// ==================== Types ====================

// User Types
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  VIEWER = 'VIEWER',
}

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface LoginDto {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  user: User
}

// Project Types
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

// Upload Types
export enum UploadStatus {
  PENDING = 'PENDING',
  UPLOADED = 'UPLOADED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface Upload {
  id: string
  projectId: string
  documentId: string
  filename: string
  status: UploadStatus
  version: number
  uploadedAt: Date
}

// ==================== Constants ====================

// Status
export const STATUS_LABELS = {
  DRAFT: '草稿',
  ACTIVE: '進行中',
  COMPLETED: '已完成',
  ARCHIVED: '已歸檔',
  PENDING: '待上傳',
  UPLOADED: '已上傳',
  APPROVED: '已通過',
  REJECTED: '已退回',
} as const

export const STATUS_COLORS = {
  DRAFT: 'gray',
  ACTIVE: 'blue',
  COMPLETED: 'green',
  ARCHIVED: 'gray',
  PENDING: 'yellow',
  UPLOADED: 'blue',
  APPROVED: 'green',
  REJECTED: 'red',
} as const

// File Types
export const ALLOWED_FILE_TYPES = {
  PDF: ['application/pdf'],
  DWG: ['application/acad', 'application/x-acad', 'application/x-dwg'],
  DOC: ['application/msword'],
  DOCX: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
} as const

export const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
