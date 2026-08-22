# Contacto

> **Alcance:** formulario por pasos, sidebar, validación, integración con Make y SEO de contacto.
> **Cargar cuando:** se trabaje en `PlantillaContacto.astro`, sus estilos, payload o experiencia del formulario.
> **Documentos relacionados:** [Integraciones](../architecture/integrations-and-deployment.md) · [Movimiento](../experience/motion.md)

[← Volver al índice de documentación](../README.md)

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
