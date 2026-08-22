# Documentación de ingeniería — Flouvia Web

Este directorio es la memoria técnica del proyecto. Está organizado por dominio para que cada tarea cargue el contexto necesario sin arrastrar reglas ajenas.

## Cómo usar esta documentación

1. Lee primero [`CLAUDE.md`](../CLAUDE.md).
2. Identifica el dominio de la tarea en la matriz siguiente.
3. Abre el documento principal y los documentos relacionados que indique su cabecera.
4. Antes de editar, contrasta las reglas con el código y las fuentes de verdad señaladas.
5. Si una decisión estructural cambia, actualiza el documento afectado en el mismo cambio.

> [!IMPORTANT]
> No es necesario leer todo `docs/` para cada tarea. Sí es obligatorio leer todos los documentos marcados para el dominio que vas a modificar.

## Mapa documental

```text
docs/
├── README.md
├── architecture/
│   ├── stack-and-routing.md
│   ├── security-and-data.md
│   └── integrations-and-deployment.md
├── products/
│   └── portal-and-ops.md
├── experience/
│   ├── design-system.md
│   ├── motion.md
│   └── public-shell.md
└── pages/
    ├── blog.md
    ├── contact.md
    ├── case-studies.md
    ├── about.md
    ├── legal-and-shopify-apps.md
    └── services.md
```

## Matriz de carga

| Si la tarea toca… | Lee primero | Complementa con |
|---|---|---|
| Configuración de Astro, rutas, layouts o i18n | [Stack, rutas e i18n](./architecture/stack-and-routing.md) | [Integraciones y despliegue](./architecture/integrations-and-deployment.md) |
| Clerk, sesiones, permisos, Neon, APIs o middleware | [Seguridad, datos y APIs](./architecture/security-and-data.md) | [Portal y Ops](./products/portal-and-ops.md) |
| Vercel, PSI, Make, Stripe, SSR o prerender | [Integraciones y despliegue](./architecture/integrations-and-deployment.md) | [Seguridad y datos](./architecture/security-and-data.md) |
| Portal de clientes, login o consola Ops | [Portal y Ops](./products/portal-and-ops.md) | [Seguridad y datos](./architecture/security-and-data.md) |
| CSS, tipografía, color, superficies o shaders | [Sistema visual](./experience/design-system.md) | [Movimiento y WebGL](./experience/motion.md) |
| GSAP, ScrollTrigger, reveals, FOUC o reduced motion | [Movimiento y WebGL](./experience/motion.md) | [Shell público](./experience/public-shell.md) |
| Home, navbar, footer o componentes públicos compartidos | [Shell público](./experience/public-shell.md) | [Sistema visual](./experience/design-system.md) |
| Blog | [Blog](./pages/blog.md) | [Movimiento](./experience/motion.md) |
| Contacto o formulario de aplicación | [Contacto](./pages/contact.md) | [Integraciones](./architecture/integrations-and-deployment.md) |
| Casos de estudio | [Casos de estudio](./pages/case-studies.md) | [Sistema visual](./experience/design-system.md) |
| Nosotros o señales de entidad | [Nosotros](./pages/about.md) | [Sistema visual](./experience/design-system.md) |
| Privacidad, términos o Apps de Shopify | [Legales y Apps](./pages/legal-and-shopify-apps.md) | [Stack y rutas](./architecture/stack-and-routing.md) |
| Servicios | [Servicios](./pages/services.md) | [Movimiento](./experience/motion.md) |

## Catálogo por dominio

### Arquitectura

- [Stack, rutas e i18n](./architecture/stack-and-routing.md): comandos, runtime, mapa de páginas, Cord, mirrors ES/EN y contrato de `Layout.astro`.
- [Seguridad, datos y APIs privadas](./architecture/security-and-data.md): Clerk, autorización de recursos y Ops, Neon, aislamiento por workspace, endpoints y middleware.
- [Integraciones y despliegue](./architecture/integrations-and-deployment.md): Vercel API, PSI, Make, Stripe, SSR y páginas prerenderizadas.

### Productos autenticados

- [Portal de clientes y consola Ops](./products/portal-and-ops.md): shell autenticado, componentes compartidos, login, dashboard y métricas operativas.

### Experiencia

- [Sistema visual](./experience/design-system.md): tokens y decisiones estéticas vigentes.
- [Movimiento y WebGL](./experience/motion.md): contrato de animación, anti-FOUC, ScrollTrigger, reduced motion y shaders.
- [Home, navegación y componentes públicos](./experience/public-shell.md): home, navbar, footers, componentes clave y bugs conocidos.

### Páginas

- [Blog](./pages/blog.md)
- [Contacto](./pages/contact.md)
- [Casos de estudio](./pages/case-studies.md)
- [Nosotros](./pages/about.md)
- [Páginas legales y Apps de Shopify](./pages/legal-and-shopify-apps.md)
- [Servicios](./pages/services.md)

## Contrato de mantenimiento

- Una regla vive en un solo documento canónico. Los demás documentos enlazan; no copian bloques extensos.
- Las decisiones globales pertenecen a `CLAUDE.md`; los detalles de implementación pertenecen a `docs/`.
- Los cambios en rutas, schemas, payloads, permisos, variables o fuentes de verdad deben actualizar su documento en el mismo commit.
- Las reglas obsoletas se reemplazan; no se acumulan como historia dentro de la guía activa. Si el contexto histórico importa, debe registrarse de forma breve junto a la decisión vigente.
- Los ejemplos deben ser ejecutables o representar fielmente el código actual.
- Los enlaces internos deben ser relativos y resolverse desde el archivo que los contiene.

## Criterio de autoridad

En caso de contradicción:

1. Seguridad, privacidad y aislamiento de datos.
2. Código, schema y configuración ejecutable actuales.
3. Regla global no negociable de `CLAUDE.md`.
4. Regla específica del documento de dominio.
5. Notas históricas o ejemplos.

No ignores una discrepancia: corrige el código o la documentación dentro del alcance de la tarea y deja ambos alineados.
