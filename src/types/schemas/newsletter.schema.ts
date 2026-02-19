import z from 'zod';

export const NewsletterRequestSchema = z.object({
  object: z.string(),
  content: z.string(),
  sendAt: z.coerce.date().nullable().default(null),
});

export type NewsletterRequest = z.infer<typeof NewsletterRequestSchema>;
