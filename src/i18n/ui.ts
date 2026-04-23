// src/i18n/ui.ts
export const languages = {
  es: 'Español',
  en: 'English',
};

export const defaultLang = 'es';

export const ui = {
  es: {
    // NAVBAR & GLOBALS
    'nav.work': 'TRABAJO',
    'nav.services': 'SERVICIOS',
    'nav.about': 'NOSOTROS',
    'nav.cases': 'CASOS',
    'nav.contact': 'CONTACTO ↗',
    'nav.login': 'INICIAR SESIÓN',

    // INICIO
    'hero.badge': 'PRIVATE GROWTH BOUTIQUE',
    'hero.title1': 'Arquitectura digital',
    'hero.title2': 'para escalar operaciones.',
    'hero.desc': 'Construimos ecosistemas E-commerce y B2B. Eliminamos fricción, automatizamos inventarios y optimizamos la conversión de marcas líderes.',
    'hero.cta': 'Agendar Auditoría',
    'tech.title': 'Nuestra',
    'tech.title_editorial': 'tecnología.',
    'tech.sub': 'Desplegamos infraestructura corporativa con las herramientas más potentes del ecosistema digital.',
    'proto.eyebrow': 'METODOLOGÍA DE TRABAJO',
    'proto.title': 'Protocolo',
    'proto.title_editorial': 'de Ejecución.',
    'proto.desc': 'No improvisamos. Aplicamos un marco de trabajo rígido basado en datos para garantizar despliegues seguros y arquitectura escalable.',

    // SERVICIOS
    'serv.hero.badge': 'CATÁLOGO DE INFRAESTRUCTURA',
    'serv.hero.title1': 'Ingeniería para',
    'serv.hero.title2': 'marcas de alto impacto.',
    'serv.hero.desc': 'Desplegamos ecosistemas transaccionales diseñados bajo estándares de latencia cero y conversión máxima. No construimos sitios, desarrollamos activos digitales que multiplican tu revenue.',
    'serv.why.badge': 'FILOSOFÍA',
    'serv.why.title': 'Infraestructura',
    'serv.why.title_ed': 'sin fricción.',
    'serv.why.1.title': 'Performance',
    'serv.why.1.desc': 'Optimización a nivel de servidor para cargas instantáneas.',
    'serv.why.2.title': 'Escalabilidad',
    'serv.why.2.desc': 'Código modular preparado para el tráfico global.',
    'serv.why.3.title': 'Conversión',
    'serv.why.3.desc': 'UX fundamentada en datos y patrones de compra.',
    'serv.why.btn': 'Agendar Diagnóstico',
    'serv.sticky.btn': 'Iniciar Arquitectura',
    
    'serv.1.cat': '01 — E-COMMERCE',
    'serv.1.title': 'E-Commerce Engineering.',
    'serv.1.desc': 'Arquitecturas robustas diseñadas para dominar el retail digital. Construimos front-ends que cargan en milisegundos, eliminando la deuda técnica y maximizando el Lifetime Value (LTV).',
    'serv.1.d1.t': 'Arquitectura Headless', 'serv.1.d1.d': 'Desacoplamos el front-end usando React y Next.js para una velocidad de carga insuperable.',
    'serv.1.d2.t': 'Custom Native Themes', 'serv.1.d2.d': 'Programación Liquid profunda en Shopify Plus para tiendas monolíticas de alta eficiencia.',
    'serv.1.d3.t': 'Checkout Engineering', 'serv.1.d3.d': 'Modificación de la página de pago para integrar flujos nativos de Upsell y Cross-sell.',
    'serv.1.d4.t': 'Migración Enterprise', 'serv.1.d4.d': 'Transiciones seguras desde Magento o VTEX conservando datos, SEO y lógica de clientes.',
    'serv.1.t1': 'Shopify Plus', 'serv.1.t2': 'Next.js / Hydrogen', 'serv.1.t3': 'Vercel',
    'serv.1.btn': 'Cotizar E-Commerce',

    'serv.2.cat': '02 — ARQUITECTURA B2B',
    'serv.2.title': 'Digital Wholesale.',
    'serv.2.desc': 'Digitalizamos la complejidad de la venta mayorista. Construimos portales B2B privados que automatizan tus reglas corporativas, eliminando el PDF, el Excel y el error humano.',
    'serv.2.d1.t': 'Portales Cerrados', 'serv.2.d1.d': 'Sistemas de acceso autenticado exclusivos para distribuidores con catálogos protegidos.',
    'serv.2.d2.t': 'Reglas Dinámicas', 'serv.2.d2.d': 'Algoritmos de precios por volumen, net terms y asignación de crédito automatizada.',
    'serv.2.d3.t': 'Sistemas Quick-Order', 'serv.2.d3.d': 'Interfaces de re-pedido ágil por SKU para compras masivas sin fricción de navegación.',
    'serv.2.d4.t': 'Sincronización Multi-Almacén', 'serv.2.d4.d': 'Ruteo inteligente de órdenes basado en la disponibilidad de inventario en tiempo real.',
    'serv.2.t1': 'Shopify B2B', 'serv.2.t2': 'Custom APIs', 'serv.2.t3': 'ERP Connect',
    'serv.2.btn': 'Digitalizar Operación B2B',

    'serv.3.cat': '03 — AUTOMATION',
    'serv.3.title': 'Data Logistics.',
    'serv.3.desc': 'Tu equipo no debería capturar datos manualmente. Orquestamos la logística de información entre tu E-commerce, tu ERP y tus bases de datos para que operen en piloto automático.',
    'serv.3.d1.t': 'Integración ERP Nativa', 'serv.3.d1.d': 'Conexión bidireccional con SAP, NetSuite o Microsoft Dynamics vía APIs personalizadas.',
    'serv.3.d2.t': 'Arquitectura de Bases', 'serv.3.d2.d': 'Construcción de centros de comando en Airtable para control operativo centralizado.',
    'serv.3.d3.t': 'Automatización de Flujos', 'serv.3.d3.d': 'Orquestación de procesos complejos mediante Make (Integromat) y webhooks nativos.',
    'serv.3.d4.t': 'Logística de Fulfillment', 'serv.3.d4.d': 'Conexión automatizada con sistemas WMS y centros de distribución (3PL).',
    'serv.3.t1': 'Make', 'serv.3.t2': 'Airtable', 'serv.3.t3': 'Webhooks / REST',
    'serv.3.btn': 'Automatizar Procesos',

    'serv.4.cat': '04 — GROWTH',
    'serv.4.title': 'Conversion Rate Optimization.',
    'serv.4.desc': 'Auditamos tu infraestructura actual con datos, no con opiniones. Identificamos los cuellos de botella exactos e implementamos mejoras matemáticas para escalar tu conversión.',
    'serv.4.d1.t': 'Auditoría Técnica UX', 'serv.4.d1.d': 'Mapeo forense de fricciones en el embudo de compra y rendimiento del servidor.',
    'serv.4.d2.t': 'A/B Testing Continuo', 'serv.4.d2.d': 'Pruebas iterativas sobre elementos críticos para garantizar el incremento del AOV.',
    'serv.4.d3.t': 'Análisis de Comportamiento', 'serv.4.d3.d': 'Despliegue de mapas de calor y grabaciones de sesión para validar hipótesis de diseño.',
    'serv.4.d4.t': 'Retención Avanzada', 'serv.4.d4.d': 'Ingeniería de flujos de automatización en Klaviyo para maximizar la recompra.',
    'serv.4.t1': 'Klaviyo', 'serv.4.t2': 'Hotjar', 'serv.4.t3': 'Google Analytics 4',
    'serv.4.btn': 'Auditar Conversión',

    'serv.choose.badge': 'EL ESTÁNDAR FLOUVIA',
    'serv.choose.title': 'Por qué eligen',
    'serv.choose.title_ed': 'nuestra firma.',
    'serv.choose.1.title': 'Cero Deuda Técnica', 'serv.choose.1.desc': 'No usamos plantillas ni llenamos tu tienda de aplicaciones basura. Escribimos código modular y limpio que permite escalar la operación sin que los sistemas colapsen bajo presión.',
    'serv.choose.2.title': 'Expertise Singular', 'serv.choose.2.desc': 'No hacemos redes sociales, no hacemos campañas de branding. Somos una firma obsesionada exclusivamente con la arquitectura transaccional y la ingeniería de conversión.',
    'serv.choose.3.title': 'Metodología Predictiva', 'serv.choose.3.desc': 'Nuestras decisiones de diseño e infraestructura no se basan en opiniones estéticas, se basan en análisis de datos cuantitativos, patrones de usuario y métricas de rendimiento.',

    // ==========================================
    // NOSOTROS — Rediseñado
    // ==========================================

    // Hero
    'about.hero.badge': 'LA FIRMA',
    'about.hero.title1': 'Diseño de sistemas.',
    'about.hero.title2': 'Ingeniería de revenue.',
    'about.hero.desc': 'Fundamos Flouvia con una sola convicción: el diseño convencional está obsoleto. Construimos arquitecturas transaccionales diseñadas matemáticamente para escalar.',

    // Manifiesto
    'about.manifesto.badge': 'EL MANIFIESTO',
    'about.manifesto.title': 'Software sobre',
    'about.manifesto.title_ed': 'estética.',
    'about.manifesto.p1': 'Rechazamos tajantemente la forma sin función. No somos una agencia creativa; somos ingenieros de ecosistemas digitales que generan revenue medible.',
    'about.manifesto.p2': 'Nuestra arquitectura está diseñada para latencia cero y conversión absoluta. La tecnología debe generar revenue, no solo ganar premios de diseño.',

    // Valores
    'about.values.badge': 'NUESTRO ADN',
    'about.values.title': 'Principios',
    'about.values.title_ed': 'inquebrantables.',
    'about.v1.title': 'Transparencia Radical',
    'about.v1.desc': 'Acceso total a nuestro código, repositorios y el porqué matemático detrás de cada decisión que tomamos.',
    'about.v2.title': 'Código de Autor',
    'about.v2.desc': 'No delegamos. Cada línea empujada a producción está auditada para garantizar latencia cero.',
    'about.v3.title': 'ROI Implacable',
    'about.v3.desc': 'El éxito se mide por el incremento exacto en tu Tasa de Conversión (CR) y Ticket Promedio (AOV).',

    // Métricas
    'about.metrics.badge': 'EL IMPACTO',
    'about.metrics.title': 'Resultados',
    'about.metrics.title_ed': 'cuantificables.',
    'about.m1.num': '0', 'about.m1.sym': 'ms', 'about.m1.desc': 'Tolerancia a deuda técnica. Código nativo puro, sin parches.',
    'about.m2.num': '99', 'about.m2.sym': '.9%', 'about.m2.desc': 'Uptime garantizado en infraestructuras Headless.',
    'about.m3.num': '34', 'about.m3.sym': '%', 'about.m3.desc': 'Aumento promedio documentado en Conversion Rate.',
    'about.m4.num': '10', 'about.m4.sym': '+', 'about.m4.desc': 'Sistemas ERP (SAP/NetSuite) integrados en tiempo real.',
    'about.m5.num': '50', 'about.m5.sym': 'M+', 'about.m5.desc': 'Revenue anual orquestado a través de nuestros sistemas.',
    'about.m6.num': '100', 'about.m6.sym': '%', 'about.m6.desc': 'Decisiones UX respaldadas exclusivamente por data real.',

    // ¿Por qué Flouvia?
    'about.liquid.badge': 'LA VENTAJA',
    'about.liquid.title': '¿Por qué Flouvia?',
    'about.liquid.desc': 'Tu facturación es demasiado grande para plantillas genéricas. Escalar requiere infraestructura empresarial, ingeniería real y decisiones basadas en datos.',

    // Reseñas
    'about.reviews.badge': 'TESTIMONIOS',
    'about.reviews.title': 'Lo que dicen',
    'about.reviews.title_ed': 'los fundadores.',
    'about.rev1.text': 'Flouvia nos construyó una máquina de ventas B2B. Redujeron el tiempo de procesamiento de 4 horas a 0. Automatización pura.',
    'about.rev1.author': 'Gerardo Miranda',
    'about.rev1.role': 'Director Comercial, El Zarco',
    'about.rev2.text': 'Migrar a una arquitectura Headless con ellos disparó nuestra conversión un 34% en el primer trimestre. La latencia simplemente desapareció.',
    'about.rev2.author': 'Diego Godoy',
    'about.rev2.role': 'CEO, Setnpet',

    // CTA
    'about.cta.badge': 'START NOW',
    'about.cta.title': '¿Listo para dominar',
    'about.cta.title_ed': 'tu mercado?',
    'about.cta.btn': 'Iniciar Arquitectura',
  },

  en: {
    // NAVBAR & GLOBALS
    'nav.work': 'WORK', 'nav.services': 'SERVICES', 'nav.about': 'ABOUT US',
    'nav.cases': 'CASES', 'nav.contact': 'CONTACT ↗', 'nav.login': 'LOGIN',
    
    // INICIO
    'hero.badge': 'PRIVATE GROWTH BOUTIQUE',
    'hero.title1': 'Digital architecture',
    'hero.title2': 'to scale operations.',
    'hero.desc': 'We build E-commerce and B2B ecosystems. We eliminate friction, automate inventories, and optimize conversion for leading brands.',
    'hero.cta': 'Schedule Audit',
    'tech.title': 'Our', 'tech.title_editorial': 'technology.',
    'tech.sub': 'We deploy corporate infrastructure with the most powerful tools in the digital ecosystem.',
    'proto.eyebrow': 'WORKING METHODOLOGY',
    'proto.title': 'Execution', 'proto.title_editorial': 'Protocol.',
    'proto.desc': 'We don\'t improvise. We apply a rigid data-driven framework to ensure secure deployments and scalable architecture.',

    // SERVICIOS
    'serv.hero.badge': 'CAPABILITIES CATALOG',
    'serv.hero.title1': 'Engineering for',
    'serv.hero.title2': 'high-impact brands.',
    'serv.hero.desc': 'We deploy transactional ecosystems designed under zero-latency and maximum conversion standards. We don\'t build sites, we develop digital assets that multiply your revenue.',
    'serv.why.badge': 'PHILOSOPHY',
    'serv.why.title': 'Frictionless',
    'serv.why.title_ed': 'Infrastructure.',
    'serv.why.1.title': 'Performance', 'serv.why.1.desc': 'Server-level optimization for instant loading.',
    'serv.why.2.title': 'Scalability', 'serv.why.2.desc': 'Modular code ready for global traffic.',
    'serv.why.3.title': 'Conversion', 'serv.why.3.desc': 'UX based on data and buying patterns.',
    'serv.why.btn': 'Schedule Diagnostics',
    'serv.sticky.btn': 'Start Architecture',
    
    'serv.1.cat': '01 — E-COMMERCE',
    'serv.1.title': 'E-Commerce Engineering.',
    'serv.1.desc': 'Robust architectures designed to dominate digital retail. We build front-ends that load in milliseconds, eliminating technical debt and maximizing Lifetime Value (LTV).',
    'serv.1.d1.t': 'Headless Architecture', 'serv.1.d1.d': 'Decoupling the front-end using React and Next.js for unbeatable loading speeds.',
    'serv.1.d2.t': 'Custom Native Themes', 'serv.1.d2.d': 'Deep Liquid programming in Shopify Plus for high-efficiency monolithic stores.',
    'serv.1.d3.t': 'Checkout Engineering', 'serv.1.d3.d': 'Checkout page modification to integrate native Upsell and Cross-sell flows.',
    'serv.1.d4.t': 'Enterprise Migration', 'serv.1.d4.d': 'Secure transitions from Magento or VTEX preserving data, SEO, and logic.',
    'serv.1.t1': 'Shopify Plus', 'serv.1.t2': 'Next.js / Hydrogen', 'serv.1.t3': 'Vercel',
    'serv.1.btn': 'Quote E-Commerce',

    'serv.2.cat': '02 — B2B ARCHITECTURE',
    'serv.2.title': 'Digital Wholesale.',
    'serv.2.desc': 'We digitize the complexity of wholesale. We build private B2B portals that automate your corporate rules, eliminating PDFs, Excel sheets, and human error.',
    'serv.2.d1.t': 'Closed Portals', 'serv.2.d1.d': 'Authenticated access systems exclusive to distributors with protected catalogs.',
    'serv.2.d2.t': 'Dynamic Rules', 'serv.2.d2.d': 'Volume pricing algorithms, net terms, and automated credit allocation.',
    'serv.2.d3.t': 'Quick-Order Systems', 'serv.2.d3.d': 'Agile re-ordering interfaces by SKU for massive purchases without friction.',
    'serv.2.d4.t': 'Multi-Warehouse Sync', 'serv.2.d4.d': 'Intelligent order routing based on real-time inventory availability.',
    'serv.2.t1': 'Shopify B2B', 'serv.2.t2': 'Custom APIs', 'serv.2.t3': 'ERP Connect',
    'serv.2.btn': 'Digitize B2B Operation',

    'serv.3.cat': '03 — AUTOMATION',
    'serv.3.title': 'Data Logistics.',
    'serv.3.desc': 'Your team shouldn\'t enter data manually. We orchestrate the information logistics between your E-commerce, your ERP, and your databases so they operate on autopilot.',
    'serv.3.d1.t': 'Native ERP Integration', 'serv.3.d1.d': 'Two-way connection with SAP, NetSuite, or Microsoft Dynamics via custom APIs.',
    'serv.3.d2.t': 'Database Architecture', 'serv.3.d2.d': 'Building command centers in Airtable for centralized operational control.',
    'serv.3.d3.t': 'Workflow Automation', 'serv.3.d3.d': 'Orchestrating complex processes using Make (Integromat) and native webhooks.',
    'serv.3.d4.t': 'Fulfillment Logistics', 'serv.3.d4.d': 'Automated connection with WMS systems and distribution centers (3PL).',
    'serv.3.t1': 'Make', 'serv.3.t2': 'Airtable', 'serv.3.t3': 'Webhooks / REST',
    'serv.3.btn': 'Automate Processes',

    'serv.4.cat': '04 — GROWTH',
    'serv.4.title': 'Conversion Rate Optimization.',
    'serv.4.desc': 'We audit your current infrastructure with data, not opinions. We pinpoint the exact bottlenecks and implement mathematical improvements to scale your conversion.',
    'serv.4.d1.t': 'Technical UX Audit', 'serv.4.d1.d': 'Forensic mapping of frictions in the purchase funnel and server performance.',
    'serv.4.d2.t': 'Continuous A/B Testing', 'serv.4.d2.d': 'Iterative testing on critical elements to guarantee an increase in AOV.',
    'serv.4.d3.t': 'Behavioral Analysis', 'serv.4.d3.d': 'Deployment of heatmaps and session recordings to validate design hypotheses.',
    'serv.4.d4.t': 'Advanced Retention', 'serv.4.d4.d': 'Engineering automation flows in Klaviyo to maximize repeat purchases.',
    'serv.4.t1': 'Klaviyo', 'serv.4.t2': 'Hotjar', 'serv.4.t3': 'Google Analytics 4',
    'serv.4.btn': 'Audit Conversion',

    'serv.choose.badge': 'THE FLOUVIA STANDARD',
    'serv.choose.title': 'Why they choose',
    'serv.choose.title_ed': 'our firm.',
    'serv.choose.1.title': 'Zero Technical Debt', 'serv.choose.1.desc': 'We don\'t use templates or fill your store with garbage apps. We write clean, modular code that allows the operation to scale without systems collapsing under pressure.',
    'serv.choose.2.title': 'Singular Expertise', 'serv.choose.2.desc': 'We don\'t do social media, we don\'t do branding campaigns. We are a firm exclusively obsessed with transactional architecture and conversion engineering.',
    'serv.choose.3.title': 'Predictive Methodology', 'serv.choose.3.desc': 'Our design and infrastructure decisions aren\'t based on aesthetic opinions; they are based on quantitative data analysis, user patterns, and performance metrics.',

    // ==========================================
    // NOSOTROS 
    // ==========================================

    // Hero
    'about.hero.badge': 'THE FIRM',
    'about.hero.title1': 'Systems design.',
    'about.hero.title2': 'Revenue engineering.',
    'about.hero.desc': 'We founded Flouvia with a single conviction: conventional design is obsolete. We build transactional architectures mathematically designed to generate revenue.',

    // Manifesto
    'about.manifesto.badge': 'THE MANIFESTO',
    'about.manifesto.title': 'Software over',
    'about.manifesto.title_ed': 'aesthetics.',
    'about.manifesto.p1': 'We strongly reject form without function. We are not a creative agency; we are engineers of digital ecosystems that generate measurable revenue.',
    'about.manifesto.p2': 'Our architecture is designed for zero latency and absolute conversion. Technology must generate revenue, not just design awards.',

    // Values
    'about.values.badge': 'CORPORATE DNA',
    'about.values.title': 'Our core',
    'about.values.title_ed': 'principles.',
    'about.v1.title': 'Radical Transparency',
    'about.v1.desc': 'Full access to our code, repositories, and the mathematical reasoning behind every decision we make.',
    'about.v2.title': 'Author Code',
    'about.v2.desc': 'We don\'t outsource. Every line pushed to production is audited by senior architects to guarantee zero latency.',
    'about.v3.title': 'Relentless ROI',
    'about.v3.desc': 'We measure success by the exact increase in your Conversion Rate (CR) and Average Order Value (AOV).',

    // Metrics
    'about.metrics.badge': 'OUR IMPACT',
    'about.metrics.title': 'Quantifiable',
    'about.metrics.title_ed': 'results.',
    'about.m1.num': '0', 'about.m1.sym': 'ms', 'about.m1.desc': 'Tolerance for technical debt. Pure native code, no patches.',
    'about.m2.num': '99', 'about.m2.sym': '.9%', 'about.m2.desc': 'Guaranteed uptime in Headless infrastructures.',
    'about.m3.num': '34', 'about.m3.sym': '%', 'about.m3.desc': 'Average documented increase in Conversion Rate.',
    'about.m4.num': '10', 'about.m4.sym': '+', 'about.m4.desc': 'ERP systems (SAP/NetSuite) integrated in real time.',
    'about.m5.num': '50', 'about.m5.sym': 'M+', 'about.m5.desc': 'Annual revenue orchestrated through our systems.',
    'about.m6.num': '100', 'about.m6.sym': '%', 'about.m6.desc': 'UX decisions backed exclusively by real data.',

    // Why Flouvia
    'about.liquid.badge': 'THE ADVANTAGE',
    'about.liquid.title': 'Why Flouvia?',
    'about.liquid.desc': 'Your revenue is too big for generic templates. Scaling requires enterprise-grade infrastructure, real engineering, and data-driven decisions.',

    // Reviews
    'about.reviews.badge': 'TESTIMONIALS',
    'about.reviews.title': 'What founders',
    'about.reviews.title_ed': 'say.',
    'about.rev1.text': 'Flouvia didn\'t build us a website, they built a B2B sales machine. They reduced our processing time from 4 hours to zero. Pure automation.',
    'about.rev1.author': 'Gerardo Miranda',
    'about.rev1.role': 'Commercial Director, El Zarco',
    'about.rev2.text': 'Migrating to a Headless architecture with them skyrocketed our conversion by 34% in the first quarter. The latency simply disappeared.',
    'about.rev2.author': 'Diego Godoy',
    'about.rev2.role': 'CEO, Setnpet',

    // CTA
    'about.cta.badge': 'START NOW',
    'about.cta.title': 'Ready to dominate',
    'about.cta.title_ed': 'your market?',
    'about.cta.btn': 'Start Architecture',
  },
} as const;