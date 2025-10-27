# 環境建立自動化腳本

這個資料夾包含了自動化建立開發環境的 PowerShell 腳本。

## 📋 腳本列表

### 基礎設定（必須執行）
1. **01-create-structure.ps1** - 建立 Monorepo 資料夾結構
2. **02-init-workspace.ps1** - 初始化 pnpm workspace
3. **03-setup-shared.ps1** - 建立共用套件
5. **05-create-env-files.ps1** - 建立環境變數檔案

### 資料庫與儲存設定（二擇一）

#### 方案 A：使用 Docker（推薦，需 CPU 支援虛擬化）
4. **04-setup-docker.ps1** - 設定 Docker Compose

#### 方案 B：本地安裝（適用於不支援 Docker 的環境）
6. **06-setup-local-postgresql.ps1** - 安裝本地 PostgreSQL
7. **07-setup-local-minio.ps1** - 安裝本地 MinIO
- **06-install-local-services.md** - 詳細的本地安裝指南

## 🚀 快速開始

### 方式 A：使用 Docker（推薦）

適用於支援虛擬化的 CPU（Intel VT-x / AMD-V）

```powershell
# 依序執行腳本
.\setup-scripts\01-create-structure.ps1
.\setup-scripts\02-init-workspace.ps1
.\setup-scripts\03-setup-shared.ps1
.\setup-scripts\05-create-env-files.ps1
.\setup-scripts\04-setup-docker.ps1
```

### 方式 B：本地安裝（無需 Docker）

適用於 CPU 不支援虛擬化或無法安裝 Docker 的環境

```powershell
# 依序執行腳本
.\setup-scripts\01-create-structure.ps1
.\setup-scripts\02-init-workspace.ps1
.\setup-scripts\03-setup-shared.ps1
.\setup-scripts\05-create-env-files.ps1

# 安裝本地服務
.\setup-scripts\06-setup-local-postgresql.ps1
.\setup-scripts\07-setup-local-minio.ps1
```

### 方式 C：單獨執行

如果只需要執行特定步驟，可以單獨執行該腳本：

```powershell
# 例如：只設定 MinIO
.\setup-scripts\07-setup-local-minio.ps1
```

## ⚠️ 注意事項

1. **執行權限**

   如果遇到「無法載入，因為這個系統上已停用指令碼執行」錯誤：

   ```powershell
   # 以管理員身份執行 PowerShell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

2. **前置需求**

   執行腳本前，請確認已安裝：
   - Node.js >= 18.0.0
   - pnpm >= 8.0.0（腳本會自動安裝）
   - Git
   
   **如果使用 Docker（方案 A）：**
   - Docker Desktop
   - CPU 需支援虛擬化（Intel VT-x / AMD-V）
   
   **如果使用本地安裝（方案 B）：**
   - 無需 Docker
   - 會自動下載並設定 PostgreSQL 和 MinIO

3. **執行順序**

   建議按照編號順序執行腳本，因為後面的腳本可能依賴前面建立的檔案。

## 📝 各腳本詳細說明

### 01-create-structure.ps1

建立基本的 Monorepo 資料夾結構：
- `apps/backend/`
- `apps/frontend/`
- `packages/shared/`
- `.github/workflows/`

### 02-init-workspace.ps1

初始化 pnpm workspace 配置：
- 建立 `package.json`
- 建立 `pnpm-workspace.yaml`
- 建立 `turbo.json`
- 建立 `.gitignore`
- 安裝根目錄依賴

### 03-setup-shared.ps1

建立共用套件：
- 建立型別定義（User, Project, Upload）
- 建立常數定義（Status, FileTypes）
- 設定 TypeScript 配置

### 04-setup-docker.ps1

設定 Docker Compose：
- 建立 `docker-compose.yml`
- 包含 PostgreSQL 和 MinIO 服務
- 可選擇立即啟動服務

### 05-create-env-files.ps1

建立環境變數檔案：
- 建立後端 `.env.example` 和 `.env`
- 建立前端 `.env.local.example` 和 `.env.local`

### 06-setup-local-postgresql.ps1

本地安裝 PostgreSQL（替代 Docker）：
- 檢查 PostgreSQL 是否已安裝
- 提供多種安裝方式（Chocolatey、手動、雲端）
- 自動建立資料庫和使用者
- 測試連線

### 07-setup-local-minio.ps1

本地安裝 MinIO（替代 Docker）：
- 下載 MinIO 執行檔
- 建立啟動/停止腳本
- 可選：設定為 Windows 服務（開機自動啟動）
- 提供 Web 管理介面

## 🔧 手動建立步驟

如果您偏好手動建立，請參考 `環境建立指南.md`。

## 🆘 遇到問題？

1. **PowerShell 執行權限錯誤**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

2. **pnpm 安裝失敗**
   ```powershell
   npm install -g pnpm@8.15.0 --force
   ```

3. **Docker 無法啟動或 CPU 不支援虛擬化**
   - 確認 Docker Desktop 正在運行
   - 檢查 WSL 2 是否已啟用（Windows）
   - **如果 CPU 不支援虛擬化**，請使用方案 B（本地安裝）：
     ```powershell
     .\setup-scripts\06-setup-local-postgresql.ps1
     .\setup-scripts\07-setup-local-minio.ps1
     ```

4. **PostgreSQL 連線失敗**
   - 檢查服務是否運行：`Get-Service -Name postgresql*`
   - 確認密碼設定正確：`password123`
   - 檢查防火牆設定

5. **MinIO 無法啟動**
   - 確認連接埠 9000 和 9001 未被占用
   - 檢查啟動腳本：`C:\minio\start-minio.bat`

## 📚 相關文件

- **06-install-local-services.md** - 本地服務安裝詳細指南
- **環境建立指南.md** - 詳細的手動建立步驟
- **MVP專案執行文件.md** - 完整的開發指南
- **MVP開發計畫.md** - MVP 開發目標與範圍

## 💡 方案選擇建議

| 情境 | 推薦方案 | 說明 |
|------|---------|------|
| CPU 支援虛擬化，有安裝 Docker | **方案 A (Docker)** | 最快速、易於管理 |
| CPU 不支援虛擬化 | **方案 B (本地安裝)** | 功能完整，穩定可靠 |
| 筆電或效能有限 | **方案 C (雲端服務)** | 見 `06-install-local-services.md` |
| 測試環境或 CI/CD | **方案 A (Docker)** | 容易重現環境 |

