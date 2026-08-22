# Integraciones y despliegue

> **Alcance:** contratos externos, timeouts, webhooks, Vercel y reglas de prerender/SSR.
> **Cargar cuando:** se cambien integraciones, webhooks, variables de proveedor, despliegue o prerender.
> **Documentos relacionados:** [Stack y rutas](./stack-and-routing.md) · [Seguridad y datos](./security-and-data.md)

[← Volver al índice de documentación](../README.md)

---

## Integraciones externas

### Vercel API
- **Endpoint:** `GET https://api.vercel.com/v6/deployments?projectId={id}&limit=8`
- **Auth:** `Authorization: Bearer ${VERCEL_TOKEN}`
- **Scope del token:** Full Account o Projects — ambos funcionan
- **Usado en:** `EntornoUI.astro` (deploy history) y `DashboardUI.astro` (activity feed)
- **Pattern:** siempre `AbortSignal.timeout(5000)` — nunca bloquear el render
- **Fallback:** array vacío si timeout o error

### Google PageSpeed Insights (PSI)
- **Endpoint:** `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url={url}&strategy=mobile&category=performance`
- **Auth:** ninguna — API pública gratuita
- **Datos:** CrUX p75 field data para LCP, CLS, INP (Core Web Vitals reales)
- **Timeout:** 7s — PSI puede ser lento
- **Usado en:** `EntornoUI.astro`

### Make (webhooks)
Hay **dos webhooks distintos**:
- **Soporte** (portal): `https://hook.us2.make.com/yxof110p9eswdp0eayr7qihrqx6778dd`
  - Trigger: formulario de soporte enviado. Flow: form → `POST /api/soporte/ticket` → Neon + Make en paralelo.
- **Contacto** (`PlantillaContacto.astro`): `https://hook.us2.make.com/ov4rrddtdx739hnl7dp2mks216171q8m`
  - Trigger: solicitud del formulario por pasos. Fire-and-forget desde el cliente (no pasa por API route).
  - Payload completo y caveat de `data-value` en la sección "Página de Contacto".

### Stripe
- **Integración:** solo Customer Portal (URL en `finance_configs.stripe_portal_url`)
- **Card data:** `card_brand`, `card_last4`, `card_exp` en `finance_configs`
- **No hay Stripe SDK** en el proyecto — todo es link externo al portal de Stripe

---

---

## Deployment

- **Plataforma:** Vercel
- **Modo:** SSR (server-side rendering) — `output: 'server'`
- **Páginas estáticas (`prerender:true`):** `index.astro`, `casos.astro`, `casos/[slug].astro`,
  `en/casos/[slug].astro`, `contacto.astro`, `nosotros.astro`, `servicios.astro`,
  `privacidad.astro`, `terminos.astro`, `en/privacy.astro`, `en/terms.astro`,
  `apps.astro`, `apps/[slug].astro`, `en/apps.astro`, `en/apps/[slug].astro`,
  `blog/index.astro`, `blog/[slug].astro` y mirrors `/en/*`.
- Todas las API routes necesitan `export const prerender = false` al inicio del archivo
