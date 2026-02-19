import { z } from 'zod';
export const UpdateEventRequestSchema = z
  .object({
    title: z.string().nonempty(),
    description: z.string().optional().default(''),
    status: z.enum(['ongoing', 'upcoming', 'canceled']),
    date: z.coerce.date(),
    publishedAt: z.coerce.date(),
    duration: z.int().positive(),
    location: z.string().max(255),
  })
  .partial();

export type UpdateEventRequest = z.infer<typeof UpdateEventRequestSchema>;
