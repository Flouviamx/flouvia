# Blog

> **Alcance:** modelo editorial, listing, artículos, autor, SEO, schemas y filtros.
> **Cargar cuando:** se edite `src/data/blog.ts`, `/blog`, `/en/blog` o una plantilla de artículo.
> **Documentos relacionados:** [Stack y rutas](../architecture/stack-and-routing.md) · [Movimiento](../experience/motion.md)

[← Volver al índice de documentación](../README.md)

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
