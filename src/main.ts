import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // kích hoạt validation global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // tự động loại bỏ các trường không có trong DTO
      forbidNonWhitelisted: true, // báo lỗi nếu client cố tình gửi trường không hợp lệ
      transform: true, // tự dộng ép kiểu dữ liệu cho khớp DTO
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
