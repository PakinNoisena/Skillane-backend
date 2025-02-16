import { Module } from '@nestjs/common';
import { UploadImageService } from './upload-image.service';
import { UploadImageController } from './upload-image.controller';
import { CloudinaryProvider } from 'src/config/cloudinary.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [UploadImageController],
  providers: [UploadImageService, CloudinaryProvider],
})
export class UploadImageModule {}
