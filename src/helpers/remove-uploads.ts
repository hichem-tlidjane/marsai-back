import type { Request } from 'express';
import fs from 'fs';

export const removeUploads = (req: Request): void => {
  if (req.files) {
    Object.values(req.files).forEach((fileArray: Express.Multer.File[]) => {
      fileArray.forEach((file) => {
        if (file.path) {
          fs.unlink(file.path, (err) => {
            if (err) console.error(`Failed to delete file: ${file.path}`, err);
          });
        }
      });
    });
  }
};
