# 廠商安全評估系統 - Monorepo 開發指南

## 📋 目錄

- [專案概述](#專案概述)
- [技術棧](#技術棧)
- [專案架構](#專案架構)
- [開發環境設定](#開發環境設定)
- [Monorepo 配置](#monorepo-配置)
- [共用套件使用](#共用套件使用)
- [開發流程](#開發流程)
- [Zeabur 部署指南](#zeabur-部署指南)
- [環境變數配置](#環境變數配置)
- [常見問題](#常見問題)

---

## 專案概述

建立一個能讓管理者設定專案、供廠商上傳所需文件、並進行審核與追蹤進度的系統。

**架構選擇：Monorepo（單一倉庫）**
- 一個後端（NestJS）
- 一個前端（Next.js 14 App Router）
- 共用型別套件（TypeScript）

**部署平台：Zeabur**
- 支援從單一 Git Repo 部署多個服務
- 自動 CI/CD
- 內建 PostgreSQL、MinIO 服務

---

## 技術棧

### 後端
- **框架**: NestJS (TypeScript)
- **資料庫**: PostgreSQL 18
- **ORM**: TypeORM
- **認證**: JWT + Passport
- **檔案儲存**: MinIO (S3 相容)
- **驗證**: class-validator + class-transformer

### 前端
- **框架**: Next.js 14 (App Router)
- **語言**: TypeScript
- **樣式**: TailwindCSS
- **狀態管理**: React Hooks + Context API
- **HTTP 客戶端**: Axios

### DevOps
- **Package Manager**: pnpm (Workspace)
- **建置工具**: Turborepo (可選)
- **容器化**: Docker + Docker Compose（可選）
- **本地開發**: PostgreSQL + MinIO（Docker 替代方案）
- **部署**: Zeabur

---

## 專案架構

```
Dataresource_MVP_Backend/
├── apps/
│   ├── backend/                         # NestJS 後端
│   │   ├── src/
│   │   │   ├── auth/                    # 認證模組
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   ├── guards/
│   │   │   │   │   └── jwt-auth.guard.ts
│   │   │   │   └── dto/
│   │   │   │       ├── login.dto.ts
│   │   │   │       └── register.dto.ts
│   │   │   ├── projects/                # 專案管理模組
│   │   │   │   ├── projects.controller.ts
│   │   │   │   ├── projects.service.ts
│   │   │   │   ├── entities/
│   │   │   │   │   └── project.entity.ts
│   │   │   │   └── dto/
│   │   │   │       ├── create-project.dto.ts
│   │   │   │       └── update-project.dto.ts
│   │   │   ├── uploads/                 # 檔案上傳模組
│   │   │   │   ├── uploads.controller.ts
│   │   │   │   ├── uploads.service.ts
│   │   │   │   ├── storage.service.ts   # MinIO 整合
│   │   │   │   ├── entities/
│   │   │   │   │   └── upload.entity.ts
│   │   │   │   └── dto/
│   │   │   ├── reviews/                 # 審核模組
│   │   │   │   ├── reviews.controller.ts
│   │   │   │   ├── reviews.service.ts
│   │   │   │   ├── entities/
│   │   │   │   │   └── review.entity.ts
│   │   │   │   └── dto/
│   │   │   ├── users/                   # 使用者管理模組
│   │   │   │   ├── users.controller.ts
│   │   │   │   ├── users.service.ts
│   │   │   │   └── entities/
│   │   │   │       └── user.entity.ts
│   │   │   ├── common/                  # 共用模組
│   │   │   │   ├── guards/
│   │   │   │   ├── decorators/
│   │   │   │   ├── interceptors/
│   │   │   │   └── filters/
│   │   │   ├── config/                  # 環境變數配置
│   │   │   │   └── configuration.ts
│   │   │   ├── database/                # 資料庫相關
│   │   │   │   └── migrations/
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── test/
│   │   ├── .env.example
│   │   ├── nest-cli.json
│   │   ├── tsconfig.json
│   │   ├── package.json
│   │   ├── Dockerfile
│   │   └── zbpack.json                  # Zeabur 配置
│   │
│   └── frontend/                        # Next.js 前端
│       ├── app/
│       │   ├── (public)/                # 公開路由群組（不需登入）
│       │   │   ├── layout.tsx
│       │   │   └── upload/
│       │   │       └── [token]/
│       │   │           ├── page.tsx     # 廠商上傳主頁
│       │   │           └── status/
│       │   │               └── page.tsx
│       │   ├── (auth)/                  # 認證路由群組
│       │   │   ├── layout.tsx
│       │   │   └── login/
│       │   │       └── page.tsx
│       │   ├── (admin)/                 # 管理後台路由群組（需登入）
│       │   │   ├── layout.tsx           # 後台 Layout（側邊欄）
│       │   │   ├── dashboard/
│       │   │   │   └── page.tsx
│       │   │   ├── projects/
│       │   │   │   ├── page.tsx         # 專案列表
│       │   │   │   ├── new/
│       │   │   │   │   └── page.tsx     # 建立專案
│       │   │   │   └── [id]/
│       │   │   │       ├── page.tsx     # 專案詳情
│       │   │   │       └── documents/
│       │   │   │           └── [docId]/
│       │   │   │               └── page.tsx  # 文件審核頁
│       │   │   └── settings/
│       │   │       └── page.tsx
│       │   ├── layout.tsx               # 根 Layout
│       │   ├── page.tsx
│       │   └── globals.css
│       ├── components/
│       │   ├── shared/                  # 共用元件
│       │   │   ├── ui/
│       │   │   │   ├── Button.tsx
│       │   │   │   ├── Input.tsx
│       │   │   │   ├── Dialog.tsx
│       │   │   │   ├── Toast.tsx
│       │   │   │   └── FilePreview.tsx
│       │   │   └── layout/
│       │   │       ├── Header.tsx
│       │   │       └── Footer.tsx
│       │   ├── admin/                   # 管理後台專用
│       │   │   ├── Sidebar.tsx
│       │   │   ├── ProjectList.tsx
│       │   │   ├── DocumentTable.tsx
│       │   │   └── ReviewPanel.tsx
│       │   └── upload/                  # 上傳頁專用
│       │       ├── FileDropzone.tsx
│       │       ├── UploadProgress.tsx
│       │       ├── FileList.tsx
│       │       └── VendorInfoForm.tsx
│       ├── lib/
│       │   ├── api/                     # API 呼叫封裝
│       │   │   ├── client.ts
│       │   │   ├── auth.ts
│       │   │   ├── projects.ts
│       │   │   ├── uploads.ts
│       │   │   └── reviews.ts
│       │   ├── utils/
│       │   │   ├── formatters.ts
│       │   │   ├── validators.ts
│       │   │   └── constants.ts
│       │   └── hooks/
│       │       ├── useAuth.ts
│       │       ├── useUpload.ts
│       │       ├── useProjects.ts
│       │       └── useToast.ts
│       ├── types/
│       │   ├── api.ts
│       │   └── models.ts
│       ├── public/
│       ├── .env.local.example
│       ├── next.config.js
│       ├── tsconfig.json
│       ├── tailwind.config.js
│       ├── postcss.config.js
│       ├── package.json
│       ├── Dockerfile
│       └── zbpack.json
│
├── packages/
│   └── shared/                          # 共用套件
│       ├── src/
│       │   ├── types/                   # 共用 TypeScript 型別
│       │   │   ├── project.types.ts
│       │   │   ├── upload.types.ts
│       │   │   ├── user.types.ts
│       │   │   ├── review.types.ts
│       │   │   └── index.ts
│       │   ├── constants/               # 共用常數
│       │   │   ├── file-types.ts
│       │   │   ├── status.ts
│       │   │   └── index.ts
│       │   ├── utils/                   # 共用工具函式
│       │   │   ├── validators.ts
│       │   │   ├── formatters.ts
│       │   │   └── index.ts
│       │   └── index.ts
│       ├── tsconfig.json
│       └── package.json
│
├── .github/
│   └── workflows/
│       └── ci.yml                       # GitHub Actions（選配）
│
├── .gitignore
├── package.json                         # Root package.json (workspace)
├── pnpm-workspace.yaml                  # pnpm workspace 配置
├── turbo.json                           # Turborepo 配置（選配）
├── .env.example
├── docker-compose.yml                   # 本地開發環境
└── README.md
```

---

## 開發環境設定

### 前置需求

- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.0.0
- **Git**: 最新版本

#### 資料庫與儲存服務（二擇一）

**方案 A：使用 Docker（推薦，需 CPU 支援虛擬化）**
- **Docker**: >= 20.10.0
- **Docker Compose**: >= 2.0.0

**方案 B：本地安裝（適用於不支援 Docker 的環境）**
- **PostgreSQL**: >= 18.0
- **MinIO**: 最新版本
- 參考：`setup-scripts/06-install-local-services.md`

### 安裝步驟

#### 1. 安裝 pnpm（如果尚未安裝）

```bash
# 使用 npm 安裝
npm install -g pnpm@8.15.0

# 或使用 Homebrew (macOS)
brew install pnpm

# 驗證安裝
pnpm --version
```

#### 2. Clone 專案

```bash
git clone https://github.com/your-username/Dataresource_MVP_Backend.git
cd Dataresource_MVP_Backend
```

#### 3. 安裝所有依賴

```bash
# pnpm 會自動處理 workspace 依賴
pnpm install
```

#### 4. 啟動基礎設施（PostgreSQL + MinIO）

**方案 A：使用 Docker**

```bash
docker-compose up -d
```

**方案 B：本地安裝（適用於 CPU 不支援 Docker）**

```bash
# 安裝 PostgreSQL
.\setup-scripts\06-setup-local-postgresql.ps1

# 安裝 MinIO
.\setup-scripts\07-setup-local-minio.ps1

# 詳細說明請參考
.\setup-scripts\06-install-local-services.md
```

> **注意**：如果您的 CPU 不支援虛擬化（無法使用 Docker），請使用方案 B。兩種方案的連線資訊相同，可直接使用預設的 `.env` 配置。

#### 5. 設定環境變數

```bash
# 後端
cp apps/backend/.env.example apps/backend/.env
# 編輯 apps/backend/.env，填入實際的資料庫連線資訊

# 前端
cp apps/frontend/.env.local.example apps/frontend/.env.local
# 編輯 apps/frontend/.env.local，填入後端 API URL
```

#### 6. 執行資料庫遷移

```bash
pnpm --filter backend run migration:run
```

#### 7. 啟動開發伺服器

```bash
# 同時啟動前後端
pnpm dev

# 或分別啟動
pnpm dev:backend  # http://localhost:3000
pnpm dev:frontend # http://localhost:3001
```

---

## Monorepo 配置

### Root `package.json`

```json
{
  "name": "dataresource-mvp",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "clean": "turbo run clean && rm -rf node_modules",

    "dev:backend": "pnpm --filter backend dev",
    "dev:frontend": "pnpm --filter frontend dev",
    "build:backend": "pnpm --filter backend build",
    "build:frontend": "pnpm --filter frontend build"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.3.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  },
  "packageManager": "pnpm@8.15.0"
}
```

### `pnpm-workspace.yaml`

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### `turbo.json` (可選，用於加速建置)

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [".env"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

### `.gitignore`

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Production builds
dist/
build/
.next/
out/

# Environment variables
.env
.env.local
.env*.local

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Testing
coverage/

# Turborepo
.turbo/

# Docker
docker-compose.override.yml
```

---

## 共用套件使用

### `packages/shared/package.json`

```json
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
```

### `packages/shared/tsconfig.json`

```json
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
```

### 共用型別定義範例

#### `packages/shared/src/types/project.types.ts`

```typescript
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

export interface UpdateProjectDto {
  name?: string
  description?: string
  status?: ProjectStatus
}
```

#### `packages/shared/src/types/upload.types.ts`

```typescript
export enum UploadStatus {
  PENDING = 'PENDING',
  UPLOADED = 'UPLOADED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum FileType {
  PDF = 'PDF',
  DWG = 'DWG',
  DOC = 'DOC',
  DOCX = 'DOCX',
  XLS = 'XLS',
  XLSX = 'XLSX',
}

export interface Upload {
  id: string
  projectId: string
  documentId: string
  filename: string
  originalFilename: string
  fileSize: number
  mimeType: string
  status: UploadStatus
  version: number
  storagePath: string
  uploadedAt: Date
  uploaderIp: string
  uploaderCompany?: string
  uploaderEmail?: string
}

export interface UploadFileDto {
  documentId: string
  file: File
}
```

#### `packages/shared/src/types/user.types.ts`

```typescript
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

export interface RegisterDto {
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken?: string
  user: User
}
```

#### `packages/shared/src/constants/file-types.ts`

```typescript
export const ALLOWED_FILE_TYPES = {
  PDF: ['application/pdf'],
  DWG: ['application/acad', 'application/x-acad', 'application/x-dwg'],
  DOC: ['application/msword'],
  DOCX: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  XLS: ['application/vnd.ms-excel'],
  XLSX: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
} as const

export const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB

export const FILE_TYPE_EXTENSIONS = {
  'application/pdf': '.pdf',
  'application/acad': '.dwg',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/vnd.ms-excel': '.xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
} as const
```

#### `packages/shared/src/constants/status.ts`

```typescript
export const STATUS_LABELS = {
  // Project Status
  DRAFT: '草稿',
  ACTIVE: '進行中',
  COMPLETED: '已完成',
  ARCHIVED: '已歸檔',

  // Upload Status
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
```

#### `packages/shared/src/index.ts`

```typescript
// 統一匯出
export * from './types/project.types'
export * from './types/upload.types'
export * from './types/user.types'
export * from './types/review.types'
export * from './constants/file-types'
export * from './constants/status'
export * from './utils/validators'
export * from './utils/formatters'
```

### 在後端使用共用套件

```typescript
// apps/backend/src/projects/dto/create-project.dto.ts
import { CreateProjectDto, ProjectStatus } from 'shared'
import { IsString, IsArray, IsEnum, IsOptional } from 'class-validator'

export class CreateProjectDtoImpl implements CreateProjectDto {
  @IsString()
  name: string

  @IsString()
  description: string

  @IsArray()
  requiredDocumentIds: string[]
}

// apps/backend/src/projects/entities/project.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { Project as IProject, ProjectStatus } from 'shared'

@Entity('projects')
export class Project implements IProject {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column('text')
  description: string

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.DRAFT
  })
  status: ProjectStatus

  @Column({ unique: true })
  uploadToken: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
```

### 在前端使用共用套件

```typescript
// apps/frontend/lib/api/projects.ts
import { Project, CreateProjectDto, ProjectStatus } from 'shared'
import { apiClient } from './client'

export async function createProject(data: CreateProjectDto): Promise<Project> {
  const response = await apiClient.post<Project>('/api/projects', data)
  return response.data
}

export async function getProjects(status?: ProjectStatus): Promise<Project[]> {
  const response = await apiClient.get<Project[]>('/api/projects', {
    params: { status }
  })
  return response.data
}

export async function getProjectById(id: string): Promise<Project> {
  const response = await apiClient.get<Project>(`/api/projects/${id}`)
  return response.data
}

// apps/frontend/components/admin/ProjectList.tsx
import { Project, ProjectStatus, STATUS_LABELS, STATUS_COLORS } from 'shared'

interface ProjectListProps {
  projects: Project[]
}

export function ProjectList({ projects }: ProjectListProps) {
  return (
    <div>
      {projects.map((project) => (
        <div key={project.id}>
          <h3>{project.name}</h3>
          <span className={`badge badge-${STATUS_COLORS[project.status]}`}>
            {STATUS_LABELS[project.status]}
          </span>
        </div>
      ))}
    </div>
  )
}
```

---

## 開發流程

### 日常開發指令

```bash
# 啟動所有服務（前端 + 後端）
pnpm dev

# 只啟動後端
pnpm dev:backend

# 只啟動前端
pnpm dev:frontend

# 建置所有專案
pnpm build

# 建置特定專案
pnpm build:backend
pnpm build:frontend

# 執行測試
pnpm test

# Lint 檢查
pnpm lint

# 清理所有 node_modules 和 build 檔案
pnpm clean
```

### 新增依賴套件

```bash
# 在 root 安裝開發依賴
pnpm add -D -w <package-name>

# 在後端安裝依賴
pnpm --filter backend add <package-name>

# 在前端安裝依賴
pnpm --filter frontend add <package-name>

# 在共用套件安裝依賴
pnpm --filter shared add <package-name>
```

### Git 工作流程

```bash
# 建立新功能分支
git checkout -b feature/project-management

# 提交變更
git add .
git commit -m "feat: add project management module"

# 推送到遠端
git push origin feature/project-management

# 建立 Pull Request（在 GitHub 上操作）
```

---

## Zeabur 部署指南

### 後端配置

#### `apps/backend/package.json`

```json
{
  "name": "backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "nest start --watch",
    "build": "nest build",
    "start": "node dist/main.js",
    "start:prod": "node dist/main.js",
    "migration:generate": "typeorm migration:generate",
    "migration:run": "typeorm migration:run",
    "migration:revert": "typeorm migration:revert",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\"",
    "test": "jest"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/typeorm": "^10.0.0",
    "@nestjs/jwt": "^10.0.0",
    "@nestjs/passport": "^10.0.0",
    "@nestjs/config": "^3.0.0",
    "typeorm": "^0.3.17",
    "pg": "^8.11.0",
    "minio": "^7.1.3",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "bcrypt": "^5.1.1",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1",
    "shared": "workspace:*"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@types/node": "^20.0.0",
    "@types/express": "^4.17.0",
    "@types/passport-jwt": "^4.0.0",
    "@types/bcrypt": "^5.0.0",
    "typescript": "^5.3.0",
    "ts-node": "^10.9.0",
    "jest": "^29.0.0",
    "@types/jest": "^29.0.0"
  }
}
```

#### `apps/backend/zbpack.json`

```json
{
  "build_command": "pnpm install && pnpm run build",
  "start_command": "node dist/main.js",
  "install_command": "pnpm install --frozen-lockfile",
  "framework": "nodejs",
  "node_version": "18",
  "env": {
    "NODE_ENV": "production"
  }
}
```

#### `apps/backend/Dockerfile` (可選)

```dockerfile
FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm@8.15.0

FROM base AS dependencies

WORKDIR /app

# Copy workspace files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/backend/package.json ./apps/backend/

# Install dependencies
RUN pnpm install --frozen-lockfile

FROM base AS build

WORKDIR /app

# Copy dependencies
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/packages ./packages
COPY --from=dependencies /app/apps/backend/node_modules ./apps/backend/node_modules

# Copy source code
COPY packages/shared ./packages/shared
COPY apps/backend ./apps/backend

# Build
WORKDIR /app/apps/backend
RUN pnpm run build

FROM base AS production

WORKDIR /app

# Copy built files
COPY --from=build /app/apps/backend/dist ./dist
COPY --from=build /app/apps/backend/node_modules ./node_modules
COPY --from=build /app/apps/backend/package.json ./

# Expose port
EXPOSE 3000

CMD ["node", "dist/main.js"]
```

---

### 前端配置

#### `apps/frontend/package.json`

```json
{
  "name": "frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.0",
    "shared": "workspace:*"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "14.1.0"
  }
}
```

#### `apps/frontend/zbpack.json`

```json
{
  "build_command": "pnpm install && pnpm run build",
  "start_command": "pnpm run start",
  "install_command": "pnpm install --frozen-lockfile",
  "framework": "nextjs",
  "node_version": "18",
  "env": {
    "NODE_ENV": "production"
  }
}
```

#### `apps/frontend/next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 環境變數
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  // 圖片優化
  images: {
    domains: ['localhost'],
  },

  // 輸出模式
  output: 'standalone',

  // 實驗性功能
  experimental: {
    optimizePackageImports: ['lodash', 'date-fns'],
  },
}

module.exports = nextConfig
```

---

### Zeabur 部署步驟

#### 步驟 1：建立 Zeabur 專案

1. 登入 [Zeabur Dashboard](https://zeabur.com)
2. 點擊 **"New Project"**
3. 輸入專案名稱：`vendor-assessment-mvp`

#### 步驟 2：部署後端服務

1. 在專案中點擊 **"Add Service"** → **"Git"**
2. 選擇你的 GitHub Repo：`Dataresource_MVP_Backend`
3. **Root Directory**: 設定為 `apps/backend`
4. Zeabur 會自動偵測到 `zbpack.json` 並開始建置
5. 等待建置完成

#### 步驟 3：新增 PostgreSQL 服務

1. 點擊 **"Add Service"** → **"Marketplace"**
2. 選擇 **"PostgreSQL"**
3. Zeabur 會自動產生連線字串
4. 複製 `DATABASE_URL` 環境變數

#### 步驟 4：新增 MinIO 服務（選配）

1. 點擊 **"Add Service"** → **"Marketplace"**
2. 選擇 **"MinIO"** 或使用其他 S3 相容服務
3. 複製連線資訊

#### 步驟 5：設定後端環境變數

在後端服務的 **"Environment Variables"** 頁面新增：

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# MinIO / S3
MINIO_ENDPOINT=your-minio-endpoint
MINIO_PORT=9000
MINIO_USE_SSL=true
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key
MINIO_BUCKET=uploads

# CORS（前端網域）
CORS_ORIGIN=https://your-frontend.zeabur.app

# Application
NODE_ENV=production
PORT=3000
```

#### 步驟 6：部署前端服務

1. 再次點擊 **"Add Service"** → **"Git"**
2. 選擇**同一個 Repo**：`Dataresource_MVP_Backend`
3. **Root Directory**: 設定為 `apps/frontend`
4. Zeabur 會自動偵測 Next.js 專案

#### 步驟 7：設定前端環境變數

在前端服務的 **"Environment Variables"** 頁面新增：

```bash
# API URL（使用後端服務的網域）
NEXT_PUBLIC_API_URL=https://your-backend.zeabur.app

# Application
NEXT_PUBLIC_APP_NAME=廠商安全評估系統
NEXT_PUBLIC_MAX_FILE_SIZE=104857600
```

#### 步驟 8：設定自訂網域（選配）

1. 在後端服務點擊 **"Domains"**
2. 新增自訂網域：`api.yourdomain.com`
3. 在前端服務點擊 **"Domains"**
4. 新增自訂網域：`app.yourdomain.com`
5. 更新前端環境變數 `NEXT_PUBLIC_API_URL`

#### 步驟 9：執行資料庫遷移

在後端服務的 **"Console"** 頁面執行：

```bash
pnpm run migration:run
```

#### 步驟 10：驗證部署

1. 開啟前端網址：`https://your-frontend.zeabur.app`
2. 測試登入功能
3. 測試專案建立
4. 測試檔案上傳

---

### Zeabur 部署檢查清單

```markdown
## 部署前確認

- [ ] Root `package.json` 設定 workspace
- [ ] `pnpm-workspace.yaml` 已建立
- [ ] 每個 app 都有自己的 `package.json`
- [ ] 每個 app 都有 `zbpack.json`
- [ ] 環境變數已準備好（不要提交到 Git）

## 後端部署確認

- [ ] Root Directory = `apps/backend`
- [ ] `zbpack.json` 配置正確
- [ ] 環境變數已設定（DATABASE_URL、JWT_SECRET 等）
- [ ] PostgreSQL 服務已建立
- [ ] MinIO 服務已建立（或使用其他 S3 服務）

## 前端部署確認

- [ ] Root Directory = `apps/frontend`
- [ ] `zbpack.json` 配置正確
- [ ] 環境變數已設定（NEXT_PUBLIC_API_URL）
- [ ] CORS 設定允許前端網域

## 部署後驗證

- [ ] 後端健康檢查端點可存取 `/health`
- [ ] 前端可正常載入
- [ ] 前端可成功呼叫後端 API
- [ ] 資料庫連線正常
- [ ] 檔案上傳功能正常
- [ ] 登入功能正常
```

---

## 環境變數配置

### 後端 `apps/backend/.env.example`

```bash
# ====================================
# 資料庫配置
# ====================================
DATABASE_URL=postgresql://admin:password123@localhost:5432/vendor_assessment

# ====================================
# JWT 認證配置
# ====================================
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=30d

# ====================================
# MinIO / S3 儲存配置
# ====================================
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_BUCKET=uploads

# ====================================
# CORS 配置
# ====================================
CORS_ORIGIN=http://localhost:3001

# ====================================
# 應用程式配置
# ====================================
PORT=3000
NODE_ENV=development

# ====================================
# Email 配置（選配）
# ====================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# ====================================
# LINE Notify 配置（選配）
# ====================================
LINE_NOTIFY_TOKEN=your-line-notify-token
```

### 前端 `apps/frontend/.env.local.example`

```bash
# ====================================
# API 配置
# ====================================
NEXT_PUBLIC_API_URL=http://localhost:3000

# ====================================
# 應用程式配置
# ====================================
NEXT_PUBLIC_APP_NAME=廠商安全評估系統
NEXT_PUBLIC_MAX_FILE_SIZE=104857600
NEXT_PUBLIC_ALLOWED_FILE_TYPES=pdf,dwg,doc,docx,xls,xlsx

# ====================================
# 功能開關（選配）
# ====================================
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_SENTRY=false
```

---

## 本地開發環境設定

### 方案 A：使用 Docker（推薦）

適用於支援虛擬化的 CPU（Intel VT-x / AMD-V）

#### `docker-compose.yml`

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:18-alpine
    container_name: vendor-assessment-postgres
    environment:
      POSTGRES_DB: vendor_assessment
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin"]
      interval: 10s
      timeout: 5s
      retries: 5

  minio:
    image: minio/minio:latest
    container_name: vendor-assessment-minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin123
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3

  # 注意：後端和前端不在這裡啟動
  # 使用 pnpm dev 在本地開發

volumes:
  postgres_data:
    driver: local
  minio_data:
    driver: local
```

#### 啟動與管理

```bash
# 啟動所有基礎設施服務
docker-compose up -d

# 查看服務狀態
docker-compose ps

# 查看日誌
docker-compose logs -f

# 停止服務
docker-compose down

# 停止服務並刪除資料
docker-compose down -v
```

---

### 方案 B：本地安裝（無需 Docker）

適用於 CPU 不支援虛擬化或無法安裝 Docker 的環境

#### 快速安裝

```powershell
# 1. 安裝 PostgreSQL
.\setup-scripts\06-setup-local-postgresql.ps1

# 2. 安裝 MinIO
.\setup-scripts\07-setup-local-minio.ps1
```

#### 服務管理

**PostgreSQL**

```powershell
# 檢查服務狀態
Get-Service -Name postgresql*

# 啟動服務
Start-Service postgresql-x64-18

# 停止服務
Stop-Service postgresql-x64-18

# 測試連線
psql -U admin -d vendor_assessment -h localhost
```

**MinIO**

```powershell
# 啟動 MinIO（方式 1：使用批次檔）
C:\minio\start-minio.bat

# 啟動 MinIO（方式 2：使用 PowerShell）
C:\minio\start-minio.ps1

# 停止 MinIO
C:\minio\stop-minio.bat

# 或在運行視窗中按 Ctrl+C
```

#### 服務資訊

**PostgreSQL**
- 主機: `localhost:5432`
- 資料庫: `vendor_assessment`
- 使用者: `admin`
- 密碼: `password123`

**MinIO**
- API 端點: `http://localhost:9000`
- 控制台: `http://localhost:9001`
- Access Key: `minioadmin`
- Secret Key: `minioadmin123`

#### 詳細說明文件

完整的安裝指南請參考：
- **`setup-scripts/06-install-local-services.md`** - 詳細的本地安裝步驟
- **`setup-scripts/README.md`** - 所有設定腳本說明

---

## 常見問題

### 0. CPU 不支援虛擬化，無法使用 Docker

**問題**：執行 `docker-compose up` 時出現虛擬化相關錯誤

**解決方案**：

使用本地安裝方案（方案 B）：

```powershell
# 1. 執行 PostgreSQL 安裝腳本
.\setup-scripts\06-setup-local-postgresql.ps1

# 2. 執行 MinIO 安裝腳本
.\setup-scripts\07-setup-local-minio.ps1

# 3. 驗證服務已啟動
Get-Service -Name postgresql*
Get-Process minio -ErrorAction SilentlyContinue

# 4. 測試連線
psql -U admin -d vendor_assessment -h localhost
# 開啟瀏覽器：http://localhost:9001
```

**優點**：
- 無需虛擬化支援
- 更輕量，資源佔用少
- 啟動速度更快
- 與 Docker 方案使用相同的連線資訊

**詳細說明**：
- 參考 `setup-scripts/06-install-local-services.md`
- 參考 `setup-scripts/README.md`

### 1. pnpm 安裝依賴時出錯

**問題**：`ERR_PNPM_WORKSPACE_PKG_NOT_FOUND`

**解決方案**：
```bash
# 確認 pnpm-workspace.yaml 存在
cat pnpm-workspace.yaml

# 清除快取並重新安裝
pnpm store prune
pnpm install
```

### 2. 共用套件型別無法被識別

**問題**：前端或後端無法 import shared 套件

**解決方案**：
```bash
# 確認 shared 套件的 package.json 中有正確的 exports
# 確認前後端的 tsconfig.json 中有正確的 paths 設定

# 重新安裝依賴
pnpm install

# 重啟 TypeScript 伺服器（VSCode）
Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### 3. Zeabur 建置失敗

**問題**：`Build failed: command not found`

**解決方案**：
```bash
# 確認 zbpack.json 中的指令正確
# 確認 Root Directory 設定正確（apps/backend 或 apps/frontend）
# 確認 package.json 中的 scripts 存在

# 本地測試建置流程
cd apps/backend
pnpm install
pnpm run build
```

### 4. 前端無法連接後端 API

**問題**：CORS 錯誤或 Network Error

**解決方案**：
```bash
# 1. 確認後端的 CORS 設定
# apps/backend/src/main.ts
app.enableCors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
})

# 2. 確認前端的 API URL
# apps/frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3000

# 3. 檢查後端是否正常運行
curl http://localhost:3000/health
```

### 5. MinIO 連線失敗

**問題**：`Error: connect ECONNREFUSED`

**解決方案**：

**如果使用 Docker：**
```bash
# 1. 確認 MinIO 容器正在運行
docker-compose ps minio

# 2. 確認環境變數正確
# apps/backend/.env
MINIO_ENDPOINT=localhost
MINIO_PORT=9000

# 3. 測試 MinIO 連線
curl http://localhost:9000/minio/health/live

# 4. 訪問 MinIO Console
open http://localhost:9001
```

**如果使用本地安裝：**
```powershell
# 1. 確認 MinIO 是否正在運行
# 檢查是否有 minio.exe 進程
Get-Process minio -ErrorAction SilentlyContinue

# 2. 啟動 MinIO
C:\minio\start-minio.bat

# 3. 檢查連接埠是否被占用
netstat -ano | findstr "9000"
netstat -ano | findstr "9001"

# 4. 訪問 MinIO 控制台
# 開啟瀏覽器：http://localhost:9001
# 帳號：minioadmin / minioadmin123
```

### 6. 資料庫遷移失敗

**問題**：`TypeORM migration failed`

**解決方案**：
```bash
# 1. 確認資料庫連線
psql $DATABASE_URL -c "SELECT 1"

# 2. 檢查遷移檔案
ls apps/backend/src/database/migrations/

# 3. 手動執行遷移
cd apps/backend
pnpm run migration:run

# 4. 如果需要回滾
pnpm run migration:revert
```

### 7. Turborepo 快取問題

**問題**：建置結果不正確，疑似使用舊的快取

**解決方案**：
```bash
# 清除 Turborepo 快取
rm -rf .turbo

# 清除所有建置產物
pnpm clean

# 重新建置
pnpm build
```

---

## 開發團隊協作

### Git Branch 策略

```
main            ← 正式環境
  ↑
  └─ develop    ← 開發環境
       ↑
       ├─ feature/project-management
       ├─ feature/file-upload
       └─ bugfix/login-issue
```

### Commit Message 規範

遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

```bash
# 新功能
git commit -m "feat(projects): add project creation API"

# 修復 Bug
git commit -m "fix(auth): resolve JWT token expiration issue"

# 文件更新
git commit -m "docs(readme): update deployment guide"

# 程式碼重構
git commit -m "refactor(uploads): extract storage service"

# 效能優化
git commit -m "perf(api): optimize database queries"

# 測試
git commit -m "test(projects): add unit tests for project service"

# 建置相關
git commit -m "build(deps): upgrade nestjs to v10.3.0"
```

### Code Review 檢查項目

- [ ] 程式碼符合 ESLint 規範
- [ ] 有適當的註解說明
- [ ] 共用型別已定義在 `packages/shared`
- [ ] API 端點有對應的 DTO 驗證
- [ ] 敏感資訊沒有寫死在程式碼中
- [ ] 錯誤處理完善
- [ ] 有撰寫單元測試（重要功能）

---

## 效能優化建議

### 前端優化

```typescript
// 1. 使用 Dynamic Import 減少初始載入
const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <div>載入中...</div>,
  ssr: false,
})

// 2. 使用 React.memo 避免不必要的重新渲染
export const ProjectCard = React.memo(({ project }: ProjectCardProps) => {
  // ...
})

// 3. 使用 useMemo 和 useCallback
const sortedProjects = useMemo(() => {
  return projects.sort((a, b) => a.name.localeCompare(b.name))
}, [projects])
```

### 後端優化

```typescript
// 1. 使用索引優化資料庫查詢
@Index(['projectId', 'status'])
@Entity('uploads')
export class Upload {
  // ...
}

// 2. 使用 QueryBuilder 減少 N+1 查詢
const projects = await this.projectRepository
  .createQueryBuilder('project')
  .leftJoinAndSelect('project.uploads', 'uploads')
  .where('project.status = :status', { status: ProjectStatus.ACTIVE })
  .getMany()

// 3. 使用快取（Redis）
@Injectable()
export class ProjectService {
  @Cacheable({ ttl: 300 })
  async findAll(): Promise<Project[]> {
    return this.projectRepository.find()
  }
}
```

---

## 安全性檢查清單

- [ ] **環境變數**：敏感資訊不要提交到 Git
- [ ] **JWT Secret**：使用強密碼（至少 32 字元）
- [ ] **CORS**：只允許信任的網域
- [ ] **檔案上傳**：驗證檔案類型和大小
- [ ] **SQL Injection**：使用 TypeORM 參數化查詢
- [ ] **XSS**：前端輸出時進行 HTML 轉義
- [ ] **CSRF**：使用 CSRF Token（如需要）
- [ ] **Rate Limiting**：API 限流防止濫用
- [ ] **HTTPS**：正式環境必須使用 HTTPS
- [ ] **依賴套件**：定期更新並檢查漏洞

```bash
# 檢查依賴套件漏洞
pnpm audit

# 自動修復（小心）
pnpm audit fix
```

---

## 監控與日誌

### 推薦工具

- **Sentry**：錯誤追蹤
- **LogRocket**：前端行為錄製
- **Datadog**：全方位監控
- **Grafana + Prometheus**：開源監控方案

### 基本日誌設定

```typescript
// apps/backend/src/main.ts
import { Logger } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  })

  const logger = new Logger('Bootstrap')

  await app.listen(3000)
  logger.log(`Application is running on: ${await app.getUrl()}`)
}
```

---

## 資源連結

- [NestJS 官方文件](https://docs.nestjs.com/)
- [Next.js 官方文件](https://nextjs.org/docs)
- [TypeORM 官方文件](https://typeorm.io/)
- [pnpm 官方文件](https://pnpm.io/)
- [Turborepo 官方文件](https://turbo.build/repo/docs)
- [Zeabur 官方文件](https://zeabur.com/docs)
- [MinIO 官方文件](https://min.io/docs/minio/linux/index.html)

---

## 授權

MIT License

---

**建立日期**: 2025-01-27
**最後更新**: 2025-01-27
**維護者**: 開發團隊
