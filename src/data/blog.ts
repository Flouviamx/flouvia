export interface BlogPost {
  slug: string;
  category: { es: string; en: string };
  categoryColor: string;
  categoryBg: string;
  title: { es: string; en: string };
  excerpt: { es: string; en: string };
  content: { es: string; en: string };
  author: string;
  authorInitial: string;
  date: string;
  readTime: number;
  tags: string[];
  featured?: boolean;
}

export const posts: BlogPost[] = [
  {
    slug: 'arquitectura-b2b-digitalizar-mayoristas',
    category: { es: 'B2B', en: 'B2B' },
    categoryColor: '#bae6fd',
    categoryBg: 'linear-gradient(135deg, #0a192f 0%, #0f2f54 100%)',
    title: {
      es: 'Arquitectura B2B: cómo digitalizar tu operación mayorista sin perder el control',
      en: 'B2B Architecture: how to digitize your wholesale operation without losing control',
    },
    excerpt: {
      es: 'La mayoría de distribuidoras gestionan pedidos por WhatsApp y Excel. Explicamos cómo construir la infraestructura digital que realmente escala.',
      en: 'Most distributors still manage orders via WhatsApp and Excel. We explain how to build the digital infrastructure that actually scales.',
    },
    content: {
      es: `<p class="article-lead">La mayoría de distribuidoras y mayoristas en México todavía procesan pedidos por WhatsApp, consolidan ventas en hojas de cálculo y comunican precios diferenciados por correo. Este modelo tiene un techo muy bajo.</p>

<h2>El problema real no es tecnológico</h2>
<p>Cuando una empresa mayorista busca "digitalizar su operación", el instinto inmediato es buscar un ERP genérico o un módulo B2B de Shopify. El problema es que la herramienta correcta depende de la arquitectura de datos de tu negocio, no del catálogo del proveedor.</p>
<p>Antes de escribir una sola línea de código, hay tres preguntas que deben responderse:</p>
<ul>
<li>¿Cuántos niveles de precios tienes y cómo se calculan?</li>
<li>¿Tu inventario vive en un sistema externo (ERP, WMS) o directamente en Shopify?</li>
<li>¿Tus compradores B2B necesitan aprobaciones de pedido o pagan de forma directa?</li>
</ul>

<h2>Los tres pilares de un portal B2B bien construido</h2>

<h3>1. Catálogo protegido con precios por segmento</h3>
<p>No todos tus clientes ven los mismos precios. Un portal B2B bien construido distingue entre distribuidores, mayoristas, clientes directos y agentes —con precios, descuentos y acceso a productos distintos para cada segmento.</p>
<blockquote>La lógica de precios no vive en el frontend. Vive en la base de datos, y el frontend solo la consulta.</blockquote>

<h3>2. Flujo de pedidos con trazabilidad completa</h3>
<p>Un pedido B2B no es un checkout de e-commerce. Puede incluir pedidos mínimos, validación de crédito, aprobación por gerente de cuenta y sincronización con el sistema de inventario. Cada uno de estos pasos necesita estado, historial y notificaciones.</p>

<h3>3. Integración con el backend operativo</h3>
<p>El portal es inútil si los pedidos no fluyen automáticamente a tu operación. Ya sea SAP, Aspel, un WMS local o Google Sheets, la integración no es opcional: es la razón de ser del portal.</p>

<h2>¿Shopify B2B o portal custom?</h2>
<p>Shopify Plus tiene funcionalidades B2B nativas desde 2022 que cubren el 70% de los casos de uso: precios por empresa, catálogos asignados, checkout personalizado. Para el otro 30% —reglas de negocio complejas, integraciones legacy, lógica de aprobaciones— se construye una capa adicional sobre la API de Shopify.</p>
<p>La decisión no es binaria. Es una arquitectura en capas donde Shopify es el motor de transacciones y los sistemas adicionales manejan la lógica de negocio específica.</p>

<h2>Resultados típicos</h2>
<ul>
<li>Reducción del 60–80% en tiempo de gestión de pedidos por parte del equipo comercial.</li>
<li>Eliminación de errores de precio en pedidos: cero discrepancias por tabla de Excel desactualizada.</li>
<li>Incremento del ticket promedio por visibilidad de inventario en tiempo real.</li>
<li>Datos completos del comportamiento de compra de cada cuenta.</li>
</ul>

<p>La digitalización B2B no es un proyecto de tecnología. Es un proyecto de arquitectura de datos que usa tecnología para ejecutarse.</p>`,

      en: `<p class="article-lead">Most distributors and wholesalers still process orders via WhatsApp, consolidate sales in spreadsheets, and communicate differentiated pricing by email. This model has a very low ceiling.</p>

<h2>The real problem isn't technological</h2>
<p>When a wholesale company looks to "digitize its operation," the immediate instinct is to find a generic ERP or a Shopify B2B module. The problem is that the right tool depends on your business's data architecture, not the vendor's catalog.</p>
<p>Before writing a single line of code, three questions must be answered:</p>
<ul>
<li>How many pricing tiers do you have and how are they calculated?</li>
<li>Does your inventory live in an external system (ERP, WMS) or directly in Shopify?</li>
<li>Do your B2B buyers need order approvals or do they pay directly?</li>
</ul>

<h2>The three pillars of a well-built B2B portal</h2>

<h3>1. Protected catalog with segment-based pricing</h3>
<p>Not all your clients see the same prices. A well-built B2B portal distinguishes between distributors, wholesalers, direct clients, and agents — with different prices, discounts, and product access for each segment.</p>
<blockquote>Pricing logic doesn't live in the frontend. It lives in the database, and the frontend only queries it.</blockquote>

<h3>2. Order flow with complete traceability</h3>
<p>A B2B order is not an e-commerce checkout. It may include minimum orders, credit validation, account manager approval, and inventory system synchronization. Each of these steps needs status, history, and notifications.</p>

<h3>3. Integration with the operational backend</h3>
<p>The portal is useless if orders don't automatically flow into your operation. Whether SAP, a local WMS, or Google Sheets — the integration is not optional: it is the reason the portal exists.</p>

<h2>Shopify B2B or custom portal?</h2>
<p>Shopify Plus has native B2B functionality since 2022 that covers 70% of use cases: company pricing, assigned catalogs, customized checkout. For the other 30% — complex business rules, legacy integrations, approval logic — an additional layer is built on top of Shopify's API.</p>
<p>The decision is not binary. It is a layered architecture where Shopify is the transaction engine and additional systems handle the specific business logic.</p>

<h2>Typical results</h2>
<ul>
<li>60–80% reduction in order management time by the commercial team.</li>
<li>Elimination of pricing errors in orders: zero discrepancies from outdated Excel sheets.</li>
<li>Increase in average ticket through real-time inventory visibility.</li>
<li>Complete behavioral data for each buying account.</li>
</ul>

<p>B2B digitization is not a technology project. It is a data architecture project that uses technology to execute.</p>`,
    },
    author: 'Flouvia Team',
    authorInitial: 'F',
    date: '2026-04-15',
    readTime: 7,
    tags: ['B2B', 'Shopify Plus', 'Portales', 'Arquitectura'],
    featured: true,
  },

  {
    slug: '5-errores-cro-shopify',
    category: { es: 'E-commerce', en: 'E-commerce' },
    categoryColor: '#a5f3fc',
    categoryBg: 'linear-gradient(135deg, #0d1b2a 0%, #083f6e 100%)',
    title: {
      es: '5 errores de CRO que destruyen la conversión de tu tienda Shopify',
      en: '5 CRO mistakes that are destroying your Shopify store conversion',
    },
    excerpt: {
      es: 'El 70% de los visitantes que agregan al carrito nunca completan la compra. Identificamos los patrones de fricción más comunes y cómo eliminarlos con datos.',
      en: '70% of visitors who add to cart never complete the purchase. We identify the most common friction patterns and how to eliminate them with data.',
    },
    content: {
      es: `<p class="article-lead">El 70% de los visitantes que agregan un producto al carrito nunca completan la compra. Antes de invertir más en tráfico, hay cinco patrones de fricción que vale la pena eliminar.</p>

<h2>Por qué el CRO es infraestructura, no táctica</h2>
<p>La optimización de conversión se enseña como una serie de "trucos": agrega urgencia, pon testimonios, simplifica el checkout. La realidad es que el CRO de alto impacto requiere entender los datos de comportamiento de tus usuarios específicos —no las mejores prácticas genéricas de la industria.</p>

<h2>Error 1: No saber dónde se caen los usuarios</h2>
<p>Sin un mapa de eventos en GA4 o Shopify Analytics que mida el funnel completo (sesión → producto → carrito → checkout → pago), cualquier optimización es a ciegas. El primer paso es instrumentar correctamente, no adivinar.</p>
<p>Las métricas que importan: tasa de add-to-cart por producto, abandono de checkout por paso, tasa de sesión→compra por fuente de tráfico.</p>

<h2>Error 2: Checkout con demasiada fricción</h2>
<p>Shopify Plus tiene checkout extensible. Cada paso adicional que pones —registro obligatorio, validación de código postal, campos innecesarios— tiene un costo medible en conversión. El benchmark: menos de 3 pasos de checkout, pago en menos de 90 segundos en móvil.</p>
<blockquote>El formulario de registro obligatorio es el mayor asesino de conversión en e-commerce B2C. Permite checkout como invitado, siempre.</blockquote>

<h2>Error 3: Mobile tratado como versión de escritorio</h2>
<p>Más del 70% del tráfico en Shopify en México llega de móvil. Si la experiencia mobile es una versión comprimida del desktop en lugar de una experiencia diseñada desde cero, estás perdiendo la mayoría de tus ventas potenciales.</p>
<p>Puntos críticos: imágenes de producto que cargan en más de 2 segundos, botón de "agregar al carrito" que no está visible sin scroll, precio y variante difíciles de leer en pantallas de 375px.</p>

<h2>Error 4: Sin flujos de upsell post-compra</h2>
<p>La conversión no termina en el checkout. Shopify Plus permite inyectar ofertas en la página de confirmación de pedido. Una oferta relevante, mostrada en el momento de mayor intención de compra, puede incrementar el AOV entre 10–25% sin costo adicional de adquisición.</p>

<h2>Error 5: Descripciones de producto genéricas</h2>
<p>El SEO de producto no es para Google: es para el cliente que llegó a tu tienda buscando certeza. Una descripción que responde las preguntas específicas de tu audiencia (materiales, dimensiones, compatibilidad, garantía) convierte más que una descripción poética del producto.</p>

<h2>Dónde empezar</h2>
<p>Audita el funnel completo antes de tocar nada. Los datos te dirán dónde están las oportunidades reales. En la mayoría de tiendas que auditamos, el problema principal no está donde el dueño cree que está.</p>`,

      en: `<p class="article-lead">70% of visitors who add a product to cart never complete the purchase. Before investing more in traffic, there are five friction patterns worth eliminating.</p>

<h2>Why CRO is infrastructure, not tactics</h2>
<p>Conversion optimization is taught as a series of "tricks": add urgency, add testimonials, simplify checkout. The reality is that high-impact CRO requires understanding the behavioral data of your specific users — not industry generic best practices.</p>

<h2>Mistake 1: Not knowing where users drop off</h2>
<p>Without an event map in GA4 or Shopify Analytics measuring the complete funnel (session → product → cart → checkout → payment), any optimization is blind. The first step is to instrument correctly, not guess.</p>
<p>Metrics that matter: add-to-cart rate by product, checkout abandonment by step, session-to-purchase rate by traffic source.</p>

<h2>Mistake 2: Too much checkout friction</h2>
<p>Shopify Plus has extensible checkout. Every additional step you add — mandatory registration, postal code validation, unnecessary fields — has a measurable cost in conversion. The benchmark: fewer than 3 checkout steps, payment in under 90 seconds on mobile.</p>
<blockquote>The mandatory registration form is the biggest conversion killer in B2C e-commerce. Always allow guest checkout.</blockquote>

<h2>Mistake 3: Mobile treated as a desktop version</h2>
<p>Over 70% of Shopify traffic in Mexico comes from mobile. If the mobile experience is a compressed version of desktop rather than an experience designed from scratch, you're losing most of your potential sales.</p>
<p>Critical points: product images loading in more than 2 seconds, add-to-cart button not visible without scrolling, price and variant hard to read on 375px screens.</p>

<h2>Mistake 4: No post-purchase upsell flows</h2>
<p>Conversion doesn't end at checkout. Shopify Plus allows injecting offers on the order confirmation page. A relevant offer, shown at the moment of highest purchase intent, can increase AOV by 10–25% without additional acquisition cost.</p>

<h2>Mistake 5: Generic product descriptions</h2>
<p>Product SEO is not for Google: it's for the customer who arrived at your store looking for certainty. A description that answers your audience's specific questions (materials, dimensions, compatibility, warranty) converts more than a poetic product description.</p>

<h2>Where to start</h2>
<p>Audit the complete funnel before touching anything. The data will tell you where the real opportunities are. In most stores we audit, the main problem is not where the owner thinks it is.</p>`,
    },
    author: 'Flouvia Team',
    authorInitial: 'F',
    date: '2026-03-28',
    readTime: 6,
    tags: ['CRO', 'Shopify', 'Conversión', 'Analytics'],
    featured: false,
  },

  {
    slug: 'make-vs-desarrollo-custom-automatizacion',
    category: { es: 'Automatización', en: 'Automation' },
    categoryColor: '#bbf7d0',
    categoryBg: 'linear-gradient(135deg, #051a0f 0%, #0d3a1f 100%)',
    title: {
      es: 'Make vs. desarrollo custom: qué automatización le conviene a tu operación',
      en: 'Make vs. custom development: which automation suits your operation',
    },
    excerpt: {
      es: 'Elegir mal la herramienta de automatización puede costarte meses de trabajo. Explicamos cuándo usar Make, cuándo conectar una API y cuándo construir desde cero.',
      en: 'Choosing the wrong automation tool can cost you months of work. We explain when to use Make, when to connect an API, and when to build from scratch.',
    },
    content: {
      es: `<p class="article-lead">Elegir entre Make y desarrollo custom no es una decisión de presupuesto. Es una decisión de arquitectura que determina qué tan fácil será escalar y mantener tu operación en los próximos años.</p>

<h2>El mito de "automatizar con Make es más rápido"</h2>
<p>Make (antes Integromat) es una herramienta poderosa para conectar aplicaciones sin código. Pero "sin código" no significa "sin arquitectura". Un escenario de Make mal diseñado puede ser tan frágil y difícil de mantener como código mal escrito.</p>
<p>La pregunta correcta no es "¿uso Make o código?" sino "¿qué requiere esta lógica específica?"</p>

<h2>Cuándo Make es la respuesta correcta</h2>
<p>Make tiene ventaja clara cuando:</p>
<ul>
<li>La lógica es lineal: evento A → transformación B → resultado C.</li>
<li>Las aplicaciones ya tienen integraciones nativas en Make (Shopify, Airtable, Gmail, Slack, HubSpot).</li>
<li>El volumen no supera los límites del plan y el costo es predecible.</li>
<li>El equipo no tiene desarrolladores disponibles para mantenimiento continuo.</li>
</ul>
<p>Ejemplos ideales: notificación de nuevo pedido a WhatsApp del equipo, sincronización de cliente de Shopify a HubSpot, reporte semanal de ventas por correo.</p>

<h2>Cuándo necesitas desarrollo custom</h2>
<p>El código directo es necesario cuando:</p>
<ul>
<li>La lógica involucra condiciones complejas o ramificaciones no lineales.</li>
<li>Necesitas control total sobre el manejo de errores y reintentos.</li>
<li>El volumen de operaciones hace que Make sea más caro que un servidor propio.</li>
<li>Requieres transformaciones de datos que Make no puede manejar de forma nativa.</li>
</ul>

<h2>El modelo híbrido que funciona en práctica</h2>
<p>La arquitectura más robusta que implementamos para e-commerces de volumen medio combina ambos enfoques:</p>
<blockquote>Make maneja la orquestación y las integraciones con terceros. El código custom maneja la lógica de negocio y las transformaciones complejas. Cada herramienta hace lo que hace mejor.</blockquote>
<p>Por ejemplo: Make captura el webhook de un nuevo pedido en Shopify y llama a una función serverless (Vercel, AWS Lambda) que aplica la lógica de negocio específica. La función procesa y devuelve el resultado, que Make distribuye a los sistemas destino.</p>

<h2>La pregunta que debes hacerte primero</h2>
<p>Antes de elegir la herramienta: si esta automatización falla a las 3am un domingo, ¿quién la puede arreglar? La respuesta determina qué herramienta usar. Si solo tu desarrollador senior puede, quizás Make es la respuesta. Si cualquier persona del equipo puede seguir un log de errores, también.</p>

<p>La automatización de alto rendimiento no se construye eligiendo la herramienta más cara ni la más popular. Se construye entendiendo exactamente qué parte de la operación necesita escalar y diseñando en consecuencia.</p>`,

      en: `<p class="article-lead">Choosing between Make and custom development is not a budget decision. It's an architecture decision that determines how easy it will be to scale and maintain your operation in the coming years.</p>

<h2>The myth of "automating with Make is faster"</h2>
<p>Make (formerly Integromat) is a powerful tool for connecting applications without code. But "no-code" doesn't mean "no architecture." A poorly designed Make scenario can be just as fragile and hard to maintain as poorly written code.</p>
<p>The right question isn't "do I use Make or code?" but "what does this specific logic require?"</p>

<h2>When Make is the right answer</h2>
<p>Make has a clear advantage when:</p>
<ul>
<li>The logic is linear: event A → transformation B → result C.</li>
<li>The applications already have native integrations in Make (Shopify, Airtable, Gmail, Slack, HubSpot).</li>
<li>Volume doesn't exceed plan limits and cost is predictable.</li>
<li>The team doesn't have developers available for continuous maintenance.</li>
</ul>
<p>Ideal examples: new order notification to the team's WhatsApp, Shopify customer sync to HubSpot, weekly sales report by email.</p>

<h2>When you need custom development</h2>
<p>Direct code is necessary when:</p>
<ul>
<li>The logic involves complex conditions or non-linear branches.</li>
<li>You need full control over error handling and retries.</li>
<li>Operation volume makes Make more expensive than your own server.</li>
<li>You need data transformations that Make can't handle natively.</li>
</ul>

<h2>The hybrid model that works in practice</h2>
<p>The most robust architecture we implement for mid-volume e-commerces combines both approaches:</p>
<blockquote>Make handles orchestration and third-party integrations. Custom code handles business logic and complex transformations. Each tool does what it does best.</blockquote>
<p>For example: Make captures a new Shopify order webhook and calls a serverless function (Vercel, AWS Lambda) that applies the specific business logic. The function processes and returns the result, which Make distributes to the destination systems.</p>

<h2>The question you must ask first</h2>
<p>Before choosing the tool: if this automation fails at 3am on a Sunday, who can fix it? The answer determines which tool to use. If only your senior developer can, maybe Make is the answer. If anyone on the team can follow an error log, also.</p>

<p>High-performance automation is not built by choosing the most expensive or most popular tool. It's built by precisely understanding which part of the operation needs to scale and designing accordingly.</p>`,
    },
    author: 'Flouvia Team',
    authorInitial: 'F',
    date: '2026-03-10',
    readTime: 5,
    tags: ['Make', 'Automatización', 'APIs', 'Integración'],
    featured: false,
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find(p => p.slug === slug);
}

export function getRelated(slug: string, count = 2): BlogPost[] {
  return posts.filter(p => p.slug !== slug).slice(0, count);
}

export function formatDate(dateStr: string, lang: 'es' | 'en'): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString(lang === 'en' ? 'en-US' : 'es-MX', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}
