import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole, ProjectStatus } from 'shared';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  create(@Body() createProjectDto: CreateProjectDto, @CurrentUser() user: any) {
    return this.projectsService.create(createProjectDto, user.id);
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.VIEWER)
  findAll(@Query('status') status?: ProjectStatus) {
    if (status) {
      return this.projectsService.findByStatus(status);
    }
    return this.projectsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.VIEWER)
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Get(':id/upload-link')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async getUploadLink(@Param('id') id: string) {
    const project = await this.projectsService.findOne(id);
    return {
      uploadLink: this.projectsService.getUploadLink(project),
      token: project.uploadToken,
    };
  }

  @Public()
  @Get('token/:token')
  findByToken(@Param('token') token: string) {
    return this.projectsService.findByToken(token);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}

