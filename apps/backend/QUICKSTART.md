# 快速啟動指南

## 🚀 快速開始（5 分鐘）

### 1. 確認環境變數已設定

確認 `.env` 檔案已存在：

```bash
ls .env
```

如果不存在，請複製範例檔案：

```bash
cp .env.example .env
```

### 2. 安裝依賴

```bash
# 在專案根目錄執行
pnpm install
```

### 3. 啟動資料庫和 MinIO

**選項 A: 使用 Docker**

```bash
# 在專案根目錄執行
docker-compose up -d
```

**選項 B: 本地安裝**

```bash
# PostgreSQL 應自動啟動，檢查狀態
Get-Service -Name postgresql*

# 啟動 MinIO
C:\minio\start-minio.bat
```

### 4. 執行資料庫遷移

```bash
# 從根目錄執行
pnpm --filter backend run migration:run
```

### 5. 建立初始管理員帳號

```bash
# 從根目錄執行
pnpm --filter backend run seed
```

這將建立一個預設的管理員帳號：
- **Email**: admin@example.com
- **Password**: admin123456

### 6. 啟動後端服務

```bash
# 從根目錄執行
pnpm dev:backend

# 或在 apps/backend 目錄執行
pnpm dev
```

### 7. 測試 API

開啟瀏覽器或使用 curl：

```bash
# 健康檢查
curl http://localhost:3000/api/health

# 登入
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123456"}'
```

## 📊 API 端點

應用程式將運行於: **http://localhost:3000**

### 主要端點

- `GET /api/health` - 健康檢查（公開）
- `POST /api/auth/login` - 登入
- `POST /api/auth/register` - 註冊
- `GET /api/auth/profile` - 取得個人資料（需認證）
- `GET /api/projects` - 取得專案列表（需認證）
- `POST /api/projects` - 建立專案（需認證）
- `POST /api/uploads` - 上傳檔案（公開）
- `POST /api/reviews` - 審核文件（需認證）

## 🔐 測試登入

使用預設管理員帳號登入：

```bash
# 使用 curl
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123456"
  }'

# 使用 PowerShell
$body = @{
    email = "admin@example.com"
    password = "admin123456"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

回應將包含 JWT Token：

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@example.com",
    "name": "系統管理員",
    "role": "SUPER_ADMIN"
  }
}
```

## 🧪 建立測試專案

```bash
# 先登入取得 Token
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"email":"admin@example.com","password":"admin123456"}'

$token = $loginResponse.accessToken

# 建立專案
$projectBody = @{
    name = "測試專案"
    description = "這是一個測試專案"
    requiredDocuments = @(
        @{
            name = "施工計畫"
            description = "詳細的施工計畫書"
            isRequired = $true
        },
        @{
            name = "安全計畫"
            description = "工安計畫書"
            isRequired = $true
        }
    )
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "http://localhost:3000/api/projects" `
  -Method Post `
  -Headers @{Authorization="Bearer $token"} `
  -ContentType "application/json" `
  -Body $projectBody
```

## 🛠️ 常用指令

```bash
# 開發模式
pnpm dev

# 建置
pnpm build

# 執行測試
pnpm test

# Lint 檢查
pnpm lint

# 資料庫遷移
pnpm migration:run

# 資料庫回滾
pnpm migration:revert

# 建立初始資料
pnpm seed
```

## 🐛 故障排除

### 無法連接資料庫

```bash
# 檢查 PostgreSQL 是否運行
Get-Service -Name postgresql*

# 啟動 PostgreSQL
Start-Service postgresql-x64-18

# 測試連線
psql -U admin -d vendor_assessment -h localhost
```

### 無法連接 MinIO

```bash
# 檢查 MinIO 是否運行
Get-Process minio

# 啟動 MinIO
C:\minio\start-minio.bat

# 開啟 MinIO 控制台
start http://localhost:9001
```

### Port 3000 已被佔用

```bash
# 查看佔用的進程
netstat -ano | findstr ":3000"

# 修改 .env 中的 PORT
PORT=3001
```

## 📚 下一步

1. 瀏覽 [API 文件](./README.md)
2. 查看 [專案架構說明](../../MVP專案執行文件.md)
3. 開始開發前端應用

## 🎯 開發流程

1. 建立功能分支
2. 開發新功能
3. 執行測試
4. 提交 Pull Request

## 💡 推薦工具

- **API 測試**: [Postman](https://www.postman.com/) 或 [Insomnia](https://insomnia.rest/)
- **資料庫管理**: [pgAdmin](https://www.pgadmin.org/) 或 [DBeaver](https://dbeaver.io/)
- **MinIO 管理**: http://localhost:9001

---

**需要幫助？** 請參考 [README.md](./README.md) 或聯繫開發團隊。

