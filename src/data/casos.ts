// src/data/casos.ts
// Para agregar un nuevo caso: añadir un objeto al array `casos`.
// El slug se convierte automáticamente en URL: /casos/{slug}

export interface CaseStudy {
  slug:     string;
  num:      string;
  brand:    string;
  category: { es: string; en: string };
  tagline:  { es: string; en: string };
  desc:     { es: string; en: string };
  // Opcionales: un caso previo a despliegue no tiene sitio en vivo todavía.
  liveUrl?:  string;
  liveDomain?: string;
  image:    string;
  metrics:  Array<{ val: string; label: { es: string; en: string } }>;
  challenge: { es: string; en: string };
  solutionPoints: Array<{ es: string; en: string }>;
  stack:    string[];
  results:  Array<{
    val:   string;
    label: { es: string; en: string };
    desc:  { es: string; en: string };
  }>;
  // Nota de contexto temporal sobre los resultados (punto de partida + plazo medido)
  resultsNote?: { es: string; en: string };
  // SEO — title/description con métricas (fallback a category/desc si se omiten)
  seoTitle?: { es: string; en: string };
  seoDesc?:  { es: string; en: string };
  // Schema Article — entidad "about" + fechas de publicación
  about?:    { name: string; description: string; url: string };
  datePublished?: string;
  dateModified?:  string;
  // CTA de cierre conectado directamente al reto del caso (fórmula "¿Tienes X?")
  cta?: {
    eyebrow: { es: string; en: string };
    title:   { es: string; en: string };
    sub:     { es: string; en: string };
  };
}

export const casos: CaseStudy[] = [
  {
    slug:  'el-zarco',
    num:   '02',
    brand: 'El Zarco',
    category: {
      es: 'Portal B2B & E-commerce',
      en: 'B2B Portal & E-commerce',
    },
    tagline: {
      es: 'De gestión manual a un ecosistema web 100% automatizado con Astro y Cord.',
      en: 'From manual management to a 100% automated web ecosystem with Astro and Cord.',
    },
    desc: {
      es: 'Integramos la potencia de Cord via API para automatizar cotizaciones e impulsar cierres, junto con un portal B2B construido en Astro y respaldado por PostgreSQL.',
      en: 'We integrated the power of Cord via API to automate quotes and boost closing rates, alongside a B2B portal built on Astro and backed by PostgreSQL.',
    },
    liveUrl:    'https://elzarcodistribuidora.com.mx',
    liveDomain: 'elzarcodistribuidora.com.mx',
    image: 'https://elzarcodistribuidora.com.mx/assets/69ac8c1474da9485bf036f71_DISTRIBUIDORA.webp',
    metrics: [
      { val: '+60%', label: { es: 'Cotizaciones',  en: 'Quotes' } },
      { val: '+70%', label: { es: 'Cierres',       en: 'Deals Closed' } },
      { val: '100%', label: { es: 'Automatizado',  en: 'Automated' } },
      { val: '90%',  label: { es: 'Ahorro de Tiempo', en: 'Time Saved' } },
    ],
    challenge: {
      es: 'El Zarco gestionaba cotizaciones de forma manual, perdiendo tiempo y ventas por procesos ineficientes. Necesitaban una plataforma robusta para administrar productos, clientes y cotizaciones, ofreciendo a la vez un portal de autogestión para que los distribuidores pudieran reordenar rápidamente sin depender de ventas.',
      en: 'El Zarco managed quotes manually, losing time and sales due to inefficient processes. They needed a robust platform to manage products, clients, and quotes, while offering a self-service portal for distributors to reorder quickly without relying on the sales team.',
    },
    solutionPoints: [
      { es: 'Sitio web informativo desarrollado con Astro.', en: 'Informative website developed with Astro.' },
      { es: 'Integración de Cord via API y Cord Elements para potenciar el cierre de cotizaciones.', en: 'Cord integration via API and Cord Elements to boost quote closing rates.' },
      { es: 'Portal de cotizaciones con carrito, funcionalidades de upsell y cross-sell.', en: 'Quote portal featuring a cart, upselling, and cross-selling capabilities.' },
      { es: 'Panel de administración integral para gestionar estados de cotizaciones, productos (precios, stock) y clientes.', en: 'Comprehensive admin panel to manage quote statuses, products (pricing, availability), and clients.' },
      { es: 'Portal de clientes para reordenamiento rápido, historial de pedidos y métricas.', en: 'Client portal for quick reordering, order history, and metrics.' },
      { es: 'Base de datos PostgreSQL con seguridad robusta (RLS, protección contra inyección SQL, rate limiting).', en: 'PostgreSQL database with robust security (RLS, SQL injection protection, rate limiting).' },
    ],
    stack: ['Astro', 'Cord API', 'Cord Elements', 'PostgreSQL'],
    resultsNote: {
      es: 'Resultados medidos tras la adopción del nuevo ecosistema.',
      en: 'Results measured after the adoption of the new ecosystem.',
    },
    results: [
      {
        val: '+60%',
        label: { es: 'Aumento en Cotizaciones',        en: 'Increase in Quotes' },
        desc:  { es: 'Incremento en el volumen de cotizaciones recibidas gracias a la nueva página web y la experiencia de usuario optimizada en el carrito.', en: 'Increase in received quotes volume driven by the new website and optimized user experience in the cart.' },
      },
      {
        val: '+70%',
        label: { es: 'Aumento en Cierres', en: 'Increase in Deals Closed' },
        desc:  { es: 'Tasa de cierre incrementada drásticamente gracias a la eficiencia y automatización que aporta la integración de Cord.', en: 'Closing rate drastically boosted thanks to the efficiency and automation provided by the Cord integration.' },
      },
      {
        val: '90%',
        label: { es: 'Ahorro de Tiempo',     en: 'Time Saved' },
        desc:  { es: 'Reducción del 90% en el tiempo invertido por cotización. El proceso 100% automatizado permite al equipo enfocarse en ventas de alto valor.', en: '90% reduction in time spent per quote. The 100% automated process allows the team to focus on high-value sales.' },
      },
    ],
    seoTitle: {
      es: 'El Zarco: Ecosistema B2B con Astro y Cord — +60% Cotizaciones | Flouvia CDMX',
      en: 'El Zarco: B2B Ecosystem with Astro and Cord — +60% Quotes | Flouvia',
    },
    seoDesc: {
      es: 'Caso de estudio: transformamos la operación de El Zarco con un portal B2B en Astro, integración de Cord y base de datos PostgreSQL. +60% cotizaciones y 90% de ahorro de tiempo.',
      en: 'Case study: we transformed El Zarco\'s operation with a B2B portal in Astro, Cord integration, and PostgreSQL database. +60% quotes and 90% time saved.',
    },
    about: {
      name: 'El Zarco',
      description: 'Distribuidora mayorista y plataforma E-commerce B2B',
      url: 'https://elzarcodistribuidora.com.mx',
    },
    datePublished: '2025-03-01',
    dateModified:  '2026-07-11',
    cta: {
      eyebrow: { es: '¿TIENES UN RETO SIMILAR?', en: 'HAVE A SIMILAR CHALLENGE?' },
      title:   { es: 'Construimos lo mismo para tu operación.', en: 'We build the same for your operation.' },
      sub:     { es: 'Si tu equipo gestiona cotizaciones, clientes o inventario de forma manual, podemos automatizarlo. Comienza con un diagnóstico sin costo.', en: 'If your team manages quotes, clients or inventory manually, we can automate it. Start with a free diagnosis.' },
    },
  },

  {
    slug:  'ago-fitness',
    num:   '03',
    brand: 'Ago Fitness',
    category: {
      es: 'E-commerce Headless',
      en: 'Headless E-commerce',
    },
    tagline: {
      es: 'De una tienda Shopify estándar a un frontend 100% custom construido con Next.js.',
      en: 'From a standard Shopify store to a 100% custom frontend built with Next.js.',
    },
    desc: {
      es: 'Construimos el storefront de Ago Fitness en modo headless: Shopify como backend de comercio (catálogo, checkout, inventario) vía Storefront API, con todo el frontend hecho a la medida en Next.js — sin las limitaciones de un theme.',
      en: 'We built the Ago Fitness storefront headless: Shopify as the commerce backend (catalog, checkout, inventory) via the Storefront API, with the entire frontend custom-built in Next.js — without the limitations of a theme.',
    },
    liveUrl:    'https://agofitnessco.com',
    liveDomain: 'agofitnessco.com',
    image: '/imgs/logo-ago-fitness.png',
    metrics: [
      { val: '92/100', label: { es: 'Performance',      en: 'Performance' } },
      { val: '100/100', label: { es: 'SEO',             en: 'SEO' } },
      { val: '0',       label: { es: 'Layout Shift',    en: 'Layout Shift' } },
      { val: '100%',    label: { es: 'Headless',        en: 'Headless' } },
    ],
    challenge: {
      es: 'Ago Fitness quería un e-commerce con el nivel de acabado de marcas premium de activewear (Lululemon, Alo Yoga, On Running) — un resultado que un theme estándar de Shopify no iba a lograr sin control total sobre el frontend.',
      en: 'Ago Fitness wanted an e-commerce with the polish of premium activewear brands (Lululemon, Alo Yoga, On Running) — a result a standard Shopify theme wasn\'t going to deliver without full control over the frontend.',
    },
    solutionPoints: [
      { es: 'Storefront headless con Next.js 15 (App Router) + Shopify Storefront API para catálogo y carrito.', en: 'Headless storefront with Next.js 15 (App Router) + Shopify Storefront API for catalog and cart.' },
      { es: 'Navbar con mega menu animado y buscador que hace morph in-place (GSAP Flip).', en: 'Navbar with animated mega menu and an in-place morphing search bar (GSAP Flip).' },
      { es: 'Footer con newsletter y componente de botón reutilizable con microinteracciones.', en: 'Footer with newsletter and a reusable button component with micro-interactions.' },
      { es: 'Checkout 100% Shopify — sin reconstruir pagos, impuestos ni envíos desde cero.', en: '100% Shopify checkout — no rebuilding payments, taxes, or shipping from scratch.' },
    ],
    stack: ['Next.js', 'Shopify Storefront API', 'Tailwind CSS', 'GSAP'],
    resultsNote: {
      es: 'Tienda en fase de lanzamiento — métricas técnicas medidas con Lighthouse contra el build de producción real. Datos de conversión y tráfico se agregarán una vez la tienda esté operando con clientes reales.',
      en: 'Store in launch phase — technical metrics measured with Lighthouse against the real production build. Conversion and traffic data will be added once the store is operating with real customers.',
    },
    results: [
      {
        val: '92/100',
        label: { es: 'Performance Score',        en: 'Performance Score' },
        desc:  { es: 'Medido con Lighthouse contra el build de producción real — sin el peso de un theme genérico, el sitio carga rápido desde el primer render.', en: 'Measured with Lighthouse against the real production build — without the weight of a generic theme, the site loads fast from the first render.' },
      },
      {
        val: '0',
        label: { es: 'Cumulative Layout Shift',  en: 'Cumulative Layout Shift' },
        desc:  { es: 'Cero saltos de layout: cada componente reserva su espacio desde el inicio, sin parpadeos ni reflow al cargar.', en: 'Zero layout shift: every component reserves its space from the start, no flicker or reflow on load.' },
      },
      {
        val: '100%',
        label: { es: 'Headless',                 en: 'Headless' },
        desc:  { es: 'Frontend 100% custom en Next.js — sin depender de un theme de Shopify ni sus límites de personalización, con Shopify como backend puro de comercio.', en: '100% custom Next.js frontend — no dependency on a Shopify theme or its customization limits, with Shopify as a pure commerce backend.' },
      },
    ],
    seoTitle: {
      es: 'Ago Fitness: E-commerce Headless con Next.js y Shopify | Flouvia CDMX',
      en: 'Ago Fitness: Headless E-commerce with Next.js and Shopify | Flouvia',
    },
    seoDesc: {
      es: 'Caso de estudio en desarrollo: storefront headless de Ago Fitness construido con Next.js y Shopify Storefront API, con diseño 100% custom.',
      en: 'Case study in progress: Ago Fitness headless storefront built with Next.js and Shopify Storefront API, with 100% custom design.',
    },
    datePublished: '2026-07-13',
    dateModified:  '2026-07-13',
    cta: {
      eyebrow: { es: '¿QUIERES UN E-COMMERCE ASÍ DE CUIDADO?', en: 'WANT AN E-COMMERCE THIS CAREFULLY BUILT?' },
      title:   { es: 'Construimos tu tienda sin las limitaciones de un theme.', en: 'We build your store without theme limitations.' },
      sub:     { es: 'Si tu marca necesita un e-commerce a la altura de tu producto, hablemos. Comienza con un diagnóstico sin costo.', en: 'If your brand needs an e-commerce that matches your product, let\'s talk. Start with a free diagnosis.' },
    },
  },

  {
    slug:  'masuma',
    num:   '04',
    brand: 'Masuma',
    category: {
      es: 'Sitio Corporativo',
      en: 'Corporate Website',
    },
    tagline: {
      es: 'De cuatro líneas de servicio dispersas a un sitio corporativo que las presenta como una sola oferta integral.',
      en: 'From four scattered service lines to a corporate site that presents them as a single integrated offering.',
    },
    desc: {
      es: 'Construimos el sitio corporativo de Masuma (Mantenimientos y Suministros Azteca) con Astro y Tailwind: obra civil, mantenimiento integral, limpieza y suministro presentados como una sola oferta, con portafolio de proyectos y captación de contacto.',
      en: 'We built the corporate site for Masuma (Mantenimientos y Suministros Azteca) with Astro and Tailwind: civil works, integral maintenance, cleaning and supply presented as a single offering, with a project portfolio and lead capture.',
    },
    image: '/imgs/logo-masuma.png',
    metrics: [
      { val: '100%',   label: { es: 'Estático (SSG)',        en: 'Static (SSG)' } },
      { val: '~29 KB', label: { es: 'JavaScript (gzip)',     en: 'JavaScript (gzip)' } },
      { val: '4',      label: { es: 'Áreas de servicio',     en: 'Service areas' } },
      { val: '9',      label: { es: 'Clientes de referencia', en: 'Reference clients' } },
    ],
    challenge: {
      es: 'Masuma opera cuatro líneas de negocio muy distintas —obra civil, mantenimiento integral, limpieza especializada y suministro de insumos— para clientes corporativos e industriales. Sin un sitio propio, cada propuesta se explicaba desde cero y la trayectoria con clientes como Pemex, Teleperformance o Enerflex no era visible para un prospecto nuevo.',
      en: 'Masuma runs four very different business lines —civil works, integral maintenance, specialized cleaning and supply of materials— for corporate and industrial clients. Without its own site, every proposal was explained from scratch and its track record with clients like Pemex, Teleperformance or Enerflex was invisible to a new prospect.',
    },
    solutionPoints: [
      { es: 'Sitio corporativo estático construido con Astro y Tailwind: HTML servido desde CDN, sin capa de servidor.', en: 'Static corporate site built with Astro and Tailwind: HTML served from a CDN, with no server layer.' },
      { es: 'Página de servicios que unifica las cuatro líneas en una sola narrativa de "solución integral, un solo contrato".', en: 'Services page that unifies the four lines into a single "integrated solution, one contract" narrative.' },
      { es: 'Portafolio de proyectos por tipo de intervención (oficinas, call center, áreas de descanso, remodelación) con galería de obra real.', en: 'Project portfolio by intervention type (offices, call center, break areas, remodeling) with a gallery of real work.' },
      { es: 'Muro de clientes e instituciones para trasladar la trayectoria a un prospecto nuevo desde el primer scroll.', en: 'Wall of clients and institutions to convey the track record to a new prospect from the first scroll.' },
      { es: 'Formulario de contacto único como cierre de cada sección, sin dispersar la intención en varios flujos.', en: 'Single contact form closing every section, without scattering intent across multiple flows.' },
      { es: 'Animación de entrada con GSAP que respeta prefers-reduced-motion.', en: 'Entrance animation with GSAP that respects prefers-reduced-motion.' },
    ],
    stack: ['Astro', 'Tailwind CSS', 'GSAP'],
    resultsNote: {
      es: 'Sitio construido y en revisión, previo a despliegue. Las cifras describen el alcance y la arquitectura entregados, medidos contra el build de producción real; las métricas de rendimiento (Lighthouse) y de negocio se agregarán cuando el sitio esté en producción.',
      en: 'Site built and under review, pre-deployment. The figures describe the delivered scope and architecture, measured against the real production build; performance (Lighthouse) and business metrics will be added once the site is live.',
    },
    results: [
      {
        val: '100%',
        label: { es: 'Sitio estático',        en: 'Fully static site' },
        desc:  { es: 'Cada página se genera como HTML plano con Astro y se sirve desde CDN. No hay base de datos ni API que consultar en cada visita: el primer render no depende de un servidor y la superficie de ataque es mínima.', en: 'Every page is generated as flat HTML with Astro and served from a CDN. There is no database or API to query on each visit: the first render does not depend on a server and the attack surface is minimal.' },
      },
      {
        val: '~29 KB',
        label: { es: 'JavaScript enviado',    en: 'JavaScript shipped' },
        desc:  { es: 'El JS que llega al navegador se limita a ~29 KB comprimidos (carrusel del hero y navegación con GSAP). El resto es HTML y CSS: ningún framework hidratando componentes que no lo necesitan.', en: 'The JS reaching the browser is limited to ~29 KB gzipped (hero carousel and navigation with GSAP). The rest is HTML and CSS: no framework hydrating components that do not need it.' },
      },
      {
        val: '4 → 1',
        label: { es: 'Líneas en una narrativa', en: 'Lines into one narrative' },
        desc:  { es: 'Obra civil, mantenimiento, limpieza y suministro pasan de cuatro discursos sueltos a una sola oferta de "un proveedor, un contrato", con un único formulario de contacto. Un prospecto entiende el alcance completo sin salir de la página.', en: 'Civil works, maintenance, cleaning and supply go from four separate pitches to a single "one provider, one contract" offering, with a single contact form. A prospect grasps the full scope without leaving the page.' },
      },
    ],
    seoTitle: {
      es: 'Masuma: Sitio Corporativo con Astro y Tailwind | Flouvia CDMX',
      en: 'Masuma: Corporate Website with Astro and Tailwind | Flouvia',
    },
    seoDesc: {
      es: 'Caso de estudio: sitio corporativo de Masuma (obra civil, mantenimiento, limpieza y suministro) construido con Astro y Tailwind — 100% estático, ~29 KB de JavaScript, portafolio de proyectos y muro de clientes.',
      en: 'Case study: corporate website for Masuma (civil works, maintenance, cleaning and supply) built with Astro and Tailwind — fully static, ~29 KB of JavaScript, project portfolio and client wall.',
    },
    datePublished: '2026-09-05',
    dateModified:  '2026-09-05',
    cta: {
      eyebrow: { es: '¿TU OPERACIÓN NO SE EXPLICA SOLA?', en: 'DOES YOUR OPERATION FAIL TO EXPLAIN ITSELF?' },
      title:   { es: 'Ordenamos tu oferta en un sitio que vende por ti.', en: 'We frame your offering in a site that sells for you.' },
      sub:     { es: 'Si tu empresa tiene varias líneas de servicio y cada propuesta arranca de cero, construimos el sitio que las unifica. Comienza con un diagnóstico sin costo.', en: 'If your company runs several service lines and every proposal starts from scratch, we build the site that unifies them. Start with a free diagnosis.' },
    },
  },

  {
    slug:  'shwcs',
    num:   '05',
    brand: 'shwcs',
    category: {
      es: 'Plataforma B2B',
      en: 'B2B Platform',
    },
    tagline: {
      es: 'De un catálogo disperso de proveedores a una plataforma editorial donde cada solución se explica y se conecta con quien la opera.',
      en: 'From a scattered vendor catalog to an editorial platform where every solution is explained and connected to whoever runs it.',
    },
    desc: {
      es: 'Construimos shwcs, una plataforma de descubrimiento B2B: publicación de soluciones con revisión editorial, biblioteca personal para guardar y comparar, solicitudes de contacto con consentimiento y respuesta desde la cuenta propietaria. Next.js 15, Neon PostgreSQL y búsqueda semántica con pgvector.',
      en: 'We built shwcs, a B2B discovery platform: solution publishing with editorial review, a personal library to save and compare, consent-based contact requests, and replies from the owner account. Next.js 15, Neon PostgreSQL, and semantic search with pgvector.',
    },
    liveUrl:    'https://shwcs.site',
    liveDomain: 'shwcs.site',
    image: '/imgs/logo-shwcs.png',
    metrics: [
      { val: '2',        label: { es: 'Locales (ES/EN)',       en: 'Locales (ES/EN)' } },
      { val: '3',        label: { es: 'Tipos de listado',      en: 'Listing types' } },
      { val: '100%',     label: { es: 'Revisión editorial',    en: 'Editorially reviewed' } },
      { val: 'pgvector', label: { es: 'Búsqueda semántica',    en: 'Semantic search' } },
    ],
    challenge: {
      es: 'El software, las agencias y los servicios B2B mexicanos viven dispersos en directorios sin criterio: listados sin contexto, sin saber qué resuelve cada opción ni cómo llegar a quien la opera. Faltaba un lugar donde cada solución se explique y el contacto ocurra con consentimiento, no por scraping de correos.',
      en: 'Mexican B2B software, agencies and services live scattered across directories with no criteria: listings without context, no idea what each option solves or how to reach whoever runs it. There was no place where every solution is explained and contact happens with consent, not through email scraping.',
    },
    solutionPoints: [
      { es: 'Plataforma Next.js 15 (App Router) con enrutamiento por locale y contenido espejo ES/EN.', en: 'Next.js 15 (App Router) platform with locale routing and mirrored ES/EN content.' },
      { es: 'Publicación de soluciones con revisión editorial antes de entrar al catálogo.', en: 'Solution publishing with editorial review before entering the catalog.' },
      { es: 'Biblioteca personal: guardar, comparar y organizar opciones.', en: 'Personal library: save, compare and organize options.' },
      { es: 'Solicitudes de contacto con consentimiento explícito; el dueño responde desde su propia cuenta.', en: 'Contact requests with explicit consent; the owner replies from their own account.' },
      { es: 'Búsqueda semántica con pgvector: relaciona soluciones por lo que resuelven, no solo por keyword.', en: 'Semantic search with pgvector: relates solutions by what they solve, not just by keyword.' },
      { es: 'Persistencia en Neon PostgreSQL con Drizzle ORM; archivos en Vercel Blob privado.', en: 'Persistence in Neon PostgreSQL with Drizzle ORM; files in private Vercel Blob.' },
    ],
    stack: ['Next.js', 'PostgreSQL (Neon)', 'Drizzle ORM', 'pgvector', 'Vercel Blob', 'AI SDK'],
    resultsNote: {
      es: 'Plataforma en operación con catálogo inicial (incluye Cord y Flouvia como publicaciones con propietario). Las cifras describen la arquitectura y el alcance entregados; las métricas de tráfico y de activación de proveedores se agregarán conforme crezca el catálogo.',
      en: 'Platform in operation with an initial catalog (includes Cord and Flouvia as owned listings). The figures describe the delivered architecture and scope; traffic and vendor-activation metrics will be added as the catalog grows.',
    },
    results: [
      {
        val: '2',
        label: { es: 'Locales con contenido espejo', en: 'Mirrored content locales' },
        desc:  { es: 'Español e inglés servidos desde un enrutamiento por locale, sin duplicar plantillas: el catálogo, las fichas y los flujos de contacto se mantienen alineados en ambos idiomas.', en: 'Spanish and English served from locale routing, without duplicating templates: the catalog, listings and contact flows stay aligned in both languages.' },
      },
      {
        val: 'Opt-in',
        label: { es: 'Contacto con consentimiento', en: 'Consent-based contact' },
        desc:  { es: 'Un prospecto solicita contacto de forma explícita y el propietario responde desde su cuenta. No hay correos expuestos ni scraping: el dato se comparte solo cuando ambas partes lo aceptan.', en: 'A prospect requests contact explicitly and the owner replies from their account. No exposed emails, no scraping: the data is shared only when both sides agree.' },
      },
      {
        val: 'pgvector',
        label: { es: 'Descubrimiento semántico', en: 'Semantic discovery' },
        desc:  { es: 'Los embeddings viven en Postgres (pgvector), así que relacionar soluciones por lo que resuelven no requiere un servicio de búsqueda aparte ni sincronizar un índice externo.', en: 'Embeddings live in Postgres (pgvector), so relating solutions by what they solve needs no separate search service and no external index to sync.' },
      },
    ],
    seoTitle: {
      es: 'shwcs: Plataforma de Descubrimiento B2B con Next.js y Neon | Flouvia CDMX',
      en: 'shwcs: B2B Discovery Platform with Next.js and Neon | Flouvia',
    },
    seoDesc: {
      es: 'Caso de estudio: construimos shwcs, plataforma de descubrimiento de software, agencias y servicios B2B — Next.js 15, Neon PostgreSQL, búsqueda semántica con pgvector y contacto con consentimiento.',
      en: 'Case study: we built shwcs, a discovery platform for B2B software, agencies and services — Next.js 15, Neon PostgreSQL, semantic search with pgvector, and consent-based contact.',
    },
    about: {
      name: 'shwcs',
      description: 'Plataforma de descubrimiento de software, agencias y servicios B2B mexicanos',
      url: 'https://shwcs.site',
    },
    datePublished: '2026-09-05',
    dateModified:  '2026-09-05',
    cta: {
      eyebrow: { es: '¿TIENES UN PRODUCTO QUE NADIE ENCUENTRA?', en: 'HAVE A PRODUCT NOBODY CAN FIND?' },
      title:   { es: 'Construimos la plataforma donde tu categoría se descubre.', en: 'We build the platform where your category gets discovered.' },
      sub:     { es: 'Marketplace, directorio con criterio o catálogo con búsqueda semántica: si tu negocio vive de que te encuentren, lo diseñamos y lo construimos. Comienza con un diagnóstico sin costo.', en: 'A marketplace, a curated directory, or a catalog with semantic search: if your business lives on being found, we design and build it. Start with a free diagnosis.' },
    },
  },

];
