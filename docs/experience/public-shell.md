# Home, navegación y componentes públicos

> **Alcance:** composición del home, footer, navbar, componentes principales y soluciones a fallos recurrentes.
> **Cargar cuando:** se trabaje en `Inicio`, `Navbar`, `Footer`, navegación pública o infraestructura visual compartida.
> **Documentos relacionados:** [Sistema visual](./design-system.md) · [Movimiento](./motion.md)

[← Volver al índice de documentación](../README.md)

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
