import { IsString, IsUUID, IsOptional, IsEmail } from 'class-validator';

export class UploadFileDto {
  @IsUUID()
  requiredDocumentId: string;

  @IsString()
  @IsOptional()
  uploaderCompany?: string;

  @IsEmail()
  @IsOptional()
  uploaderEmail?: string;

  @IsString()
  @IsOptional()
  uploaderName?: string;
}

