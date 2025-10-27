import { IsString, IsArray, IsOptional, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class RequiredDocumentDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  isRequired?: boolean;
}

export class CreateProjectDto {
  @IsString()
  @MinLength(2, { message: '專案名稱至少需要 2 個字元' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RequiredDocumentDto)
  requiredDocuments: RequiredDocumentDto[];
}

