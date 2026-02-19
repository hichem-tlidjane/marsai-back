import z from 'zod';

export const BookingRequestSchema = z.object({
  eventId: z.number().int().positive(),
  firstname: z.string().nonempty(),
  lastname: z.string().nonempty(),
  email: z.string().email(),
});

export type BookingRequest = z.infer<typeof BookingRequestSchema>;
