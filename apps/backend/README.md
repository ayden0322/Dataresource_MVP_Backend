# 廠商安全評估系統 - 後端 API

這是廠商安全評估系統的後端 API，使用 NestJS + TypeORM + JWT 建構。

## 技術棧

- **框架**: NestJS 10
- **資料庫**: PostgreSQL 18
- **ORM**: TypeORM
- **認證**: JWT + Passport
- **檔案儲存**: MinIO (S3 相容)
- **驗證**: class-validator + class-transformer

## 功能模組

- ✅ **Auth 模組**: JWT 認證、登入、註冊
- ✅ **Users 模組**: 使用者管理、角色權限
- ✅ **Projects 模組**: 專案管理、文件清單設定
- ✅ **Uploads 模組**: 檔案上傳、MinIO 整合
- ✅ **Reviews 模組**: 文件審核、狀態管理

## 開始使用

### 1. 安裝依賴

```bash
# 在專案根目錄執行
pnpm install
```

### 2. 設定環境變數

```bash
# 複製環境變數範例檔案
cp .env.example .env

# 編輯 .env 檔案，填入實際的資料庫連線資訊
```

### 3. 啟動資料庫和 MinIO

**方案 A: 使用 Docker**

```bash
# 在專案根目錄執行
docker-compose up -d
```

**方案 B: 本地安裝**

```bash
# 安裝 PostgreSQL
.\setup-scripts\06-setup-local-postgresql.ps1

# 安裝 MinIO
.\setup-scripts\07-setup-local-minio.ps1
```

### 4. 執行資料庫遷移

```bash
# 執行遷移
pnpm run migration:run

# 如需產生新的遷移檔案
pnpm run migration:generate -- src/database/migrations/InitialSchema
```

### 5. 啟動開發伺服器

```bash
# 從根目錄啟動
pnpm dev:backend

# 或在此目錄啟動
pnpm dev
```

應用程式將運行於: http://localhost:3000

## API 文件

### 認證相關

- `POST /api/auth/login` - 使用者登入
- `POST /api/auth/register` - 註冊新使用者
- `GET /api/auth/profile` - 取得目前使用者資訊
- `GET /api/auth/me` - 取得目前使用者簡要資訊

### 使用者管理

- `GET /api/users` - 取得所有使用者
- `GET /api/users/:id` - 取得指定使用者
- `POST /api/users` - 建立新使用者
- `PATCH /api/users/:id` - 更新使用者
- `DELETE /api/users/:id` - 刪除使用者

### 專案管理

- `GET /api/projects` - 取得所有專案
- `GET /api/projects/:id` - 取得指定專案
- `GET /api/projects/token/:token` - 根據 Token 取得專案（公開）
- `POST /api/projects` - 建立新專案
- `PATCH /api/projects/:id` - 更新專案
- `DELETE /api/projects/:id` - 刪除專案
- `GET /api/projects/:id/upload-link` - 取得專案上傳連結

### 檔案上傳

- `POST /api/uploads` - 上傳檔案（公開）
- `GET /api/uploads` - 取得所有上傳記錄
- `GET /api/uploads/:id` - 取得指定上傳記錄
- `GET /api/uploads/project/:projectId` - 取得專案的上傳記錄
- `GET /api/uploads/:id/download-url` - 取得檔案下載連結
- `GET /api/uploads/:id/download` - 下載檔案
- `DELETE /api/uploads/:id` - 刪除上傳記錄

### 審核管理

- `GET /api/reviews` - 取得所有審核記錄
- `GET /api/reviews/:id` - 取得指定審核記錄
- `GET /api/reviews/upload/:uploadId` - 取得上傳記錄的審核歷史
- `GET /api/reviews/project/:projectId` - 取得專案的審核記錄
- `POST /api/reviews` - 建立審核記錄
- `DELETE /api/reviews/:id` - 刪除審核記錄

## 資料庫遷移指令

```bash
# 產生新的遷移檔案
pnpm run migration:generate -- src/database/migrations/MigrationName

# 執行遷移
pnpm run migration:run

# 回滾最後一次遷移
pnpm run migration:revert
```

## 建置與部署

### 建置

```bash
pnpm run build
```

### 執行生產環境

```bash
pnpm run start:prod
```

### Docker 部署

```bash
# 建置映像檔
docker build -t vendor-assessment-backend .

# 執行容器
docker run -p 3000:3000 --env-file .env vendor-assessment-backend
```

## 角色權限

- **SUPER_ADMIN**: 最高權限，可管理所有功能
- **ADMIN**: 可管理專案、審核文件
- **VIEWER**: 唯讀權限，可查看專案和文件

## 環境變數說明

| 變數名稱 | 說明 | 預設值 |
|---------|------|--------|
| DATABASE_URL | PostgreSQL 連線字串 | - |
| JWT_SECRET | JWT 密鑰 | - |
| JWT_EXPIRES_IN | JWT 過期時間 | 7d |
| MINIO_ENDPOINT | MinIO 端點 | localhost |
| MINIO_PORT | MinIO 連接埠 | 9000 |
| MINIO_ACCESS_KEY | MinIO Access Key | minioadmin |
| MINIO_SECRET_KEY | MinIO Secret Key | minioadmin123 |
| MINIO_BUCKET | MinIO Bucket 名稱 | uploads |
| PORT | 應用程式連接埠 | 3000 |
| NODE_ENV | 執行環境 | development |

## 常見問題

### Q: 無法連接資料庫？

確認 PostgreSQL 服務已啟動：

```bash
# Windows
Get-Service -Name postgresql*

# 啟動服務
Start-Service postgresql-x64-18
```

### Q: MinIO 連接失敗？

確認 MinIO 服務已啟動：

```bash
# 啟動 MinIO
C:\minio\start-minio.bat

# 訪問控制台
http://localhost:9001
```

### Q: 如何建立第一個管理員帳號？

使用 `/api/auth/register` 端點註冊第一個使用者，或直接在資料庫中建立。

## 授權

MIT License

