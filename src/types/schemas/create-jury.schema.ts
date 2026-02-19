import z from 'zod';

const JurySchema = z.object({
  email: z.email(),
  firstname: z.string(),
  lastname: z.string(),
});

export type JuryRequest = z.infer<typeof JurySchema>;

export const CreateJurySchema = z.object({
  juries: z.array(JurySchema).nonempty(),
});

export type CreateJury = z.infer<typeof CreateJurySchema>;
