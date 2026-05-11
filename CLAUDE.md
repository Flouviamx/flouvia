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
  dashboard.astro          → /portal/dashboard
  facturacion.astro        → /portal/facturacion
  boveda.astro             → /portal/boveda
  roadmap.astro            → /portal/roadmap
  soporte.astro            → /portal/soporte
  calendario.astro         → /portal/calendario

  # API routes
  pages/api/boveda/upload.ts   → POST /api/boveda/upload
```

Las rutas `/en/*` son el espejo en inglés (el middleware detecta el prefijo).

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

---

## Auth — Clerk (invitation-only)

**Modelo:** Solo emails con invitación aceptada en Clerk pueden entrar al portal.

**Doble capa de defensa:**
1. **Clerk Dashboard** (configurar manualmente — Restrictions → Sign-ups → "Restricted"). Sin esto, cualquiera puede crear cuenta vía OAuth.
2. **Middleware** (`src/middleware.ts`) verifica que el email del user esté en `clerkClient.invitations.getInvitationList({ status: 'accepted', query: email })`. Si no, redirect a `/portal/acceso-restringido?signout=1`.

**Optimización:** Tras la primera verificación exitosa, el middleware setea `user.publicMetadata.flouvia_invited = true` y futuras requests usan ese flag (fast path) sin volver a llamar al API de invitations.

**Sign-out automático:** La página `acceso-restringido` detecta el query `?signout=1` y ejecuta `window.Clerk.signOut()` para limpiar la sesión zombie.

**Rutas protegidas:** Todas las rutas root-level (`/dashboard`, `/facturacion`, `/boveda`, `/soporte`, `/roadmap`, `/calendario`, `/entorno`, `/boveda-upload`) + sus mirrors `/portal/*` y `/en/*`.

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
| `proyectos` | Proyectos activos del cliente |
| `finanzas_config` | Config de facturación (1 por cliente) |
| `facturas` | Historial de facturas |
| `boveda_archivos` | Metadata de archivos en Storage |
| `roadmap` | Hitos del proyecto |

**Patrón RLS:** Todas las tablas usan `email_cliente = current_setting('app.email_cliente', TRUE)`. El backend setea este valor antes de cada query.

**Storage:** Bucket `boveda` — los archivos se guardan en `{email}/{timestamp}_{filename}`. Se sirven con signed URLs generadas en tiempo de lectura (no URLs públicas).

**Schema completo:** `supabase/schema.sql`

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

## Variables de entorno (.env)

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=    # SSR only — nunca al browser
PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

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

**Pattern para secciones:**
```ts
// Timelines por sección — orquestadas, no simultáneas
const tl = gsap.timeline({
  scrollTrigger: { trigger: '.section', start: 'top 80%', once: true },
});
tl.to(element1, { ...ir, opacity: 1, y: 0, duration: 1.2, ease: 'expo.out' }, 0);
tl.to(element2, { ...ir, opacity: 1, y: 0, duration: 1.1, ease: 'expo.out' }, 0.1);
```

**Section headings — SplitText line-mask (Apple-style):**
```ts
const split = SplitText.create(heading, { type: 'lines,words', linesClass: 'lx-line-mask' });
gsap.set(split.words, { yPercent: 115 });
gsap.to(split.words, { ...ir, yPercent: 0, duration: 1.4, ease: 'expo.out', stagger: { amount: 0.45 } });
```

**Pattern de revelación coreografiada (per-element timeline):**
Para tarjetas/secciones con varios elementos hijos, no animar todos juntos. Crear un timeline por elemento padre y secuenciar los hijos con `'-=0.X'` overlap o tiempos absolutos. Ej: card aparece → categoría desliza → número aparece → logo aterriza → nombre fade.

**Regla crítica — `clearProps` después de animaciones de entrada:**
Cuando GSAP anima un elemento de `opacity:0 → 1` (o cualquier propiedad CSS que luego controla una clase), el inline style que deja GSAP tiene más especificidad que las reglas de clase. Esto rompe estados CSS como `.scrolled`, `.is-active`, etc.
Solución: limpiar los props inline al terminar la animación de entrada:
```ts
tl.to(element, {
  opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.1,
  onComplete: () => gsap.set(element, { clearProps: 'opacity,transform,filter' }),
}, 0.45);
```
Aplicar a **todos** los elementos cuyo estado visual cambia después vía clase CSS (navbar logo, pills, items del right side, etc.).

**Ken Burns — NO usar `yPercent` con scrub:**
`yPercent: -8` con scrub en imágenes de carrusel mueve la imagen hacia arriba conforme scrollea, revelando el fondo del contenedor en el borde inferior. Solo usar `scale` para Ken Burns, sin desplazamiento vertical scrubbed.

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
--ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.05)
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

---

## Deployment

- **Plataforma:** Vercel
- **Modo:** SSR (server-side rendering) — `output: 'server'`
- **Excepción:** `src/pages/index.astro` tiene `export const prerender = true` (estático)
- Todas las API routes necesitan `export const prerender = false` al inicio del archivo
