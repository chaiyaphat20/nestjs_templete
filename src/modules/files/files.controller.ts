import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from '../../common/pipes/file-validation.pipe';

@Controller('files')
export class FilesController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new FileValidationPipe({
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
      }),
    )
    file: Express.Multer.File,
  ) {
    return {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };
  }
}
