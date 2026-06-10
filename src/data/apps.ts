// src/data/apps.ts
// Fuente única de verdad de las apps de Shopify de Flouvia.
// Para agregar una app: añadir un objeto al array `apps`.
// El slug se convierte automáticamente en URL: /apps/{slug}
//
// status:
//   'live' → app publicada. Tiene página de detalle (/apps/{slug}) y botón Instalar.
//   'soon' → "próximamente". Solo aparece como slot en el listing, SIN página de detalle.
//
// ⚠️ TODO (André): reemplaza los campos marcados con « TODO » por los datos reales de
//    tu app. Con name + slug + appStoreUrl + tagline ya funciona todo; el resto pule la
//    página de detalle. Los íconos/screenshots van en /public/imgs/ (ver app.icon/app.image).

export interface ShopifyApp {
  slug:     string;
  num:      string;                       // '01', '02'… numeración editorial
  name:     string;
  status:   'live' | 'soon';
  category: { es: string; en: string };
  tagline:  { es: string; en: string };   // one-liner — qué resuelve, en una frase
  desc:     { es: string; en: string };   // descripción más larga (hero del detalle)
  appStoreUrl: string;                    // listing público del Shopify App Store ('' si soon)
  icon:     string;                        // /imgs/...  — ícono cuadrado de la app
  image:    string;                        // /imgs/...  — screenshot/hero del detalle

  // Comercial
  pricingTag: { es: string; en: string };  // badge corto: "Gratis", "Free to install", "Desde $9.99"
  pricing:    { es: string; en: string };  // línea completa de pricing
  requirements:{ es: string; en: string }; // "Compatible con todos los planes" / "Requiere Shopify Plus"

  // Métricas opcionales (mismo lenguaje que casos — serif italic)
  metrics?: Array<{ val: string; label: { es: string; en: string } }>;

  // Contenido del detalle
  problem:  { es: string; en: string };    // el problema que resuelve
  features: Array<{ title: { es: string; en: string }; desc: { es: string; en: string } }>;

  // Cómo funciona — flujo paso a paso (clarifica el producto de un vistazo)
  howItWorks?: Array<{ title: { es: string; en: string }; desc: { es: string; en: string } }>;

  // Planes — comparación clara de precios (qué incluye cada nivel)
  plans?: Array<{
    name:     { es: string; en: string };
    price:    { es: string; en: string };
    tagline:  { es: string; en: string };
    features: Array<{ es: string; en: string }>;
    featured?: boolean;                    // resalta el plan recomendado
    note?:    { es: string; en: string };  // p.ej. "7 días de prueba gratis"
  }>;

  // Conexión narrativa con un caso (prueba social): "Nació del sistema de El Zarco"
  relatedCase?: { slug: string; label: { es: string; en: string } };

  // FAQ opcional (formato muy citado por AI / buen para SEO)
  faq?: Array<{ q: { es: string; en: string }; a: { es: string; en: string } }>;

  // SEO / schema SoftwareApplication
  seoTitle?: { es: string; en: string };
  seoDesc?:  { es: string; en: string };
  rating?:   { value: string; count: string }; // p.ej. { value: '5.0', count: '12' } — omitir si no hay reseñas
  datePublished?: string;
  dateModified?:  string;

  // CTA de cierre del detalle
  cta?: {
    eyebrow: { es: string; en: string };
    title:   { es: string; en: string };
    sub:     { es: string; en: string };
  };
}

export const apps: ShopifyApp[] = [
  {
    slug:   'cotizaciones-b2b',
    num:    '01',
    name:   'Flouvia Cotizaciones B2B',
    status: 'live',
    category: {
      es: 'B2B',
      en: 'B2B',
    },
    tagline: {
      es: 'Portal B2B para cotizaciones con precios negociados y CFDI en México.',
      en: 'B2B quoting portal with negotiated pricing and CFDI invoicing for Mexico.',
    },
    desc: {
      es: '¿Tus pedidos B2B llegan por WhatsApp y los capturas en Excel? Flouvia Cotizaciones B2B digitaliza ese proceso dentro de Shopify. Tus compradores solicitan cotizaciones desde el carrito, la página de producto o un botón flotante; tú negocias precios producto por producto, envías el link de pago o un PDF con tu marca, y conviertes la cotización en pedido con un clic. Incluye términos de crédito (Contado, Net 30, Net 60), descuentos, empresas con límite de crédito, analítica y facturación CFDI automática para México en el Plan Pro.',
      en: 'Are your B2B orders coming in over WhatsApp and being captured in spreadsheets? Flouvia Cotizaciones B2B digitizes that process inside Shopify. Your buyers request quotes from the cart, product page, or a floating button; you negotiate prices product by product, send a payment link or branded PDF, and convert the quote into an order in one click. Includes credit terms (Cash, Net 30, Net 60), discounts, companies with credit limits, analytics, and automatic CFDI invoicing for Mexico on the Pro plan.',
    },
    // TODO: reemplaza con el handle real del App Store una vez publicada
    // Formato: https://apps.shopify.com/{handle}?utm_source=flouvia&utm_campaign=apps
    appStoreUrl: 'https://apps.shopify.com/cotizaciones-b2b?utm_source=flouvia&utm_campaign=apps',
    icon:  '/imgs/logo-app.png',             // ícono real de la app

    image: '/imgs/app-placeholder.svg',      // TODO: reemplaza con un screenshot real (1600×900px)

    pricingTag: { es: 'Plan gratis disponible', en: 'Free plan available' },
    pricing: {
      es: 'Plan gratis hasta 5 cotizaciones activas. Planes de pago desde $29 USD/mes con 7 días de prueba gratis.',
      en: 'Free plan up to 5 active quotes. Paid plans from $29 USD/month with a 7-day free trial.',
    },
    requirements: {
      es: 'Compatible con todos los planes de Shopify. Facturación CFDI requiere Plan Pro y tienda con dirección fiscal en México.',
      en: 'Compatible with all Shopify plans. CFDI invoicing requires the Pro plan and a store with a fiscal address in Mexico.',
    },

    problem: {
      es: 'Los comercios B2B en México gestionan cotizaciones por WhatsApp, teléfono y hojas de cálculo. Sin un sistema, los precios negociados viven en conversaciones privadas, los seguimientos se pierden y cada pedido requiere capturas manuales — ventas perdidas, errores de precio y un equipo de ventas saturado de tareas que debería ejecutar el sistema.',
      en: 'B2B merchants in Mexico manage quotes over WhatsApp, phone calls, and spreadsheets. Without a system, negotiated prices live in private conversations, follow-ups get lost, and every order requires manual data entry — lost sales, pricing errors, and a sales team overwhelmed with tasks the system should handle.',
    },
    features: [
      {
        title: { es: 'Solicitud desde la tienda', en: 'Quote request from the storefront' },
        desc:  { es: 'Botón "Solicitar cotización" en el carrito, página de producto y flotante — sin salir de tu tienda.', en: '"Request a quote" button on the cart, product page, and floating — without leaving your store.' },
      },
      {
        title: { es: 'Negociación de precios y descuentos', en: 'Price negotiation and discounts' },
        desc:  { es: 'Edita el precio de cada producto en la cotización, aplica descuentos y manda el link de pago o un PDF con tu marca.', en: 'Edit the price of each item in the quote, apply discounts, and send the payment link or a branded PDF.' },
      },
      {
        title: { es: 'Convierte en pedido con un clic', en: 'Convert to order in one click' },
        desc:  { es: 'La cotización aprobada se convierte en pedido de Shopify directamente — sin recaptura manual ni errores.', en: 'An approved quote converts into a Shopify order directly — no manual re-entry, no errors.' },
      },
      {
        title: { es: 'Empresas, crédito y términos Net 30/60', en: 'Companies, credit limits, and Net 30/60 terms' },
        desc:  { es: 'Asigna límites de crédito por empresa, activa términos Contado / Net 30 / Net 60 y consulta la analítica B2B.', en: 'Assign credit limits per company, enable Cash / Net 30 / Net 60 terms, and review B2B analytics.' },
      },
      {
        title: { es: 'Facturación CFDI automática (Plan Pro)', en: 'Automatic CFDI invoicing (Pro plan)' },
        desc:  { es: 'Genera el comprobante CFDI 4.0 timbrado ante el SAT directamente desde la cotización. Solo para México.', en: 'Generate a CFDI 4.0 receipt stamped with the SAT directly from the quote. Mexico only.' },
      },
    ],

    howItWorks: [
      {
        title: { es: 'El comprador solicita', en: 'The buyer requests' },
        desc:  { es: 'Desde el carrito, la página de producto o un botón flotante, tu cliente pide una cotización sin salir de la tienda ni escribirte por WhatsApp. La solicitud llega a tu panel al instante.', en: 'From the cart, product page, or a floating button, your client requests a quote without leaving the store or messaging you on WhatsApp. The request lands in your dashboard instantly.' },
      },
      {
        title: { es: 'Tú negocias', en: 'You negotiate' },
        desc:  { es: 'Ajustas el precio de cada producto, aplicas descuentos por volumen y defines los términos de pago: Contado, Net 30 o Net 60. Todo desde un solo panel, sin hojas de cálculo.', en: 'Adjust the price of each product, apply volume discounts, and set payment terms: Cash, Net 30, or Net 60. All from a single panel — no spreadsheets.' },
      },
      {
        title: { es: 'Envías la cotización', en: 'You send the quote' },
        desc:  { es: 'Mandas al comprador un link de pago seguro o un PDF con tu marca. Él aprueba y paga en línea, o queda registrado a crédito según los términos que acordaron.', en: 'Send the buyer a secure payment link or a branded PDF. They approve and pay online, or it gets logged on credit per the terms you agreed on.' },
      },
      {
        title: { es: 'Se convierte en pedido', en: 'It becomes an order' },
        desc:  { es: 'La cotización aprobada se vuelve un pedido de Shopify con un clic — sin recaptura. Con el Plan Pro en México, el CFDI 4.0 se timbra automáticamente ante el SAT.', en: 'The approved quote turns into a Shopify order in one click — no re-entry. With the Pro plan in Mexico, the CFDI 4.0 is stamped automatically with the SAT.' },
      },
    ],

    plans: [
      {
        name:    { es: 'Gratis', en: 'Free' },
        price:   { es: '$0', en: '$0' },
        tagline: { es: 'Para empezar a digitalizar tus cotizaciones.', en: 'To start digitizing your quotes.' },
        features: [
          { es: 'Hasta 5 cotizaciones activas', en: 'Up to 5 active quotes' },
          { es: 'Botón de cotización en carrito, producto y flotante', en: 'Quote button on cart, product, and floating' },
          { es: 'Negociación de precios y descuentos', en: 'Price negotiation and discounts' },
          { es: 'Convierte la cotización en pedido de Shopify', en: 'Convert quotes into Shopify orders' },
        ],
      },
      {
        name:    { es: 'Pro', en: 'Pro' },
        price:   { es: 'Desde $29 USD/mes', en: 'From $29 USD/mo' },
        tagline: { es: 'Para operar tu canal B2B en serio.', en: 'To run your B2B channel seriously.' },
        featured: true,
        note:    { es: '7 días de prueba gratis · sin tarjeta para empezar', en: '7-day free trial · no card to start' },
        features: [
          { es: 'Cotizaciones ilimitadas', en: 'Unlimited quotes' },
          { es: 'Facturación CFDI 4.0 automática ante el SAT (México)', en: 'Automatic CFDI 4.0 invoicing with the SAT (Mexico)' },
          { es: 'Empresas con límite de crédito', en: 'Companies with credit limits' },
          { es: 'Términos de pago Net 30 / Net 60', en: 'Net 30 / Net 60 payment terms' },
          { es: 'Analítica B2B', en: 'B2B analytics' },
          { es: 'Formulario de cotización personalizable', en: 'Customizable quote form' },
          { es: 'Modo solo-cotización (oculta precios al público)', en: 'Quote-only mode (hide prices from the public)' },
        ],
      },
    ],

    relatedCase: {
      slug:  'el-zarco',
      label: {
        es: 'Nació del sistema B2B que construimos para El Zarco.',
        en: 'Born from the B2B system we built for El Zarco.',
      },
    },

    faq: [
      {
        q: { es: '¿Funciona con cualquier plan de Shopify?', en: 'Does it work with any Shopify plan?' },
        a: { es: 'Sí. El botón de cotización y la gestión básica funcionan con todos los planes. El CFDI y las funciones avanzadas (empresas, analítica, formulario personalizable) requieren el Plan Pro.', en: 'Yes. The quote button and basic management work with all Shopify plans. CFDI and advanced features (companies, analytics, custom form) require the Pro plan.' },
      },
      {
        q: { es: '¿Qué pasa si supero las 5 cotizaciones del plan gratis?', en: 'What happens if I exceed 5 quotes on the free plan?' },
        a: { es: 'Puedes seguir viendo cotizaciones existentes pero no crear nuevas hasta que cierres alguna o pases a un plan de pago. Los planes pagos tienen cotizaciones ilimitadas.', en: 'You can still view existing quotes but cannot create new ones until you close one or upgrade to a paid plan. Paid plans include unlimited quotes.' },
      },
      {
        q: { es: '¿La facturación CFDI funciona para cualquier empresa?', en: 'Does CFDI invoicing work for any company?' },
        a: { es: 'Solo para comercios con dirección fiscal en México. Necesitas tu CSD (Certificado de Sello Digital) del SAT para activarlo. El proceso de conexión tarda menos de 5 minutos.', en: 'Only for merchants with a fiscal address in Mexico. You need your CSD (Digital Seal Certificate) from the SAT to activate it. The connection process takes under 5 minutes.' },
      },
      {
        q: { es: '¿El comprador ve los precios de lista o los negociados?', en: 'Does the buyer see list prices or negotiated prices?' },
        a: { es: 'Solo ve los precios que tú apruebas en la cotización. En modo "Solo cotización" puedes ocultar todos los precios de tu tienda y forzar al comprador a solicitar cotización antes de comprar.', en: 'They only see the prices you approve in the quote. In "Quote-only mode" you can hide all store prices and require the buyer to request a quote before purchasing.' },
      },
    ],

    seoTitle: {
      es: 'Flouvia Cotizaciones B2B — App de Shopify para Cotizaciones y CFDI en México | Flouvia',
      en: 'Flouvia Cotizaciones B2B — Shopify App for B2B Quoting & CFDI in Mexico | Flouvia',
    },
    seoDesc: {
      es: 'App de Shopify para gestionar cotizaciones B2B con precios negociados, términos de crédito Net 30/60, facturación CFDI automática ante el SAT y analítica. Plan gratis disponible. Hecha por Flouvia para comercios B2B en México.',
      en: 'Shopify app to manage B2B quotes with negotiated pricing, Net 30/60 credit terms, automatic CFDI invoicing with the SAT, and analytics. Free plan available. Built by Flouvia for B2B merchants in Mexico.',
    },
    // rating: { value: '5.0', count: '12' }, // TODO: descomenta cuando tengas reseñas en el App Store
    datePublished: '2026-06-10',
    dateModified:  '2026-06-10',

    cta: {
      eyebrow: { es: 'INSTALA GRATIS', en: 'FREE INSTALL' },
      title:   { es: 'Digitaliza tus cotizaciones B2B hoy.', en: 'Digitize your B2B quotes today.' },
      sub:     { es: 'Plan gratis hasta 5 cotizaciones activas. Sin tarjeta para empezar. Planes de pago desde $29 USD/mes con 7 días de prueba gratis.', en: 'Free plan up to 5 active quotes. No card required to get started. Paid plans from $29 USD/month with a 7-day free trial.' },
    },
  },

  // ─── PRÓXIMAMENTE (slots — no generan página de detalle) ───
  {
    slug:   'proximamente-2',
    num:    '02',
    name:   'En desarrollo',
    status: 'soon',
    category: { es: 'Próximamente', en: 'Coming soon' },
    tagline: { es: 'La siguiente pieza de ingeniería, como producto.', en: 'The next piece of engineering, as a product.' },
    desc:    { es: '', en: '' },
    appStoreUrl: '',
    icon:  '/imgs/app-placeholder-icon.svg',
    image: '/imgs/app-placeholder.svg',
    pricingTag: { es: '', en: '' },
    pricing:    { es: '', en: '' },
    requirements:{ es: '', en: '' },
    problem:  { es: '', en: '' },
    features: [],
  },
];

// Helpers
export const liveApps = apps.filter(a => a.status === 'live');
export const soonApps = apps.filter(a => a.status === 'soon');
