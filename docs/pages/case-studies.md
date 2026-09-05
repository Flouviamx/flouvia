# Casos de estudio

> **Alcance:** listing, detalle compartido, datos, métricas, schema y fuentes de verdad.
> **Cargar cuando:** se editen casos, `src/data/casos.ts` o las rutas `/casos` y `/en/casos`.
> **Documentos relacionados:** [Blog](./blog.md) · [Sistema visual](../experience/design-system.md)

[← Volver al índice de documentación](../README.md)

---
## Página de Casos

> Rediseñada mayo 2026: unificada con la estética/animación del home y reescrita con eje de
> escasez + AI SEO ([[flouvia-brand-voice]], [[flouvia-scarcity-placeholders]]). Animación =
> estándar único del sitio (gate `.js-anim`, helper `reveal()` `power2.out`, `robustRefresh`,
> reduced-motion). **Sin SplitText, sin `expo.out`/`back.out`, sin blur/scale.** Números en
> Instrument Serif italic (se eliminó JetBrains Mono — ni siquiera se cargaba). Títulos 100%
> Inter bold (sin acento serif).

> **Cards del listing son manuales.** `PlantillaCasos.astro` no itera `casos.ts`: cada tarjeta
> (Cord, El Zarco, Ago Fitness, Masuma, shwcs) está escrita a mano con su copy ES/EN. Al añadir un
> caso hay que agregar su objeto en `casos.ts` (genera el detalle `/casos/{slug}`) **y** su tarjeta
> en `PlantillaCasos.astro`. El mismo caso vive además, a mano, en el carrusel del home
> (`Inicio.astro`, `.carousel-track`). El eyebrow "N SISTEMAS ACTIVOS" cuenta solo los casos con
> badge `active-dot` (Cord, El Zarco, shwcs); los de `dev-dot` ("Fase de lanzamiento": Ago Fitness,
> Masuma) no suman.

> **`liveUrl`/`liveDomain` son opcionales** (caso previo a despliegue). Si faltan, `PlantillaCaso.astro`
> oculta el chip de dominio en el breadcrumb y el botón "Visitar sitio", y muestra `.cs-soon-chip`
> ("En fase de lanzamiento"). Al desplegar, se añaden ambos campos y aparecen los enlaces.

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
