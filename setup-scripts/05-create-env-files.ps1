# ====================================
# 步驟 5: 建立環境變數範本檔案
# ====================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "建立環境變數範本檔案..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 建立後端 .env.example
Write-Host "`n建立 apps/backend/.env.example..." -ForegroundColor Yellow
$backendEnv = @"
# ====================================
# 資料庫配置
# ====================================
DATABASE_URL=postgresql://admin:password123@localhost:5432/vendor_assessment

# ====================================
# JWT 認證配置
# ====================================
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

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
"@
Set-Content -Path "apps\backend\.env.example" -Value $backendEnv
Write-Host "✓ apps/backend/.env.example 建立完成" -ForegroundColor Green

# 複製為實際的 .env 檔案
Write-Host "`n複製為 apps/backend/.env..." -ForegroundColor Yellow
Copy-Item "apps\backend\.env.example" "apps\backend\.env"
Write-Host "✓ apps/backend/.env 建立完成" -ForegroundColor Green

# 建立前端 .env.local.example
Write-Host "`n建立 apps/frontend/.env.local.example..." -ForegroundColor Yellow
$frontendEnv = @"
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
"@
Set-Content -Path "apps\frontend\.env.local.example" -Value $frontendEnv
Write-Host "✓ apps/frontend/.env.local.example 建立完成" -ForegroundColor Green

# 複製為實際的 .env.local 檔案
Write-Host "`n複製為 apps/frontend/.env.local..." -ForegroundColor Yellow
Copy-Item "apps\frontend\.env.local.example" "apps\frontend\.env.local"
Write-Host "✓ apps/frontend/.env.local 建立完成" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "步驟 5 完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host "`n提醒：" -ForegroundColor Yellow
Write-Host "  - .env 檔案已自動建立" -ForegroundColor White
Write-Host "  - 如需修改配置，請編輯對應的 .env 檔案" -ForegroundColor White
Write-Host "  - 不要將 .env 檔案提交到 Git" -ForegroundColor White

