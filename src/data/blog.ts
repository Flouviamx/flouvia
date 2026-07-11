// ─────────────────────────────────────────────────────────────────────────────
// Autor de la firma — fuente única de verdad para byline, schema Person y bio.
// Reemplaza el viejo "Flouvia Team" / avatar "F" (señal nula para E-E-A-T).
// ⚠️ LINKEDIN: pega tu URL en AUTHOR.linkedin para activar la señal `sameAs`
//    (la más fuerte de E-E-A-T). Si queda vacía, el schema omite sameAs sin romperse.
// ─────────────────────────────────────────────────────────────────────────────
export const AUTHOR = {
  name: 'André Valle Ortega',
  initial: 'A',
  role: { es: 'Fundador, Flouvia', en: 'Founder, Flouvia' },
  url: 'https://flouvia.com/nosotros',
  linkedin: 'https://www.linkedin.com/in/andrevalleortega/',
  bio: {
    es: 'André Valle Ortega es fundador de Flouvia, firma boutique de ingeniería e-commerce y B2B en CDMX. Ha implementado portales B2B en Shopify Plus y sistemas de automatización para distribuidoras y marcas D2C en México y Estados Unidos.',
    en: 'André Valle Ortega is the founder of Flouvia, a boutique e-commerce and B2B engineering firm based in Mexico City. He has built B2B portals on Shopify Plus and automation systems for distributors and D2C brands across Mexico and the United States.',
  },
};

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
  /** Fecha de última edición — CRÍTICO para schema Article (AI prioriza lo reciente). Actualizar al editar. */
  dateModified: string;
  readTime: number;
  tags: string[];
  /** Temas principales para el campo `about` del schema (mejora extracción por AI). */
  about: { es: string; en: string }[];
  /** CTA contextual al cierre del artículo (Confirmation Bias — conecta con el tema). */
  cta: {
    eyebrow: { es: string; en: string };
    title: { es: string; en: string };
    button: { es: string; en: string };
  };
  featured?: boolean;
}

export const posts: BlogPost[] = [
  {
    slug: 'automatizacion-inventario-ecommerce',
    category: { es: 'Automatización', en: 'Automation' },
    categoryColor: '#bbf7d0',
    categoryBg: 'linear-gradient(135deg, #051a0f 0%, #0d3a1f 100%)',
    title: {
      es: 'Cómo automatizar tu inventario: deja de vender productos que no tienes',
      en: 'How to automate your inventory: stop selling products you don’t have',
    },
    excerpt: {
      es: 'El quiebre de stock destruye tu retención de clientes. Aprende a sincronizar tu ERP y tu tienda online en tiempo real para operar con precisión quirúrgica.',
      en: 'Stockouts destroy customer retention. Learn how to synchronize your ERP and your online store in real time to operate with surgical precision.',
    },
    content: {
      es: `<p class="article-lead">Vender "aire" es uno de los errores más costosos en e-commerce y B2B. Cuando un cliente compra un producto y luego tienes que llamarlo para cancelar porque "el Excel de inventario no estaba actualizado", no solo pierdes una venta: pierdes la confianza.</p>

<h2>El problema del inventario asíncrono</h2>
<p>La mayoría de las operaciones en crecimiento empiezan gestionando el inventario de forma manual: alguien exporta un reporte del ERP o del sistema de almacén (WMS) una vez al día y actualiza masivamente los stocks en Shopify o en su portal B2B. Este modelo asíncrono tiene una ventana de riesgo de 24 horas.</p>
<p>Si durante esa ventana se vende un producto en tu tienda física o a través de un canal B2B tradicional, tu e-commerce seguirá mostrando inventario disponible cuando en realidad ya no existe. El resultado: sobreventa, quejas, y trabajo manual de devoluciones.</p>

<h2>La solución: Arquitectura de Sincronización en Tiempo Real (o cuasi-real)</h2>
<p>Para escalar sin romper tu operación, necesitas que tus sistemas hablen entre sí sin intervención humana. Hay tres capas fundamentales en la automatización de inventarios:</p>

<h3>1. La Fuente Única de la Verdad (SSOT)</h3>
<p>Lo primero es definir qué sistema manda. Por regla general, el ERP (SAP, NetSuite, Odoo, Bind ERP) o el WMS debe ser tu única fuente de la verdad para los niveles de inventario, nunca la plataforma de e-commerce.</p>

<h3>2. Webhooks y APIs</h3>
<p>En lugar de exportar hojas de cálculo, utilizamos la tecnología para enviar avisos (Webhooks). Cuando entra mercancía a tu almacén o se vende por otro canal, tu ERP dispara un evento a través de su API que dice: "El SKU 1044 ahora tiene 15 unidades".</p>
<p>Ese evento es capturado por un middleware o directamente por Shopify, actualizando el stock disponible en menos de 5 segundos.</p>

<h3>3. Buffer de Seguridad</h3>
<p>Incluso con automatización, siempre existe un riesgo en operaciones omnicanal de alto volumen. Una práctica avanzada es automatizar un "buffer". Si tu ERP reporta 2 unidades, el sistema de automatización le dice a Shopify que hay 0. Esto previene sobreventas en los micro-segundos que tardan los sistemas en sincronizarse durante picos como Buen Fin o Hot Sale.</p>

<h2>Cómo construir esta automatización</h2>
<p>Dependiendo de tu volumen, puedes abordar esto de dos maneras:</p>
<ul>
<li><strong>Vía plataformas iPaaS (Make/Zapier):</strong> Ideal si tus sistemas tienen integraciones nativas y procesas menos de 5,000 movimientos de inventario al mes. Es rápido de implementar pero puede volverse costoso si tienes alta rotación.</li>
<li><strong>Vía Middleware Custom (Serverless):</strong> Desarrollar una API puente en AWS o Vercel. Es la opción definitiva para marcas B2B o D2C maduras, ya que procesa millones de actualizaciones por centavos y sin latencia.</li>
</ul>

<h2>Resultados de una sincronización perfecta</h2>
<p>Cuando la sincronización de inventario está automatizada, el equipo de operaciones puede dejar de apagar incendios y el equipo comercial puede vender con confianza. Los costos ocultos de cancelación de pedidos y compensación de clientes se reducen a cero.</p>
<p>La automatización de inventario no es un lujo técnico; es infraestructura operativa básica para cualquier empresa que pretenda superar el millón de dólares en facturación.</p>`,
      en: `<p class="article-lead">Selling "air" is one of the most costly mistakes in e-commerce and B2B. When a customer buys a product and you later have to call them to cancel because "the inventory Excel wasn't updated," you don't just lose a sale: you lose trust.</p>

<h2>The problem with asynchronous inventory</h2>
<p>Most growing operations start by managing inventory manually: someone exports a report from the ERP or warehouse system (WMS) once a day and bulk-updates stocks in Shopify or their B2B portal. This asynchronous model has a 24-hour risk window.</p>
<p>If during that window a product is sold in your physical store or through a traditional B2B channel, your e-commerce will continue showing available inventory when in reality it no longer exists. The result: overselling, complaints, and manual refund work.</p>

<h2>The solution: Real-time (or near-real-time) Synchronization Architecture</h2>
<p>To scale without breaking your operation, you need your systems to talk to each other without human intervention. There are three fundamental layers in inventory automation:</p>

<h3>1. The Single Source of Truth (SSOT)</h3>
<p>The first thing is to define which system is in charge. As a general rule, the ERP (SAP, NetSuite, Odoo, Bind ERP) or WMS must be your single source of truth for inventory levels, never the e-commerce platform.</p>

<h3>2. Webhooks and APIs</h3>
<p>Instead of exporting spreadsheets, we use technology to send notices (Webhooks). When merchandise enters your warehouse or is sold through another channel, your ERP fires an event through its API saying: "SKU 1044 now has 15 units."</p>
<p>That event is captured by a middleware or directly by Shopify, updating the available stock in less than 5 seconds.</p>

<h3>3. Safety Buffer</h3>
<p>Even with automation, there is always a risk in high-volume omnichannel operations. An advanced practice is to automate a "buffer". If your ERP reports 2 units, the automation system tells Shopify there are 0. This prevents overselling in the micro-seconds it takes systems to sync during peaks like Black Friday.</p>

<h2>How to build this automation</h2>
<p>Depending on your volume, you can approach this in two ways:</p>
<ul>
<li><strong>Via iPaaS platforms (Make/Zapier):</strong> Ideal if your systems have native integrations and you process fewer than 5,000 inventory movements a month. It's fast to implement but can become expensive if you have high turnover.</li>
<li><strong>Via Custom Middleware (Serverless):</strong> Developing a bridge API on AWS or Vercel. This is the definitive option for mature B2B or D2C brands, as it processes millions of updates for pennies and without latency.</li>
</ul>

<h2>Results of perfect synchronization</h2>
<p>When inventory synchronization is automated, the operations team can stop putting out fires and the commercial team can sell with confidence. The hidden costs of order cancellations and customer compensation are reduced to zero.</p>
<p>Inventory automation is not a technical luxury; it's basic operational infrastructure for any company intending to surpass a million dollars in revenue.</p>`,
    },
    author: AUTHOR.name,
    authorInitial: AUTHOR.initial,
    date: '2026-07-02',
    dateModified: '2026-07-02',
    readTime: 5,
    tags: ['Automatización', 'ERP', 'Inventario', 'Omnicanalidad'],
    about: [
      { es: 'Sincronización de inventario', en: 'Inventory synchronization' },
      { es: 'Integraciones ERP', en: 'ERP integrations' },
    ],
    cta: {
      eyebrow: { es: '¿CANSADO DE VENDER AIRE?', en: 'TIRED OF SELLING AIR?' },
      title: { es: 'Automatizamos la conexión entre tu ERP y tu e-commerce.', en: 'We automate the connection between your ERP and e-commerce.' },
      button: { es: 'Agendar llamada técnica', en: 'Schedule technical call' },
    },
    featured: false,
  },
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

<h2>¿Qué es una arquitectura B2B headless?</h2>
<p>Una arquitectura B2B headless es un sistema donde el frontend (la tienda que ve el cliente) está desacoplado del backend (el motor de comercio y base de datos). Esto permite reglas de precios dinámicas, catálogos protegidos y aprobaciones complejas sin depender de una sola plataforma monolítica.</p>

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
<p>La decisión no es binaria. Es una arquitectura en capas donde Shopify es el motor de transacciones y los sistemas adicionales manejan la lógica de negocio específica. Esta tabla resume cuándo basta lo nativo y cuándo necesitas construir encima:</p>
<div class="table-wrap"><table>
<thead><tr><th>¿Qué necesitas?</th><th>Shopify B2B nativo</th><th>Capa adicional (custom)</th></tr></thead>
<tbody>
<tr><td>Precios por empresa / segmento</td><td>✓ Nativo</td><td>Solo si las reglas son dinámicas</td></tr>
<tr><td>Catálogos asignados por cliente</td><td>✓ Nativo</td><td>—</td></tr>
<tr><td>Reglas de precio dinámicas (volumen, tier)</td><td>Limitado</td><td>✓ Requerido</td></tr>
<tr><td>Integración con ERP / WMS legacy</td><td>API básica</td><td>✓ Requerido</td></tr>
<tr><td>Flujos de aprobación de pedido</td><td>—</td><td>✓ Requerido</td></tr>
</tbody></table></div>

<h2>Resultados típicos</h2>
<p>En <a href="/casos/el-zarco">El Zarco</a>, distribuidora mayorista con más de 150 clientes, la reducción fue del 67% —de 6 horas a menos de 2 horas diarias en gestión de pedidos—. <a href="/casos/el-zarco">Ver caso completo →</a></p>
<ul>
<li>Reducción del 60–80% en tiempo de gestión de pedidos por parte del equipo comercial.</li>
<li>Eliminación de errores de precio en pedidos: cero discrepancias por tabla de Excel desactualizada.</li>
<li>Incremento del ticket promedio por visibilidad de inventario en tiempo real.</li>
<li>Datos completos del comportamiento de compra de cada cuenta.</li>
</ul>

<p>La digitalización B2B no es un proyecto de tecnología. Es un proyecto de arquitectura de datos que usa tecnología para ejecutarse.</p>

<h2>Preguntas Frecuentes (FAQ)</h2>
<ul>
<li><strong>¿Shopify Plus puede sustituir a mi ERP?</strong><br>No. Shopify Plus actúa como el motor de transacciones y vitrina B2B, pero tu ERP (como SAP o NetSuite) debe seguir siendo la fuente de la verdad para contabilidad e inventario maestro.</li>
<li><strong>¿Cuánto tiempo toma implementar un portal B2B?</strong><br>Dependiendo de la complejidad de tus reglas de negocio y los sistemas legacy a conectar, un proyecto sólido toma entre 12 y 16 semanas.</li>
<li><strong>¿Puedo tener portal B2C y B2B en la misma tienda?</strong><br>Sí, Shopify Plus permite una arquitectura unificada (blended) donde los clientes B2C ven precios de lista y los clientes B2B ven su catálogo y precios específicos al iniciar sesión.</li>
</ul>`,

      en: `<p class="article-lead">Most distributors and wholesalers still process orders via WhatsApp, consolidate sales in spreadsheets, and communicate differentiated pricing by email. This model has a very low ceiling.</p>

<h2>What is a headless B2B architecture?</h2>
<p>A headless B2B architecture is a system where the frontend (the store the customer sees) is decoupled from the backend (the commerce engine and database). This allows for dynamic pricing rules, protected catalogs, and complex approvals without relying on a single monolithic platform.</p>

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
<p>The decision is not binary. It is a layered architecture where Shopify is the transaction engine and additional systems handle the specific business logic. This table summarizes when native is enough and when you need to build on top:</p>
<div class="table-wrap"><table>
<thead><tr><th>What you need</th><th>Native Shopify B2B</th><th>Additional layer (custom)</th></tr></thead>
<tbody>
<tr><td>Per-company / segment pricing</td><td>✓ Native</td><td>Only if rules are dynamic</td></tr>
<tr><td>Catalogs assigned per client</td><td>✓ Native</td><td>—</td></tr>
<tr><td>Dynamic price rules (volume, tier)</td><td>Limited</td><td>✓ Required</td></tr>
<tr><td>Legacy ERP / WMS integration</td><td>Basic API</td><td>✓ Required</td></tr>
<tr><td>Order approval flows</td><td>—</td><td>✓ Required</td></tr>
</tbody></table></div>

<h2>Typical results</h2>
<p>At <a href="/en/casos/el-zarco">El Zarco</a>, a wholesale distributor with more than 150 clients, the reduction was 67% — from 6 hours to under 2 hours per day in order management. <a href="/en/casos/el-zarco">See the full case →</a></p>
<ul>
<li>60–80% reduction in order management time by the commercial team.</li>
<li>Elimination of pricing errors in orders: zero discrepancies from outdated Excel sheets.</li>
<li>Increase in average ticket through real-time inventory visibility.</li>
<li>Complete behavioral data for each buying account.</li>
</ul>

<p>B2B digitization is not a technology project. It is a data architecture project that uses technology to execute.</p>

<h2>Frequently Asked Questions (FAQ)</h2>
<ul>
<li><strong>Can Shopify Plus replace my ERP?</strong><br>No. Shopify Plus acts as the transaction engine and B2B storefront, but your ERP (like SAP or NetSuite) should remain the single source of truth for accounting and master inventory.</li>
<li><strong>How long does it take to implement a B2B portal?</strong><br>Depending on the complexity of your business rules and the legacy systems to connect, a solid project takes between 12 and 16 weeks.</li>
<li><strong>Can I have B2C and B2B in the same store?</strong><br>Yes, Shopify Plus allows a unified (blended) architecture where B2C customers see retail prices and B2B customers see their specific catalog and pricing upon login.</li>
</ul>`,
    },
    author: AUTHOR.name,
    authorInitial: AUTHOR.initial,
    date: '2026-04-15',
    dateModified: '2026-05-30',
    readTime: 7,
    tags: ['B2B', 'Shopify Plus', 'Portales', 'Arquitectura'],
    about: [
      { es: 'Digitalización B2B', en: 'B2B digitization' },
      { es: 'Arquitectura de datos', en: 'Data architecture' },
      { es: 'Shopify Plus', en: 'Shopify Plus' },
    ],
    cta: {
      eyebrow: { es: '¿TU OPERACIÓN SIGUE EN EXCEL Y WHATSAPP?', en: 'STILL RUNNING ON EXCEL AND WHATSAPP?' },
      title: { es: 'Diagnosticamos tu arquitectura B2B sin costo.', en: 'We diagnose your B2B architecture, free.' },
      button: { es: 'Solicitar diagnóstico B2B', en: 'Request a B2B diagnosis' },
    },
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
      es: `<p class="article-lead">El 70% de los visitantes que agregan un producto al carrito nunca completan la compra. En la mayoría de tiendas que auditamos —incluyendo Setnpet, donde pasamos de 0.9% a 1.3% de conversión— el problema principal no estaba donde el dueño creía. Antes de invertir más en tráfico, hay cinco patrones de fricción que vale la pena eliminar.</p>

<h2>¿Qué es CRO en E-commerce?</h2>
<p>La Optimización de la Tasa de Conversión (CRO, por sus siglas en inglés) es el proceso sistemático de aumentar el porcentaje de visitantes de tu sitio web que realizan una acción deseada, como completar una compra. Se basa en el análisis de datos de comportamiento, tests A/B y psicología del consumidor, no en simples cambios estéticos.</p>

<h2>Por qué el CRO es infraestructura, no táctica</h2>
<p>La optimización de conversión se enseña como una serie de "trucos": agrega urgencia, pon testimonios, simplifica el checkout. La realidad es que el CRO de alto impacto requiere entender los datos de comportamiento de tus usuarios específicos —no las mejores prácticas genéricas de la industria.</p>

<h2>Error 0: No saber cuál es tu tasa de conversión de referencia</h2>
<p>Antes de los cinco errores hay uno más fundamental: optimizar sin un número base. Si no sabes que tu conversión actual es, por ejemplo, 1.1%, no puedes saber si un cambio mejoró algo o solo movió ruido. El primer paso de cualquier trabajo de CRO serio es establecer la línea base —por dispositivo, por fuente de tráfico y por categoría de producto— y solo entonces empezar a mover variables.</p>

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
<p>Audita el funnel completo antes de tocar nada. Los datos te dirán dónde están las oportunidades reales. En la mayoría de tiendas que auditamos, el problema principal no está donde el dueño cree que está.</p>

<h2>Paso a paso para auditar tu conversión hoy</h2>
<ul>
<li><strong>Paso 1:</strong> Verifica la correcta integración de GA4 y tus eventos de comercio electrónico. Sin datos confiables, estás a ciegas.</li>
<li><strong>Paso 2:</strong> Analiza el reporte de embudo de compras (Funnel Exploration) para encontrar la etapa exacta donde la caída es más severa (e.g., Carrito a Checkout).</li>
<li><strong>Paso 3:</strong> Revisa grabaciones de sesiones de usuarios en esa etapa específica usando herramientas como Hotjar o Microsoft Clarity.</li>
<li><strong>Paso 4:</strong> Formula una hipótesis basada en datos (ej. "Quitar la navegación en el checkout reducirá fugas en un 10%").</li>
<li><strong>Paso 5:</strong> Implementa el cambio y mide su impacto contra tu línea base.</li>
</ul>`,

      en: `<p class="article-lead">70% of visitors who add a product to cart never complete the purchase. In most stores we audit — including Setnpet, where we moved conversion from 0.9% to 1.3% — the main problem wasn't where the owner believed it was. Before investing more in traffic, there are five friction patterns worth eliminating.</p>

<h2>What is CRO in E-commerce?</h2>
<p>Conversion Rate Optimization (CRO) is the systematic process of increasing the percentage of your website visitors who take a desired action, such as completing a purchase. It relies on behavioral data analysis, A/B testing, and consumer psychology, not just aesthetic changes.</p>

<h2>Why CRO is infrastructure, not tactics</h2>
<p>Conversion optimization is taught as a series of "tricks": add urgency, add testimonials, simplify checkout. The reality is that high-impact CRO requires understanding the behavioral data of your specific users — not industry generic best practices.</p>

<h2>Mistake 0: Not knowing your baseline conversion rate</h2>
<p>Before the five mistakes there is a more fundamental one: optimizing without a baseline number. If you don't know your current conversion is, say, 1.1%, you can't tell whether a change improved anything or just moved noise. The first step of any serious CRO work is to establish the baseline — by device, by traffic source, and by product category — and only then start moving variables.</p>

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
<p>Audit the complete funnel before touching anything. The data will tell you where the real opportunities are. In most stores we audit, the main problem is not where the owner thinks it is.</p>

<h2>Step-by-step to audit your conversion today</h2>
<ul>
<li><strong>Step 1:</strong> Verify the correct integration of GA4 and your e-commerce events. Without reliable data, you're flying blind.</li>
<li><strong>Step 2:</strong> Analyze the purchase funnel report (Funnel Exploration) to find the exact stage where the drop-off is most severe (e.g., Cart to Checkout).</li>
<li><strong>Step 3:</strong> Review user session recordings at that specific stage using tools like Hotjar or Microsoft Clarity.</li>
<li><strong>Step 4:</strong> Formulate a data-driven hypothesis (e.g., "Removing navigation at checkout will reduce leaks by 10%").</li>
<li><strong>Step 5:</strong> Implement the change and measure its impact against your baseline.</li>
</ul>`,
    },
    author: AUTHOR.name,
    authorInitial: AUTHOR.initial,
    date: '2026-03-28',
    dateModified: '2026-05-30',
    readTime: 6,
    tags: ['CRO', 'Shopify', 'Conversión', 'Analytics'],
    about: [
      { es: 'Optimización de conversión (CRO)', en: 'Conversion rate optimization (CRO)' },
      { es: 'Shopify', en: 'Shopify' },
      { es: 'E-commerce', en: 'E-commerce' },
    ],
    cta: {
      eyebrow: { es: '¿IDENTIFICASTE TU TIENDA EN ESTOS ERRORES?', en: 'RECOGNIZE YOUR STORE IN THESE MISTAKES?' },
      title: { es: 'Auditamos tu embudo con datos reales.', en: 'We audit your funnel with real data.' },
      button: { es: 'Solicitar auditoría CRO', en: 'Request a CRO audit' },
    },
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

<h2>¿Qué es Make (Integromat)?</h2>
<p>Make es una plataforma de automatización visual (iPaaS) que te permite conectar diferentes aplicaciones web sin necesidad de escribir código. Funciona mediante escenarios que se activan por eventos (triggers) y ejecutan secuencias lógicas de acciones.</p>

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

<h3>Pros y Contras de usar Make</h3>
<ul>
<li><strong>Pros:</strong> Despliegue en días, auditoría visual del flujo de datos, integración rápida con cientos de APIs populares sin mantener infraestructura.</li>
<li><strong>Contras:</strong> Mayor costo unitario a altos volúmenes, difícil manejo de lógicas condicionales extremadamente complejas, riesgo de latencia.</li>
</ul>

<h2>Cuándo necesitas desarrollo custom</h2>
<p>El código directo es necesario cuando:</p>
<ul>
<li>La lógica involucra condiciones complejas o ramificaciones no lineales.</li>
<li>Necesitas control total sobre el manejo de errores y reintentos.</li>
<li>El volumen de operaciones hace que Make sea más caro que un servidor propio.</li>
<li>Requieres transformaciones de datos que Make no puede manejar de forma nativa.</li>
</ul>

<h2>Make vs. Custom vs. Híbrido, lado a lado</h2>
<p>Ninguna opción gana en todo. Depende de cinco criterios concretos:</p>
<div class="table-wrap"><table>
<thead><tr><th>Criterio</th><th>Make</th><th>Custom</th><th>Híbrido</th></tr></thead>
<tbody>
<tr><td>Volumen de operaciones</td><td>Bajo–medio</td><td>Alto</td><td>Medio–alto</td></tr>
<tr><td>Complejidad de la lógica</td><td>Lineal</td><td>Ramificada</td><td>Mixta</td></tr>
<tr><td>Mantenimiento</td><td>Cualquiera del equipo</td><td>Requiere dev</td><td>Dev + operador</td></tr>
<tr><td>Costo a escala</td><td>Sube con el volumen</td><td>Fijo (servidor)</td><td>Optimizado</td></tr>
<tr><td>Velocidad de implementación</td><td>Rápida</td><td>Lenta</td><td>Media</td></tr>
</tbody></table></div>

<h2>El modelo híbrido que funciona en práctica</h2>
<p>La arquitectura más robusta que implementamos para e-commerces de volumen medio combina ambos enfoques:</p>
<blockquote>Make maneja la orquestación y las integraciones con terceros. El código custom maneja la lógica de negocio y las transformaciones complejas. Cada herramienta hace lo que hace mejor.</blockquote>
<p>Por ejemplo: Make captura el webhook de un nuevo pedido en Shopify y llama a una función serverless (Vercel, AWS Lambda) que aplica la lógica de negocio específica. La función procesa y devuelve el resultado, que Make distribuye a los sistemas destino.</p>
<p>En <a href="/casos/el-zarco">El Zarco</a> implementamos exactamente este modelo: Make captura los webhooks de nuevos pedidos y llama a una función serverless que aplica la lógica de precios por tier antes de devolver el resultado a la operación. <a href="/casos/el-zarco">Ver caso completo →</a></p>

<h2>La pregunta que debes hacerte primero</h2>
<p>Antes de elegir la herramienta: si esta automatización falla a las 3am un domingo, ¿quién la puede arreglar? La respuesta determina qué herramienta usar. Si solo tu desarrollador senior puede, quizás Make es la respuesta. Si cualquier persona del equipo puede seguir un log de errores, también.</p>

<p>La automatización de alto rendimiento no se construye eligiendo la herramienta más cara ni la más popular. Se construye entendiendo exactamente qué parte de la operación necesita escalar y diseñando en consecuencia.</p>`,

      en: `<p class="article-lead">Choosing between Make and custom development is not a budget decision. It's an architecture decision that determines how easy it will be to scale and maintain your operation in the coming years.</p>

<h2>What is Make (Integromat)?</h2>
<p>Make is a visual automation platform (iPaaS) that lets you connect different web applications without writing code. It works through scenarios triggered by events that execute logical sequences of actions.</p>

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

<h3>Pros and Cons of using Make</h3>
<ul>
<li><strong>Pros:</strong> Deployment in days, visual audit of data flows, rapid integration with hundreds of popular APIs without maintaining infrastructure.</li>
<li><strong>Cons:</strong> Higher unit cost at high volumes, difficult handling of extremely complex conditional logic, latency risks.</li>
</ul>

<h2>When you need custom development</h2>
<p>Direct code is necessary when:</p>
<ul>
<li>The logic involves complex conditions or non-linear branches.</li>
<li>You need full control over error handling and retries.</li>
<li>Operation volume makes Make more expensive than your own server.</li>
<li>You need data transformations that Make can't handle natively.</li>
</ul>

<h2>Make vs. Custom vs. Hybrid, side by side</h2>
<p>No single option wins on everything. It comes down to five concrete criteria:</p>
<div class="table-wrap"><table>
<thead><tr><th>Criterion</th><th>Make</th><th>Custom</th><th>Hybrid</th></tr></thead>
<tbody>
<tr><td>Operation volume</td><td>Low–medium</td><td>High</td><td>Medium–high</td></tr>
<tr><td>Logic complexity</td><td>Linear</td><td>Branching</td><td>Mixed</td></tr>
<tr><td>Maintenance</td><td>Anyone on the team</td><td>Requires a dev</td><td>Dev + operator</td></tr>
<tr><td>Cost at scale</td><td>Rises with volume</td><td>Fixed (server)</td><td>Optimized</td></tr>
<tr><td>Implementation speed</td><td>Fast</td><td>Slow</td><td>Medium</td></tr>
</tbody></table></div>

<h2>The hybrid model that works in practice</h2>
<p>The most robust architecture we implement for mid-volume e-commerces combines both approaches:</p>
<blockquote>Make handles orchestration and third-party integrations. Custom code handles business logic and complex transformations. Each tool does what it does best.</blockquote>
<p>For example: Make captures a new Shopify order webhook and calls a serverless function (Vercel, AWS Lambda) that applies the specific business logic. The function processes and returns the result, which Make distributes to the destination systems.</p>
<p>At <a href="/en/casos/el-zarco">El Zarco</a> we implemented exactly this model: Make captures new-order webhooks and calls a serverless function that applies tier-based pricing logic before returning the result to the operation. <a href="/en/casos/el-zarco">See the full case →</a></p>

<h2>The question you must ask first</h2>
<p>Before choosing the tool: if this automation fails at 3am on a Sunday, who can fix it? The answer determines which tool to use. If only your senior developer can, maybe Make is the answer. If anyone on the team can follow an error log, also.</p>

<p>High-performance automation is not built by choosing the most expensive or most popular tool. It's built by precisely understanding which part of the operation needs to scale and designing accordingly.</p>`,
    },
    author: AUTHOR.name,
    authorInitial: AUTHOR.initial,
    date: '2026-03-10',
    dateModified: '2026-05-30',
    readTime: 5,
    tags: ['Make', 'Automatización', 'APIs', 'Integración'],
    about: [
      { es: 'Automatización de procesos', en: 'Process automation' },
      { es: 'Make (Integromat)', en: 'Make (Integromat)' },
      { es: 'Funciones serverless', en: 'Serverless functions' },
    ],
    cta: {
      eyebrow: { es: '¿NO SABES QUÉ AUTOMATIZACIÓN NECESITAS?', en: 'NOT SURE WHICH AUTOMATION YOU NEED?' },
      title: { es: 'Evaluamos tu stack y te decimos qué tiene sentido construir.', en: 'We assess your stack and tell you what is worth building.' },
      button: { es: 'Diagnóstico de automatización', en: 'Automation diagnosis' },
    },
    featured: false,
  },

  {
    slug: 'cotizar-mal-destruye-margen-b2b',
    category: { es: 'B2B', en: 'B2B' },
    categoryColor: '#bae6fd',
    categoryBg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    title: {
      es: 'Cómo cotizar mal está destruyendo en silencio el margen de tu negocio B2B',
      en: 'How poor quoting is silently destroying your B2B margins',
    },
    excerpt: {
      es: 'Errores manuales, tiempos de respuesta lentos y precios desactualizados son una fuga de capital constante. Descubre cómo sistematizar tus cotizaciones para proteger tus márgenes.',
      en: 'Manual errors, slow response times, and outdated pricing are a constant capital leak. Discover how to systematize your quotes to protect your margins.',
    },
    content: {
      es: `<p class="article-lead">En el sector B2B, una cotización no es solo un papel o un PDF; es el primer contrato de confianza con tu cliente. Sin embargo, más del 40% de las empresas mayoristas siguen cotizando usando hojas de cálculo desconectadas y correos electrónicos.</p>
      
<h2>¿Qué es un proceso de cotización sistematizado (CPQ)?</h2>
<p>Un sistema de Configure, Price, Quote (CPQ) o proceso de cotización sistematizado es una infraestructura de software que permite generar cotizaciones exactas y altamente personalizadas al instante, extrayendo reglas de negocio y niveles de inventario en tiempo real.</p>

<h2>El costo real de una cotización manual</h2>
<p>Cuando tu equipo de ventas tiene que buscar el precio actual en un Excel, verificar el inventario en otro sistema, y luego armar un documento manualmente, pasan tres cosas destructivas:</p>
<ul>
<li><strong>Fugas de margen:</strong> Cotizar con precios desactualizados o aplicar descuentos incorrectos significa dinero perdido que nunca recuperarás.</li>
<li><strong>Velocidad de respuesta lenta:</strong> En B2B, el proveedor que responde primero con una cotización clara suele llevarse el negocio. Las demoras de horas o días matan las ventas.</li>
<li><strong>Experiencia de cliente pobre:</strong> Si tu cliente tiene que enviarte varios correos solo para obtener un precio o modificar cantidades, buscará alternativas.</li>
</ul>

<h2>La estandarización como ventaja competitiva</h2>
<p>El problema no es la voluntad del equipo de ventas, es la infraestructura. Para evitar que las malas cotizaciones destruyan tu rentabilidad, necesitas centralizar tu lógica de precios. Los descuentos por volumen, los precios por niveles (tiers) y las reglas específicas por cliente no pueden vivir en la cabeza de los vendedores ni en archivos locales.</p>
<p>Al implementar un portal o un sistema que conecte tu inventario en tiempo real con tu catálogo de precios, eliminas el error humano de la ecuación y garantizas que cada propuesta enviada maximice tu margen, cada vez.</p>

<h2>Paso a paso para sistematizar tus cotizaciones</h2>
<ul>
<li><strong>Paso 1:</strong> Audita todos los niveles de precio actuales y centralízalos en una única base de datos maestra (ERP o CRM).</li>
<li><strong>Paso 2:</strong> Estandariza la estructura de descuentos en "Tiers" lógicos (e.g., Bronce, Plata, Oro).</li>
<li><strong>Paso 3:</strong> Conecta tu base de datos mediante API a un motor de cotizaciones digital o portal B2B.</li>
<li><strong>Paso 4:</strong> Entrena a tu equipo de ventas para que el sistema genere los PDF o enlaces automáticamente, retirando el acceso a modificar precios en celdas de Excel.</li>
</ul>

<h2>Preguntas Frecuentes</h2>
<ul>
<li><strong>¿Cuánto margen se pierde por cotizaciones manuales?</strong><br>Estudios indican que los equipos de ventas en sistemas manuales sacrifican hasta un 15% del margen neto debido a descuentos inconsistentes y errores de cálculo.</li>
<li><strong>¿Cómo acelera las ventas la sistematización?</strong><br>Un portal que devuelve precios precisos e inventario al instante reduce el ciclo de cotización de días a segundos, capturando al comprador en su momento de mayor intención.</li>
</ul>`,
      
      en: `<p class="article-lead">In the B2B sector, a quote is not just a piece of paper or a PDF; it's the first contract of trust with your client. However, over 40% of wholesale companies still quote using disconnected spreadsheets and emails.</p>
      
<h2>What is a systematized quoting process (CPQ)?</h2>
<p>A Configure, Price, Quote (CPQ) system or systematized quoting process is a software infrastructure that allows for generating accurate and highly customized quotes instantly, pulling business rules and inventory levels in real time.</p>

<h2>The real cost of a manual quote</h2>
<p>When your sales team has to look up the current price in an Excel sheet, check inventory in another system, and then manually put together a document, three destructive things happen:</p>
<ul>
<li><strong>Margin leaks:</strong> Quoting with outdated prices or applying incorrect discounts means lost money you will never recover.</li>
<li><strong>Slow response speed:</strong> In B2B, the supplier who responds first with a clear quote usually wins the business. Delays of hours or days kill sales.</li>
<li><strong>Poor customer experience:</strong> If your client has to send several emails just to get a price or modify quantities, they will look for alternatives.</li>
</ul>

<h2>Standardization as a competitive advantage</h2>
<p>The problem is not the sales team's willingness, it's the infrastructure. To prevent bad quotes from destroying your profitability, you need to centralize your pricing logic. Volume discounts, tiered pricing, and client-specific rules cannot live in salespeople's heads or local files.</p>
<p>By implementing a portal or system that connects your real-time inventory with your pricing catalog, you eliminate human error from the equation and guarantee that every proposal sent maximizes your margin, every single time.</p>

<h2>Step-by-step to systematize your quotes</h2>
<ul>
<li><strong>Step 1:</strong> Audit all current pricing tiers and centralize them into a single master database (ERP or CRM).</li>
<li><strong>Step 2:</strong> Standardize the discount structure into logical "Tiers" (e.g., Bronze, Silver, Gold).</li>
<li><strong>Step 3:</strong> Connect your database via API to a digital quoting engine or B2B portal.</li>
<li><strong>Step 4:</strong> Train your sales team so the system automatically generates PDFs or links, removing their access to alter prices in Excel cells.</li>
</ul>

<h2>Frequently Asked Questions</h2>
<ul>
<li><strong>How much margin is lost due to manual quotes?</strong><br>Studies indicate that sales teams using manual systems sacrifice up to 15% of net margin due to inconsistent discounts and calculation errors.</li>
<li><strong>How does systematization accelerate sales?</strong><br>A portal that instantly returns accurate pricing and inventory reduces the quoting cycle from days to seconds, capturing the buyer at their moment of highest intent.</li>
</ul>`,
    },
    author: AUTHOR.name,
    authorInitial: AUTHOR.initial,
    date: '2026-06-12',
    dateModified: '2026-06-12',
    readTime: 4,
    tags: ['B2B', 'Cotizaciones', 'Margen', 'Ventas'],
    about: [
      { es: 'Gestión de cotizaciones', en: 'Quote management' },
      { es: 'Operaciones B2B', en: 'B2B Operations' },
    ],
    cta: {
      eyebrow: { es: '¿TUS COTIZACIONES TOMAN DEMASIADO TIEMPO?', en: 'QUOTES TAKING TOO LONG?' },
      title: { es: 'Te ayudamos a sistematizar tus precios y proteger tus márgenes.', en: 'We help you systematize your pricing and protect margins.' },
      button: { es: 'Sistematizar cotizaciones', en: 'Systematize quotes' },
    },
    featured: false,
  },

  {
    slug: 'software-cord-operacion-b2b',
    category: { es: 'B2B', en: 'B2B' },
    categoryColor: '#bae6fd',
    categoryBg: 'linear-gradient(135deg, #111827 0%, #1e1b4b 100%)',
    title: {
      es: 'Cómo agilizar y centralizar tus cotizaciones con Cord',
      en: 'How to streamline and centralize your quotes with Cord',
    },
    excerpt: {
      es: 'Descubre por qué Cord se ha convertido en una pieza fundamental para las empresas B2B que buscan automatizar sus procesos de cotización y cierre.',
      en: 'Discover why Cord has become a fundamental piece for B2B companies looking to automate their quoting and closing processes.',
    },
    content: {
      es: `<p class="article-lead">Si estás buscando la forma definitiva de erradicar los errores humanos en las cotizaciones y acelerar los cierres de ventas, la tecnología correcta hace toda la diferencia. Aquí es donde entra <a href="https://cord.com" target="_blank" rel="noopener noreferrer">Cord</a>, una herramienta que está revolucionando la forma en que los equipos operan de manera colaborativa.</p>
      
<h2>¿Qué es Cord?</h2>
<p>Cord es un SDK y plataforma que permite integrar funciones de colaboración en tiempo real (como comentarios, notificaciones y cursores en vivo) directamente dentro de cualquier aplicación web, transformando software estático en espacios colaborativos multijugador.</p>

<h2>¿Cómo ayuda Cord al entorno B2B?</h2>
<p>Cord es un software de colaboración en tiempo real diseñado para integrarse directamente en los flujos de trabajo de tus aplicaciones. En un contexto B2B, donde múltiples tomadores de decisiones deben revisar, ajustar y aprobar cotizaciones o inventarios, Cord permite tener discusiones contextuales directamente sobre los documentos y los datos, eliminando las cadenas interminables de correos electrónicos.</p>

<h2>Ventajas de integrar Cord en tus cotizaciones</h2>
<ul>
<li><strong>Colaboración instantánea:</strong> Tu equipo de ventas y los clientes pueden dejar comentarios específicos en partes de una cotización, resolviendo dudas de manera asíncrona pero rápida.</li>
<li><strong>Contexto claro:</strong> Al estar integrado, nunca más tendrás que preguntar "¿a qué línea del Excel te refieres?". El feedback ocurre directamente en el contexto visual de la propuesta.</li>
<li><strong>Cierres acelerados:</strong> Menos fricción en las aprobaciones significa que las ventas se cierran más rápido, protegiendo tanto la relación con el cliente como los ingresos de la empresa.</li>
</ul>

<h3>Casos de uso B2B más efectivos para Cord</h3>
<ul>
<li><strong>Revisión de cotizaciones conjuntas:</strong> El cliente puede etiquetar al vendedor directamente sobre un renglón del presupuesto para pedir ajuste de precio.</li>
<li><strong>Aprobación de crédito y riesgo:</strong> Equipos internos pueden debatir sobre el perfil de una empresa sin salir de la plataforma B2B.</li>
<li><strong>Onboarding de distribuidores:</strong> Aclaración de dudas dentro de la propia plataforma de manera asíncrona, acelerando el tiempo de adaptación del usuario.</li>
</ul>

<h2>El futuro de las herramientas de ventas</h2>
<p>Al final del día, las mejores herramientas de software son invisibles: simplemente quitan la fricción de tu trabajo diario. Si quieres dejar de perder tiempo persiguiendo confirmaciones por WhatsApp, integrar plataformas como <a href="https://cord.com" target="_blank" rel="noopener noreferrer">Cord</a> en tus flujos B2B y de cotización es el paso más inteligente para escalar tu operación.</p>`,
      
      en: `<p class="article-lead">If you're looking for the ultimate way to eradicate human error in quoting and accelerate sales closures, the right technology makes all the difference. This is where <a href="https://cord.com" target="_blank" rel="noopener noreferrer">Cord</a> comes in, a tool that is revolutionizing how teams operate collaboratively.</p>
      
<h2>What is Cord?</h2>
<p>Cord is an SDK and platform that enables the integration of real-time collaboration features (like comments, notifications, and live cursors) directly inside any web application, transforming static software into multiplayer collaborative spaces.</p>

<h2>How does Cord help in a B2B environment?</h2>
<p>Cord is real-time collaboration software designed to integrate directly into your applications' workflows. In a B2B context, where multiple decision-makers must review, adjust, and approve quotes or inventories, Cord allows contextual discussions right on top of the documents and data, eliminating endless email chains.</p>

<h2>Advantages of integrating Cord into your quoting flow</h2>
<ul>
<li><strong>Instant collaboration:</strong> Your sales team and clients can leave specific comments on parts of a quote, resolving doubts asynchronously but quickly.</li>
<li><strong>Clear context:</strong> Being integrated means you'll never again have to ask "which Excel line do you mean?". Feedback happens directly in the visual context of the proposal.</li>
<li><strong>Accelerated closures:</strong> Less friction in approvals means sales close faster, protecting both the client relationship and company revenue.</li>
</ul>

<h3>Most effective B2B use cases for Cord</h3>
<ul>
<li><strong>Joint quote reviews:</strong> The client can tag the sales rep directly on a line item of the budget to request a price adjustment.</li>
<li><strong>Credit and risk approval:</strong> Internal teams can discuss a company's profile without leaving the B2B platform.</li>
<li><strong>Distributor onboarding:</strong> Clarifying doubts asynchronously within the platform itself, accelerating user adaptation time.</li>
</ul>

<h2>The future of sales tooling</h2>
<p>At the end of the day, the best software tools are invisible: they simply remove friction from your daily work. If you want to stop wasting time chasing confirmations on WhatsApp, integrating platforms like <a href="https://cord.com" target="_blank" rel="noopener noreferrer">Cord</a> into your B2B and quoting flows is the smartest step to scale your operation.</p>`,
    },
    author: AUTHOR.name,
    authorInitial: AUTHOR.initial,
    date: '2026-06-25',
    dateModified: '2026-06-25',
    readTime: 5,
    tags: ['B2B', 'Cord', 'Colaboración', 'Cotizaciones'],
    about: [
      { es: 'Herramientas colaborativas', en: 'Collaborative tools' },
      { es: 'Software B2B', en: 'B2B Software' },
    ],
    cta: {
      eyebrow: { es: '¿LISTO PARA MODERNIZAR TU STACK?', en: 'READY TO MODERNIZE YOUR STACK?' },
      title: { es: 'Diseñamos portales B2B altamente colaborativos.', en: 'We design highly collaborative B2B portals.' },
      button: { es: 'Hablar de mi proyecto', en: 'Discuss my project' },
    },
    featured: false,
  },
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
