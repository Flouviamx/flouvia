import { useState } from 'react'
import CapAuroraBg from './CapAuroraBg'

// Tarjeta de "capacidades adicionales" de /cord: en reposo es la fila hairline
// clara de siempre; al hacer hover revela el mismo aurora shader del Centro de
// Ayuda de Cord (teal/cobalt) y el texto pasa a blanco, como una card oscura de
// producto real, no un hover de color plano.
export default function CapCard({ href, icon, title, desc, linkLabel }) {
  const [active, setActive] = useState(false)

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`cap-item${active ? ' is-active' : ''}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      <CapAuroraBg active={active} />
      <div className="cap-item-inner">
        <div className="cap-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d={icon} />
          </svg>
        </div>
        <h4>{title}</h4>
        <p>{desc}</p>
        <span className="cap-link">{linkLabel} <span aria-hidden="true">&rarr;</span></span>
      </div>
    </a>
  )
}
