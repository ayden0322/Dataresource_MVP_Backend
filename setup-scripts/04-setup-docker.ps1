# ====================================
# 步驟 4: 建立 Docker Compose 配置
# ====================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "建立 Docker Compose 配置..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 建立 docker-compose.yml
Write-Host "`n建立 docker-compose.yml..." -ForegroundColor Yellow
$dockerCompose = @"
version: '3.8'

services:
  postgres:
    image: postgres:18-alpine
    container_name: vendor-assessment-postgres
    environment:
      POSTGRES_DB: vendor_assessment
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin"]
      interval: 10s
      timeout: 5s
      retries: 5

  minio:
    image: minio/minio:latest
    container_name: vendor-assessment-minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin123
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3

volumes:
  postgres_data:
    driver: local
  minio_data:
    driver: local
"@
Set-Content -Path "docker-compose.yml" -Value $dockerCompose
Write-Host "✓ docker-compose.yml 建立完成" -ForegroundColor Green

# 檢查 Docker 是否正在運行
Write-Host "`n檢查 Docker 運行狀態..." -ForegroundColor Yellow
$dockerRunning = docker ps 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Docker 正在運行" -ForegroundColor Green
    
    # 詢問是否啟動服務
    $response = Read-Host "`n是否要立即啟動 PostgreSQL 和 MinIO 服務？ (Y/N)"
    if ($response -eq 'Y' -or $response -eq 'y') {
        Write-Host "`n啟動服務中..." -ForegroundColor Yellow
        docker-compose up -d
        
        Write-Host "`n等待服務就緒..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
        
        Write-Host "`n查看服務狀態：" -ForegroundColor Cyan
        docker-compose ps
        
        Write-Host "`n✓ 服務已啟動" -ForegroundColor Green
        Write-Host "`n服務資訊：" -ForegroundColor Cyan
        Write-Host "  - PostgreSQL: localhost:5432" -ForegroundColor White
        Write-Host "    帳號: admin" -ForegroundColor White
        Write-Host "    密碼: password123" -ForegroundColor White
        Write-Host "    資料庫: vendor_assessment" -ForegroundColor White
        Write-Host "`n  - MinIO Console: http://localhost:9001" -ForegroundColor White
        Write-Host "    帳號: minioadmin" -ForegroundColor White
        Write-Host "    密碼: minioadmin123" -ForegroundColor White
    }
} else {
    Write-Host "✗ Docker 未運行，請先啟動 Docker Desktop" -ForegroundColor Red
    Write-Host "稍後可手動執行: docker-compose up -d" -ForegroundColor Yellow
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "步驟 4 完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

