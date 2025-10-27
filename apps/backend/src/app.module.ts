import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './config/typeorm.config';
import configuration from './config/configuration';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { UploadsModule } from './uploads/uploads.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    // 環境變數配置
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
    }),

    // TypeORM 資料庫配置
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        autoLoadEntities: true,  // 讓 NestJS 自動載入 entities
        synchronize: false,
        logging: process.env.NODE_ENV === 'development',
        ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
      }),
    }),

    // 功能模組
    UsersModule,
    AuthModule,
    ProjectsModule,
    UploadsModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

