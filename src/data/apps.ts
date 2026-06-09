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
    slug:   'tu-primera-app',                                   // TODO: slug real (ej. 'wholesale-pricing')
    num:    '01',
    name:   'Nombre de la App',                                 // TODO
    status: 'live',
    category: {
      es: 'Conversión',                                         // TODO: Conversión / B2B / Inventario / Automatización…
      en: 'Conversion',
    },
    tagline: {
      es: 'Una frase que resume el problema que resuelve.',     // TODO
      en: 'One line that sums up the problem it solves.',
    },
    desc: {
      es: 'Descripción de la app: qué hace, para qué tipo de tienda y por qué la construimos. Misma voz editorial que el resto del sitio — concreta, sin promesas genéricas.', // TODO
      en: 'App description: what it does, which kind of store it is for, and why we built it. Same editorial voice as the rest of the site — concrete, no generic promises.',
    },
    appStoreUrl: 'https://apps.shopify.com/tu-app?utm_source=flouvia&utm_campaign=apps', // TODO: handle real del App Store
    icon:  '/imgs/app-placeholder-icon.svg',                    // TODO: ícono real (cuadrado, ~512px)
    image: '/imgs/app-placeholder.svg',                         // TODO: screenshot/hero real

    pricingTag: { es: 'Gratis', en: 'Free' },                   // TODO
    pricing:    { es: 'Gratis. Sin tarjeta para instalar.', en: 'Free. No card required to install.' }, // TODO
    requirements:{ es: 'Compatible con todos los planes de Shopify.', en: 'Compatible with all Shopify plans.' }, // TODO

    metrics: [                                                  // TODO: opcional — borra el bloque si no aplica
      { val: '5★',  label: { es: 'Reseñas', en: 'Reviews' } },
      { val: '1 min', label: { es: 'Instalación', en: 'Setup' } },
    ],

    problem: {
      es: 'Describe el dolor concreto del merchant antes de tu app — qué hacían manualmente, qué perdían, dónde se rompía la operación.', // TODO
      en: 'Describe the merchant\'s concrete pain before your app — what they did manually, what they lost, where the operation broke.',
    },
    features: [
      {
        title: { es: 'Feature uno', en: 'Feature one' },        // TODO
        desc:  { es: 'Qué hace y por qué importa, en una línea.', en: 'What it does and why it matters, in one line.' },
      },
      {
        title: { es: 'Feature dos', en: 'Feature two' },        // TODO
        desc:  { es: 'Qué hace y por qué importa, en una línea.', en: 'What it does and why it matters, in one line.' },
      },
      {
        title: { es: 'Feature tres', en: 'Feature three' },     // TODO
        desc:  { es: 'Qué hace y por qué importa, en una línea.', en: 'What it does and why it matters, in one line.' },
      },
    ],

    // TODO: conecta con un caso si la app nació de un proyecto real (prueba social fuerte)
    relatedCase: {
      slug: 'el-zarco',
      label: { es: 'Nació del sistema que construimos para El Zarco.', en: 'Born from the system we built for El Zarco.' },
    },

    faq: [
      {
        q: { es: '¿Cómo se instala?', en: 'How do I install it?' },
        a: { es: 'Desde el Shopify App Store en un clic. Shopify gestiona los permisos y la instalación.', en: 'From the Shopify App Store in one click. Shopify handles permissions and installation.' },
      },
      {
        q: { es: '¿Tiene costo?', en: 'Is there a cost?' },     // TODO: ajusta a tu pricing real
        a: { es: 'Gratis para instalar y usar. Sin tarjeta requerida.', en: 'Free to install and use. No card required.' },
      },
    ],

    seoTitle: {
      es: 'Nombre de la App — App de Shopify | Flouvia',        // TODO
      en: 'App Name — Shopify App | Flouvia',
    },
    seoDesc: {
      es: 'Descripción SEO de la app con el problema que resuelve y para qué tiendas. Por Flouvia, firma boutique de ingeniería e-commerce — CDMX.', // TODO
      en: 'SEO description of the app with the problem it solves and which stores it is for. By Flouvia, boutique e-commerce engineering firm — Mexico City.',
    },
    // rating: { value: '5.0', count: '12' },                   // TODO: descomenta cuando tengas reseñas reales
    datePublished: '2026-06-08',
    dateModified:  '2026-06-08',

    cta: {
      eyebrow: { es: 'INSTALA EN UN CLIC', en: 'INSTALL IN ONE CLICK' },
      title:   { es: 'Pruébala en tu tienda.', en: 'Try it in your store.' },
      sub:     { es: 'Instalación gratis desde el Shopify App Store. Sin compromiso, sin tarjeta.', en: 'Free install from the Shopify App Store. No commitment, no card.' },
    },
  },

  // ─── PRÓXIMAMENTE (slots — no generan página de detalle) ───
  {
    slug:   'proximamente-2',
    num:    '02',
    name:   'En desarrollo',                                    // TODO: nombre tentativo
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
