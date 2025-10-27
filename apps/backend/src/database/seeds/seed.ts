import AppDataSource from '../../config/typeorm.config';
import { seedInitialUser } from './initial-user.seed';

async function runSeeds() {
  console.log('🌱 開始執行資料庫 Seed...');

  try {
    // 初始化資料來源
    await AppDataSource.initialize();
    console.log('✅ 資料庫連線成功');

    // 執行 Seeds
    await seedInitialUser(AppDataSource);

    console.log('✅ 所有 Seed 執行完成');
  } catch (error) {
    console.error('❌ Seed 執行失敗:', error);
  } finally {
    await AppDataSource.destroy();
    console.log('👋 資料庫連線已關閉');
  }
}

runSeeds();

