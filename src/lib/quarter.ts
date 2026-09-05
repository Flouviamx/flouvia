// src/lib/quarter.ts
// Trimestre "activo" para las señales de cupo del sitio (slot card de /casos).
// Se adelanta 1 mes: durante el último mes de un trimestre ya se anuncia el
// siguiente. dic → Q1 (año +1) · mar → Q2 · jun → Q3 · sep → Q4.
//
// Se resuelve en build (cada deploy queda correcto) y se corrige en cliente con
// un script inline para las visitas entre deploys — ver PlantillaCasos.astro.

export interface ActiveQuarter {
  q: 1 | 2 | 3 | 4;
  year: number;
}

export function activeQuarter(now: Date = new Date()): ActiveQuarter {
  const shifted = now.getMonth() + 1; // adelanto de 1 mes: 0-11 → 1-12
  const q = (Math.floor((shifted % 12) / 3) + 1) as 1 | 2 | 3 | 4;
  const year = now.getFullYear() + (shifted >= 12 ? 1 : 0);
  return { q, year };
}

export function quarterLabel(now?: Date): string {
  return `Q${activeQuarter(now).q}`;
}
