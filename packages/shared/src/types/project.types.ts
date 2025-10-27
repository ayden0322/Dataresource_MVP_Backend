export enum ProjectStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

export interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  uploadToken: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateProjectDto {
  name: string
  description: string
  requiredDocumentIds: string[]
}

