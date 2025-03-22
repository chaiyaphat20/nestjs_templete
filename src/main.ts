import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpResponseInterceptor } from './common/interceptors/http-exception.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // ตั้งค่า global prefix
  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port', 3000);

  //เพิ่ม validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //ลบข้อมูลที่ไม่ได้ระบุใน DTO
      forbidNonWhitelisted: true, //ส่ง error เมื่อมีข้อมูลที่ไม่ได้ระบุใน DTO
      transform: true, //แปลงข้อมูลให้ตรงกับ DTO โดยอัตโนมัติ
    }),
  );

  // เพิ่ม ClassSerializer เพื่อให้ @Exclude() ทำงานได้
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new HttpResponseInterceptor());
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port, () => {
    console.log(`server running on http://localhost:${port}`);
  });
}
bootstrap();
