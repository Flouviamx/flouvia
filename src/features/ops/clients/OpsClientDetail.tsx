import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState, type FormEvent } from 'react';
import type { OpsClientSnapshot, UpdateOpsClientProfileInput } from './opsClients.types';
import './ops-client-detail.css';

type Tab = 'overview' | 'work' | 'admin' | 'activity';

function Icon({ name }: { name: 'arrow' | 'back' | 'briefcase' | 'calendar' | 'card' | 'check' | 'close' | 'document' | 'edit' | 'folder' | 'globe' | 'inbox' | 'person' | 'roadmap' | 'ticket' }) {
  const paths = {
    arrow: <path d="m9 18 6-6-6-6"/>,
    back: <path d="m15 18-6-6 6-6"/>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="3"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 12h18"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
    card: <><rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20M6 15h4"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    close: <path d="m7 7 10 10M17 7 7 17"/>,
    document: <><path d="M6 2h8l4 4v16H6V2Z"/><path d="M14 2v5h5M9 13h6M9 17h5"/></>,
    edit: <><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5Z"/></>,
    folder: <path d="M3 6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z"/>,
    globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></>,
    inbox: <><path d="M4 4h16l2 10v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5L4 4Z"/><path d="M2 14h5l2 3h6l2-3h5"/></>,
    person: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    roadmap: <><circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h4a4 4 0 0 0 4-4v-2M16 10V8"/></>,
    ticket: <><path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7Z"/><path d="M13 5v14"/></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function relativeDate(value: string) {
  const diff = new Date(value).getTime() - Date.now();
  const formatter = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });
  if (Math.abs(diff) < 3_600_000) return formatter.format(Math.round(diff / 60_000), 'minute');
  if (Math.abs(diff) < 86_400_000) return formatter.format(Math.round(diff / 3_600_000), 'hour');
  return formatter.format(Math.round(diff / 86_400_000), 'day');
}

function money(value: number, currency: string) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency, maximumFractionDigits: 2 }).format(value);
}

async function fetchClient(workspaceId: string) {
  const response = await fetch(`/api/ops/workspaces/${encodeURIComponent(workspaceId)}`, { credentials: 'same-origin' });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.detail || 'No pudimos actualizar el cliente.');
  return payload.data as OpsClientSnapshot;
}

async function patchClient(workspaceId: string, data: UpdateOpsClientProfileInput) {
  const response = await fetch(`/api/ops/workspaces/${encodeURIComponent(workspaceId)}`, {
    method: 'PATCH',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.detail || 'No pudimos guardar los cambios.');
  return payload.data as OpsClientSnapshot;
}

function ClientContent({ initialSnapshot, canEdit }: { initialSnapshot: OpsClientSnapshot; canEdit: boolean }) {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>('overview');
  const [editing, setEditing] = useState(false);
  const { data = initialSnapshot, error } = useQuery({
    queryKey: ['ops-client', initialSnapshot.workspace.id],
    queryFn: () => fetchClient(initialSnapshot.workspace.id),
    initialData: initialSnapshot,
    staleTime: 15_000,
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
  });
  const update = useMutation({
    mutationFn: (input: UpdateOpsClientProfileInput) => patchClient(data.workspace.id, input),
    onSuccess: (next) => {
      queryClient.setQueryData(['ops-client', data.workspace.id], next);
      queryClient.invalidateQueries({ queryKey: ['ops-overview'] });
      setEditing(false);
    },
  });

  useEffect(() => {
    if (!editing) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setEditing(false);
    document.addEventListener('keydown', close);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', close);
    };
  }, [editing]);

  const saveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    update.mutate({
      version: data.workspace.version,
      companyName: String(form.get('companyName') || ''),
      activePlan: String(form.get('activePlan') || ''),
      locale: String(form.get('locale') || ''),
      timezone: String(form.get('timezone') || ''),
      reason: String(form.get('reason') || '') || undefined,
    });
  };

  const pending = data.counts.openThreads + data.counts.openTickets;
  const clientId = data.primaryContact?.userId || '';

  return (
    <div className="ops-client-detail">
      <header className="ocd-head">
        <div className="ocd-head-left">
          <a href="/ops/clientes" className="ocd-back" aria-label="Volver a clientes"><Icon name="back"/></a>
          <span className="ocd-avatar">{data.workspace.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()}</span>
          <div><span className="ocd-status"><i/>{data.workspace.status === 'active' ? 'Cliente activo' : 'Archivado'}</span><h1>{data.workspace.name}</h1><p>{data.primaryContact?.displayName || 'Sin contacto'} · {data.profile.activePlan}</p></div>
        </div>
        <div className="ocd-actions">
          {clientId && <a href={`/ops/bandeja?client=${encodeURIComponent(clientId)}`}>Abrir bandeja<Icon name="arrow"/></a>}
          {canEdit && <button type="button" onClick={() => setEditing(true)}><Icon name="edit"/>Editar perfil</button>}
        </div>
      </header>

      {error && <div className="ocd-error" role="alert">{error instanceof Error ? error.message : 'No pudimos actualizar este cliente.'}</div>}

      <nav className="ocd-tabs" aria-label="Secciones del cliente">
        {([
          ['overview', 'Resumen'], ['work', 'Trabajo'], ['admin', 'Administración'], ['activity', 'Actividad'],
        ] as Array<[Tab, string]>).map(([value, label]) => <button key={value} type="button" className={tab === value ? 'is-active' : ''} onClick={() => setTab(value)}>{label}</button>)}
      </nav>

      {tab === 'overview' && (
        <div className="ocd-tab-panel">
          <section className="ocd-summary-strip">
            <div><Icon name="briefcase"/><span><strong>{data.projects.length}</strong><small>Proyectos</small></span></div>
            <div><Icon name="roadmap"/><span><strong>{data.roadmap.length}</strong><small>Hitos</small></span></div>
            <div><Icon name="inbox"/><span><strong>{data.counts.openThreads}</strong><small>Conversaciones</small></span></div>
            <div><Icon name="ticket"/><span><strong>{data.counts.openTickets}</strong><small>Tickets</small></span></div>
            <div><Icon name="folder"/><span><strong>{data.counts.vaultFiles}</strong><small>Archivos</small></span></div>
            <div><Icon name="document"/><span><strong>{data.counts.invoices}</strong><small>Facturas</small></span></div>
          </section>

          <div className="ocd-grid">
            <section className="ocd-panel ocd-profile-panel">
              <header><div><span>Identidad</span><h2>Perfil del cliente</h2></div>{canEdit && <button type="button" onClick={() => setEditing(true)}><Icon name="edit"/>Editar</button>}</header>
              <dl>
                <div><dt>Empresa</dt><dd>{data.profile.companyName}</dd></div>
                <div><dt>Contacto</dt><dd>{data.primaryContact?.displayName || 'Sin contacto'}</dd></div>
                <div><dt>Correo</dt><dd>{data.primaryContact?.email || 'Sin correo'}</dd></div>
                <div><dt>Plan</dt><dd>{data.profile.activePlan}</dd></div>
                <div><dt>Idioma</dt><dd>{data.workspace.locale}</dd></div>
                <div><dt>Zona horaria</dt><dd>{data.workspace.timezone}</dd></div>
              </dl>
            </section>

            <section className="ocd-panel ocd-focus-panel">
              <header><div><span>Operación</span><h2>Estado actual</h2></div><strong>{pending}</strong></header>
              <div className="ocd-focus-list">
                {data.recentThreads.slice(0, 3).map((thread) => <a href={`/ops/bandeja?client=${encodeURIComponent(clientId)}`} key={thread.id}><span className={`ocd-dot is-${thread.status}`}/><div><strong>{thread.title}</strong><small>{thread.important ? 'Importante · ' : ''}{thread.status}</small></div><time>{relativeDate(thread.lastActivityAt)}</time></a>)}
                {data.recentTickets.slice(0, 2).map((ticket) => <div key={ticket.id}><span className={`ocd-dot is-${ticket.status}`}/><div><strong>{ticket.title}</strong><small>{ticket.ref} · {ticket.priority}</small></div><time>{relativeDate(ticket.updatedAt)}</time></div>)}
                {!data.recentThreads.length && !data.recentTickets.length && <div className="ocd-empty"><Icon name="check"/><span><strong>Sin pendientes</strong><small>Este cliente está al día.</small></span></div>}
              </div>
            </section>
          </div>
        </div>
      )}

      {tab === 'work' && (
        <div className="ocd-tab-panel ocd-work-grid">
          <section className="ocd-panel">
            <header><div><span>Entrega</span><h2>Proyectos</h2></div><strong>{data.projects.length}</strong></header>
            <div className="ocd-project-list">
              {data.projects.map((project) => <article key={project.id}><div className="ocd-project-top"><span className={`ocd-health is-${project.health}`}/><div><strong>{project.name}</strong><small>{project.stage}{project.stack ? ` · ${project.stack}` : ''}</small></div><em>{project.progress}%</em></div><div className="ocd-progress"><span style={{ width: `${project.progress}%` }}/></div><footer><span>{project.deadline || 'Sin fecha límite'}</span>{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer">Abrir sitio<Icon name="globe"/></a>}</footer></article>)}
              {!data.projects.length && <div className="ocd-empty"><Icon name="briefcase"/><span><strong>Sin proyectos</strong><small>La creación y edición llegará en el siguiente bloque.</small></span></div>}
            </div>
          </section>
          <section className="ocd-panel">
            <header><div><span>Plan</span><h2>Roadmap</h2></div><strong>{data.roadmap.length}</strong></header>
            <div className="ocd-roadmap-list">
              {data.roadmap.map((item) => <div key={item.id}><span className={`ocd-roadmap-state is-${item.status}`}>{item.status === 'done' ? <Icon name="check"/> : null}</span><div><strong>{item.title}</strong><small>{item.description || item.dateInfo || 'Sin detalles'}</small></div><time>{item.dateInfo || ''}</time></div>)}
              {!data.roadmap.length && <div className="ocd-empty"><Icon name="roadmap"/><span><strong>Sin roadmap</strong><small>Aún no hay hitos para este cliente.</small></span></div>}
            </div>
          </section>
        </div>
      )}

      {tab === 'admin' && (
        <div className="ocd-tab-panel ocd-admin-grid">
          <section className="ocd-panel ocd-finance">
            <header><div><span>Pagos</span><h2>Configuración financiera</h2></div><Icon name="card"/></header>
            {data.finance ? <div className="ocd-finance-body"><span>Próximo cobro</span><strong>{money(data.finance.nextAmount, data.finance.currency)}</strong><p>{data.finance.nextDate || 'Sin fecha programada'} · {data.finance.autoPay ? 'Autopago activo' : 'Pago manual'}</p>{data.finance.cardLast4 && <small>{data.finance.cardBrand || 'Tarjeta'} terminada en {data.finance.cardLast4}</small>}</div> : <div className="ocd-empty"><Icon name="card"/><span><strong>Sin configuración</strong><small>No hay datos financieros cargados.</small></span></div>}
          </section>
          <section className="ocd-panel ocd-admin-counters">
            <header><div><span>Datos</span><h2>Recursos del cliente</h2></div></header>
            <div><span><Icon name="document"/>Facturas</span><strong>{data.counts.invoices}</strong></div>
            <div><span><Icon name="folder"/>Archivos privados</span><strong>{data.counts.vaultFiles}</strong></div>
            <div><span><Icon name="ticket"/>Tickets abiertos</span><strong>{data.counts.openTickets}</strong></div>
            <div><span><Icon name="inbox"/>Notificaciones sin leer</span><strong>{data.counts.unreadNotifications}</strong></div>
          </section>
        </div>
      )}

      {tab === 'activity' && (
        <div className="ocd-tab-panel">
          <section className="ocd-panel ocd-history-placeholder"><Icon name="calendar"/><h2>Historial preparado</h2><p>Los cambios nuevos ya se guardan en el registro inmutable de OPS. La vista filtrada por cliente se conectará en el módulo de Sistema.</p><small>Última actualización del workspace: {relativeDate(data.workspace.updatedAt)}</small></section>
        </div>
      )}

      {editing && (
        <div className="ocd-sheet-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setEditing(false)}>
          <section className="ocd-sheet" role="dialog" aria-modal="true" aria-labelledby="ocd-edit-title">
            <header><div><span>Cliente 360</span><h2 id="ocd-edit-title">Editar perfil</h2><p>Los cambios se reflejarán en OS y quedarán auditados.</p></div><button type="button" onClick={() => setEditing(false)} aria-label="Cerrar"><Icon name="close"/></button></header>
            <form onSubmit={saveProfile}>
              <label><span>Nombre de la empresa</span><input name="companyName" defaultValue={data.profile.companyName} maxLength={160} required/></label>
              <label><span>Plan activo</span><input name="activePlan" defaultValue={data.profile.activePlan} maxLength={80} required/></label>
              <div className="ocd-form-row">
                <label><span>Idioma</span><select name="locale" defaultValue={data.workspace.locale}><option value="es-MX">Español · México</option><option value="en-US">English · US</option></select></label>
                <label><span>Zona horaria</span><select name="timezone" defaultValue={data.workspace.timezone}><option value="America/Mexico_City">Ciudad de México</option><option value="America/Tijuana">Tijuana</option><option value="America/New_York">New York</option><option value="America/Los_Angeles">Los Angeles</option></select></label>
              </div>
              <label><span>Motivo del cambio <small>opcional</small></span><textarea name="reason" maxLength={500} placeholder="Contexto para el historial del equipo…"/></label>
              {update.error && <div className="ocd-form-error" role="alert">{update.error instanceof Error ? update.error.message : 'No pudimos guardar.'}</div>}
              <footer><button type="button" onClick={() => setEditing(false)}>Cancelar</button><button className="is-primary" type="submit" disabled={update.isPending}>{update.isPending ? 'Guardando…' : 'Guardar cambios'}<Icon name="arrow"/></button></footer>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default function OpsClientDetail(props: { initialSnapshot: OpsClientSnapshot; canEdit: boolean }) {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { retry: 1 } } }));
  return <QueryClientProvider client={queryClient}><ClientContent {...props}/></QueryClientProvider>;
}
