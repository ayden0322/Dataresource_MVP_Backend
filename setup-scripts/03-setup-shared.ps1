# ====================================
# 步驟 3: 建立共用套件 (packages/shared)
# ====================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "建立共用套件 (packages/shared)..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 建立 package.json
Write-Host "`n建立 packages/shared/package.json..." -ForegroundColor Yellow
$sharedPackageJson = @"
{
  "name": "shared",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./types": "./src/types/index.ts",
    "./constants": "./src/constants/index.ts",
    "./utils": "./src/utils/index.ts"
  },
  "scripts": {
    "lint": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.3.0"
  }
}
"@
Set-Content -Path "packages\shared\package.json" -Value $sharedPackageJson
Write-Host "✓ package.json 建立完成" -ForegroundColor Green

# 建立 tsconfig.json
Write-Host "`n建立 packages/shared/tsconfig.json..." -ForegroundColor Yellow
$tsConfig = @"
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "declaration": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
"@
Set-Content -Path "packages\shared\tsconfig.json" -Value $tsConfig
Write-Host "✓ tsconfig.json 建立完成" -ForegroundColor Green

# 建立型別定義檔案
Write-Host "`n建立型別定義檔案..." -ForegroundColor Yellow

# user.types.ts
$userTypes = @"
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
"@
Set-Content -Path "packages\shared\src\types\user.types.ts" -Value $userTypes

# project.types.ts
$projectTypes = @"
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
"@
Set-Content -Path "packages\shared\src\types\project.types.ts" -Value $projectTypes

# upload.types.ts
$uploadTypes = @"
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
"@
Set-Content -Path "packages\shared\src\types\upload.types.ts" -Value $uploadTypes

# types/index.ts
$typesIndex = @"
export * from './user.types'
export * from './project.types'
export * from './upload.types'
"@
Set-Content -Path "packages\shared\src\types\index.ts" -Value $typesIndex

Write-Host "✓ 型別定義檔案建立完成" -ForegroundColor Green

# 建立常數檔案
Write-Host "`n建立常數檔案..." -ForegroundColor Yellow

# status.ts
$statusConstants = @"
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
"@
Set-Content -Path "packages\shared\src\constants\status.ts" -Value $statusConstants

# file-types.ts
$fileTypes = @"
export const ALLOWED_FILE_TYPES = {
  PDF: ['application/pdf'],
  DWG: ['application/acad', 'application/x-acad', 'application/x-dwg'],
  DOC: ['application/msword'],
  DOCX: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
} as const

export const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
"@
Set-Content -Path "packages\shared\src\constants\file-types.ts" -Value $fileTypes

# constants/index.ts
$constantsIndex = @"
export * from './status'
export * from './file-types'
"@
Set-Content -Path "packages\shared\src\constants\index.ts" -Value $constantsIndex

Write-Host "✓ 常數檔案建立完成" -ForegroundColor Green

# 建立主要 index.ts
Write-Host "`n建立 packages/shared/src/index.ts..." -ForegroundColor Yellow
$mainIndex = @"
export * from './types'
export * from './constants'
"@
Set-Content -Path "packages\shared\src\index.ts" -Value $mainIndex
Write-Host "✓ index.ts 建立完成" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "步驟 3 完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

