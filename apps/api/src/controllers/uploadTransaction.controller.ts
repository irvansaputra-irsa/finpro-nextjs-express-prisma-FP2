import { Request, Response, NextFunction } from 'express';
import { Service } from 'typedi';
import { UploadService } from '@/services/uploadTransaction.services';

@Service()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  public uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const file = await this.uploadService.handleFileUpload(req);
      res.status(200).json({
        message: 'File uploaded successfully!',
        file: file,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  };
}
