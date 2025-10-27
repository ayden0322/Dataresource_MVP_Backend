import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Project } from './project.entity';
import { Upload } from '../../uploads/entities/upload.entity';

@Entity('required_documents')
export class RequiredDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ name: 'is_required', default: false })
  isRequired: boolean;

  @ManyToOne(() => Project, (project) => project.requiredDocuments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ name: 'project_id' })
  projectId: string;

  @OneToMany(() => Upload, (upload) => upload.requiredDocument)
  uploads: Upload[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

