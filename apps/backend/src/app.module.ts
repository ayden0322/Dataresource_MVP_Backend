import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
      useFactory: () => {
        const config: any = {
          type: 'postgres',
          url: process.env.DATABASE_URL,
          autoLoadEntities: true,  // 讓 NestJS 自動載入 entities
          synchronize: false,
          logging: process.env.NODE_ENV === 'development',
        };

        // SSL 配置: 根據環境變數決定是否使用 SSL
        if (process.env.DATABASE_SSL === 'true') {
          config.ssl = {
            rejectUnauthorized: false,
          };
        } else {
          config.ssl = false;
        }

        return config;
      },
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

