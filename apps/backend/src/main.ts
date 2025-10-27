import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 啟用 CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    credentials: true,
  });

  // 啟用全域驗證管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 設定全域前綴
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 應用程式運行於: http://localhost:${port}`);
  console.log(`📚 API 文件: http://localhost:${port}/api`);
}

bootstrap();

