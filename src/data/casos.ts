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
