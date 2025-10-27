import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { RequiredDocument } from './entities/required-document.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { v4 as uuidv4 } from 'uuid';
import { ProjectStatus } from 'shared';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(RequiredDocument)
    private readonly requiredDocumentRepository: Repository<RequiredDocument>,
  ) {}

  // 建立專案
  async create(createProjectDto: CreateProjectDto, userId: string): Promise<Project> {
    const uploadToken = uuidv4();

    const project = this.projectRepository.create({
      ...createProjectDto,
      uploadToken,
      createdById: userId,
      requiredDocuments: createProjectDto.requiredDocuments.map((doc) => ({
        name: doc.name,
        description: doc.description,
        isRequired: doc.isRequired ?? true,
      })),
    });

    return await this.projectRepository.save(project);
  }

  // 取得所有專案
  async findAll(): Promise<Project[]> {
    return await this.projectRepository.find({
      relations: ['requiredDocuments', 'createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

  // 根據狀態取得專案
  async findByStatus(status: ProjectStatus): Promise<Project[]> {
    return await this.projectRepository.find({
      where: { status },
      relations: ['requiredDocuments', 'createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

  // 根據 ID 取得專案
  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['requiredDocuments', 'requiredDocuments.uploads', 'createdBy'],
    });

    if (!project) {
      throw new NotFoundException('找不到該專案');
    }

    return project;
  }

  // 根據 Token 取得專案（供廠商上傳使用）
  async findByToken(token: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { uploadToken: token },
      relations: ['requiredDocuments', 'requiredDocuments.uploads'],
    });

    if (!project) {
      throw new NotFoundException('無效的上傳連結');
    }

    if (project.status !== ProjectStatus.ACTIVE) {
      throw new ForbiddenException('此專案尚未開放或已關閉');
    }

    return project;
  }

  // 更新專案
  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);

    // 更新基本資訊
    Object.assign(project, {
      name: updateProjectDto.name ?? project.name,
      description: updateProjectDto.description ?? project.description,
      status: updateProjectDto.status ?? project.status,
    });

    // 如果有更新文件清單
    if (updateProjectDto.requiredDocuments) {
      // 刪除舊的文件清單
      await this.requiredDocumentRepository.delete({ projectId: id });

      // 建立新的文件清單
      project.requiredDocuments = updateProjectDto.requiredDocuments.map((doc) =>
        this.requiredDocumentRepository.create({
          name: doc.name,
          description: doc.description,
          isRequired: doc.isRequired ?? true,
          projectId: id,
        }),
      );
    }

    return await this.projectRepository.save(project);
  }

  // 刪除專案
  async remove(id: string): Promise<void> {
    const project = await this.findOne(id);
    await this.projectRepository.remove(project);
  }

  // 取得專案上傳連結
  getUploadLink(project: Project): string {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    return `${baseUrl}/upload/${project.uploadToken}`;
  }
}

