import z from 'zod';

export const CreateEventRequestSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().optional().default(''),
  date: z.coerce.date(),
  publishedAt: z.coerce.date(),
  duration: z.int().positive(),
  location: z.string().max(255),
});

export type CreateEventRequest = z.infer<typeof CreateEventRequestSchema>;
