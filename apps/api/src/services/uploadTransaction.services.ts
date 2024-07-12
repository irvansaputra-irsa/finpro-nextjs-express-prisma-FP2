import multer from 'multer';
import path, { join } from 'path';
import { Service } from 'typedi';
import { Request } from 'express';
import { UploadedFile } from '@/interfaces/uploadTransaction.interfaces';
const defaultDir = join(__dirname, '../public');
const storage = multer.diskStorage({
  destination: defaultDir + '/uploads',
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname),
    );
  },
});

const upload = multer({
  storage: storage,
}).single('myFile');

@Service()
export class UploadService {
  public handleFileUpload(req: Request): Promise<UploadedFile> {
    return new Promise((resolve, reject) => {
      upload(req, null, (err: any) => {
        if (err) {
          return reject(err);
        }
        if (!req.file) {
          return reject(new Error('No file selected!'));
        }
        resolve({
          filename: req.file.filename,
          path: req.file.path,
        });
      });
    });
  }
}
