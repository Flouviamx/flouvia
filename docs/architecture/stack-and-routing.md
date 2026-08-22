# Stack, rutas e i18n

> **Alcance:** entorno de ejecución, mapa de páginas, internacionalización y contrato del layout público.
> **Cargar cuando:** se creen rutas, layouts, páginas espejo ES/EN o se cambie la configuración base de Astro.
> **Documentos relacionados:** [Seguridad y datos](./security-and-data.md) · [Integraciones y despliegue](./integrations-and-deployment.md)

[← Volver al índice de documentación](../README.md)

---
## Comandos esenciales

```bash
npm run dev      # servidor local (localhost:4321)
npm run build    # build de producción
npm run preview  # preview del build local
npm run db:schema      # aplica migraciones Neon ordenadas
npm run db:verify-ops  # verifica invariantes y lecturas de Ops (read-only)
```

Node requerido: **>=22.12.0** (ver `.nvmrc`)

---

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Astro 6 (`output: 'server'`) |
| Adapter | `@astrojs/vercel` — deploy en Vercel |
| Auth | UI propia + Clerk headless (`@clerk/astro`) |
| DB / Storage | Neon PostgreSQL + Vercel Blob privado |
| Animaciones | GSAP 3 + ScrollTrigger (SplitText eliminado) |
| Tipografía | Inter (sans) — Instrument Serif ha sido eliminado (Julio 2026) |

---

---

## Estructura de páginas

```
src/pages/
  index.astro              → / (home, prerender:true)
  servicios.astro          → /servicios
  casos.astro              → /casos
  contacto.astro           → /contacto
  nosotros.astro           → /nosotros

  # Producto público — Cord (prerender:true; repo hermano ~/Desktop/flouvia-cord)
  cord.astro               → /cord — landing de venta del SaaS público de Flouvia.
                              Reescrita jul 2026 para reflejar el alcance REAL de
                              Cord (no solo cotizar+CFDI): cobranza autónoma con IA,
                              pagos directos a la cuenta del negocio (Stripe Connect,
                              sin comisión de Cord), multi-divisa con cobertura FX,
                              API/webhooks/MCP, Cord Elements (cotizador embebible),
                              roles de equipo y firma legal SHA-256. Reusa
                              <CordPricing /> (src/components/cord/CordPricing.astro,
                              ya alineado a los 5 planes reales — no tocar sin
                              verificar contra flouvia-cord/docs/negocio-billing.md).
                              Estética 100% Flouvia (hero-grand + fluid-target shader,
                              service-row editorial), NUNCA la estética "Apple gray"
                              propia de cord.flouvia.com. ⚠️ Los enlaces de esta
                              página apuntan a rutas reales de cord.flouvia.com
                              (/producto/*, /desarrolladores/*) — antes de agregar un
                              enlace nuevo, confirmar el slug contra
                              flouvia-cord/src/lib/producto.ts o desarrolladores.ts,
                              no inventarlo.
  en/cord.astro             → /en/cord — espejo en inglés (fuente de verdad separada,
                              se mantiene sincronizado a mano con cord.astro).

  # Componentes de /cord — src/components/cord/ (jul 2026)
  CordPricing.astro         → tarjetas de los 5 planes reales, con aurora CSS viajera.
  CordFaqAccordion.astro    → acordeón de FAQ PORTADO 1:1 desde
                              flouvia-cord/src/components/landing/FaqAccordion.astro
                              (mismo patrón: ícono +/− que rota, grid-template-rows
                              para la altura, uno-a-la-vez). En cord.astro/en/cord.astro
                              el array `FAQS` es la ÚNICA fuente — alimenta tanto el
                              acordeón visible como el `FAQPage` del JSON-LD; nunca
                              hardcodear las preguntas por separado en el schema.
  CapCard.jsx (React)       → tarjeta del grid "capacidades adicionales"; maneja su
                              propio estado de hover/foco y monta <CapAuroraBg active=.../>
                              como fondo — el texto pasa a blanco vía la clase `.is-active`
                              (definida en el <style is:global> de cord.astro/en/cord.astro,
                              NO en el componente).
  CapAuroraBg.jsx (React)   → mismo motor de shader del aurora del Centro de Ayuda de
                              Cord (BlueAuroraBg — teal/cobalt/cyan, grano de película),
                              adaptado para vivir dentro de una tarjeta clara y solo
                              pintar mientras `active` es true (frameloop 'never'→'always',
                              fade 0.55s). El cursor se anima con un resorte
                              masa-amortiguador (Hooke + fricción, no un lerp plano) y su
                              velocidad alimenta el uniform `u_force`, que infla el empuje
                              del aurora y dispara un chispazo cyan — es lo que le da la
                              sensación de "físicas" al pasar el mouse rápido. Montado
                              siempre con `client:visible` (no `client:only`) porque va
                              DENTRO de CapCard, que ya es un island de React.
                              ⚠️ Regla: cualquier shader R3F nuevo dentro de una tarjeta
                              con hover reactivo debe seguir este patrón (frameloop
                              condicionado + spring físico), no CardAuroraBg.jsx de
                              flouvia-cord tal cual (ese es para tarjetas SIEMPRE
                              oscuras, no para un toggle hover en una tarjeta clara).

  # Páginas legales (prerender:true)
  privacidad.astro         → /privacidad
  terminos.astro           → /terminos
  en/privacy.astro         → /en/privacy
  en/terms.astro           → /en/terms

  # Apps de Shopify (prerender:true)
  apps.astro               → /apps (listing de apps)
  apps/[slug].astro        → /apps/{slug} (detalle de app — solo status:'live')

  # Blog (prerender:true)
  blog/index.astro         → /blog (listing)
  blog/[slug].astro        → /blog/{slug} (artículo)

  # Portal de cliente (rutas protegidas por Clerk)
  dashboard.astro          → /dashboard
  colaboracion.astro       → /colaboracion — asuntos, comentarios y notas internas
  facturacion.astro        → /facturacion
  boveda.astro             → /boveda
  boveda-upload.astro      → /boveda-upload
  roadmap.astro            → /roadmap
  soporte.astro            → /soporte
  calendario.astro         → /calendario
  entorno.astro            → /entorno
  privacidad-portal.astro  → /privacidad-portal

  # Centro de operación — ops.flouvia.com (solo equipo Flouvia)
  ops.astro                    → /ops — resumen operativo real
  ops/bandeja.astro            → /ops/bandeja — asuntos y conversación
  ops/clientes.astro           → /ops/clientes — directorio de workspaces
  ops/clientes/[workspaceId].astro → Cliente 360 y edición controlada

  # API routes
  pages/api/boveda/upload.ts      → POST /api/boveda/upload
  pages/api/client/deploys.ts     → GET  /api/client/deploys
  pages/api/soporte/ticket.ts     → POST /api/soporte/ticket
  pages/api/collaboration/threads.ts  → GET/POST/PATCH asuntos compartidos
  pages/api/collaboration/comments.ts → POST comentarios compartidos/internos
  pages/api/ops/overview.ts            → GET resumen operativo
  pages/api/ops/workspaces/[workspaceId].ts → GET/PATCH Cliente 360
```

Las rutas `/en/*` son el espejo en inglés — cada página portal tiene su mirror en `src/pages/en/`.

---

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

**Language switcher** — el switch ES/EN en la Navbar usa `Astro.url.pathname` para mantenerse en la misma página:
```ts
const pathname = Astro.url.pathname;
const esUrl = lang === 'en' ? (pathname.replace(/^\/en/, '') || '/') : pathname;
const enUrl = lang === 'es' ? '/en' + pathname : pathname;
```

---

---

## Layout — props disponibles (`src/layouts/Layout.astro`)

```ts
interface Props {
  title:        string;
  description?: string;   // default: descripción genérica de Flouvia
  image?:       string;   // default: /android-touch-icon-512.png
  noindex?:     boolean;  // default: false
  ogType?:      string;   // default: 'website' — usar 'article' en casos individuales
}
```

El layout genera automáticamente: `canonical`, `hreflang` ES/EN/x-default, OG tags completos
(title, description, url, image, locale, type, site_name) y Twitter card.

**Uso con `ogType="article"`** — casos individuales (`PlantillaCaso.astro`):
```astro
<Layout title={pageTitle} description={pageDesc} image={caso.image} ogType="article">
```
El schema JSON-LD (`Article` + `BreadcrumbList`) se inyecta **en el componente**, no en el Layout,
porque depende de datos dinámicos del caso.

---
