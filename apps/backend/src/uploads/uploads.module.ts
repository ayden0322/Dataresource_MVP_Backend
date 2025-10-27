import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { Upload } from './entities/upload.entity';
import { RequiredDocument } from '../projects/entities/required-document.entity';
import { StorageService } from './storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([Upload, RequiredDocument])],
  controllers: [UploadsController],
  providers: [UploadsService, StorageService],
  exports: [UploadsService, StorageService],
})
export class UploadsModule {}

