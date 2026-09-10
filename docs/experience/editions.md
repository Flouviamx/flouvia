# Ediciones — arquitectura y ritual de congelado

> **Alcance:** cómo se versiona el estilo visual completo del sitio por año, cómo se
> congela una edición y cómo se navega a las pasadas.
> **Cargar cuando:** se trabaje en `/ediciones`, se abra una edición nueva o se
> congele la vigente.

[← Índice de documentación](../README.md)

---

## Concepto

Cada año Flouvia rediseña el sitio público **desde cero** (tipografía, color,
movimiento, estructura). Cada versión se **fecha, se nombra y se congela**. Las
pasadas quedan navegables como archivo — no una recreación, sino **el sitio real
tal como estaba**.

**2026 "Editorial Luxury" es el punto de partida del sistema.** No hay ediciones
anteriores en el archivo.

---

## Modelo (nivel stack)

Una edición congelada = **un deploy inmutable del repo en un commit**, servido
desde su propio subdominio. No se recrea con flags ni con carpetas paralelas
dentro del repo vivo (eso genera N copias que se pudren). El repo vivo siempre
es **una sola** edición: la vigente.

| Pieza | Rol |
|---|---|
| `main` → `flouvia.com` | Siempre la edición **vigente**. |
| Tag `edition-AAAA` | Congela el commit exacto de la edición. |
| Deploy Vercel aliazado a `AAAA.flouvia.com` | El archivo navegable de esa edición. |
| `src/data/ediciones.ts` | Índice: año, nombre, status, `tag`, `frozenAt`, `snapshotUrl`. |
| `/ediciones` · `/ediciones/[slug]` (+ `/en`) | Página de archivo que lo lista y describe. |

`snapshotUrl` vacío = edición **vigente** (no se enlaza a un subdominio, solo
"estás aquí"). `snapshotUrl` presente = edición **archivada** → botón "Abrir
snapshot".

---

## Ritual: cerrar la edición vigente y abrir la siguiente

Cuando la edición `AAAA+1` está lista para ser la vigente:

1. **Congelar el repo de `AAAA`:**
   ```bash
   git tag -a edition-AAAA -m "Edición AAAA — <nombre>"
   git push origin edition-AAAA
   ```
   (Opcional) rama `edition/AAAA` si se quiere poder parchear la edición
   congelada — solo fixes de seguridad, nunca contenido.

2. **Publicar el archivo de `AAAA`:** proyecto Vercel nuevo
   `flouvia-edition-AAAA` con Production Branch = tag/rama `edition-AAAA`,
   dominio `AAAA.flouvia.com`. Queda inmutable; no vuelve a desplegar.

3. **En `main` (que ya es la edición `AAAA+1`):** editar
   `src/data/ediciones.ts`:
   - `AAAA`: `status: 'archive'`, `frozenAt: '<ISO>'`,
     `snapshotUrl: 'https://AAAA.flouvia.com'`.
   - `AAAA+1`: `status: 'current'`, añadir `tag: 'edition-AAAA+1'` cuando se
     tagee.
   - `AAAA+2`: añadir como `status: 'upcoming'` cuando haya dirección.

4. Verificar `/ediciones` y `/ediciones/AAAA` en ES/EN.

---

## Alternativa ligera (si no se quiere un proyecto Vercel por edición)

Capturar el sitio construido como estático y guardarlo bajo
`public/ediciones/AAAA/` (o Vercel Blob). Congela solo las páginas de marketing
—portal/formularios SSR no funcionan en la captura, y está bien: el archivo es
del **estilo**, no de la app. `snapshotUrl` apunta a esa ruta estática.

---

## Página `/ediciones`

- `src/pages/ediciones.astro` + `src/pages/ediciones/[slug].astro` (+ espejos
  `/en/editions`). Todas `prerender: true`.
- Componentes: `PlantillaEdiciones.astro` (índice) y `PlantillaEdicion.astro`
  (detalle). Estética propia en CSS a mano, fondo blanco — la edición 2026 no usa
  Tailwind (ver [design-system](./design-system.md)).
- Enlazada desde el `Footer` ("Edición 2026" del meta-row y la columna "La Firma").
- Ediciones `upcoming` van con `noindex`.
