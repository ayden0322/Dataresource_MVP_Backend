import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { UserRole } from 'shared';

export async function seedInitialUser(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);

  // 根據環境決定使用的 Email
  const env = process.env.NODE_ENV || 'development';
  let adminEmail: string;
  let adminName: string;

  switch (env) {
    case 'production':
      adminEmail = 's1002618@gmail.com';
      adminName = 'Ayden (Production)';
      break;
    case 'staging':
    case 'test':
      adminEmail = 's1002618dev@gmail.com';
      adminName = 'Ayden (Dev)';
      break;
    default: // development
      adminEmail = 's1002618local@gmail.com';
      adminName = 'Ayden (Local)';
  }

  // 檢查是否已存在此 Email 的使用者
  const existingUser = await userRepository.findOne({
    where: { email: adminEmail },
  });

  if (existingUser) {
    console.log(`✅ 使用者 ${adminEmail} 已存在，跳過建立`);
    console.log(`   環境: ${env}`);
    return;
  }

  // 建立預設超級管理員
  // 注意：不要在這裡手動加密密碼，讓 Entity 的 @BeforeInsert() hook 處理
  const admin = userRepository.create({
    email: adminEmail,
    password: '52065301', // 未加密的密碼，將由 Entity hook 自動加密
    name: adminName,
    role: UserRole.SUPER_ADMIN,
    isActive: true,
  });

  await userRepository.save(admin);

  console.log('✅ 預設超級管理員已建立');
  console.log(`   環境: ${env}`);
  console.log(`   Email: ${adminEmail}`);
  console.log('   Password: 52065301');
  console.log('   ⚠️  請記得修改預設密碼！');
}

