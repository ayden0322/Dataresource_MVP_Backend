import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email 格式不正確' })
  email: string;

  @IsString()
  @MinLength(6, { message: '密碼至少需要 6 個字元' })
  password: string;
}

