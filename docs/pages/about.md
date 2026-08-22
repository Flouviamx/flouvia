# Nosotros

> **Alcance:** estructura, señales de entidad, métricas, testimonios, schema y placeholders de disponibilidad.
> **Cargar cuando:** se edite `PlantillaNosotros.astro`, `/nosotros`, `/en/nosotros` o el copy de entidad.
> **Documentos relacionados:** [Sistema visual](../experience/design-system.md) · [Movimiento](../experience/motion.md)

[← Volver al índice de documentación](../README.md)

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
