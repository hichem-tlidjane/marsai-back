import z from 'zod';
import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
} from '../../helpers/upload-const.js';
import { getVideoDurationInSeconds } from 'get-video-duration';
import { Languages } from '../enums/languages.enum.js';

const parseJson = (value: unknown, ctx: z.RefinementCtx) => {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as object;
    } catch (e) {
      ctx.addIssue({
        code: 'custom',
        message: (e as Error).message,
      });
      return z.NEVER;
    }
  }
  return value;
};

const ImageFileSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  mimetype: z.enum(ALLOWED_IMAGE_TYPES),
  size: z
    .number()
    .max(MAX_IMAGE_SIZE, { message: 'File size must be less than 15MB.' }),
  path: z.string(),
});

const VideoFileSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  mimetype: z.enum(ALLOWED_VIDEO_TYPES),
  size: z
    .number()
    .max(MAX_VIDEO_SIZE, { message: 'File size must be less than 300MB.' }),
  path: z.string(),
});

const DirectorSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  gender: z.string(),
  email: z.email(),
  job: z.string(),
  address: z.string(),
  zipcode: z.string().nullable().default(null),
  city: z.string(),
  region: z.string().nullable().default(null),
  country: z.string(),
  phone: z.string(),
  birthdate: z.string(),
  facebookUrl: z.string().nullable().default(null),
  instagramUrl: z.string().nullable().default(null),
  youtubeUrl: z.string().nullable().default(null),
  twitterUrl: z.string().nullable().default(null),
  linkedinUrl: z.string().nullable().default(null),
});

export type Director = z.infer<typeof DirectorSchema>;

const CollaboratorsSchema = z.object({
  gender: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  contribution: z.string(),
  email: z.email(),
});

export type Collaborator = z.infer<typeof CollaboratorsSchema>;

export const MovieRequestSchema = z
  .object({
    originalTitle: z.string().min(1).max(255),
    englishTitle: z.string().min(1).max(255),
    video: z.array(VideoFileSchema).nonempty(),
    coverImage: z.array(ImageFileSchema).nonempty(),
    stillImageA: z.array(ImageFileSchema).nullish(),
    stillImageB: z.array(ImageFileSchema).nullish(),
    stillImageC: z.array(ImageFileSchema).nullish(),
    // duration: z.coerce.number().int().positive().max(90),
    isHybrid: z.coerce.boolean().default(false),
    language: z.enum(Languages),
    originalSynopsis: z.string().min(1).max(300),
    englishSynopsis: z.string().min(1).max(300),
    creativeProcess: z.string().min(1).max(300),
    aiTools: z.string().min(1).max(300),
    hasSubs: z.coerce.boolean(),
    director: z.preprocess(parseJson, DirectorSchema),
    collaborators: z.preprocess(parseJson, z.array(CollaboratorsSchema)),
  })
  .transform(async (data, ctx) => {
    const {
      coverImage,
      video,
      stillImageA,
      stillImageB,
      stillImageC,
      ...rest
    } = data;

    const duration = await getVideoDurationInSeconds(video[0]!.path);

    if (duration > 90) {
      ctx.addIssue({
        code: 'custom',
        message: 'Video cannot be longer than 90 seconds.',
        path: ['video'],
      });
      return z.NEVER;
    }

    const stillsPath = [stillImageA, stillImageB, stillImageC]
      .map((fileArray) => fileArray?.[0]?.path)
      .filter((path): path is string => !!path);

    return {
      ...rest,
      videoPath: video[0]!.path,
      duration,
      coverPath: coverImage[0]!.path,
      stillsPath,
    };
  });

export type MovieRequest = z.infer<typeof MovieRequestSchema>;
