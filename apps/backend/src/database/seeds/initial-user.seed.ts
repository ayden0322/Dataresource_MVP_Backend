import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { UserRole } from 'shared';
import * as bcrypt from 'bcrypt';

export async function seedInitialUser(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);

  // 檢查是否已存在超級管理員
  const existingAdmin = await userRepository.findOne({
    where: { role: UserRole.SUPER_ADMIN },
  });

  if (existingAdmin) {
    console.log('✅ 超級管理員已存在，跳過建立');
    return;
  }

  // 建立預設超級管理員
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('admin123456', salt);

  const admin = userRepository.create({
    email: 'admin@example.com',
    password: hashedPassword,
    name: '系統管理員',
    role: UserRole.SUPER_ADMIN,
    isActive: true,
  });

  await userRepository.save(admin);

  console.log('✅ 預設超級管理員已建立');
  console.log('   Email: admin@example.com');
  console.log('   Password: admin123456');
  console.log('   ⚠️  請記得修改預設密碼！');
}

