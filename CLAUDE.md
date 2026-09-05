# Flouvia Web — Guía operativa

`CLAUDE.md` es el router del proyecto. Mantiene únicamente las reglas globales y dirige al documento especializado que debe cargarse antes de editar.

## Inicio obligatorio

Antes de hacer cambios:

1. Ejecuta `git status --short` y conserva cualquier trabajo local ajeno.
2. Lee [`docs/README.md`](./docs/README.md).
3. Abre todos los documentos exigidos por la matriz de carga para la tarea.
4. Verifica las fuentes de verdad en código, datos, schema o configuración.
5. Define una validación proporcional al riesgo antes de implementar.

No cargues todo `docs/` por defecto. Carga el dominio completo de la tarea y sus dependencias declaradas.

## Comandos esenciales

```bash
npm run dev            # servidor local en http://localhost:4321
npm run build          # build de producción
npm run preview        # preview del build
npm run db:schema      # aplica migraciones Neon ordenadas
npm run db:verify-collaboration # verifica colaboración; solo lectura
npm run db:verify-ops  # verifica invariantes de Ops; solo lectura
```

Runtime requerido: Node `>=22.12.0`; la versión del repositorio está en `.nvmrc`.

## Arquitectura en una mirada

| Capa | Decisión |
|---|---|
| Framework | Astro 6, `output: 'server'` |
| Deploy | Vercel con `@astrojs/vercel` |
| UI | Astro + islands React cuando existe estado real |
| Auth | UI propia sobre Clerk headless |
| Datos | Neon PostgreSQL |
| Archivos | Vercel Blob privado |
| Movimiento | GSAP 3 + ScrollTrigger |
| Idiomas | Español por defecto; inglés bajo `/en/` |
| Tipografía | Inter |

## Reglas globales no negociables

### Seguridad y datos

- La autorización se valida server-side junto al recurso. Ocultar UI nunca sustituye un permiso.
- Toda lectura o mutación privada queda limitada al usuario o `workspace_id` autorizado.
- `app_users.id` es la identidad interna estable; email y `clerk_user_id` son atributos externos.
- Las notas `internal` y la superficie `/ops/*` nunca se exponen a clientes.
- Los archivos privados se descargan mediante una ruta autenticada; no se publican URLs directas de Blob.
- No registres secretos, tokens, payloads sensibles ni contenido privado en logs o documentación.

### Producto e internacionalización

- Español vive sin prefijo; inglés usa `/en/`.
- Una página pública o de portal que tenga mirror debe mantenerse alineada en ambos idiomas.
- Cord tiene fuentes de verdad en el repositorio hermano `~/Desktop/flouvia-cord`. No inventes planes, capacidades ni slugs.
- Los datos estructurados y la UI deben leer de la misma fuente cuando comparten contenido, especialmente FAQs.

### Experiencia

- Títulos y headings usan Inter; no reintroduzcas Instrument Serif.
- Las entradas usan fade + subida leve con `power2.out`; no SplitText, blur, scale dramático ni hover magnético.
- Todo movimiento respeta `prefers-reduced-motion`.
- Los reveals de scroll siguen el patrón anti-parpadeo documentado; no uses `gsap.from(..., { immediateRender: false })`.
- No añadas watermarks gigantes ni CTAs intermedios que compitan con el CTA unificado del footer.
- En fondos oscuros, evita borders blancos perceptibles; usa profundidad mediante sombra y contraste.

### Forma de trabajo

- Reutiliza componentes y fuentes de verdad existentes antes de crear variantes.
- No dupliques markup entre ES y EN cuando ya existe una plantilla compartida.
- No cambies contratos externos, schemas, payloads o permisos sin actualizar su documentación.
- Mantén los cambios enfocados; no reformatees archivos ajenos a la tarea.
- Una corrección no está terminada hasta validar el flujo afectado y revisar el diff.

## Directorio de documentación

| Dominio | Documento canónico |
|---|---|
| Stack, comandos, rutas, Cord, i18n y Layout | [`docs/architecture/stack-and-routing.md`](./docs/architecture/stack-and-routing.md) |
| Clerk, autorización, Neon, APIs, variables y middleware | [`docs/architecture/security-and-data.md`](./docs/architecture/security-and-data.md) |
| Vercel, PSI, Make, Stripe y deployment | [`docs/architecture/integrations-and-deployment.md`](./docs/architecture/integrations-and-deployment.md) |
| Portal de clientes, login, dashboard y Ops | [`docs/products/portal-and-ops.md`](./docs/products/portal-and-ops.md) |
| Tokens, tipografía y decisiones visuales | [`docs/experience/design-system.md`](./docs/experience/design-system.md) |
| GSAP, ScrollTrigger, anti-FOUC, reduced motion y WebGL | [`docs/experience/motion.md`](./docs/experience/motion.md) |
| Home, Navbar, Footer, componentes y bugs conocidos | [`docs/experience/public-shell.md`](./docs/experience/public-shell.md) |
| Blog | [`docs/pages/blog.md`](./docs/pages/blog.md) |
| Contacto | [`docs/pages/contact.md`](./docs/pages/contact.md) |
| Casos de estudio | [`docs/pages/case-studies.md`](./docs/pages/case-studies.md) |
| Nosotros | [`docs/pages/about.md`](./docs/pages/about.md) |
| Legales y Apps de Shopify | [`docs/pages/legal-and-shopify-apps.md`](./docs/pages/legal-and-shopify-apps.md) |
| Servicios | [`docs/pages/services.md`](./docs/pages/services.md) |

La matriz completa de dependencias está en [`docs/README.md`](./docs/README.md).

## Fuentes de verdad

| Tema | Fuente |
|---|---|
| Scripts y versiones | `package.json`, `.nvmrc` |
| Configuración Astro/Vercel | `astro.config.mjs` |
| Rutas | `src/pages/` |
| Traducciones | `src/i18n/ui.ts`, `src/i18n/utils.ts` |
| Casos | `src/data/casos.ts` |
| Blog y autor | `src/data/blog.ts` |
| Apps de Shopify | `src/data/apps.ts` |
| Acceso al portal | `src/lib/portalAccess.ts` |
| Acceso a Ops | `src/features/ops/operatorAccess.ts` |
| Persistencia | `src/lib/portalDb.ts`, `src/features/ops/`, `neon/migrations/` |
| Precios de Cord | `~/Desktop/flouvia-cord/docs/negocio-billing.md` |
| Slugs públicos de Cord | `~/Desktop/flouvia-cord/src/lib/producto.ts`, `desarrolladores.ts` |
| Caso Masuma (repo hermano) | `~/Desktop/Masuma` — sitio corporativo Astro, previo a despliegue |
| Caso shwcs (repo hermano) | `~/Desktop/shwcs` — plataforma B2B Next.js en `shwcs.site` |

## Validación mínima

- Cambios de UI o contenido: revisar ES/EN, responsive y reduced motion.
- Cambios de rutas o SSR: ejecutar `npm run build`.
- Cambios de datos o Ops: ejecutar la verificación específica y después `npm run build`.
- Cambios de seguridad: probar caso autorizado, no autenticado y autenticado sin permiso.
- Cambios de integración: verificar timeout, manejo de error y ausencia de secretos en cliente/logs.
- Cualquier cambio: revisar `git diff --check` y el diff final.

## Definición de terminado

Una tarea queda lista cuando el comportamiento pedido funciona, no rompe sus mirrors o permisos, pasa la validación relevante y deja código y documentación coherentes.
