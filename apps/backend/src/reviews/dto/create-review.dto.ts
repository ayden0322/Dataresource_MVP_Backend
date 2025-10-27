import { IsUUID, IsEnum, IsString, IsOptional } from 'class-validator';
import { UploadStatus } from 'shared';

export class CreateReviewDto {
  @IsUUID()
  uploadId: string;

  @IsEnum(UploadStatus, {
    message: '狀態只能是 APPROVED（通過）或 REJECTED（退回）',
  })
  status: UploadStatus;

  @IsString()
  @IsOptional()
  comment?: string;
}

