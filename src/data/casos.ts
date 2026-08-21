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

];
