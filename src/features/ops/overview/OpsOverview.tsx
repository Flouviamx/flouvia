import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import type {
  OpsAttentionKind,
  OpsOverviewSnapshot,
} from './opsOverview.types';
import './ops-overview.css';

function Icon({ name }: { name: 'arrow' | 'briefcase' | 'clients' | 'clock' | 'inbox' | 'project' | 'refresh' | 'shield' | 'ticket' }) {
  const paths = {
    arrow: <path d="m9 18 6-6-6-6"/>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="3"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2"/></>,
    clients: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    inbox: <><path d="M4 4h16l2 10v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5L4 4Z"/><path d="M2 14h5l2 3h6l2-3h5"/></>,
    project: <><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 8h8M8 12h5M8 16h7"/></>,
    refresh: <><path d="M20 6v5h-5M4 18v-5h5"/><path d="M18.5 9A7 7 0 0 0 6.2 6.2L4 8m16 8-2.2 2A7 7 0 0 1 5.5 15"/></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-5"/></>,
    ticket: <><path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7Z"/><path d="M13 5v14"/></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function relativeDate(value: string) {
  const diff = new Date(value).getTime() - Date.now();
  const absolute = Math.abs(diff);
  const formatter = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });
  if (absolute < 60 * 60 * 1000) return formatter.format(Math.round(diff / 60_000), 'minute');
  if (absolute < 24 * 60 * 60 * 1000) return formatter.format(Math.round(diff / 3_600_000), 'hour');
  return formatter.format(Math.round(diff / 86_400_000), 'day');
}

function formatBytes(value: number) {
  if (!value) return '0 MB';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const unit = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1);
  return `${new Intl.NumberFormat('es-MX', { maximumFractionDigits: 1 }).format(value / (1024 ** unit))} ${units[unit]}`;
}

function kindIcon(kind: OpsAttentionKind) {
  return kind === 'ticket' ? 'ticket' : kind === 'project' ? 'project' : 'inbox';
}

function roleLabel(role: OpsOverviewSnapshot['actor']['role']) {
  return role === 'owner' ? 'Owner' : role === 'operator' ? 'Operador' : role === 'finance' ? 'Finanzas' : 'Colaborador';
}

async function loadOverview() {
  const response = await fetch('/api/ops/overview', { credentials: 'same-origin' });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.detail || 'No pudimos actualizar el resumen.');
  return payload.data as OpsOverviewSnapshot;
}

function OverviewContent({ initialSnapshot }: { initialSnapshot: OpsOverviewSnapshot }) {
  const { data = initialSnapshot, error, isFetching, refetch } = useQuery({
    queryKey: ['ops-overview'],
    queryFn: loadOverview,
    initialData: initialSnapshot,
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
    staleTime: 10_000,
  });
  const workload = data.metrics.openThreads + data.metrics.openTickets;

  return (
    <div className="ops-overview">
      <header className="ops-overview-head">
        <div>
          <span className="ops-overview-kicker"><span/>Centro de operación</span>
          <h1>Resumen</h1>
          <p>Lo que necesita atención en Flouvia, en un solo lugar.</p>
        </div>
        <div className="ops-overview-head-actions">
          <span className="ops-access-badge"><Icon name="shield"/>{roleLabel(data.actor.role)}</span>
          <button type="button" onClick={() => void refetch()} disabled={isFetching}>
            <Icon name="refresh"/>{isFetching ? 'Actualizando' : 'Actualizar'}
          </button>
          <a href="/ops/bandeja">Abrir bandeja<Icon name="arrow"/></a>
        </div>
      </header>

      {error && <div className="ops-overview-error" role="alert">{error instanceof Error ? error.message : 'No pudimos actualizar el resumen.'}</div>}

      <section className="ops-overview-strip" aria-label="Estado de la operación">
        <div><span className="is-blue"><Icon name="clients"/></span><strong>{data.metrics.activeWorkspaces}</strong><small>Clientes activos</small></div>
        <div><span className="is-slate"><Icon name="briefcase"/></span><strong>{data.metrics.activeProjects}</strong><small>Proyectos</small></div>
        <div><span className="is-orange"><Icon name="inbox"/></span><strong>{data.metrics.openThreads}</strong><small>Conversaciones</small></div>
        <div><span className="is-red"><Icon name="ticket"/></span><strong>{data.metrics.openTickets}</strong><small>Tickets abiertos</small></div>
        <div><span className="is-purple"><Icon name="clock"/></span><strong>{data.metrics.waitingItems}</strong><small>En espera</small></div>
        <div><span className="is-green"><Icon name="project"/></span><strong>{formatBytes(data.metrics.storageBytes)}</strong><small>En bóveda</small></div>
      </section>

      <div className="ops-overview-grid">
        <section className="ops-overview-panel ops-attention">
          <header><div><span>Prioridad</span><h2>Requiere atención</h2></div><strong>{workload}</strong></header>
          <div className="ops-attention-list">
            {data.attention.map((item) => (
              <a href={item.href} key={`${item.kind}-${item.id}`}>
                <span className={`ops-attention-icon is-${item.urgency}`}><Icon name={kindIcon(item.kind)}/></span>
                <span className="ops-attention-copy">
                  <span><strong>{item.workspaceName}</strong><time>{relativeDate(item.happenedAt)}</time></span>
                  <b>{item.title}</b><small>{item.detail}</small>
                </span>
                <Icon name="arrow"/>
              </a>
            ))}
            {!data.attention.length && <div className="ops-overview-empty"><Icon name="shield"/><strong>Todo está en orden</strong><p>No hay pendientes operativos con los datos actuales.</p></div>}
          </div>
        </section>

        <section className="ops-overview-panel ops-client-pulse">
          <header><div><span>Espacios</span><h2>Clientes recientes</h2></div><a href="/ops/clientes">Ver todos<Icon name="arrow"/></a></header>
          <div className="ops-client-pulse-list">
            {data.clients.map((client) => (
              <a href={`/ops/clientes/${encodeURIComponent(client.workspaceId)}`} key={client.workspaceId}>
                <span className="ops-client-pulse-avatar">{client.companyName.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()}</span>
                <span className="ops-client-pulse-copy"><strong>{client.companyName}</strong><small>{client.contactName} · {client.plan}</small></span>
                <span className="ops-client-pulse-stats"><strong>{client.openThreads + client.openTickets}</strong><small>pendientes</small></span>
                <time>{relativeDate(client.lastActivityAt)}</time>
              </a>
            ))}
          </div>
        </section>
      </div>

      <section className="ops-overview-panel ops-activity">
        <header><div><span>Auditoría</span><h2>Actividad del equipo</h2></div><small>Registro protegido</small></header>
        {data.activity.length ? (
          <div className="ops-activity-list">
            {data.activity.slice(0, 6).map((item) => (
              <div key={item.id}>
                <span className="ops-activity-dot"/>
                <p><strong>{item.actorName}</strong> realizó <b>{item.action}</b>{item.workspaceName ? <> en <strong>{item.workspaceName}</strong></> : null}</p>
                <time>{relativeDate(item.happenedAt)}</time>
              </div>
            ))}
          </div>
        ) : (
          <div className="ops-activity-first"><span className="ops-activity-dot"/><p>El registro está listo. Los próximos cambios hechos desde OPS aparecerán aquí.</p></div>
        )}
      </section>
    </div>
  );
}

export default function OpsOverview({ initialSnapshot }: { initialSnapshot: OpsOverviewSnapshot }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: true } },
  }));
  return <QueryClientProvider client={queryClient}><OverviewContent initialSnapshot={initialSnapshot}/></QueryClientProvider>;
}
