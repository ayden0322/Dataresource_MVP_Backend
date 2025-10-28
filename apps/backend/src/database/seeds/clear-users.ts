import AppDataSource from '../../config/typeorm.config';

/**
 * 清理所有使用者
 * 用於重新執行 seed 之前清空 users 資料表
 *
 * 使用方式:
 * pnpm --filter backend run clear-users
 */
async function clearUsers() {
  console.log('🗑️  開始清理使用者資料...');

  try {
    // 初始化資料來源
    await AppDataSource.initialize();
    console.log('✅ 資料庫連線成功');

    // 清空 users 資料表
    const result = await AppDataSource.query('DELETE FROM users');

    console.log('✅ 已清空所有使用者');
    console.log(`   刪除了 ${result[1] || 0} 筆資料`);

  } catch (error) {
    console.error('❌ 清理失敗:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
    console.log('👋 資料庫連線已關閉');
  }
}

clearUsers();
