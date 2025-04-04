import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import 'module-alias/register';
import { AppDataSource } from '../ormconfig';
import { AppModule } from './app.module';
import * as session from 'express-session'; // Thêm import express-session

// Lý do: Đặt tên hàm bootstrap là async nên cần xử lý lỗi bằng try-catch để tránh crash ứng dụng
async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    await AppDataSource.initialize(); // Initialize the DataSource

    // Cải tiến tốc độ: Chỉ khởi tạo CORS nếu thực sự cần, có thể dùng biến môi trường để bật/tắt
    const enableCors = process.env.ENABLE_CORS === 'true'; // Thêm vào .env: ENABLE_CORS=true
    if (enableCors) {
      app.enableCors({
        // origin: [
        //   'http://localhost:3000', // Cổng mặc định của React, cho phép gọi API từ React App
        //   'http://localhost:3001',
        //   'http://localhost:4200',
        // ],
        origin: true, // Cho phép tất cả các domain
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
        allowedHeaders: 'Content-Type, Accept, Authorization',
      });
    }

    // Thêm middleware express-session
    app.use(
      session({
        secret: process.env.JWT_SECRET || 'mysecretkey', // Dùng JWT_SECRET làm session secret
        resave: false, // Không lưu lại session nếu không có thay đổi
        saveUninitialized: false, // Không tạo session cho request không xác thực
        cookie: {
          secure: false, // Đặt true khi dùng HTTPS trong production
          maxAge: 24 * 60 * 60 * 1000, // Session hết hạn sau 24 giờ
        },
      }),
    );

    // ✅ Thêm ValidationPipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Xóa các field không có trong DTO
        forbidNonWhitelisted: true, // Nếu có field lạ => báo lỗi
        transform: true, // Tự động chuyển đổi kiểu dữ liệu
      }),
    );

    const port = process.env.PORT ?? 4200; // Gán biến port để tái sử dụng
    await app.listen(port);

    // Lý do: Thông báo sau khi listen thành công để tránh báo sai trạng thái
    console.log(`Application is running on: http://localhost:${port}`);
  } catch (error) {
    // Lý do: Xử lý lỗi khởi tạo ứng dụng để ghi log và thoát an toàn
    console.error('Error during application bootstrap:', error);
    process.exit(1);
  }
}
bootstrap();
