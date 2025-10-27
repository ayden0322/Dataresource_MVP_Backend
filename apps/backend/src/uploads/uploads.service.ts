import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Upload } from './entities/upload.entity';
import { RequiredDocument } from '../projects/entities/required-document.entity';
import { StorageService } from './storage.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { UploadStatus } from 'shared';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from 'shared';

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,
    @InjectRepository(RequiredDocument)
    private readonly requiredDocumentRepository: Repository<RequiredDocument>,
    private readonly storageService: StorageService,
  ) {}

  // 驗證檔案類型
  private validateFileType(mimetype: string): boolean {
    const allowedTypes = Object.values(ALLOWED_FILE_TYPES).flat();
    return allowedTypes.includes(mimetype as any);
  }

  // 驗證檔案大小
  private validateFileSize(size: number): boolean {
    return size <= MAX_FILE_SIZE;
  }

  // 上傳檔案
  async uploadFile(
    file: Express.Multer.File,
    uploadFileDto: UploadFileDto,
    uploaderIp: string,
  ): Promise<Upload> {
    // 驗證檔案類型
    if (!this.validateFileType(file.mimetype)) {
      throw new BadRequestException('不支援的檔案類型');
    }

    // 驗證檔案大小
    if (!this.validateFileSize(file.size)) {
      throw new BadRequestException('檔案大小超過限制（100MB）');
    }

    // 檢查文件項目是否存在
    const requiredDocument = await this.requiredDocumentRepository.findOne({
      where: { id: uploadFileDto.requiredDocumentId },
      relations: ['project'],
    });

    if (!requiredDocument) {
      throw new NotFoundException('找不到該文件項目');
    }

    // 檢查專案是否為活躍狀態
    if (requiredDocument.project.status !== 'ACTIVE') {
      throw new ForbiddenException('此專案尚未開放上傳');
    }

    // 取得該文件的最新版本號
    const latestUpload = await this.uploadRepository.findOne({
      where: { requiredDocumentId: uploadFileDto.requiredDocumentId },
      order: { version: 'DESC' },
    });

    const version = latestUpload ? latestUpload.version + 1 : 1;

    // 上傳檔案到 MinIO
    const storagePath = await this.storageService.uploadFile(
      file,
      requiredDocument.project.id,
      requiredDocument.id,
    );

    // 建立上傳記錄
    const upload = this.uploadRepository.create({
      requiredDocumentId: uploadFileDto.requiredDocumentId,
      filename: storagePath.split('/').pop(),
      originalFilename: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      status: UploadStatus.UPLOADED,
      version,
      storagePath,
      uploaderIp,
      uploaderCompany: uploadFileDto.uploaderCompany,
      uploaderEmail: uploadFileDto.uploaderEmail,
      uploaderName: uploadFileDto.uploaderName,
    });

    return await this.uploadRepository.save(upload);
  }

  // 取得所有上傳記錄
  async findAll(): Promise<Upload[]> {
    return await this.uploadRepository.find({
      relations: ['requiredDocument', 'requiredDocument.project'],
      order: { uploadedAt: 'DESC' },
    });
  }

  // 根據專案 ID 取得上傳記錄
  async findByProjectId(projectId: string): Promise<Upload[]> {
    return await this.uploadRepository
      .createQueryBuilder('upload')
      .leftJoinAndSelect('upload.requiredDocument', 'requiredDocument')
      .leftJoinAndSelect('requiredDocument.project', 'project')
      .where('project.id = :projectId', { projectId })
      .orderBy('upload.uploadedAt', 'DESC')
      .getMany();
  }

  // 根據 ID 取得上傳記錄
  async findOne(id: string): Promise<Upload> {
    const upload = await this.uploadRepository.findOne({
      where: { id },
      relations: ['requiredDocument', 'requiredDocument.project', 'reviews'],
    });

    if (!upload) {
      throw new NotFoundException('找不到該上傳記錄');
    }

    return upload;
  }

  // 取得檔案下載連結
  async getDownloadUrl(id: string): Promise<string> {
    const upload = await this.findOne(id);
    return await this.storageService.getFileUrl(upload.storagePath);
  }

  // 下載檔案
  async downloadFile(id: string): Promise<{ buffer: Buffer; upload: Upload }> {
    const upload = await this.findOne(id);
    const buffer = await this.storageService.downloadFile(upload.storagePath);
    return { buffer, upload };
  }

  // 刪除上傳記錄
  async remove(id: string): Promise<void> {
    const upload = await this.findOne(id);

    // 刪除實體檔案
    await this.storageService.deleteFile(upload.storagePath);

    // 刪除資料庫記錄
    await this.uploadRepository.remove(upload);
  }

  // 更新上傳狀態
  async updateStatus(id: string, status: UploadStatus): Promise<Upload> {
    const upload = await this.findOne(id);
    upload.status = status;
    return await this.uploadRepository.save(upload);
  }
}

