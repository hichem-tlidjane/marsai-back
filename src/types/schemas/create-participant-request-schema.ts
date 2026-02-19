import z from 'zod';

export const CreateParticipantRequestSchema = z.object({
  firstname: z.string().nonempty(),
  lastname: z.string().nonempty(),
  email: z.email().nonempty(),
});

export type CreateParticipantRequest = z.infer<
  typeof CreateParticipantRequestSchema
>;
