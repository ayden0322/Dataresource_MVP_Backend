# ====================================
# 自動設定本地 MinIO
# ====================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "設定本地 MinIO 物件儲存..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 設定 MinIO 目錄
$minioDir = "C:\minio"
$minioExe = "$minioDir\minio.exe"
$minioData = "$minioDir\data"

# 建立目錄
Write-Host "`n建立 MinIO 目錄..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path $minioDir | Out-Null
New-Item -ItemType Directory -Force -Path $minioData | Out-Null
Write-Host "✓ 目錄建立完成" -ForegroundColor Green

# 檢查 MinIO 是否已下載
if (Test-Path $minioExe) {
    Write-Host "✓ MinIO 已存在" -ForegroundColor Green
} else {
    Write-Host "`n下載 MinIO..." -ForegroundColor Yellow
    try {
        $url = "https://dl.min.io/server/minio/release/windows-amd64/minio.exe"
        Invoke-WebRequest -Uri $url -OutFile $minioExe
        Write-Host "✓ MinIO 下載完成" -ForegroundColor Green
    } catch {
        Write-Host "✗ 下載失敗" -ForegroundColor Red
        Write-Host "請手動下載: https://dl.min.io/server/minio/release/windows-amd64/minio.exe" -ForegroundColor Yellow
        Write-Host "並放置到: $minioExe" -ForegroundColor Yellow
        exit
    }
}

# 建立啟動腳本（批次檔）
Write-Host "`n建立啟動腳本..." -ForegroundColor Yellow
$startScript = @"
@echo off
echo ========================================
echo 啟動 MinIO 伺服器...
echo ========================================
echo.
echo 控制台: http://localhost:9001
echo API 端點: http://localhost:9000
echo 帳號: minioadmin
echo 密碼: minioadmin123
echo.
echo 按 Ctrl+C 停止伺服器
echo ========================================
echo.

set MINIO_ROOT_USER=minioadmin
set MINIO_ROOT_PASSWORD=minioadmin123
"%~dp0minio.exe" server "%~dp0data" --console-address ":9001"
"@

Set-Content -Path "$minioDir\start-minio.bat" -Value $startScript
Write-Host "✓ 啟動腳本建立完成: $minioDir\start-minio.bat" -ForegroundColor Green

# 建立 PowerShell 啟動腳本
$psScript = @"
`$env:MINIO_ROOT_USER="minioadmin"
`$env:MINIO_ROOT_PASSWORD="minioadmin123"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "啟動 MinIO 伺服器..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "控制台: http://localhost:9001" -ForegroundColor Green
Write-Host "API 端點: http://localhost:9000" -ForegroundColor Green
Write-Host "帳號: minioadmin" -ForegroundColor Yellow
Write-Host "密碼: minioadmin123" -ForegroundColor Yellow
Write-Host ""
Write-Host "按 Ctrl+C 停止伺服器" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

& "$minioDir\minio.exe" server "$minioDir\data" --console-address ":9001"
"@

Set-Content -Path "$minioDir\start-minio.ps1" -Value $psScript
Write-Host "✓ PowerShell 腳本建立完成: $minioDir\start-minio.ps1" -ForegroundColor Green

# 建立停止腳本
$stopScript = @"
@echo off
echo 停止 MinIO 服務...
taskkill /IM minio.exe /F
echo MinIO 已停止
"@

Set-Content -Path "$minioDir\stop-minio.bat" -Value $stopScript
Write-Host "✓ 停止腳本建立完成: $minioDir\stop-minio.bat" -ForegroundColor Green

# 檢查是否要設定為 Windows 服務
Write-Host "`n是否要將 MinIO 設定為 Windows 服務（開機自動啟動）？ (Y/N)" -ForegroundColor Yellow
$response = Read-Host

if ($response -eq 'Y' -or $response -eq 'y') {
    Write-Host "`n檢查 NSSM..." -ForegroundColor Yellow
    $nssm = Get-Command nssm -ErrorAction SilentlyContinue
    
    if (-not $nssm) {
        Write-Host "NSSM 未安裝，使用 Chocolatey 安裝..." -ForegroundColor Yellow
        $choco = Get-Command choco -ErrorAction SilentlyContinue
        
        if ($choco) {
            choco install nssm -y
        } else {
            Write-Host "請先安裝 Chocolatey 或手動下載 NSSM: https://nssm.cc/download" -ForegroundColor Yellow
            Write-Host "稍後可手動執行: $minioDir\start-minio.bat" -ForegroundColor Yellow
        }
    }
    
    $nssm = Get-Command nssm -ErrorAction SilentlyContinue
    if ($nssm) {
        Write-Host "建立 Windows 服務..." -ForegroundColor Yellow
        
        # 移除舊服務（如果存在）
        nssm stop MinIO 2>$null
        nssm remove MinIO confirm 2>$null
        
        # 安裝新服務
        nssm install MinIO "$minioExe"
        nssm set MinIO AppParameters "server $minioData --console-address :9001"
        nssm set MinIO AppEnvironmentExtra MINIO_ROOT_USER=minioadmin MINIO_ROOT_PASSWORD=minioadmin123
        nssm set MinIO AppDirectory $minioDir
        nssm set MinIO DisplayName "MinIO Object Storage"
        nssm set MinIO Description "MinIO 物件儲存服務"
        nssm set MinIO Start SERVICE_AUTO_START
        
        Write-Host "啟動服務..." -ForegroundColor Yellow
        nssm start MinIO
        
        Start-Sleep -Seconds 3
        
        Write-Host "✓ MinIO 服務已建立並啟動" -ForegroundColor Green
        Write-Host "服務將在開機時自動啟動" -ForegroundColor Green
    }
} else {
    Write-Host "`n要立即啟動 MinIO 嗎？ (Y/N)" -ForegroundColor Yellow
    $startNow = Read-Host
    
    if ($startNow -eq 'Y' -or $startNow -eq 'y') {
        Write-Host "`n啟動 MinIO（在新視窗中）..." -ForegroundColor Yellow
        Start-Process -FilePath "$minioDir\start-minio.bat"
        Start-Sleep -Seconds 3
        Write-Host "✓ MinIO 已在新視窗中啟動" -ForegroundColor Green
    }
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "MinIO 設定完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host "`n連線資訊：" -ForegroundColor Cyan
Write-Host "  控制台: http://localhost:9001" -ForegroundColor White
Write-Host "  API 端點: http://localhost:9000" -ForegroundColor White
Write-Host "  Access Key: minioadmin" -ForegroundColor White
Write-Host "  Secret Key: minioadmin123" -ForegroundColor White

Write-Host "`n快速啟動：" -ForegroundColor Cyan
Write-Host "  執行: $minioDir\start-minio.bat" -ForegroundColor White
Write-Host "  或: $minioDir\start-minio.ps1" -ForegroundColor White

Write-Host "`n快速停止：" -ForegroundColor Cyan
Write-Host "  執行: $minioDir\stop-minio.bat" -ForegroundColor White
Write-Host "  或按 Ctrl+C (如在前台運行)" -ForegroundColor White

