import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodError, ZodType } from 'zod';
import { removeUploads } from '../helpers/remove-uploads.js';

export const validate =
  (schema: ZodType): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataToValidate: Record<string, unknown> = {
        ...(req.body as Record<string, unknown>),
        ...((req.files as Record<string, unknown>) || {}),
      };
      req.body = await schema.parseAsync(dataToValidate);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        removeUploads(req);
        return res.status(400).json({
          message: 'Validation failed',
          errors: error.issues,
        });
      }
      next(error);
    }
  };
