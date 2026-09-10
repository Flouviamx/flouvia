# Edición 2027 — brief y ciclo

> **Estado:** en diseño. Arranca 2026-09-10. **Ship: 1 de enero de 2027.**
> **Doc general del sistema de ediciones:** [`editions.md`](./editions.md)
> **Cargar cuando:** se trabaje en la rama `edition/2027` o en el cutover de año.

[← Índice de documentación](../README.md)

---

## Ciclo (≈3 meses)

| Fase | Fechas | Qué |
|---|---|---|
| Brief | sep 2026 | Llenar este doc: north star, hipótesis, referencias. Sin código. |
| Exploración | oct 2026 | Bocetos en `edition/2027`. Tipografía, color, movimiento, un par de pantallas clave. |
| Construcción | nov–dic 2026 | Rehacer el sitio en la rama. Mantener sync con `main`. |
| Cutover | 1 ene 2027 | `edition/2027` → `main`; 2026 se congela. |

## Rama y deploy

- **Rama:** `edition/2027`, saliendo de `main` (que ya trae el sistema de ediciones).
  Todo el trabajo de 2027 vive ahí. `main` sigue siendo la edición **2026 vigente**
  y se le pueden seguir haciendo fixes/contenido.
- **Sync:** `git merge main` dentro de `edition/2027` cada semana — evita el
  merge-infierno de diciembre.
- **Deploy continuo:** asignar el dominio `2027.flouvia.com` a la rama
  `edition/2027` en el proyecto Vercel actual (Vercel permite dominio por rama).
  Así el progreso es visible todo el tiempo sin crear un segundo proyecto.
- **`src/data/ediciones.ts` en la rama:** dejar 2027 como `status: 'current'` solo
  al final; durante el desarrollo se puede trabajar sin tocar el índice.

## Cutover — 1 de enero de 2027

1. `git checkout main`
2. `git tag -a edition-2026 -m "Edición 2026 — Editorial Luxury"` · `git push origin edition-2026`
3. Vercel: proyecto (o dominio-por-tag) `2026.flouvia.com` desde el tag `edition-2026`.
   Queda inmutable.
4. `git checkout edition/2027 && git merge main` (sync final, resolver conflictos).
5. Llevar `edition/2027` a `main` (PR o `merge --ff-only`).
6. Editar `src/data/ediciones.ts` en `main`:
   - `2026` → `status: 'archive'`, `frozenAt: '2027-01-01'`, `snapshotUrl: 'https://2026.flouvia.com'`.
   - `2027` → `status: 'current'`, `tag: 'edition-2027'`.
   - (Opcional) añadir `2028` como `upcoming`.
7. Vercel: quitar el dominio de rama `2027.flouvia.com` (ya es `flouvia.com`).
8. Deploy de `main`. Verificar `/ediciones` y `/ediciones/2026` en ES/EN.

## Reglas que NO cambian entre ediciones

Aunque el estilo se rehaga desde cero, esto se mantiene (no son "estilo", son
producto/infra):

- Server-side auth, `workspace_id`, `app_users.id` como identidad interna.
- i18n: ES sin prefijo, EN bajo `/en/`; mirrors alineados.
- `prefers-reduced-motion` respetado siempre.
- Portal (`/dashboard`, `/boveda`, …) y `/ops/*` — su UI no entra en la edición
  de marketing salvo decisión explícita.
- Fuentes de verdad: `src/data/*`, `src/i18n/ui.ts`, Cord en el repo hermano.

---

# BRIEF (llenar durante septiembre)

## North star
_Una frase. ¿De qué va el sitio 2027? ¿Qué sensación deja?_

>

## Qué hizo bien 2026 (conservar)
- Liquid Glass en el navbar / superficies flotantes
- Tipografía Inter única, sin serif
- Movimiento sobrio (fade + subida, `power2.out`)
- Navy `#0a192f` como ancla
- _…_

## Qué empujar / qué rechazar de 2026
- _¿El glass se queda o se lleva a otro lado?_
- _¿Más densidad editorial? ¿Más aire?_
- _¿Color: seguimos monocromo navy o entra un acento?_
- _…_

## Hipótesis de dirección

| Eje | 2026 | Hipótesis 2027 |
|---|---|---|
| Tipografía | Inter (todo) | _¿display para H1? ¿mono para datos?_ |
| Color | Navy `#0a192f` + blanco | __ |
| Movimiento | GSAP fade/subida | __ |
| Layout | Grid editorial, mucho aire | __ |
| Superficies | Liquid Glass | __ |
| Fondo | Blanco / navy radial | __ |

## Referencias
_Links, capturas, sitios. Qué robar de cada uno y qué NO._

-

## Preguntas abiertas
-

## Log de decisiones
_Fecha — decisión — por qué._

- 2026-09-10 — Se abre el ciclo 2027, ship 1 ene 2027, rama `edition/2027`.
