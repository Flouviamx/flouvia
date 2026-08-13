import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import type {
  CollaborationSnapshot,
  CollaborationStatus,
  CollaborationThread,
  CommentVisibility,
} from './collaboration.types';
import './collaboration.css';

type Lang = 'es' | 'en';
type Filter = 'active' | 'all' | 'resolved';

interface Props {
  initialSnapshot: CollaborationSnapshot;
  lang: Lang;
}

const copy = {
  es: {
    workspace: 'Espacio de trabajo',
    adminView: 'Vista de Flouvia',
    clientView: 'Vista de cliente',
    team: 'Equipo Flouvia',
    client: 'Cliente',
    newThread: 'Nuevo asunto',
    all: 'Todos',
    active: 'Activos',
    resolved: 'Resueltos',
    emptyTitle: 'Todo está al día',
    emptyText: 'Agrega una decisión, pregunta o pendiente importante para empezar la conversación.',
    emptyAction: 'Crear primer asunto',
    comments: 'comentarios',
    comment: 'comentario',
    important: 'Importante',
    pinned: 'Fijado por Flouvia',
    authoredBy: 'Creado por',
    conversation: 'Conversación',
    noComments: 'Todavía no hay comentarios. Escribe el primero para dejar contexto.',
    sharedComment: 'Comentario compartido',
    internalNote: 'Nota interna de Flouvia',
    internalHint: 'Solo el equipo de Flouvia puede verla.',
    messagePlaceholder: 'Escribe un comentario claro y accionable…',
    send: 'Enviar',
    sending: 'Enviando…',
    state: 'Estado',
    open: 'Nuevo',
    in_progress: 'En proceso',
    waiting_client: 'Esperando cliente',
    resolvedStatus: 'Resuelto',
    clientStateHint: 'Flouvia actualizará el estado conforme avance el asunto.',
    pin: 'Fijar asunto',
    unpin: 'Desfijar asunto',
    close: 'Cerrar',
    modalTitle: 'Nuevo asunto',
    modalText: 'Comparte una decisión, pregunta o pendiente. Quedará visible para ambas partes.',
    title: 'Título',
    titlePlaceholder: 'Ej. Confirmar contenido de la página principal',
    detail: 'Contexto',
    detailPlaceholder: 'Explica qué necesitas, qué decisión falta o por qué es importante…',
    markImportant: 'Marcar como importante',
    importantHint: 'Aparecerá destacado en la lista compartida.',
    cancel: 'Cancelar',
    create: 'Crear asunto',
    creating: 'Creando…',
    synced: 'Actualizado',
    syncing: 'Actualizando…',
    retry: 'Reintentar',
    genericError: 'No pudimos guardar el cambio. Inténtalo nuevamente.',
    selectWorkspace: 'Seleccionar cliente',
  },
  en: {
    workspace: 'Workspace',
    adminView: 'Flouvia view',
    clientView: 'Client view',
    team: 'Flouvia team',
    client: 'Client',
    newThread: 'New topic',
    all: 'All',
    active: 'Active',
    resolved: 'Resolved',
    emptyTitle: 'Everything is up to date',
    emptyText: 'Add a decision, question, or important pending item to start the conversation.',
    emptyAction: 'Create first topic',
    comments: 'comments',
    comment: 'comment',
    important: 'Important',
    pinned: 'Pinned by Flouvia',
    authoredBy: 'Created by',
    conversation: 'Conversation',
    noComments: 'There are no comments yet. Add the first one to leave context.',
    sharedComment: 'Shared comment',
    internalNote: 'Internal Flouvia note',
    internalHint: 'Only the Flouvia team can see it.',
    messagePlaceholder: 'Write a clear, actionable comment…',
    send: 'Send',
    sending: 'Sending…',
    state: 'Status',
    open: 'New',
    in_progress: 'In progress',
    waiting_client: 'Waiting for client',
    resolvedStatus: 'Resolved',
    clientStateHint: 'Flouvia will update the status as this topic moves forward.',
    pin: 'Pin topic',
    unpin: 'Unpin topic',
    close: 'Close',
    modalTitle: 'New topic',
    modalText: 'Share a decision, question, or pending item. It will be visible to both sides.',
    title: 'Title',
    titlePlaceholder: 'E.g. Confirm homepage content',
    detail: 'Context',
    detailPlaceholder: 'Explain what you need, which decision is pending, or why it matters…',
    markImportant: 'Mark as important',
    importantHint: 'It will be highlighted in the shared list.',
    cancel: 'Cancel',
    create: 'Create topic',
    creating: 'Creating…',
    synced: 'Updated',
    syncing: 'Updating…',
    retry: 'Retry',
    genericError: 'We could not save that change. Please try again.',
    selectWorkspace: 'Select client',
  },
} as const;

const statuses: CollaborationStatus[] = ['open', 'in_progress', 'waiting_client', 'resolved'];

async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    credentials: 'same-origin',
    ...options,
    headers: {
      ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
      ...options?.headers,
    },
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.detail || 'Request failed');
  }
  return payload.data as T;
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'F';
}

function relativeDate(value: string, lang: Lang) {
  const diff = new Date(value).getTime() - Date.now();
  const abs = Math.abs(diff);
  const formatter = new Intl.RelativeTimeFormat(lang === 'en' ? 'en' : 'es', { numeric: 'auto' });
  if (abs < 60 * 60 * 1000) return formatter.format(Math.round(diff / (60 * 1000)), 'minute');
  if (abs < 24 * 60 * 60 * 1000) return formatter.format(Math.round(diff / (60 * 60 * 1000)), 'hour');
  return formatter.format(Math.round(diff / (24 * 60 * 60 * 1000)), 'day');
}

function Icon({ name }: { name: 'plus' | 'pin' | 'important' | 'comment' | 'lock' | 'close' | 'chevron' | 'refresh' }) {
  const paths = {
    plus: <><path d="M12 5v14M5 12h14" /></>,
    pin: <><path d="M12 17v5M7 3h10l-2 6 3 3H6l3-3-2-6Z" /></>,
    important: <><circle cx="12" cy="12" r="9" /><path d="M12 7v6M12 17h.01" /></>,
    comment: <><path d="M21 15a3 3 0 0 1-3 3H8l-5 3V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v9Z" /></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="3" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
    close: <><path d="m7 7 10 10M17 7 7 17" /></>,
    chevron: <><path d="m9 18 6-6-6-6" /></>,
    refresh: <><path d="M20 6v5h-5M4 18v-5h5" /><path d="M18.5 9A7 7 0 0 0 6.2 6.2L4 8m16 8-2.2 2A7 7 0 0 1 5.5 15" /></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

export default function CollaborationApp({ initialSnapshot, lang }: Props) {
  const c = copy[lang];
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [selectedId, setSelectedId] = useState(initialSnapshot.threads[0]?.id ?? '');
  const [filter, setFilter] = useState<Filter>('active');
  const [composerOpen, setComposerOpen] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');
  const [commentBody, setCommentBody] = useState('');
  const [commentVisibility, setCommentVisibility] = useState<CommentVisibility>('shared');
  const titleRef = useRef<HTMLInputElement>(null);

  // OS is always the client product. Operator capabilities live exclusively in Ops.
  const isAdmin = false;
  const filteredThreads = useMemo(() => snapshot.threads.filter((thread) => {
    if (filter === 'resolved') return thread.status === 'resolved';
    if (filter === 'active') return thread.status !== 'resolved';
    return true;
  }), [filter, snapshot.threads]);
  const selected = filteredThreads.find((thread) => thread.id === selectedId) ?? filteredThreads[0] ?? null;

  useEffect(() => {
    if (selected && selected.id !== selectedId) setSelectedId(selected.id);
  }, [selected, selectedId]);

  useEffect(() => {
    if (!composerOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const frame = requestAnimationFrame(() => titleRef.current?.focus());
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setComposerOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
    };
  }, [composerOpen]);

  const refresh = useCallback(async (workspaceId = snapshot.workspace.id, silent = false) => {
    if (!silent) setSyncing(true);
    try {
      const data = await api<CollaborationSnapshot>('/api/collaboration/threads');
      setSnapshot(data);
      setError('');
      setSelectedId((current) => data.threads.some((thread) => thread.id === current)
        ? current
        : data.threads[0]?.id ?? '');
    } catch (cause) {
      if (!silent) setError(cause instanceof Error ? cause.message : c.genericError);
    } finally {
      if (!silent) setSyncing(false);
    }
  }, [c.genericError, snapshot.workspace.id]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (document.visibilityState === 'visible' && busy === null) void refresh(snapshot.workspace.id, true);
    }, 20_000);
    return () => window.clearInterval(interval);
  }, [busy, refresh, snapshot.workspace.id]);

  const createThread = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy('create');
    setError('');
    try {
      await api<{ id: string }>('/api/collaboration/threads', {
        method: 'POST',
        body: JSON.stringify({
          title: form.get('title'),
          body: form.get('body'),
          isImportant: form.get('important') === 'on',
        }),
      });
      setComposerOpen(false);
      await refresh(snapshot.workspace.id, true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : c.genericError);
    } finally {
      setBusy(null);
    }
  };

  const updateThread = async (thread: CollaborationThread, patch: { status?: CollaborationStatus; pinned?: boolean }) => {
    if (!isAdmin || busy) return;
    setBusy(`thread:${thread.id}`);
    setSnapshot((current) => ({
      ...current,
      threads: current.threads.map((item) => item.id === thread.id ? { ...item, ...patch } : item),
    }));
    try {
      await api('/api/collaboration/threads', {
        method: 'PATCH',
        body: JSON.stringify({ threadId: thread.id, ...patch }),
      });
      setError('');
      await refresh(snapshot.workspace.id, true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : c.genericError);
      await refresh(snapshot.workspace.id, true);
    } finally {
      setBusy(null);
    }
  };

  const addComment = async (event: FormEvent) => {
    event.preventDefault();
    if (!selected || !commentBody.trim() || busy) return;
    const body = commentBody.trim();
    const visibility = isAdmin ? commentVisibility : 'shared';
    const optimisticId = `pending-${Date.now()}`;
    setBusy(`comment:${selected.id}`);
    setCommentBody('');
    setSnapshot((current) => ({
      ...current,
      threads: current.threads.map((thread) => thread.id === selected.id ? {
        ...thread,
        comments: [...thread.comments, {
          id: optimisticId,
          body,
          visibility,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          author: current.actor,
        }],
      } : thread),
    }));
    try {
      await api('/api/collaboration/comments', {
        method: 'POST',
        body: JSON.stringify({ threadId: selected.id, body, visibility }),
      });
      setError('');
      await refresh(snapshot.workspace.id, true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : c.genericError);
      setCommentBody(body);
      await refresh(snapshot.workspace.id, true);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="collab-app">
      <section className="collab-toolbar" aria-label={c.workspace}>
        <div className="collab-workspace-meta">
          <span className={`collab-role-mark ${isAdmin ? 'is-admin' : 'is-client'}`}>
            {isAdmin ? 'F' : initials(snapshot.workspace.companyName)}
          </span>
          <div>
            <span className="collab-overline">{c.workspace}</span>
            {isAdmin && snapshot.workspaces.length > 1 ? (
              <label className="collab-workspace-select">
                <span className="sr-only">{c.selectWorkspace}</span>
                <select
                  value={snapshot.workspace.id}
                  onChange={(event) => void refresh(event.target.value)}
                  disabled={syncing || busy !== null}
                >
                  {snapshot.workspaces.map((workspace) => (
                    <option key={workspace.id} value={workspace.id}>{workspace.companyName}</option>
                  ))}
                </select>
                <Icon name="chevron" />
              </label>
            ) : <strong>{snapshot.workspace.companyName}</strong>}
          </div>
        </div>

        <div className="collab-toolbar-actions">
          <span className={`collab-access-chip ${isAdmin ? 'is-admin' : ''}`}>
            <span />{isAdmin ? c.adminView : c.clientView}
          </span>
          <button
            type="button"
            className="collab-sync-button"
            onClick={() => void refresh()}
            disabled={syncing}
            aria-label={syncing ? c.syncing : c.synced}
            title={syncing ? c.syncing : c.synced}
          >
            <span className={syncing ? 'is-spinning' : ''}><Icon name="refresh" /></span>
          </button>
          <button type="button" className="collab-primary-button" onClick={() => setComposerOpen(true)}>
            <Icon name="plus" />
            <span>{c.newThread}</span>
          </button>
        </div>
      </section>

      {error && (
        <div className="collab-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => void refresh()}>{c.retry}</button>
        </div>
      )}

      <div className="collab-filter" role="tablist" aria-label="Filter">
        {(['active', 'all', 'resolved'] as Filter[]).map((item) => (
          <button
            type="button"
            role="tab"
            aria-selected={filter === item}
            className={filter === item ? 'is-active' : ''}
            onClick={() => setFilter(item)}
            key={item}
          >
            {c[item]}
          </button>
        ))}
      </div>

      {snapshot.threads.length === 0 ? (
        <section className="collab-empty">
          <span className="collab-empty-icon"><Icon name="comment" /></span>
          <h2>{c.emptyTitle}</h2>
          <p>{c.emptyText}</p>
          <button type="button" className="collab-secondary-button" onClick={() => setComposerOpen(true)}>
            <Icon name="plus" />{c.emptyAction}
          </button>
        </section>
      ) : (
        <div className="collab-layout">
          <aside className="collab-thread-list" aria-label={c.workspace}>
            {filteredThreads.length === 0 ? (
              <div className="collab-filter-empty">{c.emptyTitle}</div>
            ) : filteredThreads.map((thread) => (
              <button
                type="button"
                className={`collab-thread-row ${selected?.id === thread.id ? 'is-selected' : ''}`}
                onClick={() => setSelectedId(thread.id)}
                key={thread.id}
              >
                <span className="collab-thread-row-top">
                  <span className={`collab-status-dot is-${thread.status}`} />
                  <span className="collab-thread-title">{thread.title}</span>
                  <span className="collab-row-chevron"><Icon name="chevron" /></span>
                </span>
                <span className="collab-thread-preview">{thread.body}</span>
                <span className="collab-thread-meta">
                  {thread.pinned && <span className="collab-icon-label"><Icon name="pin" />{c.pinned}</span>}
                  {thread.isImportant && <span className="collab-icon-label is-important"><Icon name="important" />{c.important}</span>}
                  <span className="collab-comment-count">
                    {thread.comments.length} {thread.comments.length === 1 ? c.comment : c.comments}
                  </span>
                  <time>{relativeDate(thread.lastActivityAt, lang)}</time>
                </span>
              </button>
            ))}
          </aside>

          {selected && (
            <section className="collab-detail" aria-live="polite">
              <header className="collab-detail-header">
                <div className="collab-detail-title-wrap">
                  <div className="collab-detail-flags">
                    <span className={`collab-status-label is-${selected.status}`}>{
                      selected.status === 'open' ? c.open
                        : selected.status === 'in_progress' ? c.in_progress
                          : selected.status === 'waiting_client' ? c.waiting_client
                            : c.resolvedStatus
                    }</span>
                    {selected.isImportant && <span className="collab-important-label"><Icon name="important" />{c.important}</span>}
                  </div>
                  <h2>{selected.title}</h2>
                  <p>{selected.body}</p>
                  <span className="collab-author-line">
                    {c.authoredBy} <strong>{selected.author.displayName}</strong> · {relativeDate(selected.createdAt, lang)}
                  </span>
                </div>

                {isAdmin && (
                  <button
                    type="button"
                    className={`collab-pin-button ${selected.pinned ? 'is-pinned' : ''}`}
                    onClick={() => void updateThread(selected, { pinned: !selected.pinned })}
                    aria-pressed={selected.pinned}
                    title={selected.pinned ? c.unpin : c.pin}
                  >
                    <Icon name="pin" />
                  </button>
                )}
              </header>

              <div className="collab-state-panel">
                <div className="collab-state-heading">
                  <span>{c.state}</span>
                  {!isAdmin && <small>{c.clientStateHint}</small>}
                </div>
                {isAdmin ? (
                  <div className="collab-status-control" role="group" aria-label={c.state}>
                    {statuses.map((status) => (
                      <button
                        type="button"
                        className={selected.status === status ? 'is-active' : ''}
                        onClick={() => void updateThread(selected, { status })}
                        disabled={busy === `thread:${selected.id}`}
                        key={status}
                      >
                        {status === 'open' ? c.open
                          : status === 'in_progress' ? c.in_progress
                            : status === 'waiting_client' ? c.waiting_client
                              : c.resolvedStatus}
                      </button>
                    ))}
                  </div>
                ) : (
                  <span className={`collab-client-status is-${selected.status}`}>
                    <span />{selected.status === 'open' ? c.open
                      : selected.status === 'in_progress' ? c.in_progress
                        : selected.status === 'waiting_client' ? c.waiting_client
                          : c.resolvedStatus}
                  </span>
                )}
              </div>

              <div className="collab-conversation">
                <div className="collab-section-title">
                  <h3>{c.conversation}</h3>
                  <span>{selected.comments.length}</span>
                </div>

                <div className="collab-comments">
                  {selected.comments.length === 0 ? (
                    <p className="collab-no-comments">{c.noComments}</p>
                  ) : selected.comments.map((comment) => {
                    const fromFlouvia = comment.author.teamMember === true;
                    const pending = comment.id.startsWith('pending-');
                    return (
                      <article
                        className={`collab-comment ${fromFlouvia ? 'is-flouvia' : 'is-client'} ${comment.visibility === 'internal' ? 'is-internal' : ''} ${pending ? 'is-pending' : ''}`}
                        key={comment.id}
                      >
                        <span className="collab-comment-avatar">{fromFlouvia ? 'F' : initials(comment.author.displayName)}</span>
                        <div className="collab-comment-content">
                          <header>
                            <strong>{comment.author.displayName}</strong>
                            <span>{fromFlouvia ? c.team : c.client}</span>
                            <time>{relativeDate(comment.createdAt, lang)}</time>
                          </header>
                          {comment.visibility === 'internal' && (
                            <span className="collab-internal-label"><Icon name="lock" />{c.internalNote}</span>
                          )}
                          <p>{comment.body}</p>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <form className="collab-comment-form" onSubmit={addComment}>
                  <textarea
                    value={commentBody}
                    onChange={(event) => setCommentBody(event.target.value)}
                    placeholder={c.messagePlaceholder}
                    maxLength={3000}
                    rows={3}
                    required
                  />
                  <div className="collab-comment-actions">
                    {isAdmin && (
                      <div className="collab-visibility-control" role="group" aria-label="Visibility">
                        <button
                          type="button"
                          className={commentVisibility === 'shared' ? 'is-active' : ''}
                          onClick={() => setCommentVisibility('shared')}
                        >{c.sharedComment}</button>
                        <button
                          type="button"
                          className={commentVisibility === 'internal' ? 'is-active is-internal' : 'is-internal'}
                          onClick={() => setCommentVisibility('internal')}
                        ><Icon name="lock" />{c.internalNote}</button>
                      </div>
                    )}
                    <button
                      type="submit"
                      className="collab-send-button"
                      disabled={!commentBody.trim() || busy === `comment:${selected.id}`}
                    >
                      {busy === `comment:${selected.id}` ? c.sending : c.send}
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 14-7-4 14-3-5-7-2Z" /><path d="m12 14 7-9" /></svg>
                    </button>
                  </div>
                  {isAdmin && commentVisibility === 'internal' && <small className="collab-internal-hint">{c.internalHint}</small>}
                </form>
              </div>
            </section>
          )}
        </div>
      )}

      {composerOpen && (
        <div className="collab-modal-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.currentTarget === event.target) setComposerOpen(false);
        }}>
          <section className="collab-modal" role="dialog" aria-modal="true" aria-labelledby="collab-modal-title">
            <header>
              <div>
                <h2 id="collab-modal-title">{c.modalTitle}</h2>
                <p>{c.modalText}</p>
              </div>
              <button type="button" className="collab-modal-close" onClick={() => setComposerOpen(false)} aria-label={c.close}>
                <Icon name="close" />
              </button>
            </header>
            <form onSubmit={createThread}>
              <label className="collab-field">
                <span>{c.title}</span>
                <input ref={titleRef} name="title" maxLength={120} placeholder={c.titlePlaceholder} required />
              </label>
              <label className="collab-field">
                <span>{c.detail}</span>
                <textarea name="body" maxLength={4000} rows={6} placeholder={c.detailPlaceholder} required />
              </label>
              <label className="collab-important-toggle">
                <input type="checkbox" name="important" />
                <span className="collab-toggle-track"><span /></span>
                <span><strong>{c.markImportant}</strong><small>{c.importantHint}</small></span>
              </label>
              <footer>
                <button type="button" className="collab-cancel-button" onClick={() => setComposerOpen(false)}>{c.cancel}</button>
                <button type="submit" className="collab-primary-button" disabled={busy === 'create'}>
                  {busy === 'create' ? c.creating : c.create}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
