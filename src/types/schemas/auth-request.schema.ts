import z from 'zod';

export const AuthRequestSchema = z.object({
  email: z.email(),
  password: z.string().nonempty(),
});

export type AuthRequest = z.infer<typeof AuthRequestSchema>;
