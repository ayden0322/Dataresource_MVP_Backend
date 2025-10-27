# ====================================
# 步驟 2: 初始化 Workspace 配置
# ====================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "初始化 pnpm Workspace..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 檢查 pnpm 是否已安裝
Write-Host "`n檢查 pnpm 安裝狀態..." -ForegroundColor Yellow
$pnpmVersion = pnpm --version 2>$null
if (-not $pnpmVersion) {
    Write-Host "✗ pnpm 未安裝，正在安裝..." -ForegroundColor Red
    npm install -g pnpm@8.15.0
    Write-Host "✓ pnpm 安裝完成" -ForegroundColor Green
} else {
    Write-Host "✓ pnpm 已安裝 (版本: $pnpmVersion)" -ForegroundColor Green
}

# 建立 Root package.json
Write-Host "`n建立 Root package.json..." -ForegroundColor Yellow
$rootPackageJson = @"
{
  "name": "dataresource-mvp",
  "version": "1.0.0",
  "private": true,
  "description": "廠商安全評估資料蒐集系統",
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "clean": "turbo run clean && rm -rf node_modules",
    "dev:backend": "pnpm --filter backend dev",
    "dev:frontend": "pnpm --filter frontend dev",
    "build:backend": "pnpm --filter backend build",
    "build:frontend": "pnpm --filter frontend build"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.3.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  },
  "packageManager": "pnpm@8.15.0"
}
"@
Set-Content -Path "package.json" -Value $rootPackageJson
Write-Host "✓ Root package.json 建立完成" -ForegroundColor Green

# 建立 pnpm-workspace.yaml
Write-Host "`n建立 pnpm-workspace.yaml..." -ForegroundColor Yellow
$workspaceYaml = @"
packages:
  - 'apps/*'
  - 'packages/*'
"@
Set-Content -Path "pnpm-workspace.yaml" -Value $workspaceYaml
Write-Host "✓ pnpm-workspace.yaml 建立完成" -ForegroundColor Green

# 建立 turbo.json
Write-Host "`n建立 turbo.json..." -ForegroundColor Yellow
$turboJson = @"
{
  "`$schema": "https://turbo.build/schema.json",
  "globalDependencies": [".env"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "clean": {
      "cache": false
    }
  }
}
"@
Set-Content -Path "turbo.json" -Value $turboJson
Write-Host "✓ turbo.json 建立完成" -ForegroundColor Green

# 建立 .gitignore
Write-Host "`n建立 .gitignore..." -ForegroundColor Yellow
$gitignore = @"
# Dependencies
node_modules/
.pnp
.pnp.js

# Production builds
dist/
build/
.next/
out/

# Environment variables
.env
.env.local
.env*.local

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Testing
coverage/

# Turborepo
.turbo/

# Docker
docker-compose.override.yml
"@
Set-Content -Path ".gitignore" -Value $gitignore
Write-Host "✓ .gitignore 建立完成" -ForegroundColor Green

# 初始化 Git
Write-Host "`n初始化 Git 倉庫..." -ForegroundColor Yellow
git init 2>$null
git branch -M main 2>$null
Write-Host "✓ Git 倉庫初始化完成" -ForegroundColor Green

# 安裝根目錄依賴
Write-Host "`n安裝根目錄依賴..." -ForegroundColor Yellow
pnpm install
Write-Host "✓ 依賴安裝完成" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "步驟 2 完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

