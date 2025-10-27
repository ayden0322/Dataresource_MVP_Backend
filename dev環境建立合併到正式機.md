# 開發環境建立與合併到正式機指南

## 📊 目前部署狀況總結

### ✅ Develop 分支 - 開發環境

- **URL**: https://devdataresource-mvp.zeabur.app
- **分支**: `develop`
- **狀態**: ✅ 運行正常
- **資料庫**: ✅ PostgreSQL 已連接並執行 migration
- **檔案儲存**: ✅ MinIO 已設定
- **API 測試**: ✅ 登入、專案管理功能正常

### 📝 程式碼優化記錄

最近的重要 commits：

```
e89b269 - 移除 cross-env，修復 migration 指令
670b951 - 將建置依賴移至 dependencies
0734a39 - 將 @nestjs/cli 和 typescript 移至 dependencies
881fa05 - 移除 Dockerfile，使用 zbpack.json
8fe2d11 - 停用 Dockerfile 配置
```

### 🗄️ 資料庫結構

已建立的表格：
- `users` - 使用者表
- `projects` - 專案表
- `required_documents` - 必要文件表
- `uploads` - 檔案上傳表
- `reviews` - 審核表
- `migrations` - 遷移記錄表

---

## 🚀 部署到正式環境檢查清單

### 步驟 1：部署前檢查

#### ✅ 程式碼檢查

- [x] 所有測試都通過
- [x] API 功能正常
- [x] 資料庫 migration 成功
- [x] 沒有不必要的 console.log 或 debug 程式碼
- [ ] README.md 已更新（如果需要）
- [ ] .env.example 已更新為正式環境的範例

#### ✅ 安全性檢查

- [ ] **JWT_SECRET** - 需要更換為強密碼（至少 32 字元）
- [ ] **DATABASE_URL** - 由 Zeabur 自動提供
- [ ] **MINIO 憑證** - 由 Zeabur 自動提供
- [ ] 沒有敏感資訊被提交到 Git
- [ ] CORS_ORIGIN 設定正確

#### ✅ Zeabur 配置檢查

- [x] zbpack.json 配置正確
- [x] package.json 依賴正確（建置依賴在 dependencies）
- [x] Migration 指令可在生產環境執行
- [ ] 環境變數準備就緒

---

## 📝 Merge 到 Main 的完整流程

### 方法 1：使用命令列

```bash
# 1. 確保 develop 分支是最新的
git checkout develop
git pull origin develop

# 2. 確保沒有未提交的變更
git status

# 3. 切換到 main 分支
git checkout main

# 4. 拉取最新的 main
git pull origin main

# 5. 合併 develop（使用 --no-ff 保留 merge commit）
git merge develop --no-ff -m "chore: merge develop to main for production deployment

包含以下更新：
- 修復 Zeabur 建置問題（移除 Dockerfile）
- 將建置依賴移至 dependencies
- 修復 migration 指令
- 資料庫結構已建立並測試
- API 功能測試通過"

# 6. 檢查合併結果
git log --oneline -5

# 7. 推送到遠端
git push origin main

# 8. 切回 develop 繼續開發
git checkout develop
```

### 方法 2：使用 GitHub Pull Request（推薦）

1. 前往 GitHub Repository
2. 點擊 "Pull requests" → "New pull request"
3. Base: `main` ← Compare: `develop`
4. 填寫 PR 標題和說明
5. 請團隊成員 Review（如果有）
6. Merge Pull Request

---

## 🔧 正式環境配置

### 部署選項

#### 選項 A：使用相同的 Zeabur 服務（快速測試）

**優點**：快速、簡單
**缺點**：開發和正式共用同一個資料庫

**步驟**：
1. 在 Zeabur 後端服務設定中
2. 將 **Branch** 從 `develop` 改為 `main`
3. Zeabur 會自動重新部署

#### 選項 B：建立全新的正式環境專案（推薦）

**優點**：開發和正式環境完全分離
**缺點**：需要重新設定

**環境架構**：

```
開發環境 (develop 分支)
├── URL: https://dev-dataresource-mvp.zeabur.app
├── 用途: 開發測試
├── 資料庫: 測試資料
└── 可以隨意測試和修改

正式環境 (main 分支)
├── URL: https://dataresource-mvp.zeabur.app
├── 用途: 正式上線
├── 資料庫: 正式資料
└── 穩定版本，謹慎更新
```

---

## 🎯 建立正式環境的詳細步驟

### 步驟 1：在 Zeabur 建立新專案

1. 登入 [Zeabur Dashboard](https://zeabur.com/dashboard)
2. 點擊 **"New Project"**
3. 輸入專案名稱：`vendor-assessment-production`

### 步驟 2：部署後端服務

1. 點擊 **"Add Service"** → **"Git"**
2. 選擇你的 Repository：`Dataresource_MVP_Backend`
3. **Branch**: 選擇 `main`
4. **Root Directory**: 設定為 `apps/backend`
5. 等待自動偵測 `zbpack.json` 並開始建置

### 步驟 3：新增 PostgreSQL 服務

1. 點擊 **"Add Service"** → **"Marketplace"**
2. 選擇 **"PostgreSQL"**
3. Zeabur 會自動產生連線字串

### 步驟 4：新增 MinIO 服務

1. 點擊 **"Add Service"** → **"Marketplace"**
2. 選擇 **"MinIO"**
3. Zeabur 會自動產生連線資訊

### 步驟 5：設定環境變數

在後端服務的 **"Environment Variables"** 頁面新增：

#### 🔐 安全性配置（**必須自訂**）

```bash
# JWT Secret - 請使用強密碼（至少 32 字元）
JWT_SECRET=請替換成至少32字元的隨機字串
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=請替換成另一個至少32字元的隨機字串
JWT_REFRESH_EXPIRES_IN=30d
```

> 💡 **產生安全的 Secret**：
>
> **PowerShell**:
> ```powershell
> -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
> ```
>
> **線上工具**: https://randomkeygen.com/
>
> **命令列**:
> ```bash
> openssl rand -base64 32
> ```

#### 🗄️ 資料庫配置（Zeabur 自動提供）

```bash
DATABASE_URL=${POSTGRES.DATABASE_URL}
DATABASE_SSL=true
```

#### 📦 MinIO 配置（Zeabur 自動提供）

```bash
MINIO_ENDPOINT=${MINIO.HOST}
MINIO_PORT=${MINIO.PORT}
MINIO_USE_SSL=true
MINIO_ACCESS_KEY=${MINIO.USERNAME}
MINIO_SECRET_KEY=${MINIO.PASSWORD}
MINIO_BUCKET=uploads
```

#### 🌐 應用程式配置

```bash
# 環境設定
NODE_ENV=production
PORT=3000

# CORS（部署前端後更新）
CORS_ORIGIN=https://your-frontend.zeabur.app

# 或暫時允許所有來源（不建議長期使用）
# CORS_ORIGIN=*

# 前端 URL（選填）
FRONTEND_URL=https://your-frontend.zeabur.app
```

### 步驟 6：執行資料庫遷移

服務部署成功後，在 Zeabur 後端服務的 **Console** 中執行：

```bash
# 1. 執行 migration 建立表格
pnpm run migration:run

# 2. 執行 seed 建立預設管理員
pnpm run seed
```

預設管理員帳號：
- **Email**: `admin@example.com`
- **Password**: `admin123456`
- **角色**: SUPER_ADMIN

⚠️ **重要**：登入後請立即修改預設密碼！

### 步驟 7：驗證部署

測試以下 API 端點：

```bash
# 1. 健康檢查
curl https://your-production-url.zeabur.app/api/health

# 2. 登入測試
curl -X POST https://your-production-url.zeabur.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123456"
  }'

# 3. 查詢專案（需要先登入取得 token）
curl https://your-production-url.zeabur.app/api/projects \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## ⚠️ 部署前安全檢查

### 1. 檢查敏感資訊

```bash
# 在專案根目錄執行，確認沒有真實的密碼或 token
git grep -i "password"
git grep -i "secret"
git grep -i "token"
git grep -i "@gmail.com"
```

### 2. 確認 .env.example 是範例值

確保 `apps/backend/.env.example` 中的值都是範例，不是真實的：

```bash
# 正確 ✅
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
MINIO_ACCESS_KEY=minioadmin

# 錯誤 ❌（不要包含真實的密碼或 token）
JWT_SECRET=abc123RealSecretXYZ789
MINIO_ACCESS_KEY=my-real-access-key
```

### 3. 檢查 .gitignore

確認以下檔案不會被提交：

```
.env
.env.local
.env*.local
*.log
node_modules/
dist/
```

---

## 🎊 部署後操作

### 1. 建立正式環境管理員

**方法 A：使用 Seed Script（推薦）**

```bash
pnpm run seed
```

**方法 B：透過 API 註冊**

```bash
curl -X POST https://your-production-url.zeabur.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@yourcompany.com",
    "password": "your-secure-password",
    "name": "系統管理員"
  }'
```

然後在 pgAdmin 中將角色升級為 SUPER_ADMIN：

```sql
UPDATE users
SET role = 'SUPER_ADMIN'
WHERE email = 'admin@yourcompany.com';
```

### 2. 連接正式資料庫（使用 pgAdmin）

1. 從 Zeabur PostgreSQL 服務頁面取得連線資訊
2. 在 pgAdmin 中建立新連線：
   - Host: [從 Zeabur 複製]
   - Port: 5432
   - Database: zeabur
   - Username: root
   - Password: [從 Zeabur 複製]
   - SSL Mode: Require

### 3. 設定自訂網域（選填）

1. 在 Zeabur 後端服務點擊 **"Domains"**
2. 新增自訂網域：`api.yourdomain.com`
3. 按照 Zeabur 指示設定 DNS CNAME 記錄
4. 更新環境變數 `CORS_ORIGIN`

---

## 📊 環境對照表

| 項目 | 開發環境 (develop) | 正式環境 (main) |
|------|-------------------|----------------|
| **分支** | develop | main |
| **URL** | dev-xxx.zeabur.app | xxx.zeabur.app |
| **資料庫** | 測試資料 | 正式資料 |
| **JWT_SECRET** | 測試用（可共享） | 強密碼（保密） |
| **CORS_ORIGIN** | * 或 localhost | 正式前端網址 |
| **NODE_ENV** | development | production |
| **用途** | 開發測試 | 正式上線 |
| **更新頻率** | 頻繁 | 穩定後才更新 |

---

## 🔄 持續部署流程

### 日常開發流程

```bash
# 1. 在 develop 分支開發新功能
git checkout develop
# ... 開發 ...
git add .
git commit -m "feat: add new feature"
git push origin develop

# 2. Zeabur 自動部署到開發環境
# 3. 測試功能是否正常

# 4. 功能穩定後，合併到 main
git checkout main
git merge develop
git push origin main

# 5. Zeabur 自動部署到正式環境
```

### 緊急修復流程（Hotfix）

```bash
# 1. 從 main 建立 hotfix 分支
git checkout main
git checkout -b hotfix/critical-bug-fix

# 2. 修復問題
# ... 修復 ...
git add .
git commit -m "fix: critical bug fix"

# 3. 合併回 main
git checkout main
git merge hotfix/critical-bug-fix
git push origin main

# 4. 同步到 develop
git checkout develop
git merge main
git push origin develop

# 5. 刪除 hotfix 分支
git branch -d hotfix/critical-bug-fix
```

---

## 📋 完整部署檢查清單

### 部署前

- [ ] 所有功能測試通過
- [ ] 資料庫 migration 成功
- [ ] API 測試正常
- [ ] 產生強密碼的 JWT_SECRET
- [ ] 檢查沒有敏感資訊在程式碼中
- [ ] .env.example 使用範例值
- [ ] README 文件已更新

### 部署中

- [ ] 建立正式環境 Zeabur 專案
- [ ] 部署後端服務（main 分支）
- [ ] 新增 PostgreSQL 服務
- [ ] 新增 MinIO 服務
- [ ] 設定所有環境變數
- [ ] 執行 migration
- [ ] 執行 seed

### 部署後

- [ ] 健康檢查 API 正常
- [ ] 登入功能正常
- [ ] 專案建立功能正常
- [ ] 資料庫連接正常
- [ ] MinIO 檔案上傳正常
- [ ] 建立正式管理員帳號
- [ ] 修改預設密碼
- [ ] 設定自訂網域（如需要）
- [ ] 通知團隊成員正式環境 URL

---

## 🆘 常見問題排查

### 1. 建置失敗

**問題**：Zeabur 建置失敗
**解決方案**：
- 檢查 `zbpack.json` 配置
- 確認 `package.json` 中建置依賴在 `dependencies`
- 查看 Zeabur 建置日誌

### 2. Migration 失敗

**問題**：執行 `pnpm run migration:run` 失敗
**解決方案**：
- 檢查 `DATABASE_URL` 環境變數
- 確認 PostgreSQL 服務已啟動
- 查看錯誤訊息

### 3. API 無法連接

**問題**：前端無法連接後端 API
**解決方案**：
- 檢查 `CORS_ORIGIN` 設定
- 確認後端服務正在運行
- 測試健康檢查端點

### 4. JWT Token 無效

**問題**：Token 驗證失敗
**解決方案**：
- 確認 `JWT_SECRET` 環境變數正確
- 檢查 Token 是否過期
- 重新登入取得新 Token

---

## 📚 相關文件

- [Zeabur 官方文件](https://zeabur.com/docs)
- [NestJS 部署指南](https://docs.nestjs.com/deployment)
- [TypeORM Migration 文件](https://typeorm.io/migrations)
- [專案 README](./README.md)
- [MVP 專案執行文件](./MVP專案執行文件.md)

---

## 📞 支援

如遇到問題，請：
1. 查看 Zeabur 建置日誌
2. 檢查環境變數設定
3. 查看資料庫連接狀態
4. 參考本文件的常見問題排查

---

**建立日期**: 2025-10-27
**最後更新**: 2025-10-27
**維護者**: 開發團隊
