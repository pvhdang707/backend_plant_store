import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // CẤU HÌNH CORS CHO PHÉP FRONTEND KẾT NỐI
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'], // Địa chỉ của Frontend ReactJS
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Cho phép đính kèm cookie hoặc token xác thực
  });

  // kích hoạt validation global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // tự động loại bỏ các trường không có trong DTO
      forbidNonWhitelisted: true, // báo lỗi nếu client cố tình gửi trường không hợp lệ
      transform: true, // tự dộng ép kiểu dữ liệu cho khớp DTO
    }),
  );
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: 'uploads/', //khi url có chữ /uploads/ thì trỏ vào thư mục này
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
