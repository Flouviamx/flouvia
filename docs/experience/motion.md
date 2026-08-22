# Movimiento y WebGL

> **Alcance:** estándar GSAP, ScrollTrigger, anti-FOUC, reduced motion y reglas de shaders.
> **Cargar cuando:** se añadan o modifiquen reveals, animaciones de carga, scroll, transiciones o canvas WebGL.
> **Documentos relacionados:** [Sistema visual](./design-system.md) · [Shell público](./public-shell.md)

[← Volver al índice de documentación](../README.md)

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
