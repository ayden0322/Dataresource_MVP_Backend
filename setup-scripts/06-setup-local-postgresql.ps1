# ====================================
# 自動設定本地 PostgreSQL
# ====================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "設定本地 PostgreSQL 資料庫..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 檢查 PostgreSQL 是否已安裝
Write-Host "`n檢查 PostgreSQL 安裝狀態..." -ForegroundColor Yellow

$pgService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue

if (-not $pgService) {
    Write-Host "✗ PostgreSQL 未安裝" -ForegroundColor Red
    Write-Host "`n請選擇安裝方式：" -ForegroundColor Yellow
    Write-Host "1. 使用 Chocolatey 安裝（需要管理員權限）" -ForegroundColor White
    Write-Host "2. 手動下載安裝程式" -ForegroundColor White
    Write-Host "3. 使用雲端服務（Supabase/Neon）" -ForegroundColor White
    
    $choice = Read-Host "`n請選擇 (1/2/3)"
    
    if ($choice -eq "1") {
        Write-Host "`n檢查 Chocolatey..." -ForegroundColor Yellow
        $choco = Get-Command choco -ErrorAction SilentlyContinue
        
        if (-not $choco) {
            Write-Host "安裝 Chocolatey..." -ForegroundColor Yellow
            Set-ExecutionPolicy Bypass -Scope Process -Force
            [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
            Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
        }
        
        Write-Host "使用 Chocolatey 安裝 PostgreSQL..." -ForegroundColor Yellow
        Write-Host "（此步驟需要管理員權限，請在 UAC 提示時允許）" -ForegroundColor Yellow
        choco install postgresql18 -y
        
        Write-Host "等待服務啟動..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
        
    } elseif ($choice -eq "2") {
        Write-Host "`n請前往以下網址下載並安裝 PostgreSQL：" -ForegroundColor Yellow
        Write-Host "https://www.postgresql.org/download/windows/" -ForegroundColor Cyan
        Write-Host "https://www.enterprisedb.com/downloads/postgres-postgresql-downloads" -ForegroundColor Cyan
        Write-Host "`n安裝時請設定密碼為: password123" -ForegroundColor Yellow
        Write-Host "安裝完成後，請重新執行此腳本。" -ForegroundColor Yellow
        exit
        
    } elseif ($choice -eq "3") {
        Write-Host "`n推薦的雲端服務：" -ForegroundColor Yellow
        Write-Host "1. Supabase: https://supabase.com (免費)" -ForegroundColor White
        Write-Host "2. Neon: https://neon.tech (免費)" -ForegroundColor White
        Write-Host "3. ElephantSQL: https://www.elephantsql.com (免費)" -ForegroundColor White
        Write-Host "`n請註冊後，將連線字串更新到 apps/backend/.env 的 DATABASE_URL" -ForegroundColor Yellow
        exit
    }
}

Write-Host "✓ PostgreSQL 已安裝" -ForegroundColor Green

# 檢查服務狀態
Write-Host "`n檢查 PostgreSQL 服務..." -ForegroundColor Yellow
$pgService = Get-Service -Name "postgresql*" | Select-Object -First 1

if ($pgService.Status -ne "Running") {
    Write-Host "啟動 PostgreSQL 服務..." -ForegroundColor Yellow
    Start-Service $pgService.Name
    Start-Sleep -Seconds 3
}

Write-Host "✓ PostgreSQL 服務運行中" -ForegroundColor Green

# 尋找 psql 路徑
Write-Host "`n尋找 PostgreSQL 執行檔..." -ForegroundColor Yellow
$possiblePaths = @(
    "C:\Program Files\PostgreSQL\18\bin",
    "C:\Program Files\PostgreSQL\17\bin",
    "C:\Program Files\PostgreSQL\16\bin",
    "C:\ProgramData\chocolatey\lib\postgresql18\tools\postgresql\bin"
)

$psqlPath = $null
foreach ($path in $possiblePaths) {
    if (Test-Path "$path\psql.exe") {
        $psqlPath = $path
        break
    }
}

if (-not $psqlPath) {
    Write-Host "✗ 找不到 psql.exe" -ForegroundColor Red
    Write-Host "請手動將 PostgreSQL bin 目錄加入 PATH" -ForegroundColor Yellow
    exit
}

Write-Host "✓ 找到 PostgreSQL: $psqlPath" -ForegroundColor Green
$env:PATH += ";$psqlPath"

# 建立資料庫和使用者
Write-Host "`n建立資料庫和使用者..." -ForegroundColor Yellow
Write-Host "（請輸入 postgres 使用者的密碼）" -ForegroundColor Yellow

# 建立 SQL 腳本
$sqlScript = @"
-- 檢查並建立資料庫
SELECT 'CREATE DATABASE vendor_assessment'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'vendor_assessment')\gexec

-- 檢查並建立使用者
DO
\$\$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = 'admin') THEN
      CREATE USER admin WITH PASSWORD 'password123';
   END IF;
END
\$\$;

-- 授予權限
GRANT ALL PRIVILEGES ON DATABASE vendor_assessment TO admin;
"@

$sqlScript | Out-File -FilePath "$env:TEMP\setup-db.sql" -Encoding UTF8

# 執行 SQL
try {
    & "$psqlPath\psql.exe" -U postgres -f "$env:TEMP\setup-db.sql" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ 資料庫建立完成" -ForegroundColor Green
    } else {
        Write-Host "⚠ 可能已存在，繼續..." -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠ 請手動執行以下 SQL：" -ForegroundColor Yellow
    Write-Host $sqlScript -ForegroundColor White
}

# 測試連線
Write-Host "`n測試資料庫連線..." -ForegroundColor Yellow
$env:PGPASSWORD = "password123"
$testResult = & "$psqlPath\psql.exe" -U admin -d vendor_assessment -h localhost -c "SELECT version();" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ 資料庫連線成功！" -ForegroundColor Green
} else {
    Write-Host "✗ 連線失敗，請檢查設定" -ForegroundColor Red
    Write-Host $testResult -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "PostgreSQL 設定完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host "`n連線資訊：" -ForegroundColor Cyan
Write-Host "  主機: localhost" -ForegroundColor White
Write-Host "  連接埠: 5432" -ForegroundColor White
Write-Host "  資料庫: vendor_assessment" -ForegroundColor White
Write-Host "  使用者: admin" -ForegroundColor White
Write-Host "  密碼: password123" -ForegroundColor White
Write-Host "  連線字串: postgresql://admin:password123@localhost:5432/vendor_assessment" -ForegroundColor White

