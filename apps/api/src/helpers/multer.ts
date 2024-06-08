// import { Request } from 'express';
// import multer from 'multer';
// import { join } from 'path';
// import path = require('path');
// import { FileFilterCallback } from 'multer';
// type DestinationCallback = (error: Error | null, destination: string) => void;
// type FileNameCallback = (error: Error | null, filename: string) => void;
// type FilterCallback = (error: Error | null, valid: Boolean) => void;

// export const uploader = (filePrefix: string, folderName?: string) => {
//   try {
//     const defaultDir = join(__dirname, '../public');

//     const storage = multer.diskStorage({
//       destination: (
//         req: Request,
//         file: Express.Multer.File,
//         cb: DestinationCallback,
//       ) => {
//         const destination = folderName ? defaultDir + folderName : defaultDir;
//         cb(null, destination);
//       },
//       filename: (
//         req: Request,
//         file: Express.Multer.File,
//         cb: FileNameCallback,
//       ) => {
//         const originalNameParts = file.originalname.split('.');
//         console.log(originalNameParts);
//         const fileExtension = originalNameParts[originalNameParts.length - 1];
//         const newFileName = filePrefix + Date.now() + '.' + fileExtension;

//         cb(null, newFileName);
//       },
//     });

//     const filter = (
//       req: Request,
//       file: Express.Multer.File,
//       cb: FileFilterCallback,
//     ) => {
//       try {
//         const extension = path.extname(file.originalname);
//         console.log(extension);
//         if (extension !== '.png' && extension !== '.jpg') {
//           cb(new Error('Extension type is invalid'));
//         }
//         cb(null, true);
//       } catch (err) {
//         throw err;
//       }
//     };

//     return multer({
//       storage: storage,
//       fileFilter: filter,
//       limits: { fileSize: 1024 * 1024 },
//     });
//   } catch (err) {
//     throw err;
//   }
// };
