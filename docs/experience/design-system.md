# Sistema visual

> **Alcance:** tokens, tipografía, composición, superficies, estados hover y decisiones estéticas vigentes.
> **Cargar cuando:** se cambien estilos, componentes visuales, tipografía, color, cards, CTAs o shaders.
> **Documentos relacionados:** [Movimiento](./motion.md) · [Shell público](./public-shell.md)

[← Volver al índice de documentación](../README.md)

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
