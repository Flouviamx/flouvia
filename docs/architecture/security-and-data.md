# Seguridad, datos y APIs privadas

> **Alcance:** Clerk, autorización, Neon, aislamiento multi-tenant, rutas API, variables y middleware.
> **Cargar cuando:** se toque autenticación, autorización, datos privados, endpoints, rate limiting o middleware.
> **Documentos relacionados:** [Portal y Ops](../products/portal-and-ops.md) · [Integraciones y despliegue](./integrations-and-deployment.md)

[← Volver al índice de documentación](../README.md)

---
## Auth — Clerk (invitation-only)

**Modelo:** Solo emails con invitación aceptada en Clerk pueden entrar al portal.

**Doble capa de defensa:**
1. **Clerk Dashboard** (configurar manualmente — Restrictions → Sign-ups → "Restricted"). Sin esto, cualquiera puede crear cuenta vía OAuth.
2. **Autorización de recurso** (`src/lib/portalAccess.ts`) verifica junto a cada página/API privada que el email tenga una invitación aceptada. El middleware solo incorpora Clerk a `Astro.locals`; no depende de una lista frágil de rutas.

**Optimización:** Tras la primera verificación exitosa, el middleware setea `user.publicMetadata.flouvia_invited = true` y futuras requests usan ese flag (fast path) sin volver a llamar al API de invitations.

**Sign-out automático:** La página `acceso-restringido` detecta el query `?signout=1` y ejecuta `window.Clerk.signOut()` para limpiar la sesión zombie.

**Rutas protegidas:** Todas las rutas root-level (`/dashboard`, `/colaboracion`, `/facturacion`, `/boveda`, `/soporte`, `/roadmap`, `/calendario`, `/entorno`, `/boveda-upload`, `/privacidad-portal`) + sus mirrors `/en/*`.

**Flow de redirects:**
- No autenticado en ruta protegida → `/login` (o `/en/login`)
- Autenticado pero sin invitación → `/acceso-restringido?signout=1` (o `/en/access-denied`) → auto-logout

**UI propia:** `CustomSignIn.tsx`, `CustomOAuthCallback.tsx` y `CustomUserMenu.tsx` implementan la experiencia completa. No se renderizan embeds de Clerk. Clerk queda como proveedor headless para identidad, OAuth, MFA, recuperación y sesiones.

**API routes:**
- `const { userId } = await locals.auth()`
- Email: `const user = await locals.currentUser(); user.emailAddresses[0].emailAddress`

**Cliente principal:** `app_users.id` es un UUID interno estable. `clerk_user_id` es solo el vínculo externo; el email es un atributo editable y nunca una foreign key.

### Autorización de Ops

- La autenticación sigue siendo Clerk headless; la autorización vive server-side en `src/features/ops/operatorAccess.ts`.
- Una cuenta necesita correo verificado del equipo y una membresía activa en `ops_memberships`. No basta ocultar botones en React.
- Roles actuales: `owner`, `operator`, `finance`, `collaborator`; cada mutación exige una capability explícita (`clients:write`, `inbox:write`, etc.).
- Toda API de escritura valida host de Ops, `Origin`, sesión, capability, payload con Zod y rate limit.
- Una sesión anónima en `/ops/*` se redirige a `/login`; una cuenta ajena al equipo nunca recibe el snapshot de Ops.

---

---

## Base de datos — Neon

**Cliente:** `src/lib/neon.ts`; repositorio de queries: `src/lib/portalDb.ts`.
- Acepta `DATABASE_URL` o `FLOUVIA_DATABASE_URL` (nombre inyectado por Vercel Marketplace).
- Solo se usa server-side.
- Toda query privada recibe el `user_id` interno obtenido desde la sesión autorizada.

**Tablas:**

| Tabla | Descripción |
|-------|-------------|
| `app_users` | Identidad interna estable; `role` distingue `flouvia_admin` y `client` |
| `profiles` | Perfil de cada cliente, PK/FK `user_id` |
| `projects` | Proyectos activos, incluye `vercel_project_id` |
| `finance_configs` | Configuración de facturación (1 por cliente) |
| `invoices` | Historial de facturas |
| `vault_files` | Metadata de archivos guardados en Blob privado |
| `roadmap_items` | Hitos del proyecto |
| `tickets` / `ticket_counters` | Tickets y numeración atómica por cliente |
| `notifications` / `announcements` | Notificaciones privadas y anuncios globales |
| `changelog` | Historial público del portal |
| `push_subscriptions` | Suscripciones Web Push por cliente |
| `collaboration_threads` | Asuntos compartidos, prioridad, estado y pin por workspace |
| `collaboration_comments` | Comentarios `shared` y notas `internal` visibles solo para Flouvia |
| `workspaces` | Tenant estable del cliente; desacopla los datos de una persona/email |
| `workspace_members` | Relación usuario↔workspace con membresía activa/revocada |
| `ops_memberships` | Rol interno de cada operador y fecha de revocación |
| `ops_audit_events` | Bitácora append-only de mutaciones administrativas |
| `ops_idempotency_keys` | Base para comandos reintentables sin efectos duplicados |

**Storage:** Vercel Blob privado. Los archivos se guardan bajo `boveda/{user_id}/...`; la descarga pasa por `/api/boveda/download?id=...`, valida sesión + propiedad y transmite el archivo sin exponer una URL pública.

**Schema:** migraciones ordenadas en `neon/migrations/`. Aplicar todas con `npm run db:schema`.

### Ops como consola administrativa

La primera vertical está en `src/features/ops/` y separa `repository → service → API → UI`:

- `/ops`: métricas, cola de atención, clientes recientes y actividad auditada con datos de Neon.
- `/ops/clientes`: directorio por workspace, no por email.
- `/ops/clientes/[workspaceId]`: vista 360 con perfil, proyectos, roadmap, finanzas, tickets, asuntos y actividad; el perfil se edita con control optimista por `version` y motivo obligatorio.
- `/ops/bandeja`: conversación compartida; cambios de estado, pins, mensajes y notas internas escriben auditoría en la misma transacción SQL.
- Las tablas tenant conservan temporalmente `user_id` por compatibilidad, pero ya incluyen `workspace_id`; el código nuevo de Ops debe preferir `workspace_id`.
- Borrado administrativo futuro debe ser archivado/soft delete. `ops_audit_events` bloquea `UPDATE` y `DELETE` mediante trigger.

---

---

## API Routes del portal

### `POST /api/soporte/ticket`
Guarda ticket en Neon y reenvía a Make.
- Auth: `locals.auth()` — requiere sesión Clerk
- Body: `{ category, subject, description, priority }`
- Genera `ticket_ref` (TK-001, TK-002…) basado en count del cliente
- Forwards a Make webhook (fire-and-forget, 8s timeout)

### `GET /api/client/deploys`
Obtiene deployments reales de Vercel para el cliente autenticado.
- Lee `vercel_project_id` de tabla `proyectos`
- Llama a Vercel API con `VERCEL_TOKEN`
- Devuelve: `{ deploys: [{ sha, msg, branch, env, status, url, duration, when }] }`

### `POST /api/boveda/upload`
Upload directo autenticado al store privado de Vercel Blob; la metadata se guarda en Neon.
- Rate limit: 10 subidas/minuto por usuario (in-memory)

### Colaboración
- `GET /api/collaboration/threads?workspaceId=` devuelve el snapshot del workspace autorizado.
- `POST /api/collaboration/threads` permite a ambos roles crear asuntos en su workspace.
- `PATCH /api/collaboration/threads` es solo `flouvia_admin`: cambia estado o pin.
- `POST /api/collaboration/comments` permite comentarios compartidos; `visibility: internal` es solo Flouvia.
- El cliente nunca puede seleccionar otro workspace ni recibir comentarios internos.

---

---

## Variables de entorno (.env)

```
DATABASE_URL=                 # o FLOUVIA_DATABASE_URL, SSR only
BLOB_READ_WRITE_TOKEN=        # store privado, SSR only
PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
VERCEL_TOKEN=                 # Para leer deployments del proyecto del cliente
```

---

---

## Rate limiting

`src/lib/rateLimit.ts` — in-memory, per Vercel instance.
- Upload: 10 subidas/minuto por usuario
- Si se escala a múltiples instancias → migrar a Upstash Redis

---

---

## Middleware

`src/middleware.ts` — dos capas con `sequence(cors, clerk)`:

1. **CORS:** Solo permite origins `flouvia.com`, `www.flouvia.com`, `os.flouvia.com`
2. **Clerk:** Protege rutas `/portal/*` y `/en/portal/*`

---
