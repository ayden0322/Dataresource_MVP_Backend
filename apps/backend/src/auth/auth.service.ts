import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from 'shared';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // 驗證使用者
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (!user || !user.isActive) {
      return null;
    }

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      return null;
    }

    const { password: _, ...result } = user;
    return result;
  }

  // 登入
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Email 或密碼錯誤');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  // 註冊（僅供 SuperAdmin 使用）
  async register(registerDto: RegisterDto) {
    try {
      const user = await this.usersService.create({
        ...registerDto,
        role: UserRole.ADMIN, // 預設為 ADMIN
      });

      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error('註冊失敗');
    }
  }

  // 取得目前使用者資訊
  async getProfile(userId: string) {
    return await this.usersService.findOne(userId);
  }
}

