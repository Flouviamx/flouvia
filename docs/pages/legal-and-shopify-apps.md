# Páginas legales y Apps de Shopify

> **Alcance:** contratos visuales y de contenido legal, privacidad Shopify Partner y catálogo de apps.
> **Cargar cuando:** se cambien privacidad, términos, `src/data/apps.ts`, `/apps` o una ficha de app.
> **Documentos relacionados:** [Stack y rutas](../architecture/stack-and-routing.md) · [Integraciones](../architecture/integrations-and-deployment.md)

[← Volver al índice de documentación](../README.md)

---
## Páginas legales (`privacidad.astro`, `terminos.astro`, `en/privacy.astro`, `en/terms.astro`)

> Actualizadas junio 2026: unificadas con el estándar visual/animación del resto del sitio.

### Hero estándar (igual que el home)
- **Status pill** ("DOCUMENTO VIGENTE" / "ACTIVE DOCUMENT") con dot verde pulsante — mismas clases y CSS que `.hero-status` del home.
- H1 **100% Inter bold**, sin acento serif italic (eliminar `<span class="editorial">` en ediciones futuras).
- **Números de sección (`.section-num`):** `Instrument Serif italic` — **no** JetBrains Mono.
- **Gate anti-FOUC:** `.js-anim .hero-anim { opacity: 0 }` en `<style is:global>` + timeline GSAP `power2.out` en carga. Reduced-motion → todo visible, `gsap.set` fuerza opacity:1 en index/content.
- **Animación estándar:** `power2.out`, `duration 0.9–1.0`, `y: 14`, stagger por elemento (status → eyebrow → title → meta).
- **ScrollTrigger reveal:** `once: true`, `power2.out` para `.legal-index` y `.legal-content`. Eliminado `expo.out`.

### Estructura del contenido
- Índice lateral sticky (`.legal-index`) + artículo principal (`.legal-content`).
- Active link en el índice: `ScrollTrigger` por sección, `start/end: 'top/bottom 40%'`.
- Responsive: `grid-template-columns: 220px 1fr` → 1 col en ≤1024px; índice horizontal en ≤768px.

### Aviso de privacidad — sección Shopify Partner (junio 2026)
`/privacidad` y `/en/privacy` tienen **9 secciones** (una más que términos):

| # | Sección |
|---|---------|
| 01 | Identidad del Responsable / Data Controller |
| 02 | Datos Personales Recabados / Personal Data Collected |
| 03 | Finalidades del Tratamiento / Purposes of Processing |
| 04 | Transferencias de Datos / Data Transfers — incluye **Shopify Inc.** |
| 05 | **Shopify Partner, Aplicaciones y Datos de Tiendas** ← nueva |
| 06 | Derechos ARCO / Your Rights |
| 07 | Uso de Cookies / Cookies |
| 08 | Cambios al Aviso / Changes |
| 09 | Contacto / Contact |

**Sección 05 — puntos clave de protección legal:**
- Flouvia actúa como **encargado (data processor)**, no controller, sobre datos de tienda y clientes finales del comercio.
- Cumplimiento: Shopify Partner Program Agreement + Shopify API Terms + Protected Customer Data Policy.
- Minimización de datos, no venta/no uso propio/no entrenamiento de IA.
- Borrado tras desinstalación de la app; notificación de incidentes sin demora.
- Mención a GDPR/CCPA para clientes finales fuera de México.
- Cláusula de limitación de responsabilidad: Flouvia responde solo dentro del marco del servicio e instrucciones del Cliente.

**Términos de servicio:** mantienen 9 secciones sin cambios de numeración.

**Fecha de última actualización:** 8 de junio de 2026 / June 8, 2026.

---

---

## Página de Apps (`PlantillaApps.astro` + `PlantillaApp.astro`)

> Añadida junio 2026. Estética idéntica a Casos: hero estándar, grid, slot "próximamente",
> CTA dark navy. Fuente única de verdad en `src/data/apps.ts`. Flouvia es Shopify Partner.

### Modelo de datos (`ShopifyApp` — `apps.ts`)

Campos clave:

```ts
status: 'live' | 'soon'  // 'live' → genera /apps/{slug}; 'soon' → solo slot en listing
appStoreUrl: string       // link al App Store con ?utm_source=flouvia&utm_campaign=apps
icon:   string            // /imgs/... — ícono cuadrado de la app
image:  string            // /imgs/... — screenshot/hero del detalle
pricingTag: { es; en }   // badge corto: "Gratis", "Free to install", "Desde $9.99"
relatedCase?: { slug; label }  // conecta con caso real → prueba social
faq?:   Array<{ q; a }>  // genera schema FAQPage (AI-citable)
rating?:{ value; count } // descomenta cuando tengas reseñas → schema aggregateRating
```

Helpers exportados: `liveApps` / `soonApps`.

### Listing — `/apps` (`PlantillaApps.astro`, sirve ES y `/en/apps`)

- **Hero** estándar home: status pill "SHOPIFY PARTNER" + eyebrow "PRODUCTOS — APPS DE SHOPIFY" + H1 bold.
- **Grid 2 col** de apps `live` (`app-card`) + slots `soon` (borde punteado ámbar, sin link).
- **Badge "En el App Store"** sobre el ícono de cada app live (mismo patrón que "Sistema activo" en Casos).
- **CTA intermedio** "¿Necesitas algo a medida?" → `/contacto`.
- SEO: `pageTitle` con keywords "Shopify, E-commerce, B2B, CDMX"; schema `CollectionPage` con `inLanguage`, `breadcrumb`, `publisher` completo.

### Detalle — `/apps/{slug}` (`PlantillaApp.astro` — componente compartido)

- **Hero split:** columna izquierda (eyebrow + nombre grande + tagline serif italic + desc + botón **Instalar desde Shopify**) + sidebar derecha (info-card: precio, categoría, requisitos, rating).
- **Botón Instalar** → `app.appStoreUrl` (deeplink al App Store con UTM). `target="_blank"`.
- **Métricas opcionales** (mismo serif italic que Casos).
- **Screenshot** (`app.image`) en sección gris con sombra profunda.
- **Problema** (texto editorial serif italic) + **Features** numeradas con `/01 /02 /03` en serif.
- **Conexión al caso** (`relatedCase`) — chip navy con link → prueba social.
- **FAQ** (si `app.faq`): genera schema `FAQPage` además del `SoftwareApplication`.
- **CTA final** dark navy — botón "Instalar desde Shopify →".
- SEO: schema `SoftwareApplication` con `applicationSubCategory`, `inLanguage`, `offers.description`, `publisher` completo, `FAQPage` condicional.

### Navegación — Footer

"Apps" añadido en la columna `/01 TRABAJO` del `Footer.astro` (Servicios · Casos · **Apps** · Blog).
**No está en la navbar pública** (decisión de marca: navbar mínima).

### Para añadir una nueva app

1. Añadir objeto en `src/data/apps.ts` con `status: 'live'`.
2. Subir ícono (cuadrado, ~512px) y screenshot a `public/imgs/`.
3. Apuntar `icon:` e `image:` a esos archivos.
4. Cuando haya reseñas, descomentar `rating: { value, count }`.
5. Build automáticamente genera `/apps/{slug}` y `/en/apps/{slug}`.

---
