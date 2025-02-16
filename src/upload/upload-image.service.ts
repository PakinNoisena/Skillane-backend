import { Injectable, Inject } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { MulterFile } from 'src/config/mutler.config';

@Injectable()
export class UploadImageService {
  constructor(@Inject('CLOUDINARY') private cloudinary) {}

  async uploadImage(file: MulterFile): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'skillane',
            resource_type: 'auto',
          },
          (error, result) => {
            if (error || !result) {
              return reject(
                error || new Error('Upload failed: No result returned'),
              );
            }
            resolve(result);
          },
        )
        .end(file.buffer);
    });
  }
}
