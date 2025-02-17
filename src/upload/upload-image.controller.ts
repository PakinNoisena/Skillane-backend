import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImageService } from './upload-image.service';
import { FileUploadInterceptor } from 'src/interceptors/file-upload.interceptor';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';

@Controller('upload')
export class UploadImageController {
  constructor(private readonly cloudinaryService: UploadImageService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileUploadInterceptor.getInterceptor())
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.cloudinaryService.uploadImage(file);
  }
}
