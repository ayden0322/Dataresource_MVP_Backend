import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Res,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response, Request } from 'express';
import { UploadsService } from './uploads.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from 'shared';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Public()
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadFileDto: UploadFileDto,
    @Req() request: Request,
  ) {
    if (!file) {
      throw new BadRequestException('請選擇要上傳的檔案');
    }

    const uploaderIp = request.ip || request.socket.remoteAddress;
    return await this.uploadsService.uploadFile(file, uploadFileDto, uploaderIp);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.VIEWER)
  findAll() {
    return this.uploadsService.findAll();
  }

  @Get('project/:projectId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.VIEWER)
  findByProject(@Param('projectId') projectId: string) {
    return this.uploadsService.findByProjectId(projectId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.VIEWER)
  findOne(@Param('id') id: string) {
    return this.uploadsService.findOne(id);
  }

  @Get(':id/download-url')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.VIEWER)
  async getDownloadUrl(@Param('id') id: string) {
    const url = await this.uploadsService.getDownloadUrl(id);
    return { url };
  }

  @Get(':id/download')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.VIEWER)
  async downloadFile(@Param('id') id: string, @Res() res: Response) {
    const { buffer, upload } = await this.uploadsService.downloadFile(id);

    res.set({
      'Content-Type': upload.mimeType,
      'Content-Disposition': `attachment; filename="${encodeURIComponent(upload.originalFilename)}"`,
      'Content-Length': upload.fileSize,
    });

    res.send(buffer);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.uploadsService.remove(id);
  }
}

