import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UploadsService } from '../uploads/uploads.service';
import { UploadStatus } from 'shared';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly uploadsService: UploadsService,
  ) {}

  // 建立審核記錄
  async create(createReviewDto: CreateReviewDto, reviewerId: string): Promise<Review> {
    const { uploadId, status, comment } = createReviewDto;

    // 驗證狀態值
    if (status !== UploadStatus.APPROVED && status !== UploadStatus.REJECTED) {
      throw new BadRequestException('審核狀態只能是 APPROVED 或 REJECTED');
    }

    // 檢查上傳記錄是否存在
    const upload = await this.uploadsService.findOne(uploadId);

    if (!upload) {
      throw new NotFoundException('找不到該上傳記錄');
    }

    // 建立審核記錄
    const review = this.reviewRepository.create({
      uploadId,
      reviewerId,
      status,
      comment,
    });

    const savedReview = await this.reviewRepository.save(review);

    // 更新上傳記錄的狀態
    await this.uploadsService.updateStatus(uploadId, status);

    return savedReview;
  }

  // 取得所有審核記錄
  async findAll(): Promise<Review[]> {
    return await this.reviewRepository.find({
      relations: ['upload', 'upload.requiredDocument', 'reviewer'],
      order: { createdAt: 'DESC' },
    });
  }

  // 根據上傳記錄 ID 取得審核記錄
  async findByUploadId(uploadId: string): Promise<Review[]> {
    return await this.reviewRepository.find({
      where: { uploadId },
      relations: ['reviewer'],
      order: { createdAt: 'DESC' },
    });
  }

  // 根據 ID 取得審核記錄
  async findOne(id: string): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['upload', 'upload.requiredDocument', 'reviewer'],
    });

    if (!review) {
      throw new NotFoundException('找不到該審核記錄');
    }

    return review;
  }

  // 根據專案 ID 取得審核記錄
  async findByProjectId(projectId: string): Promise<Review[]> {
    return await this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.upload', 'upload')
      .leftJoinAndSelect('upload.requiredDocument', 'requiredDocument')
      .leftJoinAndSelect('requiredDocument.project', 'project')
      .leftJoinAndSelect('review.reviewer', 'reviewer')
      .where('project.id = :projectId', { projectId })
      .orderBy('review.createdAt', 'DESC')
      .getMany();
  }

  // 刪除審核記錄
  async remove(id: string): Promise<void> {
    const review = await this.findOne(id);
    await this.reviewRepository.remove(review);
  }
}

