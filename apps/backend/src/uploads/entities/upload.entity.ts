import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { UploadStatus } from 'shared';
import { RequiredDocument } from '../../projects/entities/required-document.entity';
import { Review } from '../../reviews/entities/review.entity';

@Entity('uploads')
export class Upload {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => RequiredDocument, (doc) => doc.uploads)
  @JoinColumn({ name: 'required_document_id' })
  requiredDocument: RequiredDocument;

  @Column({ name: 'required_document_id' })
  requiredDocumentId: string;

  @Column()
  filename: string;

  @Column({ name: 'original_filename' })
  originalFilename: string;

  @Column({ name: 'file_size', type: 'bigint' })
  fileSize: number;

  @Column({ name: 'mime_type' })
  mimeType: string;

  @Column({
    type: 'enum',
    enum: UploadStatus,
    default: UploadStatus.UPLOADED,
  })
  status: UploadStatus;

  @Column({ default: 1 })
  version: number;

  @Column({ name: 'storage_path' })
  storagePath: string;

  @Column({ name: 'uploader_ip', nullable: true })
  uploaderIp: string;

  @Column({ name: 'uploader_company', nullable: true })
  uploaderCompany: string;

  @Column({ name: 'uploader_email', nullable: true })
  uploaderEmail: string;

  @Column({ name: 'uploader_name', nullable: true })
  uploaderName: string;

  @OneToMany(() => Review, (review) => review.upload)
  reviews: Review[];

  @CreateDateColumn({ name: 'uploaded_at' })
  uploadedAt: Date;
}

