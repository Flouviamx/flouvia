import { useMemo, useState } from 'react';
import type { OpsClientDirectoryItem } from './clients/opsClients.types';
import './ops-dashboard.css';

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'CL';
}

function relativeDate(value?: string) {
  if (!value) return 'Sin actividad';
  const diff = new Date(value).getTime() - Date.now();
  const absolute = Math.abs(diff);
  const format = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });
  if (absolute < 60 * 60 * 1000) return format.format(Math.round(diff / 60_000), 'minute');
  if (absolute < 24 * 60 * 60 * 1000) return format.format(Math.round(diff / 3_600_000), 'hour');
  return format.format(Math.round(diff / 86_400_000), 'day');
}

function Icon({ name }: { name: 'search' | 'message' | 'arrow' }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    message: <><path d="M20 15a3 3 0 0 1-3 3H8l-5 3V6a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3v9Z"/><path d="M8 9h7M8 13h4"/></>,
    arrow: <path d="m9 18 6-6-6-6"/>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

export default function OpsClients({ initialClients }: { initialClients: OpsClientDirectoryItem[] }) {
  const [query, setQuery] = useState('');
  const clients = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('es');
    return initialClients.filter((client) => !normalized
      || `${client.companyName} ${client.contactName} ${client.contactEmail}`.toLocaleLowerCase('es').includes(normalized));
  }, [initialClients, query]);

  return (
    <div className="ops-app ops-clients-page">
      <section className="ops-page-head">
        <div className="ops-page-copy">
          <span className="ops-live"><span />Directorio privado</span>
          <h1>Clientes</h1>
          <p>Cada espacio y su conversación compartida, sin mezclar contextos.</p>
        </div>
        <div className="ops-directory-count">
          <strong>{initialClients.filter((client) => client.status === 'active').length}</strong>
          <span>{initialClients.filter((client) => client.status === 'active').length === 1 ? 'cliente activo' : 'clientes activos'}</span>
        </div>
      </section>

      <section className="ops-directory" aria-label="Directorio de clientes">
        <div className="ops-directory-toolbar">
          <label className="ops-search">
            <Icon name="search"/>
            <span className="sr-only">Buscar cliente</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar cliente"/>
          </label>
          <span>{clients.length} {clients.length === 1 ? 'resultado' : 'resultados'}</span>
        </div>

        <div className="ops-directory-list">
          {clients.map((client) => (
            <a className="ops-directory-row" href={`/ops/clientes/${encodeURIComponent(client.workspaceId)}`} key={client.workspaceId}>
              <span className="ops-directory-avatar">{initials(client.companyName)}</span>
              <span className="ops-directory-identity">
                <strong>{client.companyName}</strong>
                <small>{client.contactName} · {client.plan}</small>
              </span>
              <span className="ops-directory-stat">
                <strong>{client.projects}</strong><small>proyectos</small>
              </span>
              <span className="ops-directory-stat">
                <strong>{client.openThreads + client.openTickets}</strong><small>pendientes</small>
              </span>
              <span className="ops-directory-activity">
                <small>Última actividad</small>
                <strong>{relativeDate(client.lastActivityAt)}</strong>
              </span>
              <span className="ops-directory-open"><Icon name="message"/><span>Abrir cliente</span><Icon name="arrow"/></span>
            </a>
          ))}
          {!clients.length && (
            <div className="ops-directory-empty">
              <Icon name="search"/>
              <strong>No encontramos ese cliente</strong>
              <p>Prueba con el nombre de la empresa o del contacto.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
