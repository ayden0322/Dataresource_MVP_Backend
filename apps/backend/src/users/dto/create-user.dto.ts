import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from 'shared';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email 格式不正確' })
  email: string;

  @IsString()
  @MinLength(6, { message: '密碼至少需要 6 個字元' })
  password: string;

  @IsString()
  @MinLength(2, { message: '名稱至少需要 2 個字元' })
  name: string;

  @IsEnum(UserRole, { message: '角色類型不正確' })
  @IsOptional()
  role?: UserRole;
}

