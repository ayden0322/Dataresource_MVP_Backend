# 本地服務安裝指南（不使用 Docker）

適用於 CPU 不支援 Docker 的 Windows 系統。

## 📦 安裝 PostgreSQL

### 方法 1：使用安裝程式（推薦）

1. **下載 PostgreSQL 安裝程式**
   - 前往：https://www.postgresql.org/download/windows/
   - 或使用 EDB 安裝程式：https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
   - 建議版本：PostgreSQL 18.x

2. **執行安裝程式**
   - 執行下載的安裝檔
   - 選擇安裝路徑（預設即可）
   - 設定密碼：`0322`（與專案配置一致）
   - 連接埠：`5432`（預設）
   - 地區設定：使用預設值

3. **建立資料庫**
   
   安裝完成後，開啟 SQL Shell (psql) 或 pgAdmin：

   ```sql
   -- 登入 postgres 帳號後執行
   CREATE DATABASE vendor_assessment;
   CREATE USER admin WITH PASSWORD 'password123';
   GRANT ALL PRIVILEGES ON DATABASE vendor_assessment TO admin;
   ```

   或使用 PowerShell：
   
   ```powershell
   # 設定 PostgreSQL 路徑（請根據實際安裝路徑調整）
   $env:PATH += ";C:\Program Files\PostgreSQL\18\bin"
   
   # 建立資料庫和使用者
   psql -U postgres -c "CREATE DATABASE vendor_assessment;"
   psql -U postgres -c "CREATE USER admin WITH PASSWORD 'password123';"
   psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE vendor_assessment TO admin;"
   ```

### 方法 2：使用 Chocolatey

```powershell
# 以管理員身份執行
choco install postgresql18 -y

# 啟動服務
Start-Service postgresql-x64-18

# 建立資料庫（同上）
```

---

## 📦 安裝 MinIO

### 方法 1：下載執行檔（推薦）

1. **下載 MinIO Server**
   
   ```powershell
   # 建立 MinIO 資料夾
   New-Item -ItemType Directory -Force -Path "C:\minio"
   cd C:\minio
   
   # 下載 MinIO
   Invoke-WebRequest -Uri "https://dl.min.io/server/minio/release/windows-amd64/minio.exe" -OutFile "minio.exe"
   ```

2. **建立啟動腳本**
   
   建立檔案 `C:\minio\start-minio.bat`：
   
   ```batch
   @echo off
   set MINIO_ROOT_USER=minioadmin
   set MINIO_ROOT_PASSWORD=minioadmin123
   minio.exe server C:\minio\data --console-address ":9001"
   ```

3. **啟動 MinIO**
   
   ```powershell
   # 執行批次檔
   cd C:\minio
   .\start-minio.bat
   ```
   
   或使用 PowerShell：
   
   ```powershell
   $env:MINIO_ROOT_USER="minioadmin"
   $env:MINIO_ROOT_PASSWORD="minioadmin123"
   .\minio.exe server C:\minio\data --console-address ":9001"
   ```

4. **設定為 Windows 服務（可選）**
   
   使用 NSSM (Non-Sucking Service Manager)：
   
   ```powershell
   # 安裝 NSSM
   choco install nssm -y
   
   # 建立服務
   nssm install MinIO "C:\minio\minio.exe"
   nssm set MinIO AppParameters "server C:\minio\data --console-address :9001"
   nssm set MinIO AppEnvironmentExtra MINIO_ROOT_USER=minioadmin MINIO_ROOT_PASSWORD=minioadmin123
   nssm start MinIO
   ```

---

## 🔗 連線資訊

### PostgreSQL
- **主機**: `localhost`
- **連接埠**: `5432`
- **資料庫**: `vendor_assessment`
- **使用者**: `admin`
- **密碼**: `password123`
- **連線字串**: `postgresql://admin:password123@localhost:5432/vendor_assessment`

### MinIO
- **API 端點**: `http://localhost:9000`
- **控制台**: `http://localhost:9001`
- **Access Key**: `minioadmin`
- **Secret Key**: `minioadmin123`

---

## ✅ 驗證安裝

### 測試 PostgreSQL 連線

```powershell
# 使用 psql 測試
psql -U admin -d vendor_assessment -h localhost

# 或使用 PowerShell 測試
$env:PGPASSWORD="password123"
psql -U admin -d vendor_assessment -h localhost -c "SELECT version();"
```

### 測試 MinIO 連線

開啟瀏覽器，前往：
- **控制台**: http://localhost:9001
- 使用帳號 `minioadmin` / `minioadmin123` 登入

---

## 🔧 環境變數配置

您的 `.env` 檔案已經配置正確，無需修改：

```env
DATABASE_URL=postgresql://admin:password123@localhost:5432/vendor_assessment

MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_BUCKET=uploads
```

---

## 🚀 啟動順序

1. **啟動 PostgreSQL**
   ```powershell
   # PostgreSQL 通常會自動啟動，檢查狀態：
   Get-Service -Name postgresql*
   
   # 如果未啟動，手動啟動：
   Start-Service postgresql-x64-18
   ```

2. **啟動 MinIO**
   ```powershell
   cd C:\minio
   .\start-minio.bat
   ```

3. **啟動後端應用**
   ```powershell
   cd C:\Users\user\Desktop\Cursor\Dataresource_MVP_Backend
   pnpm dev:backend
   ```

---

## 📝 常見問題

### PostgreSQL 無法連線

1. 檢查服務是否運行：
   ```powershell
   Get-Service -Name postgresql*
   ```

2. 檢查防火牆設定

3. 確認 pg_hba.conf 允許本地連線

### MinIO 無法啟動

1. 確認連接埠 9000 和 9001 沒被占用：
   ```powershell
   netstat -ano | findstr "9000"
   netstat -ano | findstr "9001"
   ```

2. 檢查資料目錄權限

---

## 🌐 方案二：使用雲端服務（可選）

如果本地安裝有困難，也可以使用免費的雲端服務：

### PostgreSQL 雲端服務
- **Supabase**: https://supabase.com (免費方案)
- **ElephantSQL**: https://www.elephantsql.com (免費方案)
- **Neon**: https://neon.tech (免費方案)

### 物件儲存服務
- **Cloudflare R2**: https://cloudflare.com/products/r2 (免費 10GB)
- **Backblaze B2**: https://www.backblaze.com/b2 (免費 10GB)

使用雲端服務時，記得修改 `.env` 檔案中的連線資訊。

---

## 📚 相關工具

### pgAdmin（PostgreSQL 管理工具）
- 下載：https://www.pgadmin.org/download/
- 圖形化介面管理資料庫

### DBeaver（通用資料庫工具）
- 下載：https://dbeaver.io/
- 支援多種資料庫

### MinIO Client (mc)
- 下載：https://min.io/docs/minio/windows/reference/minio-mc.html
- 命令列管理 MinIO

