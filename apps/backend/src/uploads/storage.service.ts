import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private minioClient: Minio.Client;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get<string>('minio.bucket');

    this.minioClient = new Minio.Client({
      endPoint: this.configService.get<string>('minio.endpoint'),
      port: this.configService.get<number>('minio.port'),
      useSSL: this.configService.get<boolean>('minio.useSSL'),
      accessKey: this.configService.get<string>('minio.accessKey'),
      secretKey: this.configService.get<string>('minio.secretKey'),
    });
  }

  async onModuleInit() {
    try {
      // 檢查 bucket 是否存在，不存在則建立
      const bucketExists = await this.minioClient.bucketExists(this.bucketName);

      if (!bucketExists) {
        await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
        this.logger.log(`Bucket ${this.bucketName} 已建立`);
      } else {
        this.logger.log(`Bucket ${this.bucketName} 已存在`);
      }
    } catch (error) {
      this.logger.error(`MinIO 初始化失敗: ${error.message}`);
    }
  }

  // 上傳檔案
  async uploadFile(
    file: Express.Multer.File,
    projectId: string,
    documentId: string,
  ): Promise<string> {
    const fileExtension = file.originalname.split('.').pop();
    const filename = `${projectId}/${documentId}/${uuidv4()}.${fileExtension}`;

    try {
      await this.minioClient.putObject(this.bucketName, filename, file.buffer, file.size, {
        'Content-Type': file.mimetype,
      });

      this.logger.log(`檔案上傳成功: ${filename}`);
      return filename;
    } catch (error) {
      this.logger.error(`檔案上傳失敗: ${error.message}`);
      throw new Error('檔案上傳失敗');
    }
  }

  // 下載檔案
  async downloadFile(filename: string): Promise<Buffer> {
    try {
      const chunks: Buffer[] = [];
      const stream = await this.minioClient.getObject(this.bucketName, filename);

      return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
      });
    } catch (error) {
      this.logger.error(`檔案下載失敗: ${error.message}`);
      throw new Error('檔案下載失敗');
    }
  }

  // 刪除檔案
  async deleteFile(filename: string): Promise<void> {
    try {
      await this.minioClient.removeObject(this.bucketName, filename);
      this.logger.log(`檔案刪除成功: ${filename}`);
    } catch (error) {
      this.logger.error(`檔案刪除失敗: ${error.message}`);
      throw new Error('檔案刪除失敗');
    }
  }

  // 取得檔案 URL（預簽名連結，有效期限 7 天）
  async getFileUrl(filename: string, expirySeconds = 604800): Promise<string> {
    try {
      return await this.minioClient.presignedGetObject(this.bucketName, filename, expirySeconds);
    } catch (error) {
      this.logger.error(`取得檔案 URL 失敗: ${error.message}`);
      throw new Error('取得檔案 URL 失敗');
    }
  }

  // 檢查檔案是否存在
  async fileExists(filename: string): Promise<boolean> {
    try {
      await this.minioClient.statObject(this.bucketName, filename);
      return true;
    } catch (error) {
      return false;
    }
  }
}

