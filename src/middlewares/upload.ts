import type { Request, RequestHandler } from 'express';
import multer, { type FileFilterCallback } from 'multer';
import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  MAX_SIZE,
} from '../helpers/upload-const.js';

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1],
    );
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  if (
    ['coverImage', 'stillImageA', 'stillImageB', 'stillImageC'].includes(
      file.fieldname,
    )
  ) {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid image format for ${file.fieldname}. Allowed: .jpg, .png, .webp`,
        ),
      );
    }
  } else if ('video'.includes(file.fieldname)) {
    if (ALLOWED_VIDEO_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid video format for ${file.fieldname}. Allowed: .mp4, .mkv`,
        ),
      );
    }
  } else {
    cb(new Error(`Unexpected field: ${file.fieldname}`));
  }
};

const uploadConfig = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter,
});

export const upload: RequestHandler = (req, res, next) => {
  const uploadMiddleware = uploadConfig.fields([
    { name: 'video', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
    { name: 'stillImageA', maxCount: 1 },
    { name: 'stillImageB', maxCount: 1 },
    { name: 'stillImageC', maxCount: 1 },
  ]);

  uploadMiddleware(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `Upload Error: ${err.message}` });
    } else if (err) {
      next(err);
    }
    next();
  });
};
