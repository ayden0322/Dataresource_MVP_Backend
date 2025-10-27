# ====================================
# 步驟 1: 建立 Monorepo 專案結構
# ====================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "建立 Monorepo 專案結構..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 建立主要資料夾
Write-Host "`n建立主要資料夾..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "apps\backend\src" | Out-Null
New-Item -ItemType Directory -Force -Path "apps\frontend\app" | Out-Null
New-Item -ItemType Directory -Force -Path "packages\shared\src\types" | Out-Null
New-Item -ItemType Directory -Force -Path "packages\shared\src\constants" | Out-Null
New-Item -ItemType Directory -Force -Path "packages\shared\src\utils" | Out-Null
New-Item -ItemType Directory -Force -Path ".github\workflows" | Out-Null
New-Item -ItemType Directory -Force -Path "setup-scripts" | Out-Null

Write-Host "✓ 資料夾結構建立完成" -ForegroundColor Green

# 顯示目錄樹
Write-Host "`n專案結構預覽：" -ForegroundColor Cyan
tree /F /A

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "步驟 1 完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

