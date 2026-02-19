import z from 'zod';

export const SubscriberRequestSchema = z.object({
  email: z.email(),
});

export type SubscriberRequest = z.infer<typeof SubscriberRequestSchema>;
