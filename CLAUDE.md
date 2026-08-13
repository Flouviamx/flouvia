# Flouvia Web — CLAUDE.md

## Comandos esenciales

```bash
npm run dev      # servidor local (localhost:4321)
npm run build    # build de producción
npm run preview  # preview del build local
npm run db:schema      # aplica migraciones Neon ordenadas
npm run db:verify-ops  # verifica invariantes y lecturas de Ops (read-only)
```

Node requerido: **>=22.12.0** (ver `.nvmrc`)

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Astro 6 (`output: 'server'`) |
| Adapter | `@astrojs/vercel` — deploy en Vercel |
| Auth | UI propia + Clerk headless (`@clerk/astro`) |
| DB / Storage | Neon PostgreSQL + Vercel Blob privado |
| Animaciones | GSAP 3 + ScrollTrigger (SplitText eliminado) |
| Tipografía | Inter (sans) — Instrument Serif ha sido eliminado (Julio 2026) |

---

## Estructura de páginas

```
src/pages/
  index.astro              → / (home, prerender:true)
  servicios.astro          → /servicios
  casos.astro              → /casos
  contacto.astro           → /contacto
  nosotros.astro           → /nosotros

  # Producto público — Cord (prerender:true; repo hermano ~/Desktop/flouvia-cord)
  cord.astro               → /cord — landing de venta del SaaS público de Flouvia.
                              Reescrita jul 2026 para reflejar el alcance REAL de
                              Cord (no solo cotizar+CFDI): cobranza autónoma con IA,
                              pagos directos a la cuenta del negocio (Stripe Connect,
                              sin comisión de Cord), multi-divisa con cobertura FX,
                              API/webhooks/MCP, Cord Elements (cotizador embebible),
                              roles de equipo y firma legal SHA-256. Reusa
                              <CordPricing /> (src/components/cord/CordPricing.astro,
                              ya alineado a los 5 planes reales — no tocar sin
                              verificar contra flouvia-cord/docs/negocio-billing.md).
                              Estética 100% Flouvia (hero-grand + fluid-target shader,
                              service-row editorial), NUNCA la estética "Apple gray"
                              propia de cord.flouvia.com. ⚠️ Los enlaces de esta
                              página apuntan a rutas reales de cord.flouvia.com
                              (/producto/*, /desarrolladores/*) — antes de agregar un
                              enlace nuevo, confirmar el slug contra
                              flouvia-cord/src/lib/producto.ts o desarrolladores.ts,
                              no inventarlo.
  en/cord.astro             → /en/cord — espejo en inglés (fuente de verdad separada,
                              se mantiene sincronizado a mano con cord.astro).

  # Componentes de /cord — src/components/cord/ (jul 2026)
  CordPricing.astro         → tarjetas de los 5 planes reales, con aurora CSS viajera.
  CordFaqAccordion.astro    → acordeón de FAQ PORTADO 1:1 desde
                              flouvia-cord/src/components/landing/FaqAccordion.astro
                              (mismo patrón: ícono +/− que rota, grid-template-rows
                              para la altura, uno-a-la-vez). En cord.astro/en/cord.astro
                              el array `FAQS` es la ÚNICA fuente — alimenta tanto el
                              acordeón visible como el `FAQPage` del JSON-LD; nunca
                              hardcodear las preguntas por separado en el schema.
  CapCard.jsx (React)       → tarjeta del grid "capacidades adicionales"; maneja su
                              propio estado de hover/foco y monta <CapAuroraBg active=.../>
                              como fondo — el texto pasa a blanco vía la clase `.is-active`
                              (definida en el <style is:global> de cord.astro/en/cord.astro,
                              NO en el componente).
  CapAuroraBg.jsx (React)   → mismo motor de shader del aurora del Centro de Ayuda de
                              Cord (BlueAuroraBg — teal/cobalt/cyan, grano de película),
                              adaptado para vivir dentro de una tarjeta clara y solo
                              pintar mientras `active` es true (frameloop 'never'→'always',
                              fade 0.55s). El cursor se anima con un resorte
                              masa-amortiguador (Hooke + fricción, no un lerp plano) y su
                              velocidad alimenta el uniform `u_force`, que infla el empuje
                              del aurora y dispara un chispazo cyan — es lo que le da la
                              sensación de "físicas" al pasar el mouse rápido. Montado
                              siempre con `client:visible` (no `client:only`) porque va
                              DENTRO de CapCard, que ya es un island de React.
                              ⚠️ Regla: cualquier shader R3F nuevo dentro de una tarjeta
                              con hover reactivo debe seguir este patrón (frameloop
                              condicionado + spring físico), no CardAuroraBg.jsx de
                              flouvia-cord tal cual (ese es para tarjetas SIEMPRE
                              oscuras, no para un toggle hover en una tarjeta clara).

  # Páginas legales (prerender:true)
  privacidad.astro         → /privacidad
  terminos.astro           → /terminos
  en/privacy.astro         → /en/privacy
  en/terms.astro           → /en/terms

  # Apps de Shopify (prerender:true)
  apps.astro               → /apps (listing de apps)
  apps/[slug].astro        → /apps/{slug} (detalle de app — solo status:'live')

  # Blog (prerender:true)
  blog/index.astro         → /blog (listing)
  blog/[slug].astro        → /blog/{slug} (artículo)

  # Portal de cliente (rutas protegidas por Clerk)
  dashboard.astro          → /dashboard
  colaboracion.astro       → /colaboracion — asuntos, comentarios y notas internas
  facturacion.astro        → /facturacion
  boveda.astro             → /boveda
  boveda-upload.astro      → /boveda-upload
  roadmap.astro            → /roadmap
  soporte.astro            → /soporte
  calendario.astro         → /calendario
  entorno.astro            → /entorno
  privacidad-portal.astro  → /privacidad-portal

  # Centro de operación — ops.flouvia.com (solo equipo Flouvia)
  ops.astro                    → /ops — resumen operativo real
  ops/bandeja.astro            → /ops/bandeja — asuntos y conversación
  ops/clientes.astro           → /ops/clientes — directorio de workspaces
  ops/clientes/[workspaceId].astro → Cliente 360 y edición controlada

  # API routes
  pages/api/boveda/upload.ts      → POST /api/boveda/upload
  pages/api/client/deploys.ts     → GET  /api/client/deploys
  pages/api/soporte/ticket.ts     → POST /api/soporte/ticket
  pages/api/collaboration/threads.ts  → GET/POST/PATCH asuntos compartidos
  pages/api/collaboration/comments.ts → POST comentarios compartidos/internos
  pages/api/ops/overview.ts            → GET resumen operativo
  pages/api/ops/workspaces/[workspaceId].ts → GET/PATCH Cliente 360
```

Las rutas `/en/*` son el espejo en inglés — cada página portal tiene su mirror en `src/pages/en/`.

---

## i18n

Sistema propio minimalista — sin librería externa.

- **Default lang:** español (`es`) — sin prefijo en URL
- **Inglés:** prefijo `/en/`
- **Traducciones:** `src/i18n/ui.ts`
- **Helpers:** `src/i18n/utils.ts`

```ts
// Uso en cualquier .astro
const lang = getLangFromUrl(Astro.url);   // 'es' | 'en'
const t = useTranslations(lang);
t('hero.title1')  // devuelve string traducido
```

Para texto inline que no vale la pena agregar a ui.ts, usar ternario directo:
```astro
{lang === 'en' ? 'Our Work' : 'Nuestro Trabajo'}
```

**Language switcher** — el switch ES/EN en la Navbar usa `Astro.url.pathname` para mantenerse en la misma página:
```ts
const pathname = Astro.url.pathname;
const esUrl = lang === 'en' ? (pathname.replace(/^\/en/, '') || '/') : pathname;
const enUrl = lang === 'es' ? '/en' + pathname : pathname;
```

---

## Auth — Clerk (invitation-only)

**Modelo:** Solo emails con invitación aceptada en Clerk pueden entrar al portal.

**Doble capa de defensa:**
1. **Clerk Dashboard** (configurar manualmente — Restrictions → Sign-ups → "Restricted"). Sin esto, cualquiera puede crear cuenta vía OAuth.
2. **Autorización de recurso** (`src/lib/portalAccess.ts`) verifica junto a cada página/API privada que el email tenga una invitación aceptada. El middleware solo incorpora Clerk a `Astro.locals`; no depende de una lista frágil de rutas.

**Optimización:** Tras la primera verificación exitosa, el middleware setea `user.publicMetadata.flouvia_invited = true` y futuras requests usan ese flag (fast path) sin volver a llamar al API de invitations.

**Sign-out automático:** La página `acceso-restringido` detecta el query `?signout=1` y ejecuta `window.Clerk.signOut()` para limpiar la sesión zombie.

**Rutas protegidas:** Todas las rutas root-level (`/dashboard`, `/colaboracion`, `/facturacion`, `/boveda`, `/soporte`, `/roadmap`, `/calendario`, `/entorno`, `/boveda-upload`, `/privacidad-portal`) + sus mirrors `/en/*`.

**Flow de redirects:**
- No autenticado en ruta protegida → `/login` (o `/en/login`)
- Autenticado pero sin invitación → `/acceso-restringido?signout=1` (o `/en/access-denied`) → auto-logout

**UI propia:** `CustomSignIn.tsx`, `CustomOAuthCallback.tsx` y `CustomUserMenu.tsx` implementan la experiencia completa. No se renderizan embeds de Clerk. Clerk queda como proveedor headless para identidad, OAuth, MFA, recuperación y sesiones.

**API routes:**
- `const { userId } = await locals.auth()`
- Email: `const user = await locals.currentUser(); user.emailAddresses[0].emailAddress`

**Cliente principal:** `app_users.id` es un UUID interno estable. `clerk_user_id` es solo el vínculo externo; el email es un atributo editable y nunca una foreign key.

### Autorización de Ops

- La autenticación sigue siendo Clerk headless; la autorización vive server-side en `src/features/ops/operatorAccess.ts`.
- Una cuenta necesita correo verificado del equipo y una membresía activa en `ops_memberships`. No basta ocultar botones en React.
- Roles actuales: `owner`, `operator`, `finance`, `collaborator`; cada mutación exige una capability explícita (`clients:write`, `inbox:write`, etc.).
- Toda API de escritura valida host de Ops, `Origin`, sesión, capability, payload con Zod y rate limit.
- Una sesión anónima en `/ops/*` se redirige a `/login`; una cuenta ajena al equipo nunca recibe el snapshot de Ops.

---

## Base de datos — Neon

**Cliente:** `src/lib/neon.ts`; repositorio de queries: `src/lib/portalDb.ts`.
- Acepta `DATABASE_URL` o `FLOUVIA_DATABASE_URL` (nombre inyectado por Vercel Marketplace).
- Solo se usa server-side.
- Toda query privada recibe el `user_id` interno obtenido desde la sesión autorizada.

**Tablas:**

| Tabla | Descripción |
|-------|-------------|
| `app_users` | Identidad interna estable; `role` distingue `flouvia_admin` y `client` |
| `profiles` | Perfil de cada cliente, PK/FK `user_id` |
| `projects` | Proyectos activos, incluye `vercel_project_id` |
| `finance_configs` | Configuración de facturación (1 por cliente) |
| `invoices` | Historial de facturas |
| `vault_files` | Metadata de archivos guardados en Blob privado |
| `roadmap_items` | Hitos del proyecto |
| `tickets` / `ticket_counters` | Tickets y numeración atómica por cliente |
| `notifications` / `announcements` | Notificaciones privadas y anuncios globales |
| `changelog` | Historial público del portal |
| `push_subscriptions` | Suscripciones Web Push por cliente |
| `collaboration_threads` | Asuntos compartidos, prioridad, estado y pin por workspace |
| `collaboration_comments` | Comentarios `shared` y notas `internal` visibles solo para Flouvia |
| `workspaces` | Tenant estable del cliente; desacopla los datos de una persona/email |
| `workspace_members` | Relación usuario↔workspace con membresía activa/revocada |
| `ops_memberships` | Rol interno de cada operador y fecha de revocación |
| `ops_audit_events` | Bitácora append-only de mutaciones administrativas |
| `ops_idempotency_keys` | Base para comandos reintentables sin efectos duplicados |

**Storage:** Vercel Blob privado. Los archivos se guardan bajo `boveda/{user_id}/...`; la descarga pasa por `/api/boveda/download?id=...`, valida sesión + propiedad y transmite el archivo sin exponer una URL pública.

**Schema:** migraciones ordenadas en `neon/migrations/`. Aplicar todas con `npm run db:schema`.

### Ops como consola administrativa

La primera vertical está en `src/features/ops/` y separa `repository → service → API → UI`:

- `/ops`: métricas, cola de atención, clientes recientes y actividad auditada con datos de Neon.
- `/ops/clientes`: directorio por workspace, no por email.
- `/ops/clientes/[workspaceId]`: vista 360 con perfil, proyectos, roadmap, finanzas, tickets, asuntos y actividad; el perfil se edita con control optimista por `version` y motivo obligatorio.
- `/ops/bandeja`: conversación compartida; cambios de estado, pins, mensajes y notas internas escriben auditoría en la misma transacción SQL.
- Las tablas tenant conservan temporalmente `user_id` por compatibilidad, pero ya incluyen `workspace_id`; el código nuevo de Ops debe preferir `workspace_id`.
- Borrado administrativo futuro debe ser archivado/soft delete. `ops_audit_events` bloquea `UPDATE` y `DELETE` mediante trigger.

---

## Integraciones externas

### Vercel API
- **Endpoint:** `GET https://api.vercel.com/v6/deployments?projectId={id}&limit=8`
- **Auth:** `Authorization: Bearer ${VERCEL_TOKEN}`
- **Scope del token:** Full Account o Projects — ambos funcionan
- **Usado en:** `EntornoUI.astro` (deploy history) y `DashboardUI.astro` (activity feed)
- **Pattern:** siempre `AbortSignal.timeout(5000)` — nunca bloquear el render
- **Fallback:** array vacío si timeout o error

### Google PageSpeed Insights (PSI)
- **Endpoint:** `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url={url}&strategy=mobile&category=performance`
- **Auth:** ninguna — API pública gratuita
- **Datos:** CrUX p75 field data para LCP, CLS, INP (Core Web Vitals reales)
- **Timeout:** 7s — PSI puede ser lento
- **Usado en:** `EntornoUI.astro`

### Make (webhooks)
Hay **dos webhooks distintos**:
- **Soporte** (portal): `https://hook.us2.make.com/yxof110p9eswdp0eayr7qihrqx6778dd`
  - Trigger: formulario de soporte enviado. Flow: form → `POST /api/soporte/ticket` → Neon + Make en paralelo.
- **Contacto** (`PlantillaContacto.astro`): `https://hook.us2.make.com/ov4rrddtdx739hnl7dp2mks216171q8m`
  - Trigger: solicitud del formulario por pasos. Fire-and-forget desde el cliente (no pasa por API route).
  - Payload completo y caveat de `data-value` en la sección "Página de Contacto".

### Stripe
- **Integración:** solo Customer Portal (URL en `finance_configs.stripe_portal_url`)
- **Card data:** `card_brand`, `card_last4`, `card_exp` en `finance_configs`
- **No hay Stripe SDK** en el proyecto — todo es link externo al portal de Stripe

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

## API Routes del portal

### `POST /api/soporte/ticket`
Guarda ticket en Neon y reenvía a Make.
- Auth: `locals.auth()` — requiere sesión Clerk
- Body: `{ category, subject, description, priority }`
- Genera `ticket_ref` (TK-001, TK-002…) basado en count del cliente
- Forwards a Make webhook (fire-and-forget, 8s timeout)

### `GET /api/client/deploys`
Obtiene deployments reales de Vercel para el cliente autenticado.
- Lee `vercel_project_id` de tabla `proyectos`
- Llama a Vercel API con `VERCEL_TOKEN`
- Devuelve: `{ deploys: [{ sha, msg, branch, env, status, url, duration, when }] }`

### `POST /api/boveda/upload`
Upload directo autenticado al store privado de Vercel Blob; la metadata se guarda en Neon.
- Rate limit: 10 subidas/minuto por usuario (in-memory)

### Colaboración
- `GET /api/collaboration/threads?workspaceId=` devuelve el snapshot del workspace autorizado.
- `POST /api/collaboration/threads` permite a ambos roles crear asuntos en su workspace.
- `PATCH /api/collaboration/threads` es solo `flouvia_admin`: cambia estado o pin.
- `POST /api/collaboration/comments` permite comentarios compartidos; `visibility: internal` es solo Flouvia.
- El cliente nunca puede seleccionar otro workspace ni recibir comentarios internos.

---

## Variables de entorno (.env)

```
DATABASE_URL=                 # o FLOUVIA_DATABASE_URL, SSR only
BLOB_READ_WRITE_TOKEN=        # store privado, SSR only
PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
VERCEL_TOKEN=                 # Para leer deployments del proyecto del cliente
```

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

## Activity Feed (dashboard)

Mezcla eventos de 3 fuentes, ordenados por fecha descendente, máx 7 items:
- **Deploys** (Vercel API) — dot verde/rojo/ámbar según estado
- **Tickets** (Neon `tickets`) — dot azul/verde/ámbar según status
- **Uploads** (Neon `vault_files`) — dot púrpura

---

## Rate limiting

`src/lib/rateLimit.ts` — in-memory, per Vercel instance.
- Upload: 10 subidas/minuto por usuario
- Si se escala a múltiples instancias → migrar a Upstash Redis

---

## Middleware

`src/middleware.ts` — dos capas con `sequence(cors, clerk)`:

1. **CORS:** Solo permite origins `flouvia.com`, `www.flouvia.com`, `os.flouvia.com`
2. **Clerk:** Protege rutas `/portal/*` y `/en/portal/*`

---

## Layout — props disponibles (`src/layouts/Layout.astro`)

```ts
interface Props {
  title:        string;
  description?: string;   // default: descripción genérica de Flouvia
  image?:       string;   // default: /android-touch-icon-512.png
  noindex?:     boolean;  // default: false
  ogType?:      string;   // default: 'website' — usar 'article' en casos individuales
}
```

El layout genera automáticamente: `canonical`, `hreflang` ES/EN/x-default, OG tags completos
(title, description, url, image, locale, type, site_name) y Twitter card.

**Uso con `ogType="article"`** — casos individuales (`PlantillaCaso.astro`):
```astro
<Layout title={pageTitle} description={pageDesc} image={caso.image} ogType="article">
```
El schema JSON-LD (`Article` + `BreadcrumbList`) se inyecta **en el componente**, no en el Layout,
porque depende de datos dinámicos del caso.

---

## Animaciones — GSAP & WebGL (estándar del sitio)

> **Filosofía actual (mayo/julio 2026):** minimalista, sutil, smooth. El usuario rechazó
> explícitamente: SplitText "frase construyéndose", botones magnetic, entradas
> cinemáticas multicapa y cualquier blur/scale dramático. **Un solo estándar para
> todo el sitio.** Esta sección reemplaza las reglas viejas (SplitText, magnetic,
> `immediateRender:false`, coreografías) — no reintroducir esos patrones.
>
> **WebGL Shaders (Julio 2026):** Se incorporaron fluid shaders interactivos para los
> fondos de tarjetas (ej. Blog y Cord). Estos se renderizan en `<canvas>` absolutos 
> (`z-index: 0`) detrás del contenido (`.relative-z`), manteniendo la elegancia técnica 
> y el performance.
>
> Aplica a: `Inicio.astro`, `PlantillaCasos.astro`, `PlantillaCaso.astro`,
> `PlantillaContacto.astro`, `PlantillaServicios.astro`, `PlantillaNosotros.astro`, `Footer.astro`,
> `blog/index.astro`, `blog/[slug].astro` (y sus mirrors `/en/`).

**Estándar único de entrada:** `fade + leve subida`. `ease: 'power2.out'`,
duración `0.85–1.1s`, `y: 10–24px`, stagger `0.05–0.1s`. Sin blur, sin scale, sin
SplitText.

**Tokens nuevos relevantes:** `EASE='power2.out'`, `DUR=0.9`, `Y=14` (definidos en el
script). `expo.out`/`power3.inOut` solo quedan para animaciones **scrub** (track del
protocolo, barra de progreso, parallax) — no para reveals.

### Patrón anti-parpadeo (reveal on scroll) — CRÍTICO
Los reveals **ocultan el elemento de entrada con `gsap.set` y lo revelan UNA vez con
`gsap.to` desde `onEnter`**. NO usar `gsap.from(..., {immediateRender:false})`:
ese patrón dejaba el elemento visible hasta el primer scroll y entonces lo "saltaba"
a `opacity:0` para re-animarlo → se veía "recargar al hacer scroll".

```ts
const reveal = (targets, opts) => {
  const els = gsap.utils.toArray(targets);
  if (!els.length) return;
  gsap.set(els, { opacity: 0, y: opts.y ?? 14 });          // oculto de entrada
  ScrollTrigger.create({
    trigger: opts.trigger ?? els[0], start: opts.start ?? 'top 85%', once: true,
    onEnter: () => gsap.to(els, {                            // revela 1 vez
      opacity: 1, y: 0, duration: opts.dur ?? 0.9, ease: 'power2.out',
      stagger: opts.stagger ?? 0.08, delay: opts.delay ?? 0,
      clearProps: 'transform,opacity',                       // libera para hovers/.is-active
    }),
  });
};
```
- `clearProps: 'transform,opacity'` al final → libera el inline para que `:hover` y
  `.is-active` apliquen sus propios transforms.
- `ScrollTrigger.create({ once: true })` (no en el tween) → dispara onEnter una sola vez.
- Las animaciones de scroll NO dependen de `.js-anim`: si el elemento está bajo el
  fold, `gsap.set` lo oculta sin que el usuario lo vea; arriba del fold dispara al cargar.

### Anti-FOUC (hero + navbar) — gate `.js-anim`
Elementos que animan **en carga** (hero, navbar) NO deben tener `opacity:0` permanente
en CSS (causaba "pantalla blanca hasta refresh" y flash visible→oculto→anima).
- `Layout.astro` tiene un `<script is:inline>` en el `<head>` que añade `js-anim` a
  `<html>` **antes del primer paint** (solo si NO hay `prefers-reduced-motion`).
- CSS global oculta: `.js-anim .hero-anim { opacity:0 }` (Inicio/Contacto/Nosotros/Servicios),
  `.js-anim #navbar { opacity:0 }` (Navbar), `.js-anim .cs-breadcrumb/…/cs-metrics { opacity:0 }`
  (PlantillaCaso), `.js-anim .blog-anim { opacity:0 }` (blog listing),
  `.js-anim .post-anim { opacity:0 }` (artículo de blog). Debe ir en
  `<style is:global>` porque `.js-anim` vive en `<html>` y Astro scopea los selectores normales.
- GSAP revela con `.to()`/`fromTo()`. **Sin `clearProps` de `opacity`** en estos
  (dejamos el `opacity:1` inline para que gane sobre el gate; sí se puede limpiar el
  `transform`).
- Sin JS o con reduced-motion → la clase nunca se añade → todo visible por defecto.

### robustRefresh
Tras `Promise.all([window load, document.fonts.ready])` → `ScrollTrigger.refresh()`
(con `setTimeout 120ms`). Recalcula posiciones después de fuentes/imágenes para que
los triggers ya pasados disparen su `onEnter` y nada quede invisible.

### Reduced-motion
`if (prefers-reduced-motion) return;` al inicio del `DOMContentLoaded` → no se anima
nada y todo queda visible (la clase `.js-anim` tampoco se añade).

### Otras reglas vigentes
- `once: true` en los ScrollTrigger de reveal (no re-anima al volver a subir).
- NO `clipPath` para reveals; NO 3D (`rotateX/Y`) dentro de `overflow-x:auto`.
- Ken Burns (carrusel casos): solo `scale` en hover (CSS), sin `yPercent` scrubbed.
- "Nota dev": el flash blanco en `npm run dev` es FOUC propio de Astro (inyecta
  estilos por JS). En producción el CSS va en `<link>` del `<head>` y no ocurre.

---

## Diseño — tokens CSS

```css
--color-bg: #ffffff
--color-bg-soft: #fcfcfc
--color-blue-deep: #0a192f      /* navy principal */
--color-text: #050505
--color-text-muted: #555556
--color-border: rgba(0,0,0,0.08)
--font-sans: 'Inter'
--ease-ios: cubic-bezier(0.25, 1, 0.5, 1)
--ease-spring: cubic-bezier(0.22, 1, 0.36, 1)   /* sin overshoot — suavizado (antes 1.05) */
--ease-smooth: cubic-bezier(0.16, 1, 0.3, 1)
```

**Sección oscura (Casos):** `background: radial-gradient(ellipse at 20% 50%, #112240 0%, #0a192f 65%, #050b14 100%)`

---

## Estética — reglas del proyecto

**Filosofía:** minimalista, caro, lujoso. Referencias visuales: Apple, Stripe, Bottega Veneta, Aesop.

**Tipografía editorial (Actualizado Julio 2026):**
- **Eliminación del estilo Serif/Elegante:** Se elimina `Instrument Serif` en favor de `Inter` (sans) para un estilo más moderno y directo.
- **Números:** Los números grandes decorativos han sido removidos (especialmente en tarjetas de blog) para lograr máxima limpieza. Donde sean estrictamente necesarios, van en `01`, `02` sans-serif (no serif italic ni con barra `/`).
- **Títulos = una sola tipografía (Inter bold).** Los H1/H2/headings van completos en `Inter` bold. En interiores (ej. Blog) usan la escala estandarizada `clamp(1.9rem, 3.6vw, 3.4rem)`.
- Eyebrows: Globalmente ocultos vía `Layout.astro` (`[class*="eyebrow"] { display: none !important; }`), EXCEPTO en componentes del Footer (donde sí se utilizan).

**Watermarks de fondo (Eliminados Julio 2026):**
- Todos los watermarks gigantes en el fondo de las secciones han sido removidos por completo en todo el sitio para mantener una interfaz aún más limpia, profesional y libre de ruido visual.

**Cards / containers:**
- NO usar `border` blanco en fondo oscuro (causa "líneas grises" perceptibles). Usar `box-shadow` profundo en su lugar.
- Border-radius: 24px (squircle) para cards normales, 28-32px para containers grandes
- Shadows luxe: `0 24px 60px rgba(0,0,0,0.35)` para cards en dark, `0 30px 80px -30px rgba(10,25,47,0.08)` para containers en light

**Plantillas Interiores & Hero (Actualizado Julio 2026):**
- **Heroes Unificados:** Todas las plantillas interiores (Casos, Servicios, Cord, Blog) usan un Hero centrado, limpio, con el título directamente alineado sin elementos asimétricos (eliminados los layouts "flex-between"). Se eliminó toda lógica de separación de texto (como `titleHasDot`) para remover el punto serif final.
- **Métricas Minimalistas (Apple-style):** Las bandas oscuras y pesadas de métricas ("DARK BLUEPRINT") fueron eliminadas de Servicios. En los Casos de estudio, la sección de resultados ahora tiene fondo claro (`--color-bg`), números gigantes gruesos, más padding y ausencia de cajas oscuras.
- **Sin CTAs Intermedios:** Se eliminaron todos los bloques CTA personalizados al final de las páginas de plantillas (`.cta-card-blue`, `.cta-integrated`). Ahora el sitio depende exclusivamente del CTA unificado del `Footer.astro` para cerrar cada página.

**Blog & Shaders (Actualizado Julio 2026):**
- **WebGL Fluid Shader:** Se eliminaron las cuadrículas estáticas (`.visual-grid-lines`) de las tarjetas del blog en favor de un shader de fluido WebGL ultraligero y de alto rendimiento, implementado con `OffscreenCanvas` y Vanilla WebGL.
- **Minimalismo absoluto:** El shader es completamente pasivo (no reacciona al mouse ni emite luz). Es un gradiente fluido lento y elegante (mayormente oscuro), que mezcla de forma sutil un 12% del color de la categoría (`data-shader-color`) usando simplex noise y ruido esmerilado, manteniendo una estética *Apple/Stripe* extremadamente sobria.
- **Categorías y Filtros:** Se eliminaron las pastillas coloridas (`.cat-pill`). Ahora las categorías usan enlaces de texto simple que se subrayan al hover, fusionándose con el diseño sin crear ruido visual. El filtro JS oculta tarjetas manipulando `.hidden` con `display: none !important` y forzando `ScrollTrigger.refresh()`.
- **Datos y Ordenamiento:** El arreglo principal de posts exportado en `src/data/blog.ts` aplica automáticamente un `.sort()` descendente por fecha (`post.date`), garantizando un listado cronológico sin intervención manual.

**Easings — qué usar/no usar:**
- ✅ `power2.out` — estándar de TODAS las entradas del home (sutil, sin overshoot)
- ✅ `expo.out` / `power3.inOut` — solo para animaciones **scrub** (track, barra de progreso, parallax)
- ❌ `back.out` (rebotes), spring/elastic — juguetón, no luxury

**Hover states luxury:**
- Translate sutil (3-8px), nunca scale dramático (max 1.06)
- Botones (`.btn-luxe`, `.btn-glow-blue`, `.btn-contact`): elevación `translateY(-3px)` en CSS — **NO magnetic** (el usuario lo rechazó; se eliminó de home y navbar)
- Cambios de color graduales (0.4-0.6s)
- El mouse glow tracker `--cta-mx/y` (CTA) / `--mouse-x/y` para revelar áreas — microinteracción sobria, se mantiene

---

## Mapa de secciones del index

```
Hero (white)        — clamp(1.9rem, 3.6vw, 3.4rem) title (reducido), fade en carga,
                      cabe completo en 100svh. Status pill "Aceptando proyectos Q3".
Tech (white)        — Tira de logos minimalista: 8 logos grises (.strip-logo) en
                      grid 4-col centrado, sin tarjetas ni hover navy. Header centrado.
Casos (dark navy)   — Carrusel horizontal scroll-snap, Ken Burns (scale) en hover
Servicios (white)   — Lista vertical de 4 rows, números 2rem sans-serif (01, 02...)
Protocolo (gray)    — Sticky 2-col + timeline track con gradient + step counter
CTA (gray + dark)   — Card oscura con mouse-tracking glow
Footer (dark navy)  — Watermark "Flouvia" 26vw. Grid 5fr/7fr: columna de marca
                      (logo, tagline sans, descripción-entity, status badge) +
                      3 nav cols (01 TRABAJO · 02 LA FIRMA · 03 CONTACTO).
                      El correo es el CTA protagonista (en 03). Ver Footer pattern.
```

> **Eliminado (mayo 2026):** la "proof-strip" (filas El Zarco −67% / Setnpet +42%
> que iban debajo del hero) y el grid editorial de tarjetas del bloque Tech (con
> hover navy, números y labels). El bloque Tech ahora es solo la tira de logos.

**Pattern de Layout (Split Header):**
- Por defecto, TODAS las secciones (excepto el Hero) usan un layout "Split Header".
- **Izquierda:** El título de la sección (`<h2>`).
- **Derecha:** El subtítulo/texto explicativo (`<p class="section-intro">`).
- Esto reemplaza el antiguo patrón centrado, otorgando un look más limpio y estructurado a los inicios de sección en pantallas de escritorio. En móvil, se apilan verticalmente.

**Pattern de "active step" (Protocolo y similar):**
- ScrollTrigger sin scrub con `start: 'top 55%'` y `end: 'bottom 45%'` para detectar qué paso es el más visible
- Toggle clase `.is-active` con `onEnter`/`onEnterBack`/`onLeave`/`onLeaveBack`
- Contador "01 / 04" en sticky col se actualiza con animación `fromTo` (y: -10 → 0, opacity: 0 → 1)
- Barra de progreso (1px de alto) con scrub para llenarse conforme avanza el scroll

**FAQ Pattern (Actualizado Julio 2026):**
- **Estética Apple/Minimalista:** Diseño en 2 columnas (desktop) donde el encabezado (`.faq-header`) permanece fijo (sticky) a la izquierda y las preguntas (`.faq-list`) hacen scroll a la derecha.
- **Acordeón Custom:** Se eliminó el uso de `<details>` nativo por problemas de animación. Ahora se usan botones (`.faq-q`) y divs (`.faq-a`), controlando la altura con GSAP.
- **Interacción Exclusiva:** Al abrir una pregunta, se despliega suavemente y cierra automáticamente las demás.
- **Iconografía Clean:** Ícono de + / - construido con `span`s de 1.5px de grosor que rotan con un easing `spring` suave.
- **Tipografía:** Las preguntas usan Inter Medium (500) con `letter-spacing` negativo. Al hacer hover, el color se atenúa ligeramente.

**Footer pattern** (`src/components/Footer.astro` — rediseñado mayo/julio 2026):

> **Objetivo del rediseño:** dar protagonismo al correo (antes era un link pequeño
> perdido al pie de la columna de marca) y reordenar el contenido con eje de
> exclusividad. El correo es ahora el **CTA principal** del footer.
> **Actualización Julio 2026 (Unified CTA):** Todos los CTA finales de página se fusionaron
> visualmente y estructuralmente en el componente `Footer.astro`. Ya NO se usa `<slot name="cta" />`.
> El Footer ahora recibe `props` (`ctaTitleEs`, `ctaBtnEs`, etc.) para inyectar copy dinámico
> y de alta conversión dependiendo de la página (usando principios de marketing/copywriting).
> **Reglas estrictas de diseño del CTA del Footer:** 
> - **Cero serif:** El título principal del CTA (`.unified-cta-title`) debe ser 100% sans-serif (Inter) y audaz (`font-weight: 800`).
> - **Botón limpio (sin brillo):** El `.unified-cta-btn` no debe usar `box-shadow` ni glow effect. Emplea la flecha `.cta-arrow` con `transform: translateX(4px)` en hover para igualar la animación del resto del sitio.
> - **Ocultar CTA:** Si la página ya cumple el propósito del CTA (ej. `/contacto`), pasar la prop `hideCta={true}` al Footer para evitar redundancia.

**Estructura (de arriba a abajo):**
1. `.top-hairline` — línea con gradient que desvanece a los lados.
2. `.footer-watermark` — `Flouvia` en serif italic, `26vw`, `rgba(255,255,255,0.025)`.
3. `.footer-meta-row` — eyebrow ("ESTUDIO · CIUDAD DE MÉXICO") + edición ("2026 · Edición", número en serif italic).
4. `.footer-grid` (`grid-template-columns: 5fr 7fr; gap: 6rem`):
   - **`.brand-column`** (izquierda): logo SVG → **tagline** (`.footer-statement`,
     `clamp(1.7rem, 2.2vw, 2.3rem)`, **100% sans/Inter — SIN palabra-accent serif**;
     el usuario rechazó "B2B" en serif italic) → **descripción** (texto tipo
     *entity definition* para AI SEO, incluye escasez "menos de 8 clientes activos al
     año") → **`.footer-status-badge`** (punto verde `pulse-server` + "ACEPTANDO
     PROYECTOS Q3").
   - **`.navigation-columns`** (derecha, `grid-template-columns: 1fr 1fr 1.7fr; gap: 2.5rem`):
     - `01 TRABAJO` → Servicios · Casos · Blog
     - `02 LA FIRMA` → Nosotros · Portal de Clientes (`/login`)
     - `03 CONTACTO` (`.contact-col`, más ancha) → `.contact-location`
       ("CDMX — Operación global") + **`.minimal-email-link` = correo protagonista**
       (`hola@flouvia.com`, `clamp(1.4rem, 1.9vw, 1.8rem)`, weight 600, subrayado +
       flecha SVG animada) + `.contact-note` ("Respuesta en menos de 24 h.").
5. `.footer-divider` — hairline con gradient.
6. `.footer-bottom` (flex space-between): copyright (© 2026 **Flouvia** en serif italic
   + "Todos los derechos reservados.") · `.footer-socials` (IG/FB/LinkedIn como íconos
   circulares compactos) · `.legal-right` (Privacidad · Términos).

**Tipografía — casing unificado (regla del proyecto):**
- **Etiquetas-sistema en MAYÚSCULAS:** eyebrow, `01 02 03` col-titles, status badge.
- **Links en Title Case:** Servicios, Casos, Blog, Nosotros, Portal de Clientes
  (hardcodeados con ternario `isEn ?`, **NO** `t()` — las claves `nav.*` devuelven
  mayúsculas y romperían el casing). Por eso `useTranslations`/`t` ya no se importa aquí.
- Numeración `01 02 03` y el "2026" de edición: sans-serif. El "Flouvia" del copyright: serif italic.

**Hairlines:** `linear-gradient(to right, transparent, rgba(255,255,255,0.18) 20%, ... 80%, transparent)` — bordes desvanecen.

**Animación de entrada:** master timeline con `defaults: { ease: 'power2.out' }`
(sutil, NO `expo.out`), patrón anti-parpadeo (`gsap.set` oculta + `gsap.to` revela
una vez en `onEnter`, `ScrollTrigger once:true`, `start: 'top 88%'`). `fadeSel`
incluye: eyebrow, edition, logo, statement, description, **footer-status-badge**,
nav-col (stagger), footer-bottom > * (stagger). Hairline y divider animan `scaleX`.
Reduced-motion → return temprano, todo visible.

**Scarcity placeholders (actualizar por trimestre):** el status badge "ACEPTANDO
PROYECTOS Q3" y la descripción "menos de 8 clientes activos al año" son valores
hardcodeados — revisar cada trimestre.

> **Eliminado en el rediseño (mayo 2026):** la columna `/03 Redes` con links de texto
> (las redes pasaron a íconos en `.footer-bottom`); el botón destacado "Aplicar a un
> proyecto" (el usuario prefirió que el correo solo cargue ese rol); el indicador
> "SISTEMAS OPERATIVOS" y el link "CDMX" de la barra inferior; los links "Inicio" y
> "Contacto Privado"; la palabra-accent serif del statement.

---

**PortalFooter pattern** (`src/components/PortalFooter.astro` — rediseñado mayo 2026):

> **Objetivo:** footer del portal de clientes autenticados. Visual coherente con el
> footer público (mismo dark navy radial-gradient, watermark, eyebrow, numeración /0X
> serif, hairlines) pero escalado a herramienta logueada — sin correo enorme ni CTA
> de marketing, con las páginas del portal completas y logout.

**Estructura:**
1. `.pf-hairline` — hairline con gradient que desvanece.
2. `.pf-watermark` — "Flouvia" serif italic, `17vw`, `rgba(255,255,255,0.022)`.
3. `.pf-meta` — eyebrow `FLOUVIA OS · PORTAL DE CLIENTES` + badge `● SISTEMAS OPERATIVOS` (LED pulse verde).
4. `.pf-grid` (`5fr 7fr`):
   - **`.pf-brand-col`**: logo SVG + **statement 100% sans/Inter** "Tu operación, en un solo lugar." (SIN serif italic — misma regla que el footer público) + correo `hola@flouvia.com →`.
   - **`.pf-nav-cols`** (`repeat(3, 1fr)`):
     - `01 PORTAL` → Dashboard · Bóveda · Facturación · Calendario
     - `02 HERRAMIENTAS` → Roadmap · Entorno · Changelog · Soporte
     - `03 CUENTA` → Sitio Público · Cerrar sesión (logout)
5. `.pf-divider` — hairline con gradient.
6. `.pf-bottom` — copyright + Privacidad · Términos.

**Tipografía — mismas reglas que el footer público:**
- Etiquetas-sistema en MAYÚSCULAS (eyebrow, `0X` col-titles, badge).
- Links en Title Case (hardcodeados con ternario `isEn ?`).
- Statement 100% sans — sin acento serif italic.
- Números de edición y "Flouvia" del copyright: serif italic (`.pf-ed`).

**Logout:** `window.Clerk.signOut(cb)` vía `<script>` (botón `#pf-signout`). Se pasa
callback para inhibir la navegación default del SDK y redirigir al home. NO usar
`<SignOutButton>` de `@clerk/astro/components` — no está exportado por esa versión y
rompe el build.

**Montaje:** ya está en `PortalLayout.astro` línea 59 → aparece en todas las páginas del portal automáticamente.

**Animación:** CSS `animation: pf-fadein 0.9s var(--pf-ease) both` (no GSAP — el portal usa CSS animations para entradas simples). `prefers-reduced-motion` desactiva la animación y el LED pulse.

---

## Navbar — patterns

**Logo transition (desktop):**
- Logo grande en centro desaparece al scroll con clase `.scrolled` vía CSS: `opacity: 0; transform: translateY(-12px) scale(0.94); pointer-events: none`
- Logo pequeño dentro de la píldora aparece: `.pill-logo { max-width: 0; opacity: 0 }` → `.scrolled .pill-logo { max-width: 150px; opacity: 1 }`
- La transición es 100% CSS (no GSAP) — GSAP solo maneja la animación de entrada. Crítico: limpiar inline styles con `clearProps` al terminar entrada o el CSS de `.scrolled` no puede sobreescribir.

**Animación de entrada (mayo 2026 — reveal escalonado):** timeline GSAP que revela las
piezas internas en stagger sutil (top-bar → glass-pill/mobile-pill → main-logo → hijos
de `#nav-right`), `power3.out`, `y:-10`, stagger `0.07`. **NO** la coreografía cinemática
vieja (logo cayendo con blur, pill escalando). Patrón anti-flash: el gate
`.js-anim #navbar{opacity:0}` tapa el navbar antes del paint; se ocultan las piezas con
`gsap.set` **mientras el contenedor sigue tapado**, luego se revela el contenedor
(`gsap.set(navbar,{opacity:1})`) y entran las piezas. `onComplete` →
`clearProps:'transform,opacity'` en las piezas (para que `.scrolled`/`:hover` gobiernen);
el navbar conserva su `opacity:1` inline (gana sobre el gate). Reduced-motion → todo visible.

**Estética de las píldoras — Liquid Glass (iOS):** `.glass-pill`, `.lang-switch`,
`.mini-pill` y `.mobile-pill-inner` usan el mismo lenguaje: fill translúcido en
`linear-gradient(180deg,...)`, `backdrop-filter: blur(24-34px) saturate(1.8-1.9)
brightness(1.04-1.06)`, **rim light** (`inset 0 0 0 0.5px rgba(255,255,255,.35-.4)`),
**specular top** (`inset 0 1px 1px rgba(255,255,255,.9+)`) y sombra profunda suave.
Estado `.scrolled` = versión navy translúcida con los mismos insets. Transición
claro→oscuro: `0.7s var(--ease-spring)` por propiedad (no `all`). `--btn-contact` se
deja navy sólido (no glass) a propósito.

**Hover de los nav-links — indicador deslizante (NO burbuja que crece):** el usuario
rechazó el `::before` que escalaba ("se hace grande"). Ahora hay **un solo** elemento
`#nav-indicator` (cápsula de vidrio) dentro de `.glass-pill`; GSAP lo desliza (`x,y,
width,height`, `power3.out` ~0.5s) al `.nav-link` en `mouseenter` y lo regresa al link
activo en `mouseleave` del pill. Detalles: posición **relativa al pill**
(`rect.left - pillRect.left`) → inmune al transform de la entrada; flag `visible` para
que aparezca ya colocado (no "crecer desde la esquina") en páginas sin link activo;
se recoloca en `fonts.ready`, `load` y `resize` (`indicatorRelayout`). **Al cambiar
`.scrolled`** el `pill-logo` aparece/desaparece y empuja los links durante su transición
CSS de 0.7s → en vez de un `setTimeout` que reacomoda al final (causaba un desfase
visible: el indicador se quedaba en la posición vieja y luego saltaba), un loop de
`requestAnimationFrame` (`indicatorFollow`, ~780ms) **pega** el indicador al link con
`gsap.set` cuadro por cuadro (`snap`), así lo **sigue** mientras el layout se mueve.
`target` = link activo o el hovered; `slide` anima (hover/relayout), `snap` es instantáneo
(seguimiento). `indicatorRelayout`/`indicatorFollow` se declaran arriba del callback.

**Active link:** lo marca el `#nav-indicator` descansando sobre el `.nav-active` (ya no
hay `::before` por link). `.nav-active` solo cambia el color del texto. No usar dot/underline.

**Hover btn-contact:** 100% CSS (`.btn-contact:hover` → shimmer + flecha). **El
magnetic se eliminó** (el usuario lo rechazó). El hover de los nav-links es el indicador
deslizante (arriba) + fade de color; se eliminó el letterSpacing/translateY del hover.

**PortalNavbar (`PortalNavbar.astro`) — mismo sistema:** la navbar del portal replica
el navbar público: píldoras Liquid Glass (`.pnav-pill`, `.pnav-lang-switch`,
`.pnav-mobile-inner`), indicador deslizante `#pnav-indicator` (reemplazó el `::before`
que crecía **y** el dot `::after` del activo), entrada con reveal escalonado (se quitó
el scale/elastic) y transición scroll por-propiedad a `--ease-spring`. Para el anti-flash
se añadió el gate `.js-anim` al `<head>` de `PortalLayout.astro` (script `is:inline`
pre-paint) + `<style is:global>.js-anim #pnav{opacity:0}` en el componente. El
`UserButton` de Clerk se deja intacto (no glass).

**Lang switch ES↔EN — crossfade + prefetch (sin sensación de recarga):** el sitio **NO**
usa View Transitions (se evaluó y se descartó: `ClientRouter` obligaría a reescribir el
init de ~17 páginas públicas, el código FOUC-frágil del proyecto). En su lugar, el script
del navbar: (1) **precarga** el destino del otro idioma con `<link rel="prefetch">` al
primer indicio de intención (`mouseenter`/`touchstart`, `once`); (2) al click hace
`gsap.to(document.body,{opacity:0,duration:0.16})` → navega en `onComplete`. El destino
entra con su propio gate `.js-anim` → se lee como crossfade. Guard `pageshow` con
`event.persisted` limpia el `opacity:0` inline al volver por bfcache (si no, pantalla en
blanco). Reduced-motion o idioma activo → navegación normal sin fade.

**Preservar scroll al cambiar de idioma (no reiniciar arriba):** como es navegación real,
la página destino cargaría en el top. Al click se guarda `sessionStorage['flouviaLangScroll']
= scrollY`; el `<head>` de `Layout`/`PortalLayout` (script `is:inline`, antes del paint) ve
el flag y añade `html.lang-restoring` → `html.lang-restoring body{opacity:0}` oculta todo
para que no se vea el salto desde el top. El navbar (en `DOMContentLoaded`): lee y borra el
flag, `window.scrollTo(0,y)` (ya, en el siguiente frame y en `load`), quita la clase y revela
el body con un crossfade (`gsap` 0.25s). **Failsafe** en el head: `setTimeout 1500ms` quita
`lang-restoring` aunque el navbar muera (no dejar el body en blanco). Implementado en AMBOS
navbars (público y portal); el switch del portal también recibió el crossfade+prefetch.

---

## Bugs conocidos y sus fixes

| Bug | Causa raíz | Fix |
|-----|-----------|-----|
| **Las cosas "se recargan" al primer scroll** (home) | `gsap.from(..., {immediateRender:false})` deja el elemento visible hasta que el trigger dispara; en el primer scroll lo salta a `opacity:0` y lo re-anima | **Patrón actual:** `gsap.set(els,{opacity:0,y})` + `ScrollTrigger.create({once:true, onEnter: () => gsap.to(els,{opacity:1,...})})`. Oculto de entrada → revela 1 vez sin parpadeo. Ver sección Animaciones. |
| **Pantalla en blanco al cargar / hasta refresh** (hero, navbar) | `opacity:0` permanente en CSS esperando a que el JS anime → flash visible→oculto→anima | Gate `.js-anim`: script `is:inline` en `<head>` del Layout añade la clase antes del paint; `.js-anim .hero-anim/#navbar { opacity:0 }` en `<style is:global>`; GSAP revela con `.to()` **sin** limpiar opacity. Sin JS/reduced-motion → visible. |
| **Nota:** flash blanco SOLO en `npm run dev` | Astro dev inyecta los estilos de componentes por JS (FOUC de dev) | No es bug de producción — ahí el CSS va en `<link>` del `<head>`. Verificar con el build (`dist/client/index.html`). |
| Logo/elemento no responde a clase `.scrolled` | GSAP deja inline style `opacity:1` al terminar entrada | `onComplete: () => gsap.set(el, { clearProps:'transform' })` (no limpiar opacity si hay gate `.js-anim`) |
| `position: sticky` no funciona en sección | `overflow: hidden` en el contenedor padre crea scroll container | Cambiar a `overflow: clip` — recorta visualmente sin crear scroll container |
| Línea gris en borde inferior de carrusel | `yPercent: -8` con scrub mueve imagen hacia arriba revelando fondo | Eliminar scrub de yPercent, solo usar scale para Ken Burns |
| Hover/`is-active` no aplica `transform` después del reveal | GSAP deja inline `transform: matrix(...)` con más especificidad que las pseudo-clases | `clearProps: 'transform,opacity'` en el `gsap.to` del reveal (ya incluido en el helper `reveal`) |
| `Clerk.signOut()` redirige al login en vez de quedarse en la página | Sin callback, el SDK navega a `signInUrl` automáticamente | Pasar callback como primer argumento: `Clerk.signOut(() => { /* limpiar */ })`. El callback inhibe la navegación default. |
| `.throwOnError().catch()` falla en TypeScript | `throwOnError()` devuelve `PromiseLike`, no `Promise` — no tiene `.catch()` | Usar la query normal (sin `throwOnError`) — ya devuelve `{ data, error }` y `data` es null si hay error |
| Estilos de librería con DOM inyectado en runtime no aplican (ej: intl-tel-input, tipografía del prefijo `+52` no empata) | Astro **scopea** los selectores del `<style>` no-global a `.sel[data-astro-cid]`; el DOM que inyecta la librería por JS no trae ese atributo → el selector nunca matchea | Mover esos selectores a `<style is:global>`. Verificable en el CSS compilado: scoped sale `.iti…[data-astro-cid-…]`, global sale `.iti…{` a secas |

---

## Componentes clave

| Archivo | Descripción |
|---------|-------------|
| `src/components/Inicio.astro` | Landing page completa — hero, tech, casos, servicios, protocolo, CTA |
| `src/components/Navbar.astro` | Navbar con glassmorphism y dark-mode adaptativo |
| `src/components/PlantillaContacto.astro` | Página `/contacto` (y `/en/contacto`) — hero estándar home + formulario por pasos. Ver sección "Página de Contacto". |
| `src/components/PlantillaServicios.astro` | Página `/servicios` (y `/en/servicios`) — rediseñada mayo 2026. Ver sección "Página de Servicios". |
| `src/components/PlantillaCasos.astro` | Página `/casos` (listing). Hero estándar home + grid 2-col. Simplificada (Julio 2026): sin CTAs de escasez adicionales. Ver "Página de Casos". |
| `src/components/PlantillaCaso.astro` | Template **compartido** del caso individual (`/casos/{slug}` y `/en/casos/{slug}`). Ambas `[slug].astro` son wrappers que le pasan `caso/next/isEn/root`. Lee todo de `data/casos.ts`. Ver "Página de Casos". |
| `src/components/PlantillaApps.astro` | Listing de apps de Shopify (`/apps` y `/en/apps`). Grid de apps `live` + slots `soon`. Hero estándar home. Ver "Página de Apps". |
| `src/components/PlantillaApp.astro` | Template **compartido** del detalle de app (`/apps/{slug}` y `/en/apps/{slug}`). Hero con botón Instalar + info-card lateral, problema, features, FAQ, CTA. Lee de `data/apps.ts`. Ver "Página de Apps". |
| `src/data/apps.ts` | Fuente única de apps. Helpers `liveApps`/`soonApps`. `status:'live'` genera página de detalle; `status:'soon'` solo aparece como slot en el listing. |
| `src/layouts/PortalLayout.astro` | Layout del portal de cliente |
| `src/components/portal/PortalHeader.astro` | Header compartido de todas las páginas del portal |
| `src/components/PortalFooter.astro` | Footer del portal — dark navy coherente con el footer público. Ver "PortalFooter pattern" |
| `src/pages/blog/index.astro` | Listing del blog — hero con status pill, grid cards, CTA contextual. `prerender:true`. |
| `src/pages/blog/[slug].astro` | Artículo individual — hero, banner, sidebar TOC, article, author card, related, CTA. `prerender:true`. |
| `src/data/blog.ts` | Fuente única de posts + `export const AUTHOR` (nombre, initial, rol, LinkedIn, bio). |

---

## Página de Blog

> Rediseñada mayo 2026: unificada con el estándar de animación/tipografía del home.
> Archivos: `src/pages/blog/index.astro`, `src/pages/blog/[slug].astro` (y mirrors `/en/`).
> Datos: `src/data/blog.ts`.

### Autor — fuente única de verdad (`AUTHOR`)
El objeto `AUTHOR` exportado desde `blog.ts` centraliza todos los campos del byline:
```ts
export const AUTHOR = {
  name:    'André Valle Ortega',
  initial: 'A',
  role:    { es: 'Fundador, Flouvia', en: 'Founder, Flouvia' },
  url:     'https://flouvia.com/nosotros',
  linkedin: '',   // TODO: pegar URL de LinkedIn → activa sameAs en schema + author-card-link
  bio:     { es: '…', en: '…' },
};
```
Reemplaza el viejo "Flouvia Team / avatar F" (señal nula para E-E-A-T).
**Regla:** cualquier cambio de autor o bio → editar solo `AUTHOR`. El byline, el author card al pie del artículo, y el schema `Person` lo leen de ahí automáticamente.

### Modelo de datos (`BlogPost`)
Campos añadidos en mayo 2026 (además de los que ya existían):
```ts
dateModified: string;        // CRÍTICO — actualizar al editar. AI prioriza contenido reciente.
about: { es: string; en: string }[];  // temas para schema `about` (mejora extracción AI)
cta: {                       // CTA contextual al cierre — distinto por artículo
  eyebrow: { es; en };
  title:   { es; en };
  button:  { es; en };
};
```

### Listing — `/blog` y `/en/blog`
- **Hero estándar home**: status pill "ACEPTANDO PROYECTOS Q3" + eyebrow "INGENIERÍA APLICADA — PERSPECTIVAS DE LA FIRMA" + H1 bold 100% Inter + desc + post-count pill.
- **Gate `.js-anim .blog-anim { opacity:0 }`** en `<style is:global>` + timeline GSAP `power2.out` en carga (igual patrón que home). Reveal de featured card, post cards y CTA con helper `reveal()`.
- **CTA reescrito**: eyebrow "¿LEES ESTO Y RECONOCES TU OPERACIÓN?" + badge "● 2 proyectos disponibles Q3". Elimina el viejo "Listo para escalar tu ¿operación?" (typo + copy genérico).
- **Schema `Blog`** (JSON-LD) inyectado en la página con `blogPost[]` que lista todos los artículos.
- Title SEO: "Blog de Ingeniería E-commerce y B2B | Flouvia — CDMX".
- Scarcity placeholders (actualizar por trimestre): hero status pill + CTA badge → ver [[flouvia-scarcity-placeholders]].

#### Barra de filtros — Liquid Glass segmented control (mayo 2026)
Las pills de categoría (Todos / B2B / E-commerce / Automatización) usan el mismo lenguaje visual que el navbar:
- **Contenedor `.filter-glass`** (id `filter-glass`): Liquid Glass — `backdrop-filter: blur(30px) saturate(1.9)`, fill translúcido, rim light + specular top + sombra profunda suave. Shimmer sweep al hover del contenedor.
- **Indicador `.filter-indicator`** (id `filter-indicator`): cápsula de vidrio interna que desliza entre categorías con GSAP (`power3.out`, 0.48s). Mismo patrón que `#nav-indicator` del navbar.
- **Pills `.filter-pill`**: sin borde propio, sin fondo propio — solo cambian `color`. `z-index: 1` para quedar sobre el indicador. `text-transform: uppercase`, `letter-spacing: 0.8px`.
- **JS**: `slideIndicator` se define antes de los click handlers; posiciona en el activo inicial (sin animar), desliza en hover/click, vuelve al activo en `mouseleave`. Se recoloca en `fonts.ready`, `load`, `resize`. Con `reduced-motion` el indicador no se crea.
- **NO cambió la estructura HTML** de la barra — solo estética.

### Artículo — `/blog/{slug}` y `/en/blog/{slug}`
- **Hero**: breadcrumb, cat-badge + post-num, H1, meta-row (autor + fecha + tags). Gate `.js-anim .post-anim{opacity:0}` + timeline `power2.out`.
- **Sidebar TOC**: sticky, construido por JS desde los `h2` del artículo. Activo con `toc-active` via ScrollTrigger. Oculto en mobile (≤1024px).
- **Barra de progreso** de lectura (CSS width, listener scroll, no GSAP).
- **Author card** al pie del artículo: avatar + "ESCRITO POR" + nombre + rol + bio + link LinkedIn (condicionado a que `AUTHOR.linkedin` no esté vacío).
- **CTAs contextuales** por artículo: B2B → "Solicitar diagnóstico B2B", CRO → "Solicitar auditoría CRO", Automatización → "Diagnóstico de automatización". Ya no el genérico "Escale su operación."
- **Schema `BlogPosting`** (JSON-LD): `author.@type: Person`, `datePublished`, `dateModified`, `about[]`, `publisher.@id`, `isPartOf`, `keywords`, `inLanguage`. `sameAs` se incluye solo si `AUTHOR.linkedin` no está vacío.
- **`ogType="article"`** pasado al Layout.

### Contenido — cambios específicos por artículo (mayo 2026)
- **B2B Mayoristas**: tabla decisión "Shopify B2B nativo vs capa custom" (5 criterios). "Resultados típicos" con dato real El Zarco (67%) + link a `/casos/el-zarco`.
- **5 Errores CRO**: "Error 0" (tasa de conversión de referencia) antes de los 5. Lead con link a `/casos/setnpet` (0.9%→1.3%).
- **Make vs Custom**: tabla comparativa (Make / Custom / Híbrido × 5 criterios). Ejemplo del modelo híbrido con El Zarco.

### Tipografía del artículo
- Títulos en el listado: 100% Inter bold. **Eliminados** los acentos serif italic en related title, CTA heading.
- Serif italic queda en: `.post-num-badge` (numeración `/01`), `.banner-title-watermark`, `.related-num`, `.cat-pill` / watermarks.
- **Tablas** (`.table-wrap table`): formato más citado por AI; estilos en `<style is:global>` para que apliquen al HTML inyectado con `set:html`.
- **Links inline** en el artículo: `color: var(--color-blue-deep)`, underline, weight 600 — en `<style is:global>` (misma razón: `set:html` no lleva `data-astro-cid`).

---

## Página de Contacto (`PlantillaContacto.astro`)

> Sirve `/contacto` y `/en/contacto` (ambos `prerender:true`, mismo componente; idioma por
> `getLangFromUrl`). Reescrita mayo 2026 bajo el eje de **firma selectiva** ([[flouvia-brand-voice]])
> y el estándar de animación minimalista del sitio.

### Estructura (3 secciones)
```
Hero (white, 100svh)   — mismo estándar que la home: status pill de escasez + eyebrow +
                         H1 bold (una sola tipografía, sin serif) + hero-bottom (desc + CTA scroll).
                         CTA "Iniciar solicitud ↓" hace scroll a #form-zone.
Trust strip (NAVY)     — `Resultados` (gris, full-width) — grid de 2-4 métricas destacadas bajo la sección
                         "Evidencia". 3 métricas reales (−67% El Zarco · +42% / 3× Cord) en
                         serif italic BLANCO + nota de escasez. Sin testimonio (no inventar).
Executive contact      — grid 320px/1fr: sidebar sticky + formulario por pasos (#form-zone).
                         Watermark serif "Aplica" muy faint detrás; overflow:clip.
```

### Lenguaje visual = "editorial" (igual que Inicio), NO "dashboard"
La sección se rediseñó (mayo 2026) para igualar la estética del home tras feedback de que el look
"mono/dashboard" se sentía off-brand:
- **Sin JetBrains Mono en labels** — todos los eyebrows/labels van en `Inter` 800 uppercase letterspaced
  (`.ec-label`, `.sp-label`, `.sf-group label`, `.ds-eyebrow`, `.ds-next-label`, `.tm-case`). El mono
  solo queda en afordances de teclado (`.chip-key`, `.kbd-hint kbd`).
- **Números en Instrument Serif italic**: contador de paso (`.sp-current`), `/01…/05` grande por pregunta
  (`.dq-index`, eco de los `/01` de los service-rows del home), reloj CDMX (`.ec-clock`) y métricas del
  trust strip (`.tm-val`).
- **Contraste claro/oscuro**: la franja de Evidencia es navy (mismo `radial-gradient` que la sección Casos).
- **Hairlines difuminadas** en las orillas (`linear-gradient(transparent, border 10%, border 90%, transparent)`)
  vía `::before` en `.step-nav` y `.ds-next` — patrón del footer/tech del home (no usar borde sólido).
- **Watermarks** serif italic gigantes y faint: "Evidencia" (navy, blanco 0.035) y "Aplica" (form, navy 0.022).

### Hero
- Status pill (`.hero-status`) = escasez explícita: **"2 CUPOS DISPONIBLES · Q3" / "2 SLOTS OPEN · Q3"**
  (placeholder por trimestre — ver [[flouvia-scarcity-placeholders]]).
- Eyebrow: "PROCESO DE APLICACIÓN" / "APPLICATION PROCESS".
- H1: "Aplica. / Evaluamos el fit." — **bold sans en ambos versos** (regla de una sola tipografía).
- Animación: gate `.js-anim .hero-anim{opacity:0}` + timeline GSAP `power2.out` (igual que `Inicio.astro`),
  parallax leve solo desktop. Reduced-motion → return temprano, todo visible.

### Sidebar (`.ec-sidebar`, sticky) — tarjeta Liquid Glass (iOS)
Iteración (mayo 2026): primero se dejó mínima (3 bloques) pero "se veía vacía" → ahora es una **tarjeta
de vidrio esmerilado** (mismo lenguaje iOS del navbar) con secciones separadas por hairlines internas:
- **Glass**: `border-radius:24px`, `backdrop-filter: blur(28px) saturate(1.8) brightness(1.04)`, fill
  `linear-gradient(180deg, rgba(255,255,255,.74), rgba(248,250,252,.55))`, rim+specular+sombra profunda
  vía `box-shadow` (inset edge `rgba(10,25,47,.05)` para definirse sobre blanco). `overflow:hidden`.
- **Secciones** (`.ec-block`, padding `1.4rem 1.55rem`, hairline entre cada una vía `+ ::before`):
  (1) pill de escasez "2 cupos · Q3"; (2) **QUIÉN APLICA** ✓/✕ (`.criteria`); (3) **EL PROCESO** (✓
  respondemos <24h · ✓ leemos a mano); (4) **LA FIRMA** (escasez "Menos de **8** al año" con el 8 en
  serif italic `.ec-firm-num` + "CDMX · Operación global"); (5) **LÍNEA DIRECTA** (correo con flecha).
- Reloj CDMX en vivo y los íconos de redes siguen **eliminados** (redes ya están en el footer). Sin
  elemento humano (firma/foto).
- **Reveal**: la tarjeta entra como **una sola pieza** (`reveal('.ec-sidebar')`), no bloque por bloque.
- **Responsive**: ≤1024px deja de ser sticky y la tarjeta va full-width arriba del form (sigue en columna).

### Formulario por pasos (typeform-style) — CRÍTICO
**Una pregunta a la vez**, no scroll vertical. 5 pasos `.dq-step` dentro de `.dq-stage`; solo el activo
se muestra (`.is-active` = display, `.is-visible` = opacity/translateY). Transición = fade-out → swap →
fade-in vía CSS (no GSAP), `var(--ease-smooth)`. Toda la lógica vive en el `<script is:inline>`
(stepper + chips + submit + reloj); el `<script>` con GSAP solo hace el reveal del hero/trust/sidebar.

- **Progreso** (`.sp-progress`): contador serif "PASO 01/05" + barra `scaleX` — Goal Gradient.
- **Navegación**: `#stepBack` (oculto en paso 0) + `#stepNext` (texto "Continuar" → en el último paso el
  script lo cambia a **"Aplicar a proyecto"**). Enter en inputs text/email/tel avanza; en textarea no.
- **Chips** (`.q-chips[data-field]`): selección setea el `<input hidden id="field-{field}">`; **auto-avanzan**
  (~420ms) salvo en el último paso. Grupo opcional → `data-optional` (no valida, no auto-avanza al ser último).
- **Validación por paso** (`validateStep`): inputs `[required]` + chips no-opcionales. Falla → marca
  `.invalid`/`.chips-invalid` + `#stepError`. Se limpia al editar.
- **Pasos**: 01 Datos (WhatsApp opcional, intl-tel-input) · 02 Operación (DTC / B2B / Ambos / Compleja —
  sin "Otro") · 03 Problema (textarea con placeholder de ejemplo) · 04 Horizonte (Lo antes posible / 1–3
  meses — sin "explorando") · 05 Presupuesto **en MXN, opcional** ($30k–$80k / $80k–$200k / +$200k / no claro).
- **Submit** → Make webhook (ver abajo) → fade-out form → `#diagSuccess`.
- **Success state** (Zeigarnik): eyebrow + H2 bold (sin serif) + regla + sub + **"EN LAS PRÓXIMAS 24H" vs
  "LO QUE NO PASA"** (cierra el ciclo / quita ansiedad post-envío). Animado por JS (array `els` con delays).

### Microinteracciones (estilo Typeform)
- **Entrada escalonada por paso**: cada `.dq-step.is-visible > *` (título → desc → cuerpo) entra con
  fade+subida y `transition-delay` por `nth-child` (no GSAP — CSS puro).
- **Chips con tecla**: el `<script is:inline>` inyecta en cada `.q-chip` un `.chip-key` (1,2,3…), el
  `.chip-text` y un `.chip-check` (✓ que aparece al seleccionar). Teclas **1–9 seleccionan** y **Enter
  avanza** en pasos de chips (listener en `document`, con guard si hay un `<button>` enfocado para no
  duplicar el avance). Pop sutil al seleccionar (`@keyframes chip-pop`).
- **Hint de teclado** `.kbd-hint` ("↵ Enter") en la nav; oculto en ≤768px.
- **Contador con bump** (`.sp-current.bump`) + **shine** que recorre la barra (`.sp-bar.pulse`) al cambiar
  de paso (`updateUI(true)`; en carga `updateUI(false)` sin animar).
- Inputs: `caret-color` navy + label que se oscurece con `:focus-within`.

### Integraciones
- **intl-tel-input v23** (CDN): input `#whatsapp`, `initialCountry:auto` (geoIp → fallback `mx`),
  `separateDialCode`. Al enviar: `itiInstance.getNumber()`.
  - ⚠️ **Sus estilos (`.iti*`) DEBEN ir en `<style is:global>`**, no en el `<style>` scoped: el DOM lo
    inyecta la librería en runtime y NO trae el atributo `data-astro-cid`, así que los selectores scoped
    (`.iti…[data-astro-cid]`) nunca aplican. El prefijo (`+52`) se iguala a los dígitos tecleados con
    `font-family/size/weight/color` idénticos al `.diag-form input` (Inter 1.1rem / 500 / #0a0e1a).
- **Make webhook (contacto)**: `POST https://hook.us2.make.com/ov4rrddtdx739hnl7dp2mks216171q8m`
  (DISTINTO del de soporte). Payload: `{nombre, email, whatsapp, tipo_negocio, problema, urgencia,
  presupuesto, timestamp, fuente:'flouvia.com/contacto'}`. Fire-and-forget (`.catch` silencioso) — el
  success se muestra aunque falle. ⚠️ Los `data-value` de los chips son la fuente de verdad del payload;
  si cambian (p. ej. `ambos-canales`, `1-3-meses`, `30k-80k-mxn`), **actualizar el escenario de Make**.

### SEO
- `pageTitle`/`pageDesc` localizados (ES/EN) en frontmatter, con keywords e-commerce/B2B + "CDMX" + "firma
  boutique" + "diagnóstico gratuito 30 min".
- **Schema `ContactPage`** (JSON-LD, `<script type="application/ld+json" is:inline set:html={...}>`):
  localizado por idioma, `@id #contactpage`, `mainEntity → {SITE}/#organization`, `breadcrumb` y `inLanguage`.

---

## Página de Casos

> Rediseñada mayo 2026: unificada con la estética/animación del home y reescrita con eje de
> escasez + AI SEO ([[flouvia-brand-voice]], [[flouvia-scarcity-placeholders]]). Animación =
> estándar único del sitio (gate `.js-anim`, helper `reveal()` `power2.out`, `robustRefresh`,
> reduced-motion). **Sin SplitText, sin `expo.out`/`back.out`, sin blur/scale.** Números en
> Instrument Serif italic (se eliminó JetBrains Mono — ni siquiera se cargaba). Títulos 100%
> Inter bold (sin acento serif).

### Listing — `/casos` (`PlantillaCasos.astro`, sirve ES y `/en/casos`)
- **Hero** estándar home: status pill + eyebrow "RESULTADOS DOCUMENTADOS — 2 SISTEMAS ACTIVOS"
  + H1 bold "Lo que construimos. / Lo que midió." + CTA `#case-grid` "Explorar casos ↓".
- **Badge de disponibilidad** (`.avail-badge`) arriba del grid (Loss Aversion en el momento de
  lectura) + **badge "● Sistema activo"** (`.active-badge`) sobre cada imagen.
- **Simplificación (Julio 2026)**: Se eliminó la `slot-card` final ("Tu proyecto aquí"), el banner intermedio de "¿Tu operación tiene un reto similar?" y el CTA del footer personalizado. Todo esto se fusionó con la barra inferior estándar de `<Footer>`.
- **Fondos WebGL**: Tarjetas estelares (como Cord) utilizan `FluidShader` en el fondo.
- Title/description con métricas (El Zarco +25% AOV · Cord +42%); el resto de OG/canonical
  lo genera `Layout.astro`.

### Detalle — `/casos/{slug}` (`PlantillaCaso.astro` — componente compartido)
- **Una sola fuente de verdad.** `pages/casos/[slug].astro` y `pages/en/casos/[slug].astro` son
  wrappers delgados que pasan `caso/next/isEn/root`. **No duplicar markup — editar el componente.**
- Todo el contenido y metadatos viven en `src/data/casos.ts`. Campos relevantes del interface:

```ts
// Campos base (todos los casos los necesitan)
tagline:    { es; en }  // "De X a Y" — visible en hero, no describir el proyecto
resultsNote:{ es; en }  // "Resultados medidos a 90 días... Punto de partida: X"
results[].desc          // Incluir antes/después con número y mecanismo de mejora

// Campos SEO/schema (opcionales pero recomendados para AI-citeability)
seoTitle:       { es; en }   // title con métricas: "Marca: Sistema — +X%, −Y% | Flouvia"
seoDesc:        { es; en }   // description: "Caso de estudio: …resultado en N días: X, Y, Z"
about:          { name, description, url }  // entidad cliente para schema Article
datePublished:  string       // ISO date
dateModified:   string       // ISO date — actualizar al tocar el caso

// CTA de cierre conectado al reto del caso (fórmula "¿Tienes X?")
cta: {
  eyebrow: { es; en }  // "¿TIENES UN RETO SIMILAR?"
  title:   { es; en }  // "Construimos lo mismo para tu operación."
  sub:     { es; en }  // párrafo de sub-texto + propuesta
}
```

- **Schema JSON-LD** (`Article` + `BreadcrumbList`) construido en el componente desde `caso`;
  `mentions` se genera automáticamente desde `caso.stack`. `Layout` recibe `ogType="article"`.

---

## Página Nosotros (`PlantillaNosotros.astro`)

> Sirve `/nosotros` y `/en/nosotros` (`prerender:true`). Rediseñada mayo 2026 bajo el
> eje de AI SEO y señales de entidad. Es la página que Google AI Overviews extrae para
> queries "quién es Flouvia" y "agencias boutique de ingeniería e-commerce en México".

### Estructura (7 secciones)
```
Hero (white, 100svh)      — mismo estándar index: status pill + eyebrow + H1 bold sans
                            + hero-bottom (desc + btn). Gate .js-anim + GSAP timeline.
Entidad (white)           — Párrafo visible AI-extractable. Texto completo en el DOM.
                            No solo en meta/schema — Google AI Overviews prefiere párrafos
                            de texto visible en la primera mitad de la página.
Manifiesto (white)        — Grid 2 col: imagen (parallax leve) + texto sticky. Subtítulo
                            grande + 2 párrafos con consecuencia para el cliente.
ADN / Principios (white)  — 3 tarjetas monolith: 01 Transparencia · 02 Código de Autor ·
                            03 ROI. Watermark editorial /01/02/03 dentro de la tarjeta.
Resultados (white)        — 4 métricas ESTÁTICAS con fuente visible. NO hay contadores JS.
                            Valores: +42% CR (Cord), −67% tiempo (El Zarco), +25% AOV
                            (El Zarco), <8 proyectos/año. Fuente citable por AI.
¿Por qué Flouvia? (navy)  — Bandita slim (padding ~1.5rem). Título compacto izquierda +
                            divisor + texto filtro-cliente + botón derecha. Una sola fila.
Testimonios (white)       — Carrusel horizontal. Cada tarjeta: métrica ancla (serif italic)
                            + quote + autor con .t-role + .t-context (empresa, industria,
                            ciudad). Avatares en navy sólido con inicial.
CTA final (navy)          — Escasez: "2 proyectos disponibles este trimestre" + badge
                            "● ACEPTANDO PROYECTOS Q3 · 2 cupos". CTA "Solicitar diagnóstico".
```

### Schema JSON-LD
`AboutPage` + `Organization` inline en el `<head>` vía `set:html`:
- `foundingDate: '2024'`, `foundingLocation: 'Ciudad de México'`
- `areaServed: ['México', 'Estados Unidos']`
- `mentions`: El Zarco (distribuidora mayorista B2B) + Cord (SaaS B2B)
- `breadcrumb` localizado por idioma
Actualizar `mentions` si se agregan nuevos casos de estudio.

### Animaciones — igual que Inicio.astro
- Hero: gate `.js-anim .hero-anim{opacity:0}` + GSAP timeline `power2.out` en carga.
- Reveals on-scroll: `gsap.set` oculta + `ScrollTrigger {once:true, onEnter: gsap.to}`.
  NO `gsap.from` con `immediateRender:false` (causa parpadeo al primer scroll).
- `revealEach` por elemento para `.section-heading`, `.eyebrow`, textos del manifiesto.
- Stagger grupal para `.monolith-card` y `.thin-card`.
- Sin SplitText, sin contadores JS, sin blur, sin scale en reveals.

### i18n — claves nuevas relevantes
- `about.entity` — párrafo de definición de entidad (visible en DOM)
- `about.m{1-4}.pre/num/sym/src` — métricas estáticas con fuente
- `about.rev{1-2}.context` — contexto de empresa AI-citable en testimonios
- `about.rev{1-2}.metric` — métrica ancla visible arriba del quote
- `about.liquid.cta` — CTA del banner "¿Por qué Flouvia?"
- `about.cta.avail/body` — badge de disponibilidad + cuerpo del CTA final

### Tipografía
- H1/H2 100% Inter bold (sin palabra-acento serif — igual que Inicio/Contacto post-mayo 2026).
- Serif italic solo en: números de métricas (`.thin-num.editorial`), watermarks de tarjeta
  (`.m-watermark`), métrica ancla de testimonios (`.t-metric`).
- JetBrains Mono eliminado de esta página.

### Scarcity placeholders (actualizar por trimestre)
- `about.hero.status` — "ACEPTANDO PROYECTOS Q3"
- `about.cta.badge` — "EL SIGUIENTE NIVEL — Q3"
- `about.cta.avail` — "ACEPTANDO PROYECTOS Q3 · 2 cupos disponibles"
- `about.cta.title` — "2 proyectos disponibles este trimestre."

---

## Páginas legales (`privacidad.astro`, `terminos.astro`, `en/privacy.astro`, `en/terms.astro`)

> Actualizadas junio 2026: unificadas con el estándar visual/animación del resto del sitio.

### Hero estándar (igual que el home)
- **Status pill** ("DOCUMENTO VIGENTE" / "ACTIVE DOCUMENT") con dot verde pulsante — mismas clases y CSS que `.hero-status` del home.
- H1 **100% Inter bold**, sin acento serif italic (eliminar `<span class="editorial">` en ediciones futuras).
- **Números de sección (`.section-num`):** `Instrument Serif italic` — **no** JetBrains Mono.
- **Gate anti-FOUC:** `.js-anim .hero-anim { opacity: 0 }` en `<style is:global>` + timeline GSAP `power2.out` en carga. Reduced-motion → todo visible, `gsap.set` fuerza opacity:1 en index/content.
- **Animación estándar:** `power2.out`, `duration 0.9–1.0`, `y: 14`, stagger por elemento (status → eyebrow → title → meta).
- **ScrollTrigger reveal:** `once: true`, `power2.out` para `.legal-index` y `.legal-content`. Eliminado `expo.out`.

### Estructura del contenido
- Índice lateral sticky (`.legal-index`) + artículo principal (`.legal-content`).
- Active link en el índice: `ScrollTrigger` por sección, `start/end: 'top/bottom 40%'`.
- Responsive: `grid-template-columns: 220px 1fr` → 1 col en ≤1024px; índice horizontal en ≤768px.

### Aviso de privacidad — sección Shopify Partner (junio 2026)
`/privacidad` y `/en/privacy` tienen **9 secciones** (una más que términos):

| # | Sección |
|---|---------|
| 01 | Identidad del Responsable / Data Controller |
| 02 | Datos Personales Recabados / Personal Data Collected |
| 03 | Finalidades del Tratamiento / Purposes of Processing |
| 04 | Transferencias de Datos / Data Transfers — incluye **Shopify Inc.** |
| 05 | **Shopify Partner, Aplicaciones y Datos de Tiendas** ← nueva |
| 06 | Derechos ARCO / Your Rights |
| 07 | Uso de Cookies / Cookies |
| 08 | Cambios al Aviso / Changes |
| 09 | Contacto / Contact |

**Sección 05 — puntos clave de protección legal:**
- Flouvia actúa como **encargado (data processor)**, no controller, sobre datos de tienda y clientes finales del comercio.
- Cumplimiento: Shopify Partner Program Agreement + Shopify API Terms + Protected Customer Data Policy.
- Minimización de datos, no venta/no uso propio/no entrenamiento de IA.
- Borrado tras desinstalación de la app; notificación de incidentes sin demora.
- Mención a GDPR/CCPA para clientes finales fuera de México.
- Cláusula de limitación de responsabilidad: Flouvia responde solo dentro del marco del servicio e instrucciones del Cliente.

**Términos de servicio:** mantienen 9 secciones sin cambios de numeración.

**Fecha de última actualización:** 8 de junio de 2026 / June 8, 2026.

---

## Página de Apps (`PlantillaApps.astro` + `PlantillaApp.astro`)

> Añadida junio 2026. Estética idéntica a Casos: hero estándar, grid, slot "próximamente",
> CTA dark navy. Fuente única de verdad en `src/data/apps.ts`. Flouvia es Shopify Partner.

### Modelo de datos (`ShopifyApp` — `apps.ts`)

Campos clave:

```ts
status: 'live' | 'soon'  // 'live' → genera /apps/{slug}; 'soon' → solo slot en listing
appStoreUrl: string       // link al App Store con ?utm_source=flouvia&utm_campaign=apps
icon:   string            // /imgs/... — ícono cuadrado de la app
image:  string            // /imgs/... — screenshot/hero del detalle
pricingTag: { es; en }   // badge corto: "Gratis", "Free to install", "Desde $9.99"
relatedCase?: { slug; label }  // conecta con caso real → prueba social
faq?:   Array<{ q; a }>  // genera schema FAQPage (AI-citable)
rating?:{ value; count } // descomenta cuando tengas reseñas → schema aggregateRating
```

Helpers exportados: `liveApps` / `soonApps`.

### Listing — `/apps` (`PlantillaApps.astro`, sirve ES y `/en/apps`)

- **Hero** estándar home: status pill "SHOPIFY PARTNER" + eyebrow "PRODUCTOS — APPS DE SHOPIFY" + H1 bold.
- **Grid 2 col** de apps `live` (`app-card`) + slots `soon` (borde punteado ámbar, sin link).
- **Badge "En el App Store"** sobre el ícono de cada app live (mismo patrón que "Sistema activo" en Casos).
- **CTA intermedio** "¿Necesitas algo a medida?" → `/contacto`.
- SEO: `pageTitle` con keywords "Shopify, E-commerce, B2B, CDMX"; schema `CollectionPage` con `inLanguage`, `breadcrumb`, `publisher` completo.

### Detalle — `/apps/{slug}` (`PlantillaApp.astro` — componente compartido)

- **Hero split:** columna izquierda (eyebrow + nombre grande + tagline serif italic + desc + botón **Instalar desde Shopify**) + sidebar derecha (info-card: precio, categoría, requisitos, rating).
- **Botón Instalar** → `app.appStoreUrl` (deeplink al App Store con UTM). `target="_blank"`.
- **Métricas opcionales** (mismo serif italic que Casos).
- **Screenshot** (`app.image`) en sección gris con sombra profunda.
- **Problema** (texto editorial serif italic) + **Features** numeradas con `/01 /02 /03` en serif.
- **Conexión al caso** (`relatedCase`) — chip navy con link → prueba social.
- **FAQ** (si `app.faq`): genera schema `FAQPage` además del `SoftwareApplication`.
- **CTA final** dark navy — botón "Instalar desde Shopify →".
- SEO: schema `SoftwareApplication` con `applicationSubCategory`, `inLanguage`, `offers.description`, `publisher` completo, `FAQPage` condicional.

### Navegación — Footer

"Apps" añadido en la columna `/01 TRABAJO` del `Footer.astro` (Servicios · Casos · **Apps** · Blog).
**No está en la navbar pública** (decisión de marca: navbar mínima).

### Para añadir una nueva app

1. Añadir objeto en `src/data/apps.ts` con `status: 'live'`.
2. Subir ícono (cuadrado, ~512px) y screenshot a `public/imgs/`.
3. Apuntar `icon:` e `image:` a esos archivos.
4. Cuando haya reseñas, descomentar `rating: { value, count }`.
5. Build automáticamente genera `/apps/{slug}` y `/en/apps/{slug}`.

---

## Página de Servicios (`PlantillaServicios.astro`)

> Rediseñada julio 2026: eliminación total de tipografías Serif y Watermarks para alinearla al minimalismo "pro" del resto de la plataforma. La sección "¿Por qué Flouvia?" fue convertida en un Acordeón Horizontal Dinámico (inspiración Stripe/Apple).

### Estructura
```
Hero (white, 100svh)      — Sin watermark de fondo. Títulos 100% sans. Status pill.
Servicios (white)         — Grid de servicios principales.
                            Las métricas pequeñas (.svc-proof) debajo de cada servicio han sido ELIMINADAS (Julio 2026).
¿Por qué Flouvia? (white) — Acordeón Horizontal Interactivo (Desktop) / Vertical (Móvil).
                            6 puntos de valor integrados (Cero Deuda Técnica, Metodología Predictiva, Integraciones a Medida, etc.).
CTA final (navy)          — Integrado de manera limpia con el footer.
```

### Acordeón Horizontal "Super Pro" (`.wf-accordion`)
- **Funcionamiento**: Reemplazó a las tarjetas estáticas anteriores. Al hacer clic en un panel cerrado (que solo muestra su número 01..06), este se expande revelando el título y la descripción, mientras que el anterior se contrae fluidamente usando un `cubic-bezier` muy suavizado.
- **Microinteracciones**: Efectos de `filter: brightness(1.25)` sutiles en hover sobre los paneles inactivos.
- **Paleta de Color**: Utiliza variaciones (shades) del azul principal (`--color-blue-deep`) para crear un efecto de degradado elegante a lo largo de los paneles cerrados del acordeón (`--bg-shade`).

---

## Deployment

- **Plataforma:** Vercel
- **Modo:** SSR (server-side rendering) — `output: 'server'`
- **Páginas estáticas (`prerender:true`):** `index.astro`, `casos.astro`, `casos/[slug].astro`,
  `en/casos/[slug].astro`, `contacto.astro`, `nosotros.astro`, `servicios.astro`,
  `privacidad.astro`, `terminos.astro`, `en/privacy.astro`, `en/terms.astro`,
  `apps.astro`, `apps/[slug].astro`, `en/apps.astro`, `en/apps/[slug].astro`,
  `blog/index.astro`, `blog/[slug].astro` y mirrors `/en/*`.
- Todas las API routes necesitan `export const prerender = false` al inicio del archivo
