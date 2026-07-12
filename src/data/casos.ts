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
  liveUrl:  string;
  liveDomain: string;
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

];
