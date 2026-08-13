import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import type {
  CollaborationStatus,
  CommentVisibility,
  OperatorCollaborationSnapshot,
  OperatorCollaborationThread,
} from '../collaboration/collaboration.types';
import './ops-dashboard.css';

type InboxFilter = 'active' | 'waiting_client' | 'important' | 'resolved' | 'all';

const STATUS: Array<{ value: CollaborationStatus; label: string }> = [
  { value: 'open', label: 'Nuevo' },
  { value: 'in_progress', label: 'En proceso' },
  { value: 'waiting_client', label: 'Esperando cliente' },
  { value: 'resolved', label: 'Resuelto' },
];

function Icon({ name }: { name: 'search' | 'refresh' | 'plus' | 'pin' | 'message' | 'lock' | 'close' | 'arrow' | 'check' }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    refresh: <><path d="M20 6v5h-5M4 18v-5h5"/><path d="M18.5 9A7 7 0 0 0 6.2 6.2L4 8m16 8-2.2 2A7 7 0 0 1 5.5 15"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    pin: <><path d="M12 17v5M7 3h10l-2 6 3 3H6l3-3-2-6Z"/></>,
    message: <><path d="M20 15a3 3 0 0 1-3 3H8l-5 3V6a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3v9Z"/><path d="M8 9h7M8 13h4"/></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    close: <path d="m7 7 10 10M17 7 7 17"/>,
    arrow: <path d="m9 18 6-6-6-6"/>,
    check: <path d="m5 12 4 4L19 6"/>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'F';
}

function relativeDate(value: string) {
  const diff = new Date(value).getTime() - Date.now();
  const absolute = Math.abs(diff);
  const format = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });
  if (absolute < 60 * 60 * 1000) return format.format(Math.round(diff / 60_000), 'minute');
  if (absolute < 24 * 60 * 60 * 1000) return format.format(Math.round(diff / 3_600_000), 'hour');
  return format.format(Math.round(diff / 86_400_000), 'day');
}

function exactDate(value: string) {
  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit',
  }).format(new Date(value));
}

function statusLabel(status: CollaborationStatus) {
  return STATUS.find((item) => item.value === status)?.label ?? status;
}

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
  if (!response.ok) throw new Error(payload?.detail || 'No pudimos completar la acción.');
  return payload.data as T;
}

export default function OpsDashboard({
  initialSnapshot,
  initialClientId = 'all',
}: {
  initialSnapshot: OperatorCollaborationSnapshot;
  initialClientId?: string;
}) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [selectedId, setSelectedId] = useState(initialSnapshot.threads[0]?.id ?? '');
  const [clientId, setClientId] = useState(
    initialSnapshot.workspaces.some((workspace) => workspace.id === initialClientId)
      ? initialClientId
      : 'all',
  );
  const [filter, setFilter] = useState<InboxFilter>('active');
  const [query, setQuery] = useState('');
  const [visibility, setVisibility] = useState<CommentVisibility>('shared');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');
  const [composerOpen, setComposerOpen] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  const metrics = useMemo(() => ({
    active: snapshot.threads.filter((thread) => thread.status !== 'resolved').length,
    waiting: snapshot.threads.filter((thread) => thread.status === 'waiting_client').length,
    important: snapshot.threads.filter((thread) => thread.isImportant && thread.status !== 'resolved').length,
    clients: new Set(snapshot.threads.filter((thread) => thread.status !== 'resolved').map((thread) => thread.workspace.id)).size,
  }), [snapshot.threads]);

  const clientCounts = useMemo(() => new Map(snapshot.workspaces.map((workspace) => [
    workspace.id,
    snapshot.threads.filter((thread) => thread.workspace.id === workspace.id && thread.status !== 'resolved').length,
  ])), [snapshot.threads, snapshot.workspaces]);

  const threads = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('es');
    return snapshot.threads.filter((thread) => {
      if (clientId !== 'all' && thread.workspace.id !== clientId) return false;
      if (filter === 'active' && thread.status === 'resolved') return false;
      if (filter === 'waiting_client' && thread.status !== 'waiting_client') return false;
      if (filter === 'important' && (!thread.isImportant || thread.status === 'resolved')) return false;
      if (filter === 'resolved' && thread.status !== 'resolved') return false;
      if (normalized && !`${thread.title} ${thread.body} ${thread.workspace.companyName}`.toLocaleLowerCase('es').includes(normalized)) return false;
      return true;
    });
  }, [clientId, filter, query, snapshot.threads]);

  const selected = threads.find((thread) => thread.id === selectedId) ?? threads[0] ?? null;

  useEffect(() => {
    if (selected && selected.id !== selectedId) setSelectedId(selected.id);
  }, [selected, selectedId]);

  useEffect(() => {
    if (!composerOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const frame = requestAnimationFrame(() => titleRef.current?.focus());
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setComposerOpen(false);
    document.addEventListener('keydown', close);
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', close);
    };
  }, [composerOpen]);

  const refresh = useCallback(async (silent = false) => {
    if (!silent) setSyncing(true);
    try {
      const next = await api<OperatorCollaborationSnapshot>('/api/ops/threads');
      setSnapshot(next);
      setError('');
      setSelectedId((current) => next.threads.some((thread) => thread.id === current)
        ? current
        : next.threads[0]?.id ?? '');
    } catch (cause) {
      if (!silent) setError(cause instanceof Error ? cause.message : 'No pudimos actualizar la bandeja.');
    } finally {
      if (!silent) setSyncing(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible' && !busy) void refresh(true);
    }, 12_000);
    return () => window.clearInterval(timer);
  }, [busy, refresh]);

  const updateThread = async (thread: OperatorCollaborationThread, patch: { status?: CollaborationStatus; pinned?: boolean }) => {
    if (busy) return;
    setBusy(`thread:${thread.id}`);
    setSnapshot((current) => ({
      ...current,
      threads: current.threads.map((item) => item.id === thread.id ? { ...item, ...patch } : item),
    }));
    try {
      await api('/api/ops/threads', {
        method: 'PATCH',
        body: JSON.stringify({ threadId: thread.id, ...patch }),
      });
      setError('');
      await refresh(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No pudimos guardar el cambio.');
      await refresh(true);
    } finally {
      setBusy(null);
    }
  };

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault();
    if (!selected || !message.trim() || busy) return;
    const body = message.trim();
    const optimisticId = `pending-${Date.now()}`;
    setBusy(`comment:${selected.id}`);
    setMessage('');
    setSnapshot((current) => ({
      ...current,
      threads: current.threads.map((thread) => thread.id === selected.id ? {
        ...thread,
        lastActivityAt: new Date().toISOString(),
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
      await api('/api/ops/comments', {
        method: 'POST',
        body: JSON.stringify({ threadId: selected.id, body, visibility }),
      });
      setError('');
      await refresh(true);
    } catch (cause) {
      setMessage(body);
      setError(cause instanceof Error ? cause.message : 'No pudimos enviar el mensaje.');
      await refresh(true);
    } finally {
      setBusy(null);
    }
  };

  const createThread = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    setBusy('create');
    try {
      const result = await api<{ id: string }>('/api/ops/threads', {
        method: 'POST',
        body: JSON.stringify({
          workspaceId: form.get('workspaceId'),
          title: form.get('title'),
          body: form.get('body'),
          isImportant: form.get('important') === 'on',
        }),
      });
      setComposerOpen(false);
      setFilter('all');
      setClientId('all');
      await refresh(true);
      setSelectedId(result.id);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No pudimos crear el asunto.');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="ops-app" id="inbox">
      <section className="ops-page-head">
        <div className="ops-page-copy">
          <span className="ops-live"><span />Sincronización activa</span>
          <h1>Bandeja</h1>
          <p>Conversaciones, decisiones y pendientes de todos tus clientes.</p>
        </div>
        <div className="ops-page-actions">
          <button className="ops-button ops-button-primary" type="button" onClick={() => setComposerOpen(true)}>
            <Icon name="plus"/>Nuevo asunto
          </button>
        </div>
      </section>

      <section className="ops-summary" aria-label="Resumen operativo">
        <button type="button" className={filter === 'active' ? 'is-active' : ''} onClick={() => setFilter('active')}>
          <span className="ops-summary-dot is-open"/><strong>{metrics.active}</strong><span>Abiertos</span>
        </button>
        <button type="button" className={filter === 'waiting_client' ? 'is-active' : ''} onClick={() => setFilter('waiting_client')}>
          <span className="ops-summary-dot is-waiting"/><strong>{metrics.waiting}</strong><span>Esperando cliente</span>
        </button>
        <button type="button" className={filter === 'important' ? 'is-active' : ''} onClick={() => setFilter('important')}>
          <span className="ops-summary-dot is-important"/><strong>{metrics.important}</strong><span>Importantes</span>
        </button>
        <button type="button" className={clientId === 'all' && filter === 'active' ? 'is-active' : ''} onClick={() => { setClientId('all'); setFilter('active'); }}>
          <span className="ops-summary-dot is-client"/><strong>{metrics.clients}</strong><span>Clientes activos</span>
        </button>
      </section>

      {error && <div className="ops-error" role="alert"><span>{error}</span><button type="button" onClick={() => setError('')}>Cerrar</button></div>}

      <section className="ops-command-bar">
        <label className="ops-search">
          <Icon name="search"/>
          <span className="sr-only">Buscar asuntos</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar cliente, asunto o contexto"/>
          {query && <button type="button" onClick={() => setQuery('')} aria-label="Limpiar búsqueda"><Icon name="close"/></button>}
        </label>
        <div className="ops-filter-control" aria-label="Filtrar asuntos">
          {(['active', 'all', 'resolved'] as InboxFilter[]).map((value) => (
            <button key={value} type="button" className={filter === value ? 'is-active' : ''} onClick={() => setFilter(value)}>
              {value === 'active' ? 'Activos' : value === 'all' ? 'Todos' : 'Resueltos'}
            </button>
          ))}
        </div>
        <button className="ops-refresh" type="button" onClick={() => void refresh()} disabled={syncing}>
          <Icon name="refresh"/><span>{syncing ? 'Actualizando' : 'Actualizar'}</span>
        </button>
      </section>

      <section className="ops-workspace" aria-label="Bandeja de clientes">
        <aside className="ops-clients" id="clients">
          <div className="ops-panel-head"><span>Clientes</span><strong>{snapshot.workspaces.length}</strong></div>
          <button type="button" className={clientId === 'all' ? 'is-active' : ''} onClick={() => setClientId('all')}>
            <span className="ops-client-avatar is-all"><Icon name="message"/></span>
            <span><strong>Todos</strong><small>Bandeja unificada</small></span>
            <em>{metrics.active}</em>
          </button>
          {snapshot.workspaces.map((workspace) => (
            <button key={workspace.id} type="button" className={clientId === workspace.id ? 'is-active' : ''} onClick={() => setClientId(workspace.id)}>
              <span className="ops-client-avatar">{initials(workspace.companyName)}</span>
              <span><strong>{workspace.companyName}</strong><small>{workspace.displayName}</small></span>
              <em>{clientCounts.get(workspace.id) || ''}</em>
            </button>
          ))}
        </aside>

        <div className="ops-thread-list">
          <div className="ops-panel-head"><span>Asuntos</span><strong>{threads.length}</strong></div>
          <div className="ops-thread-scroll">
            {threads.length ? threads.map((thread) => (
              <button key={thread.id} type="button" className={`ops-thread-row ${selected?.id === thread.id ? 'is-active' : ''}`} onClick={() => setSelectedId(thread.id)}>
                <span className="ops-thread-row-top">
                  <span className={`ops-status-dot is-${thread.status}`}/>
                  <span>{thread.workspace.companyName}</span>
                  <time>{relativeDate(thread.lastActivityAt)}</time>
                </span>
                <strong>{thread.title}</strong>
                <p>{thread.comments.at(-1)?.body || thread.body}</p>
                <span className="ops-thread-row-meta">
                  <span>{statusLabel(thread.status)}</span>
                  <span><Icon name="message"/>{thread.comments.length}</span>
                  {thread.isImportant && <span className="is-important">Importante</span>}
                  {thread.pinned && <Icon name="pin"/>}
                </span>
              </button>
            )) : (
              <div className="ops-empty-list"><span><Icon name="check"/></span><strong>Sin asuntos aquí</strong><p>La bandeja está al día con este filtro.</p></div>
            )}
          </div>
        </div>

        <article className="ops-detail">
          {selected ? (
            <>
              <header className="ops-detail-head">
                <div>
                  <span className="ops-detail-client"><span>{initials(selected.workspace.companyName)}</span>{selected.workspace.companyName}</span>
                  <h2>{selected.title}</h2>
                  <p>{selected.body}</p>
                </div>
                <button className={`ops-pin ${selected.pinned ? 'is-active' : ''}`} type="button" onClick={() => void updateThread(selected, { pinned: !selected.pinned })} aria-label={selected.pinned ? 'Desfijar asunto' : 'Fijar asunto'}>
                  <Icon name="pin"/>
                </button>
              </header>

              <div className="ops-detail-controls">
                <div>
                  <span>Estado</span>
                  <div className="ops-status-control">
                    {STATUS.map((item) => (
                      <button key={item.value} type="button" className={selected.status === item.value ? 'is-active' : ''} onClick={() => void updateThread(selected, { status: item.value })} disabled={busy !== null}>
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="ops-detail-meta">
                  <span>Creado por {selected.author.teamMember ? 'Flouvia' : selected.author.displayName}</span>
                  <time>{exactDate(selected.createdAt)}</time>
                </div>
              </div>

              <div className="ops-conversation">
                <div className="ops-conversation-label"><span>Conversación</span><strong>{selected.comments.length}</strong></div>
                <div className="ops-messages">
                  {!selected.comments.length && <div className="ops-no-messages"><Icon name="message"/><p>Aún no hay respuestas. Puedes dejar el primer mensaje o una nota para el equipo.</p></div>}
                  {selected.comments.map((comment) => {
                    const isTeam = comment.author.teamMember === true;
                    return (
                      <div key={comment.id} className={`ops-message ${isTeam ? 'is-team' : 'is-client'} ${comment.visibility === 'internal' ? 'is-internal' : ''}`}>
                        <span className="ops-message-avatar">{isTeam ? 'F' : initials(comment.author.displayName)}</span>
                        <div>
                          <div className="ops-message-meta">
                            <strong>{isTeam ? 'Flouvia' : comment.author.displayName}</strong>
                            {comment.visibility === 'internal' && <span><Icon name="lock"/>Nota interna</span>}
                            <time>{exactDate(comment.createdAt)}</time>
                          </div>
                          <p>{comment.body}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <form className={`ops-reply ${visibility === 'internal' ? 'is-internal' : ''}`} onSubmit={sendMessage}>
                <div className="ops-reply-top">
                  <div className="ops-visibility" aria-label="Visibilidad del mensaje">
                    <button type="button" className={visibility === 'shared' ? 'is-active' : ''} onClick={() => setVisibility('shared')}><Icon name="message"/>Compartido</button>
                    <button type="button" className={visibility === 'internal' ? 'is-active' : ''} onClick={() => setVisibility('internal')}><Icon name="lock"/>Nota interna</button>
                  </div>
                  <span>{visibility === 'shared' ? 'El cliente podrá leerlo' : 'Solo visible para @flouvia.com'}</span>
                </div>
                <textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={3000} placeholder={visibility === 'shared' ? `Responder a ${selected.workspace.companyName}…` : 'Dejar contexto para el equipo…'} />
                <div className="ops-reply-bottom">
                  <span>{message.length}/3000</span>
                  <button className="ops-button ops-button-primary" type="submit" disabled={!message.trim() || busy !== null}>
                    {busy === `comment:${selected.id}` ? 'Enviando…' : 'Enviar'}<Icon name="arrow"/>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="ops-empty-detail"><span><Icon name="message"/></span><h2>Selecciona un asunto</h2><p>El contexto completo y las acciones aparecerán aquí.</p></div>
          )}
        </article>
      </section>

      {composerOpen && (
        <div className="ops-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setComposerOpen(false)}>
          <section className="ops-modal" role="dialog" aria-modal="true" aria-labelledby="ops-modal-title">
            <header><div><span>Nuevo asunto</span><h2 id="ops-modal-title">Iniciar una conversación</h2><p>El cliente la verá de inmediato en su OS.</p></div><button type="button" onClick={() => setComposerOpen(false)} aria-label="Cerrar"><Icon name="close"/></button></header>
            <form onSubmit={createThread}>
              <label><span>Cliente</span><select name="workspaceId" required defaultValue=""><option value="" disabled>Selecciona un cliente</option>{snapshot.workspaces.map((workspace) => <option key={workspace.id} value={workspace.id}>{workspace.companyName}</option>)}</select></label>
              <label><span>Título</span><input ref={titleRef} name="title" maxLength={120} required placeholder="Ej. Aprobar propuesta de contenido"/></label>
              <label><span>Contexto</span><textarea name="body" maxLength={4000} required placeholder="Explica la decisión, pendiente o siguiente paso…"/></label>
              <label className="ops-check"><input type="checkbox" name="important"/><span><Icon name="check"/></span><div><strong>Marcar como importante</strong><small>Se destacará en la bandeja del cliente.</small></div></label>
              <footer><button type="button" className="ops-button ops-button-secondary" onClick={() => setComposerOpen(false)}>Cancelar</button><button type="submit" className="ops-button ops-button-primary" disabled={busy === 'create'}>{busy === 'create' ? 'Creando…' : 'Crear asunto'}<Icon name="arrow"/></button></footer>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
