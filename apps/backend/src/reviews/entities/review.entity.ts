import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Upload } from '../../uploads/entities/upload.entity';
import { User } from '../../users/entities/user.entity';
import { UploadStatus } from 'shared';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Upload, (upload) => upload.reviews)
  @JoinColumn({ name: 'upload_id' })
  upload: Upload;

  @Column({ name: 'upload_id' })
  uploadId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'reviewer_id' })
  reviewer: User;

  @Column({ name: 'reviewer_id' })
  reviewerId: string;

  @Column({
    type: 'enum',
    enum: UploadStatus,
  })
  status: UploadStatus;

  @Column('text', { nullable: true })
  comment: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

