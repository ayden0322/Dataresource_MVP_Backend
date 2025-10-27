# 後端專案結構

## 📁 目錄結構

```
apps/backend/
├── src/                          # 原始碼目錄
│   ├── auth/                     # 認證模組
│   │   ├── decorators/           # 自訂裝飾器
│   │   │   ├── current-user.decorator.ts  # 取得當前使用者
│   │   │   ├── public.decorator.ts        # 公開端點標記
│   │   │   └── roles.decorator.ts         # 角色權限標記
│   │   ├── dto/                  # 資料傳輸物件
│   │   │   ├── login.dto.ts
│   │   │   └── register.dto.ts
│   │   ├── guards/               # 守衛
│   │   │   ├── jwt-auth.guard.ts     # JWT 認證守衛
│   │   │   ├── local-auth.guard.ts   # 本地認證守衛
│   │   │   └── roles.guard.ts        # 角色權限守衛
│   │   ├── strategies/           # Passport 策略
│   │   │   ├── jwt.strategy.ts       # JWT 策略
│   │   │   └── local.strategy.ts     # 本地策略
│   │   ├── auth.controller.ts    # 控制器
│   │   ├── auth.module.ts        # 模組
│   │   └── auth.service.ts       # 服務
│   │
│   ├── users/                    # 使用者管理模組
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   └── update-user.dto.ts
│   │   ├── entities/
│   │   │   └── user.entity.ts        # 使用者實體
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   └── users.service.ts
│   │
│   ├── projects/                 # 專案管理模組
│   │   ├── dto/
│   │   │   ├── create-project.dto.ts
│   │   │   └── update-project.dto.ts
│   │   ├── entities/
│   │   │   ├── project.entity.ts         # 專案實體
│   │   │   └── required-document.entity.ts  # 必要文件實體
│   │   ├── projects.controller.ts
│   │   ├── projects.module.ts
│   │   └── projects.service.ts
│   │
│   ├── uploads/                  # 檔案上傳模組
│   │   ├── dto/
│   │   │   └── upload-file.dto.ts
│   │   ├── entities/
│   │   │   └── upload.entity.ts      # 上傳記錄實體
│   │   ├── storage.service.ts        # MinIO 儲存服務
│   │   ├── uploads.controller.ts
│   │   ├── uploads.module.ts
│   │   └── uploads.service.ts
│   │
│   ├── reviews/                  # 審核模組
│   │   ├── dto/
│   │   │   └── create-review.dto.ts
│   │   ├── entities/
│   │   │   └── review.entity.ts      # 審核記錄實體
│   │   ├── reviews.controller.ts
│   │   ├── reviews.module.ts
│   │   └── reviews.service.ts
│   │
│   ├── config/                   # 配置檔案
│   │   ├── configuration.ts      # 環境變數配置
│   │   └── typeorm.config.ts     # TypeORM 配置
│   │
│   ├── database/                 # 資料庫相關
│   │   ├── migrations/           # 資料庫遷移
│   │   │   └── 1704067200000-InitialSchema.ts
│   │   └── seeds/                # 初始資料
│   │       ├── initial-user.seed.ts   # 初始使用者
│   │       └── seed.ts                # Seed 執行檔
│   │
│   ├── app.controller.ts         # 應用程式控制器
│   ├── app.module.ts             # 應用程式主模組
│   ├── app.service.ts            # 應用程式服務
│   └── main.ts                   # 應用程式入口
│
├── test/                         # 測試目錄
├── .env                          # 環境變數
├── .env.example                  # 環境變數範例
├── .eslintrc.js                  # ESLint 配置
├── .gitignore                    # Git 忽略檔案
├── .prettierrc                   # Prettier 配置
├── Dockerfile                    # Docker 映像檔
├── jest.config.js                # Jest 配置
├── nest-cli.json                 # NestJS CLI 配置
├── package.json                  # 套件依賴
├── tsconfig.json                 # TypeScript 配置
├── zbpack.json                   # Zeabur 部署配置
├── README.md                     # 專案說明
├── QUICKSTART.md                 # 快速啟動指南
└── STRUCTURE.md                  # 專案結構說明（本檔案）
```

## 📦 模組說明

### Auth 模組 (auth/)

負責使用者認證與授權：

- **JWT 認證**: 使用 JWT Token 進行無狀態認證
- **角色權限**: 支援 SUPER_ADMIN、ADMIN、VIEWER 三種角色
- **守衛機制**: 保護需要認證的路由
- **裝飾器**: 提供便捷的權限控制

**主要功能**:
- 使用者登入
- 使用者註冊
- 取得個人資料
- Token 驗證

### Users 模組 (users/)

管理系統使用者：

- **使用者 CRUD**: 建立、查詢、更新、刪除使用者
- **密碼加密**: 使用 bcrypt 加密密碼
- **角色管理**: 管理使用者角色權限
- **軟刪除**: 停用使用者而非直接刪除

**主要功能**:
- 查詢所有使用者
- 查詢單一使用者
- 建立新使用者
- 更新使用者資料
- 停用/刪除使用者

### Projects 模組 (projects/)

管理工程專案：

- **專案管理**: 建立和管理專案
- **文件清單**: 設定專案所需文件
- **上傳連結**: 產生專案專屬的上傳 Token
- **狀態管理**: 管理專案狀態（草稿/進行中/已完成/已歸檔）

**主要功能**:
- 建立專案並設定所需文件
- 查詢專案列表
- 取得專案詳情
- 產生上傳連結
- 根據 Token 取得專案（供廠商使用）
- 更新專案狀態

### Uploads 模組 (uploads/)

處理檔案上傳：

- **檔案上傳**: 接收並儲存檔案到 MinIO
- **檔案驗證**: 檢查檔案類型和大小
- **版本控制**: 支援同一文件多次上傳
- **MinIO 整合**: 使用 MinIO 作為物件儲存

**主要功能**:
- 上傳檔案（公開端點）
- 查詢上傳記錄
- 下載檔案
- 取得檔案 URL
- 刪除上傳記錄

### Reviews 模組 (reviews/)

文件審核管理：

- **審核流程**: 通過或退回文件
- **審核備註**: 記錄審核意見
- **審核歷史**: 追蹤文件審核記錄
- **狀態同步**: 自動更新檔案狀態

**主要功能**:
- 建立審核記錄
- 查詢審核記錄
- 根據專案查詢審核
- 根據上傳記錄查詢審核

## 🗃️ 資料庫實體

### User (users)

使用者實體，包含：
- 基本資料（email, name）
- 密碼（加密）
- 角色（SUPER_ADMIN, ADMIN, VIEWER）
- 啟用狀態

### Project (projects)

專案實體，包含：
- 專案名稱和描述
- 專案狀態
- 上傳 Token
- 建立者關聯

### RequiredDocument (required_documents)

必要文件實體，包含：
- 文件名稱和描述
- 是否必填
- 所屬專案

### Upload (uploads)

上傳記錄實體，包含：
- 檔案資訊（名稱、大小、類型）
- 儲存路徑
- 版本號
- 上傳者資訊
- 審核狀態

### Review (reviews)

審核記錄實體，包含：
- 審核狀態
- 審核備註
- 審核者
- 關聯的上傳記錄

## 🔐 認證與授權

### JWT 策略

使用 JWT Token 進行認證：
1. 使用者登入成功後取得 Token
2. 後續請求在 Header 中攜帶 Token
3. 伺服器驗證 Token 並取得使用者資訊

### 角色權限

三種角色權限：

| 角色 | 權限 |
|------|------|
| SUPER_ADMIN | 最高權限，可管理所有功能 |
| ADMIN | 可管理專案、審核文件 |
| VIEWER | 唯讀權限，可查看專案和文件 |

### 守衛使用

```typescript
@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)  // 需要認證和角色檢查
export class ProjectsController {
  
  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)  // 只有 SUPER_ADMIN 和 ADMIN 可存取
  create() { ... }
  
  @Public()  // 公開端點，不需要認證
  @Get('token/:token')
  findByToken() { ... }
}
```

## 📝 DTO 驗證

使用 class-validator 進行資料驗證：

```typescript
export class CreateProjectDto {
  @IsString()
  @MinLength(2, { message: '專案名稱至少需要 2 個字元' })
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  requiredDocuments: RequiredDocumentDto[];
}
```

## 🔄 資料庫遷移

### 建立遷移

```bash
pnpm migration:generate -- src/database/migrations/MigrationName
```

### 執行遷移

```bash
pnpm migration:run
```

### 回滾遷移

```bash
pnpm migration:revert
```

## 🌱 初始資料 (Seeds)

執行 Seed 建立初始資料：

```bash
pnpm seed
```

會建立：
- 預設管理員帳號（admin@example.com / admin123456）

## 📦 MinIO 儲存服務

### 初始化

應用程式啟動時自動檢查並建立 Bucket。

### 檔案上傳

```typescript
await storageService.uploadFile(file, projectId, documentId);
```

### 檔案下載

```typescript
const buffer = await storageService.downloadFile(filename);
```

### 取得檔案 URL

```typescript
const url = await storageService.getFileUrl(filename);
```

## 🧪 測試

### 單元測試

```bash
pnpm test
```

### 測試覆蓋率

```bash
pnpm test:cov
```

### 監視模式

```bash
pnpm test:watch
```

## 🚀 部署

### 建置

```bash
pnpm build
```

### 執行

```bash
pnpm start:prod
```

### Docker

```bash
docker build -t vendor-assessment-backend .
docker run -p 3000:3000 --env-file .env vendor-assessment-backend
```

## 📚 相關文件

- [快速啟動指南](./QUICKSTART.md)
- [API 文件](./README.md)
- [專案執行文件](../../MVP專案執行文件.md)

---

**最後更新**: 2025-10-27

