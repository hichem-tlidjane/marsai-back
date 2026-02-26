import z from 'zod';

export const SubscriberRequestSchema = z.object({
  email: z.email(),
});

export type SubscriberRequest = z.infer<typeof SubscriberRequestSchema>;

export const UnsubscribeRequestSchema = z.object({
  token: z.string(),
});

export type UnubscribeRequest = z.infer<typeof UnsubscribeRequestSchema>;
