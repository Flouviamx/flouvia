# Neon database

The portal now uses an internal identity model:

- `app_users.id` is the stable Flouvia identifier.
- `app_users.clerk_user_id` only links the record to Clerk.
- Email is an editable attribute and is never a foreign key.
- `app_users.role` is either `flouvia_admin` or `client`.
- Every private table is scoped by `user_id` in server-side queries.

Collaboration uses `collaboration_threads.workspace_user_id` for tenant isolation.
Shared comments are visible to both sides; `internal` comments are returned only to
Flouvia administrators.

## Provision

The Neon integration in Vercel Marketplace injects a connection string into the
project. This repository accepts either `DATABASE_URL` or the resource-prefixed
`FLOUVIA_DATABASE_URL`. The private Vercel Blob store separately provides
`BLOB_READ_WRITE_TOKEN`.

## Apply the schema

Apply every idempotent migration in `neon/migrations/` against the configured
database, in filename order:

```bash
npm run db:schema
```

New invited users are linked to `app_users` on their first authenticated request.
New accounts receive the `client` role by default; administrator promotion must be
an explicit database operation. Project, billing, roadmap, support, collaboration,
and vault records are created directly in Neon.
