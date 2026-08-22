# Servicios

> **Alcance:** estructura y comportamiento de la página de servicios, incluido el acordeón horizontal.
> **Cargar cuando:** se edite `PlantillaServicios.astro`, `/servicios` o `/en/servicios`.
> **Documentos relacionados:** [Sistema visual](../experience/design-system.md) · [Movimiento](../experience/motion.md)

[← Volver al índice de documentación](../README.md)

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
