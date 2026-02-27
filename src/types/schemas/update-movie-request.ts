import { Languages } from '../enums/languages.enum.js';
import { z } from 'zod';

export const UpdateMovieRequestSchema = z
  .object({
    originalTitle: z.string().nonempty(),
    englishTitle: z.string().nonempty(),
    coverImage: z.string().nonempty(),
    duration: z.number().int().positive(),
    isHybrid: z.boolean(),
    language: z.enum(Languages),
    originalSynopsis: z.string().nonempty(),
    englishSynopsis: z.string().nonempty(),
    creativeProcess: z.string().nonempty(),
    iaTools: z.string().nonempty(),
    hasSubs: z.boolean(),
    srt: z.string().nonempty(),
    status: z.enum(['draft', 'published', 'archived']),
  })
  .partial();

export type UpdateEventRequest = z.infer<typeof UpdateMovieRequestSchema>;
