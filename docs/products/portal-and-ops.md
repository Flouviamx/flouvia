# Portal de clientes y consola Ops

> **Alcance:** shell autenticado, componentes compartidos, login y métricas operativas del dashboard.
> **Cargar cuando:** se trabaje en `/dashboard`, `/ops`, login o cualquier superficie autenticada.
> **Documentos relacionados:** [Seguridad y datos](../architecture/security-and-data.md) · [Sistema visual](../experience/design-system.md)

[← Volver al índice de documentación](../README.md)

---
## Portal — componentes compartidos

### `PortalHeader.astro`
Componente unificado de cabecera para todas las páginas del portal.

**Props:**
```ts
interface Props {
  title?: string;      // opcional — CalendarioUI no lo usa
  titleEd?: string;    // parte editorial (Instrument Serif italic)
  subtitle?: string;
  backHref: string;
  lang: 'es' | 'en';
}
```

**Slots nombrados:**
- `topbar-left` — contenido extra izquierda del topbar (ej: date strip en Soporte)
- `topbar-right` — contenido extra derecha del topbar (ej: refresh button en Entorno)
- `title-right` — elemento alineado a la derecha del título (ej: sprint count badge en Roadmap, upload button en Bóveda)

**Usado en:** BovedaUI, BovedaUploadUI, CalendarioUI, EntornoUI, FacturacionUI, RoadmapUI, SoporteUI, PrivacidadPortalUI

**Entrada:** fade + subida de 10px por CSS, 280ms, sin blur ni scale.

### Shell de aplicación
- `PortalNavbar.astro`: barra translúcida tipo app con navegación segmentada; en móvil usa tab bar inferior.
- `PortalFooter.astro`: pie utilitario claro, sin consola, watermark ni lenguaje VIP.
- El único acento de acción es `#0071e3`; no hay glows que sigan el cursor ni hover magnético.
- El chip `Equipo Flouvia` / `Cliente` hace explícito el rol de la sesión.

### Componentes del portal

| Archivo | Página | Notas clave |
|---------|--------|-------------|
| `DashboardUI.astro` | /dashboard | Bento grid. Fetch paralelo: proyecto, finanzas, roadmap, archivos, tickets, notificaciones, deploys Vercel. Health score computado server-side. Activity feed cross-portal. |
| `CollaborationApp.tsx` | /colaboracion | Asuntos, importancia y comentarios compartidos. Flouvia controla estado/pin y puede escribir notas internas. Polling visible cada 20s + optimistic UI. |
| `EntornoUI.astro` | /entorno | Vercel deploys reales + PSI vitals reales + activity log derivado de deploys. Refresh button en `topbar-right`. |
| `BovedaUI.astro` | /boveda | Descargas autenticadas desde Blob privado. Upload button en `title-right`. |
| `BovedaUploadUI.astro` | /boveda-upload | `backHref` va a `/boveda`, no `/dashboard`. |
| `FacturacionUI.astro` | /facturacion | Money counter GSAP. Stripe Portal link. |
| `RoadmapUI.astro` | /roadmap | Sprint count badge en `title-right`. |
| `SoporteUI.astro` | /soporte | Tickets leídos de Neon (tabla `tickets`). Form → `/api/soporte/ticket`. Date strip en `topbar-left`. |
| `CalendarioUI.astro` | /calendario | Calendly embed. PortalHeader sin `title` (solo topbar). |
| `PrivacidadPortalUI.astro` | /privacidad-portal | Política de datos del portal. Auth-protected. Link desde PortalFooter. |
| `LoginUI.astro` | /login · /portal/login · /en/login | Rediseñada mayo 2026. Ver sección "Página de Login" abajo. |

---

---

## Página de Login (`LoginUI.astro`)

> Rediseñada mayo 2026. Archivo único (`src/components/portal/LoginUI.astro`) que alimenta
> `/login`, `/portal/login` y `/en/login`. Sigue la misma estética que el home:
> claro editorial, Inter bold en headings, serif italic solo en números/watermark.

### Decisiones de diseño
- **Sin tarjeta (card):** la `card` de Clerk tiene `background: transparent`, `box-shadow: none`,
  `border: none`. El formulario vive directamente sobre el fondo `--color-bg-soft` (sin caja flotante).
- **Inputs como líneas:** `border-bottom: 1px solid` con transición a navy en `:focus`. Sin `border-radius`,
  sin fondo. Estética Aesop/Stripe, no dashboard.
- **Layout split:** `grid-template-columns: 1.05fr 0.95fr`. Izquierda = bloque de marca.
  Derecha = formulario borderless.

### Bloque de marca (izquierda)
- Eyebrow (clave `login.eyebrow`): "ENTORNO PRIVADO" / "PRIVATE ENVIRONMENT".
- H1 100% Inter bold sin palabra-acento serif (regla de una sola tipografía en headings).
- Nota neutral de acceso seguro para cuentas autorizadas; no usar mensajes de escasez, VIP o exclusividad.
- Badge de sesión segura con indicador verde estático.

### UI de autenticación propia
- `CustomSignIn.tsx` controla email/password, Google OAuth, MFA, recuperación de contraseña y aceptación de invitación con los stores headless de Clerk.
- `CustomOAuthCallback.tsx` completa OAuth sin montar componentes visuales de Clerk.
- `CustomUserMenu.tsx` reemplaza el avatar/menú embebido.
- `custom-auth.css` y `custom-user-menu.css` son la única capa visual de auth.

### Animación de entrada
- Gate `.js-anim .login-anim { opacity: 0 }` en `<style is:global>` (PortalLayout añade `.js-anim`
  pre-paint — ver `PortalLayout.astro`).
- `power2.out`, `duration 0.95s`, `y: 14`, `stagger: 0.09` — estándar único del sitio.
- Reduced-motion → set `opacity:1, y:0` inmediato y return. Sin FOUC.
- Sin `expo.out`, sin `scale`, sin `blur` (reglas de mayo 2026).

### Responsive (≤920px)
- Grid colapsa a una columna; marca arriba, formulario abajo.
- `max-width` del form-wrap sube a `440px` centrado a la izquierda.
- Watermark pasa a `42vw` para seguir visible sin ocupar toda la pantalla.

---

---

## Health Score (dashboard)

Computed en `DashboardUI.astro` server-side. Rango 0–100:

| Métrica | Puntos |
|---------|--------|
| Uptime ≥ 99.9% | 30 |
| Uptime ≥ 99.0% | 20 |
| Uptime < 99.0% | 10 |
| Progreso ≥ 75% | 25 |
| Progreso ≥ 50% | 18 |
| Progreso ≥ 25% | 10 |
| Progreso < 25% | 5 |
| Último deploy exitoso (READY) | 25 |
| Deploys existentes pero fallo | 10 |
| Sin deploys registrados | 15 |
| 0 tickets abiertos | 20 |
| ≤ 2 tickets abiertos | 12 |
| > 2 tickets abiertos | 5 |

Color: verde (#10b981) ≥ 85, ámbar (#f59e0b) ≥ 65, rojo (#ef4444) < 65.

---

---

## Activity Feed (dashboard)

Mezcla eventos de 3 fuentes, ordenados por fecha descendente, máx 7 items:
- **Deploys** (Vercel API) — dot verde/rojo/ámbar según estado
- **Tickets** (Neon `tickets`) — dot azul/verde/ámbar según status
- **Uploads** (Neon `vault_files`) — dot púrpura

---
