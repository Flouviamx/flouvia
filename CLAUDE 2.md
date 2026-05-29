# Flouvia Web — CLAUDE.md

## Comandos esenciales

```bash
npm run dev      # servidor local (localhost:4321)
npm run build    # build de producción
npm run preview  # preview del build local
```

Node requerido: **>=22.12.0** (ver `.nvmrc`)

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Astro 6 (`output: 'server'`) |
| Adapter | `@astrojs/vercel` — deploy en Vercel |
| Auth | Clerk (`@clerk/astro`) |
| DB / Storage | Supabase (PostgreSQL + Storage bucket `boveda`) |
| Animaciones | GSAP 3 + ScrollTrigger + SplitText |
| Tipografía | Instrument Serif (serif/editorial) + Inter (sans) |

---

## Estructura de páginas

```
src/pages/
  index.astro              → / (home, prerender:true)
  servicios.astro          → /servicios
  casos.astro              → /casos
  contacto.astro           → /contacto
  nosotros.astro           → /nosotros

  # Portal de cliente (rutas protegidas por Clerk)
  dashboard.astro          → /dashboard
  facturacion.astro        → /facturacion
  boveda.astro             → /boveda
  boveda-upload.astro      → /boveda-upload
  roadmap.astro            → /roadmap
  soporte.astro            → /soporte
  calendario.astro         → /calendario
  entorno.astro            → /entorno
  privacidad-portal.astro  → /privacidad-portal

  # API routes
  pages/api/boveda/upload.ts      → POST /api/boveda/upload
  pages/api/client/deploys.ts     → GET  /api/client/deploys
  pages/api/soporte/ticket.ts     → POST /api/soporte/ticket
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
2. **Middleware** (`src/middleware.ts`) verifica que el email del user esté en `clerkClient.invitations.getInvitationList({ status: 'accepted', query: email })`. Si no, redirect a `/portal/acceso-restringido?signout=1`.

**Optimización:** Tras la primera verificación exitosa, el middleware setea `user.publicMetadata.flouvia_invited = true` y futuras requests usan ese flag (fast path) sin volver a llamar al API de invitations.

**Sign-out automático:** La página `acceso-restringido` detecta el query `?signout=1` y ejecuta `window.Clerk.signOut()` para limpiar la sesión zombie.

**Rutas protegidas:** Todas las rutas root-level (`/dashboard`, `/facturacion`, `/boveda`, `/soporte`, `/roadmap`, `/calendario`, `/entorno`, `/boveda-upload`, `/privacidad-portal`) + sus mirrors `/en/*`.

**Flow de redirects:**
- No autenticado en ruta protegida → `/login` (o `/en/login`)
- Autenticado pero sin invitación → `/portal/acceso-restringido?signout=1` → auto-logout

**Rutas SSO callback (Clerk routing="path"):** Como `<SignIn>` usa `routing="path"`, deben existir páginas en `/login/sso-callback` y `/en/login/sso-callback` que rendericen el mismo componente. Sin ellas → 404 al completar OAuth.

**API routes:**
- `const { userId } = await locals.auth()`
- Email: `const user = await locals.currentUser(); user.emailAddresses[0].emailAddress`

**Cliente principal:** El `email_cliente` (email de Clerk en lowercase) es la PK que relaciona todos los datos del portal en Supabase.

---

## Base de datos — Supabase

**Cliente:** `src/lib/supabase.ts`
- Usa `SUPABASE_SERVICE_ROLE_KEY` (server-side únicamente, bypassa RLS)
- Fallback a `SUPABASE_ANON_KEY` en dev local

**Tablas:**

| Tabla | Descripción |
|-------|-------------|
| `perfiles` | Un registro por cliente. PK: `email_cliente` |
| `proyectos` | Proyectos activos del cliente. Incluye `vercel_project_id` |
| `finanzas_config` | Config de facturación (1 por cliente) |
| `facturas` | Historial de facturas |
| `boveda_archivos` | Metadata de archivos en Storage |
| `roadmap` | Hitos del proyecto |
| `tickets` | Tickets de soporte del portal (ver SQL abajo) |
| `notificaciones` | Notificaciones para el cliente (ver SQL abajo) |

**SQL — tabla tickets:**
```sql
create table tickets (
  id          uuid        default gen_random_uuid() primary key,
  email_cliente text      not null,
  ticket_ref  text        not null,
  title       text        not null,
  category    text        not null default 'general',
  descripcion text,
  priority    text        not null default 'normal',
  status      text        not null default 'open',
  created_at  timestamptz default now()
);
create index on tickets(email_cliente, created_at desc);
```

**SQL — tabla notificaciones:**
```sql
create table notificaciones (
  id          uuid        default gen_random_uuid() primary key,
  email_cliente text      not null,
  tipo        text        not null,  -- 'deploy'|'milestone'|'invoice'|'announcement'|'alert'
  titulo      text        not null,
  mensaje     text,
  leida       boolean     default false,
  created_at  timestamptz default now()
);
create index on notificaciones(email_cliente, leida, created_at desc);
```

**Patrón RLS:** Todas las tablas usan `email_cliente = current_setting('app.email_cliente', TRUE)`. El backend setea este valor antes de cada query.

**Storage:** Bucket `boveda` — los archivos se guardan en `{email}/{timestamp}_{filename}`. Se sirven con signed URLs generadas en tiempo de lectura (no URLs públicas).

**Schema completo:** `supabase/schema.sql`

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
- **Webhook URL:** `https://hook.us2.make.com/yxof110p9eswdp0eayr7qihrqx6778dd`
- **Trigger:** formulario de soporte enviado
- **Flow:** form → `POST /api/soporte/ticket` → Supabase + Make en paralelo
- **Make puede escribir a Supabase** para actualizar status de tickets o publicar notificaciones

### Stripe
- **Integración:** solo Customer Portal (URL en `finanzas_config.stripe_portal_url`)
- **Card data:** `card_brand`, `card_last4`, `card_exp` en `finanzas_config`
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

**GSAP de entrada:** back-arrow (blur + x), badge (blur + x), título (y), subtítulo (y) — DOMContentLoaded, no ScrollTrigger.

### Componentes del portal

| Archivo | Página | Notas clave |
|---------|--------|-------------|
| `DashboardUI.astro` | /dashboard | Bento grid. Fetch paralelo: proyecto, finanzas, roadmap, archivos, tickets, notificaciones, deploys Vercel. Health score computado server-side. Activity feed cross-portal. |
| `EntornoUI.astro` | /entorno | Vercel deploys reales + PSI vitals reales + activity log derivado de deploys. Refresh button en `topbar-right`. |
| `BovedaUI.astro` | /boveda | Signed URLs (1h expiry). Upload button en `title-right`. |
| `BovedaUploadUI.astro` | /boveda-upload | `backHref` va a `/boveda`, no `/dashboard`. |
| `FacturacionUI.astro` | /facturacion | Money counter GSAP. Stripe Portal link. |
| `RoadmapUI.astro` | /roadmap | Sprint count badge en `title-right`. |
| `SoporteUI.astro` | /soporte | Tickets leídos de Supabase (tabla `tickets`). Form → `/api/soporte/ticket`. Date strip en `topbar-left`. |
| `CalendarioUI.astro` | /calendario | Calendly embed. PortalHeader sin `title` (solo topbar). |
| `PrivacidadPortalUI.astro` | /privacidad-portal | Política de datos del portal. Auth-protected. Link desde PortalFooter. |

---

## API Routes del portal

### `POST /api/soporte/ticket`
Guarda ticket en Supabase y reenvía a Make.
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
Upload de archivos al bucket `boveda` de Supabase Storage.
- Rate limit: 10 subidas/minuto por usuario (in-memory)

---

## Variables de entorno (.env)

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=    # SSR only — nunca al browser
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
- **Tickets** (Supabase `tickets`) — dot azul/verde/ámbar según status
- **Uploads** (Supabase `boveda_archivos`) — dot púrpura

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

## Animaciones — GSAP

**Regla crítica — siempre usar `immediateRender: false` en animaciones con ScrollTrigger:**
```ts
const ir = { immediateRender: false } as const;

gsap.from('.elemento', {
  ...ir,          // ← siempre spread esto
  y: 40, opacity: 0, duration: 1.2, ease: 'expo.out',
  scrollTrigger: { trigger: '.section', start: 'top 80%', once: true },
});
```
Sin `immediateRender: false`, GSAP aplica el estado `from` (opacity:0) inmediatamente y si ScrollTrigger no dispara, el elemento queda invisible para siempre.

**Reglas de animación del proyecto:**
- Easing: siempre `expo.out` o `power3.out` — nunca `back.out` (se siente juguetón, no premium)
- Duraciones: 1.0–1.5s desktop, 0.9–1.2s mobile
- Stagger: 0.08–0.15s — ritmo deliberado
- NO usar `clipPath` para reveals (causa artefactos de 1px en algunos browsers)
- NO usar 3D (`rotateX`/`rotateY`) en elementos dentro de contenedores `overflow-x: auto`
- Siempre `once: true` en ScrollTrigger para que no re-anime al hacer scroll back
- `window.addEventListener('load', () => setTimeout(() => ScrollTrigger.refresh(), 120))` — recalcular posiciones después de que cargan fuentes e imágenes

**Pattern portal — entrance timeline (sin ScrollTrigger):**
```ts
// Patrón estándar de todas las páginas del portal
document.addEventListener('DOMContentLoaded', () => {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  // PortalHeader se anima solo (tiene su propio script)
  // Cards: set initial state → animate
  gsap.set('.os-card', { y: 32, opacity: 0, scale: 0.985 });
  tl.to('.os-card', { y: 0, opacity: 1, scale: 1, duration: 1.0, stagger: 0.07 }, 0.5);
});
```

**Section headings — SplitText line-mask (Apple-style):**
```ts
const split = SplitText.create(heading, { type: 'lines,words', linesClass: 'lx-line-mask' });
gsap.set(split.words, { yPercent: 115 });
gsap.to(split.words, { ...ir, yPercent: 0, duration: 1.4, ease: 'expo.out', stagger: { amount: 0.45 } });
```

**Regla crítica — `clearProps` después de animaciones de entrada:**
Cuando GSAP anima un elemento de `opacity:0 → 1` (o cualquier propiedad CSS que luego controla una clase), el inline style que deja GSAP tiene más especificidad que las reglas de clase. Esto rompe estados CSS como `.scrolled`, `.is-active`, etc.
```ts
tl.to(element, {
  opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.1,
  onComplete: () => gsap.set(element, { clearProps: 'opacity,transform,filter' }),
}, 0.45);
```

**Ken Burns — NO usar `yPercent` con scrub:**
Solo usar `scale` para Ken Burns, sin desplazamiento vertical scrubbed.

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
--font-serif: 'Instrument Serif'
--ease-ios: cubic-bezier(0.25, 1, 0.5, 1)
--ease-spring: cubic-bezier(0.22, 1, 0.36, 1)   /* sin overshoot — suavizado (antes 1.05) */
--ease-smooth: cubic-bezier(0.16, 1, 0.3, 1)
```

**Sección oscura (Casos):** `background: radial-gradient(ellipse at 20% 50%, #112240 0%, #0a192f 65%, #050b14 100%)`

---

## Estética — reglas del proyecto

**Filosofía:** minimalista, caro, lujoso. Referencias visuales: Apple, Stripe, Bottega Veneta, Aesop.

**Tipografía editorial:**
- Cualquier número o "tier" debe ir en **`Instrument Serif italic`** — nunca números en sans bold.
  - Ej: `<span class="editorial">.js</span>`, `<span class="tool-tier"> Plus</span>`, `/01` en serif italic
- Headings tienen una palabra-acento en serif italic (`<span class="editorial">`) que rompe el bold sans
- Eyebrows: `0.65rem`, weight 800, letter-spacing 3px, uppercase, color `#888`

**Watermarks de fondo:**
- Cada sección importante tiene un watermark de su nombre en serif italic, tamaño `20-22vw`, color `rgba(0,0,0,0.025)` (light) o `rgba(255,255,255,0.035)` (dark)
- Posicionado bottom-right o left con parallax suave en scroll

**Cards / containers:**
- NO usar `border` blanco en fondo oscuro (causa "líneas grises" perceptibles). Usar `box-shadow` profundo en su lugar.
- Border-radius: 24px (squircle) para cards normales, 28-32px para containers grandes
- Shadows luxe: `0 24px 60px rgba(0,0,0,0.35)` para cards en dark, `0 30px 80px -30px rgba(10,25,47,0.08)` para containers en light

**Easings — qué usar/no usar:**
- ✅ `expo.out`, `power3.out`, `power3.inOut` — premium
- ❌ `back.out` (rebotes) — se siente juguetón, no luxury
- ❌ Spring/elastic — too bouncy

**Hover states luxury:**
- Translate sutil (4-8px), nunca scale dramático (max 1.06)
- Cambios de color graduales (0.4-0.55s)
- El mouse glow tracker `--mouse-x/y` para revelar áreas

---

## Mapa de secciones del index

```
Hero (white)        — clamp(3.2rem, 7vw, 6.8rem) title, SplitText word reveal on load
Tech (white)        — Editorial grid 4-col, cards 280px alto, hover dark navy
Casos (dark navy)   — Carrusel horizontal scroll-snap, Ken Burns en imágenes
Servicios (white)   — Lista vertical de 4 rows, números editorial serif italic 2.6rem
Protocolo (gray)    — Sticky 2-col + timeline track con gradient + step counter
CTA (gray + dark)   — Card oscura con mouse-tracking glow
Footer (dark navy)  — Watermark "Flouvia" 26vw, statement editorial, edition tag
```

**Pattern de "active step" (Protocolo y similar):**
- ScrollTrigger sin scrub con `start: 'top 55%'` y `end: 'bottom 45%'` para detectar qué paso es el más visible
- Toggle clase `.is-active` con `onEnter`/`onEnterBack`/`onLeave`/`onLeaveBack`
- Contador "01 / 04" en sticky col se actualiza con animación `fromTo` (y: -10 → 0, opacity: 0 → 1)
- Barra de progreso (1px de alto) con scrub para llenarse conforme avanza el scroll

**Footer pattern:**
- Watermark `Flouvia` en serif italic, `26vw` (light dark theme con `rgba(255,255,255,0.025)`)
- Eyebrow + edición ("2026 · Edición") en row superior
- Statement editorial grande (`clamp(1.7rem, 2.2vw, 2.3rem)`) con palabra-accent en serif italic
- Numeración `/01 /02 /03` en serif italic encima de cada nav col
- Hairlines con `linear-gradient(transparent, rgba(255,255,255,0.18) 20%, ..., transparent)` — bordes desvanecen
- Master timeline con `defaults: { ease: 'expo.out' }`, todas las animaciones en cascada con tiempos absolutos

---

## Navbar — patterns

**Logo transition (desktop):**
- Logo grande en centro desaparece al scroll con clase `.scrolled` vía CSS: `opacity: 0; transform: translateY(-12px) scale(0.94); pointer-events: none`
- Logo pequeño dentro de la píldora aparece: `.pill-logo { max-width: 0; opacity: 0 }` → `.scrolled .pill-logo { max-width: 150px; opacity: 1 }`
- La transición es 100% CSS (no GSAP) — GSAP solo maneja la animación de entrada. Crítico: limpiar inline styles con `clearProps` al terminar entrada o el CSS de `.scrolled` no puede sobreescribir.

**Animación de entrada cinemática (multi-capa):**
```ts
// Pill crece desde scaleX:0.5 con blur
gsap.set(pill, { opacity:0, scaleX:0.5, scaleY:0.85, y:-16, filter:'blur(8px)', transformOrigin:'center center' });
tl.to(pill, { opacity:1, scaleX:1, scaleY:1, y:0, filter:'blur(0px)', duration:1.2,
  onComplete: () => gsap.set(pill, { clearProps:'opacity,transform,filter' }) }, 0.2);
// Logo cae desde arriba con scale + blur (Apple-style)
gsap.set(mainLogo, { opacity:0, y:-22, scale:1.18, filter:'blur(14px)' });
tl.to(mainLogo, { opacity:1, y:0, scale:1, filter:'blur(0px)', duration:1.1,
  onComplete: () => gsap.set(mainLogo, { clearProps:'opacity,transform,filter' }) }, 0.45);
// Links del pill: stagger desde abajo
tl.to(navLinks, { opacity:1, y:0, filter:'blur(0px)', duration:0.8, stagger:0.055,
  onComplete: () => gsap.set(navLinks, { clearProps:'opacity,transform,filter' }) }, 0.65);
```

**Active link:** Filled pill via `::before` pseudo-element con `background: rgba(0,0,0,0.08)` (light) / `rgba(255,255,255,0.14)` (dark). No usar dot/underline.

**Magnetic hover en btn-contact:**
```ts
contactBtn.addEventListener('mousemove', (e) => {
  const r = contactBtn.getBoundingClientRect();
  const dx = (e.clientX - r.left - r.width/2) * 0.25;
  const dy = (e.clientY - r.top - r.height/2) * 0.25;
  gsap.to(contactBtn, { x:dx, y:dy, duration:0.45, ease:'power3.out' });
});
contactBtn.addEventListener('mouseleave', () => {
  gsap.to(contactBtn, { x:0, y:0, duration:0.6, ease:'elastic.out(1, 0.5)' });
});
```

---

## Bugs conocidos y sus fixes

| Bug | Causa raíz | Fix |
|-----|-----------|-----|
| Elemento invisible en primera carga | `gsap.set(opacity:0)` + ScrollTrigger que no dispara | Usar `gsap.from(..., { immediateRender:false })` — elementos visibles en CSS hasta que el tween arranca |
| Logo/elemento no responde a clase `.scrolled` | GSAP deja inline style `opacity:1` al terminar entrada | `onComplete: () => gsap.set(el, { clearProps:'opacity,transform,filter' })` |
| `position: sticky` no funciona en sección | `overflow: hidden` en el contenedor padre crea scroll container | Cambiar a `overflow: clip` — recorta visualmente sin crear scroll container |
| Línea gris en borde inferior de carrusel | `yPercent: -8` con scrub mueve imagen hacia arriba revelando fondo | Eliminar scrub de yPercent, solo usar scale para Ken Burns |
| Footer invisible hasta refresh | `gsap.set(opacity:0)` + posiciones calculadas antes de que carguen fuentes | Convertir a `gsap.from()` con `immediateRender:false` + solo un listener `DOMContentLoaded` |
| Sección entera (ej. protocolo) se encima al cargar, se arregla con refresh | Patrón `gsap.set(opacity:0) + gsap.to(opacity:1)` + ScrollTrigger calcula posiciones antes de fuentes/imgs | (a) Convertir a `gsap.from(..., { immediateRender:false })` para que el CSS quede visible si no dispara. (b) `ScrollTrigger.refresh()` después de `Promise.all([fonts.ready, window.load])` |
| Hover/`is-active` no aplica `transform` después de la animación de entrada | GSAP deja inline `transform: matrix(...)` que tiene mayor especificidad que las pseudo-clases CSS | `onComplete: () => gsap.set(targets, { clearProps: 'opacity,transform' })` en el timeline |
| `Clerk.signOut()` redirige al login en vez de quedarse en la página | Sin callback, el SDK navega a `signInUrl` automáticamente | Pasar callback como primer argumento: `Clerk.signOut(() => { /* limpiar */ })`. El callback inhibe la navegación default. |
| `.throwOnError().catch()` falla en TypeScript | `throwOnError()` devuelve `PromiseLike`, no `Promise` — no tiene `.catch()` | Usar la query normal (sin `throwOnError`) — ya devuelve `{ data, error }` y `data` es null si hay error |

---

## Componentes clave

| Archivo | Descripción |
|---------|-------------|
| `src/components/Inicio.astro` | Landing page completa — hero, tech, casos, servicios, protocolo, CTA |
| `src/components/Navbar.astro` | Navbar con glassmorphism y dark-mode adaptativo |
| `src/components/WhatsApp.astro` | Botón flotante WhatsApp con dark-section detection |
| `src/components/PlantillaServicios.astro` | Template para páginas de servicio individual |
| `src/components/PlantillaCasos.astro` | Template para casos de estudio |
| `src/layouts/PortalLayout.astro` | Layout del portal de cliente |
| `src/components/portal/PortalHeader.astro` | Header compartido de todas las páginas del portal |
| `src/components/PortalFooter.astro` | Footer del portal — link a `/privacidad-portal` |

---

## Deployment

- **Plataforma:** Vercel
- **Modo:** SSR (server-side rendering) — `output: 'server'`
- **Excepción:** `src/pages/index.astro` tiene `export const prerender = true` (estático)
- Todas las API routes necesitan `export const prerender = false` al inicio del archivo
