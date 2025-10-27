import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from 'shared';

@Controller('reviews')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  create(@Body() createReviewDto: CreateReviewDto, @CurrentUser() user: any) {
    return this.reviewsService.create(createReviewDto, user.id);
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.VIEWER)
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get('upload/:uploadId')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.VIEWER)
  findByUpload(@Param('uploadId') uploadId: string) {
    return this.reviewsService.findByUploadId(uploadId);
  }

  @Get('project/:projectId')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.VIEWER)
  findByProject(@Param('projectId') projectId: string) {
    return this.reviewsService.findByProjectId(projectId);
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.VIEWER)
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}

