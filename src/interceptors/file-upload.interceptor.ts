import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';
import * as multer from 'multer';

@Injectable()
export class FileUploadInterceptor implements NestInterceptor {
  private static readonly fileSizeLimit = 5 * 1024 * 1024; // 5MB
  private static readonly allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/jpg',
  ];

  static getInterceptor() {
    return FileInterceptor('file', {
      limits: { fileSize: this.fileSizeLimit },
      fileFilter: (req, file, callback) => {
        if (!this.allowedMimeTypes.includes(file.mimetype)) {
          return callback(
            new BadRequestException(
              'Only image files (JPG, JPEG, PNG) are allowed!',
            ),
            false,
          );
        }
        callback(null, true);
      },
    });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle();
  }
}
