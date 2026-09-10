// Ediciones del sitio — archivo del estilo visual de Flouvia.
// Cada año se rediseña el sitio desde cero; la versión anterior se congela como
// un deploy inmutable propio (ver docs/experience/editions.md).
//
// Fuente de verdad única: la consumen /ediciones, /ediciones/[slug] y sus
// espejos en /en. Orden DESCENDENTE por año (próxima arriba).
//
// La edición 2026 es el punto de partida del sistema.

export type EditionStatus = 'upcoming' | 'current' | 'archive';

export interface Edition {
  /** Año y slug de ruta: /ediciones/2026 */
  slug: string;
  year: string;
  name: { es: string; en: string };
  status: EditionStatus;
  /** Una línea para el índice */
  summary: { es: string; en: string };
  /** Rasgos de la edición — chips en el detalle */
  traits: { es: string[]; en: string[] };
  /** Nota larga del detalle */
  body: { es: string; en: string };
  /** Tag de git que congela la edición (se crea al cerrarla). */
  tag?: string;
  /** Fecha en que se congeló (ISO). Solo ediciones 'archive'. */
  frozenAt?: string;
  /** Deploy inmutable de la edición congelada (subdominio propio). */
  snapshotUrl?: string;
  /** Color de acento del status */
  accent: string;
}

export const EDITIONS: Edition[] = [
  {
    slug: '2027',
    year: '2027',
    name: { es: 'Sin título', en: 'Untitled' },
    status: 'upcoming',
    summary: {
      es: 'La próxima edición. En diseño ahora mismo.',
      en: 'The next edition. In design right now.',
    },
    traits: {
      es: ['Por definir'],
      en: ['To be defined'],
    },
    body: {
      es: 'Dirección aún abierta. Cuando quede fijada, esta edición reemplaza a la vigente y la de 2026 se congela en su propio deploy.',
      en: 'Direction still open. Once locked, this edition replaces the current one and 2026 is frozen on its own deployment.',
    },
    accent: '#8a94a6',
  },
  {
    slug: '2026',
    year: '2026',
    name: { es: 'Editorial Luxury', en: 'Editorial Luxury' },
    status: 'current',
    summary: {
      es: 'Vidrio líquido, tipografía Inter, movimiento contenido.',
      en: 'Liquid glass, Inter type, restrained motion.',
    },
    traits: {
      es: ['Liquid Glass', 'Inter', 'GSAP · power2.out', 'Navy #0a192f'],
      en: ['Liquid Glass', 'Inter', 'GSAP · power2.out', 'Navy #0a192f'],
    },
    body: {
      es: 'El punto de partida del archivo y la edición que estás viendo. Superficies de vidrio translúcido con blur, tipografía Inter en todo el sitio, movimiento sobrio (fade + subida leve, sin drama) y navy #0a192f como color ancla.',
      en: 'The starting point of the archive and the edition you are looking at. Translucent glass surfaces with blur, Inter across the whole site, restrained motion (fade + slight rise, no drama) and navy #0a192f as the anchor color.',
    },
    tag: 'edition-2026',
    accent: '#1f9d5b',
  },
];

export const getEdition = (slug: string): Edition | undefined =>
  EDITIONS.find((e) => e.slug === slug);
