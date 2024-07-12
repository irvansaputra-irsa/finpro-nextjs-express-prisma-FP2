import { Request } from 'express';
import multer from 'multer';
import { join } from 'path';
import uniqid from 'uniqid';
import path = require('path');
import { FileFilterCallback } from 'multer';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;
export const uploader = (filePrefix: string, folderName?: string) => {
  try {
    const defaultDir = join(__dirname, '../public'); //destination tempat penyimpanan //dirname tempat lokasi file ini ada dimana

    const storage = multer.diskStorage({
      destination: (
        req: Request,
        file: Express.Multer.File,
        cb: DestinationCallback,
      ) => {
        const destination = folderName ? defaultDir + folderName : defaultDir;
        cb(null, destination);
      },
      filename: (
        req: Request,
        file: Express.Multer.File,
        cb: FileNameCallback,
      ) => {
        const originalNameParts = file.originalname.split('.');
        const fileExtension = originalNameParts[originalNameParts.length - 1];
        const newFileName = filePrefix + uniqid() + '.' + fileExtension;

        cb(null, newFileName);
      },
    });

    const filter = (
      req: Request,
      file: Express.Multer.File,
      cb: FileFilterCallback,
    ) => {
      try {
        const extensionFormat = ['.jpg', '.png', '.jpeg', '.gif'];
        const extension = path.extname(file.originalname);
        if (!extensionFormat.includes(extension)) {
          cb(new Error('Invalid file type'));
        }
        cb(null, true);
      } catch (error) {
        throw error;
      }
    };

    return multer({
      storage,
      fileFilter: filter,
      // limits: { fileSize: 1024 * 1024 },
    });
  } catch (error) {
    throw error;
  }
};
