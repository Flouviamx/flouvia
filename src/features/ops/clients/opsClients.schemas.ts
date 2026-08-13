import { z } from 'zod';

export const updateOpsClientProfileSchema = z.object({
  version: z.number().int().positive(),
  companyName: z.string().trim().min(1).max(160),
  activePlan: z.string().trim().min(1).max(80),
  locale: z.string().trim().min(2).max(20),
  timezone: z.string().trim().min(3).max(80),
  reason: z.string().trim().min(3).max(500).optional(),
}).strict();
