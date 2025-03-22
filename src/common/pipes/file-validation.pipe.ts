import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

//validate file ก่อน controller method ทำงาน
//1.Request เข้ามาที่ NestJS Application
//2.FileInterceptor ทำงานก่อน
//3.FileValidationPipe ทำงาน
//4.Controller Method ทำงาน

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(
    private options: {
      maxSize?: number;
      allowedMimeTypes?: string[]; // 'image/jpeg', 'application/pdf'
    },
  ) {}

  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (this.options.allowedMimeTypes && !this.options.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type not allowed. Allowed types: ${this.options.allowedMimeTypes.join(', ')}`,
      );
    }

    if (this.options.maxSize && file.size > this.options.maxSize) {
      const maxSizeMB = this.options.maxSize / (1024 * 1024);
      throw new BadRequestException(`File too large. Maximum size allowed is ${maxSizeMB} MB`);
    }

    return file;
  }
}
