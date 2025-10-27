import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 建立使用者
  async create(createUserDto: CreateUserDto): Promise<User> {
    // 檢查 Email 是否已存在
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('此 Email 已被註冊');
    }

    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  // 取得所有使用者
  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      select: ['id', 'email', 'name', 'role', 'isActive', 'createdAt', 'updatedAt'],
    });
  }

  // 根據 ID 取得使用者
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'name', 'role', 'isActive', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new NotFoundException('找不到該使用者');
    }

    return user;
  }

  // 根據 Email 取得使用者（包含密碼，用於登入驗證）
  async findByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  // 更新使用者
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  // 刪除使用者（軟刪除：設為不活躍）
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    user.isActive = false;
    await this.userRepository.save(user);
  }

  // 永久刪除使用者
  async hardRemove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}

