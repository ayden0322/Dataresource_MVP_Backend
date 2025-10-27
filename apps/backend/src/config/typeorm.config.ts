import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

// 載入環境變數
dotenv.config();

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgresql://admin:password123@localhost:5432/vendor_assessment',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  synchronize: false, // 使用 migration，關閉自動同步
  logging: process.env.NODE_ENV === 'development',
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
};

// 匯出 DataSource 供 TypeORM CLI 使用
const AppDataSource = new DataSource(typeOrmConfig);

export default AppDataSource;

