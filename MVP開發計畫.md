# 廠商安全評估系統 - MVP 開發計畫

## MVP 開發目標

讓管理者能建立工程專案 → 產生專案上傳連結 → 廠商能上傳檔案 → 管理者能在後台看到檔案並進行審核（通過 / 退回）。

---

## ✅ 一、MVP 必須實作的核心功能（第一波就要有）

### 1️⃣ 管理者帳號與登入

- 基礎帳號系統（Email + 密碼登入）。
- 總管理者帳號先寫死於 migration seed（root 帳號）。
- 角色：暫時只分「SuperAdmin / Admin」，不需要細分權限表。

**🔹 目的**：確保只有內部人員能進後台操作。

---

### 2️⃣ 專案建立與文件清單設定

- 管理者可在後台建立「工程專案名稱」。
- 專案建立時可手動輸入或勾選「所需上傳項目」（先以靜態模板或簡短列表實作）。
- 系統產生專屬的「上傳連結（含 UUID token）」。

**🔹 例子**
```
專案：台北車站改建案
→ 需要文件：施工計畫、勞安計畫、施工圖說
→ 產生一條上傳網址 https://upload.company.com/project/abcd1234
```

---

### 3️⃣ 檔案上傳機制（核心重點）

- 前端由專案連結進入後，可看到需上傳文件清單。
- 每個項目旁有「上傳按鈕」；選檔 → 上傳到後端。

**檔案資訊紀錄：**
- 專案 ID、文件項目 ID
- 檔案名稱、大小、上傳者 IP
- 狀態：`UPLOADED_PENDING`（待審核）

**🔹 暫時不做掃毒**（先假設所有檔案安全）

**🔹 儲存方式：**
- 可先暫時使用本地儲存（`uploads/`）或 MinIO。
- 每次上傳後記錄 metadata 至資料庫（PostgreSQL）。

---

### 4️⃣ 管理端專案與文件清單頁面

**可看到所有工程專案列表。**

點進某個專案後，可看到：
- 每個文件項目名稱
- 使用者上傳狀態（已上傳 / 待審核 / 已通過 / 退回）
- 審核按鈕（通過、退回）

**🔹 點擊檔案名稱可下載/預覽原始檔案**（先不轉 PDF 預覽）。

---

### 5️⃣ 文件審核（通過 / 退回）

- 管理者可點擊檔案 → 審核通過或退回，並填寫備註（可選）。

**狀態更新：**
- 通過 → `APPROVED`
- 退回 → `REJECTED`
- 前端上傳頁同步顯示最新狀態。

**🔹 例子**
```
「施工圖說.pdf」 → 管理者審核通過 → 前端顯示 ✅「已通過」
```

---

## 🚧 二、建議一起做（MVP+，基礎防呆與體驗）

### 1️⃣ 檔案型態與大小限制

- 限定允許副檔名：`.pdf`, `.docx`, `.dwg`, `.dxf`
- 檔案大小上限：
  - 100MB（PDF/Word）
  - 500MB（CAD）
- 後端檢查並回傳 400 錯誤。

---

### 2️⃣ 檔名與儲存命名策略

- 儲存時重新命名：`projectId_docId_timestamp_uuid.ext`
- 防止覆蓋與路徑穿越問題。

---

### 3️⃣ 檔案版本控制（簡易版）

- 同一項目若再次上傳 → 新增一筆版本記錄（`version=auto increment`）。
- 審核永遠對應特定版本。
- 顯示「最新版本」標示。

---

## 📊 MVP 核心資料表結構

### users（管理者帳號）
| 欄位 | 型態 | 說明 |
|------|------|------|
| id | UUID | 主鍵 |
| email | VARCHAR | 帳號 Email |
| password_hash | VARCHAR | 密碼雜湊 |
| role | ENUM | SuperAdmin / Admin |
| created_at | TIMESTAMP | 建立時間 |

### projects（工程專案）
| 欄位 | 型態 | 說明 |
|------|------|------|
| id | UUID | 主鍵 |
| name | VARCHAR | 專案名稱 |
| token | UUID | 上傳連結 Token |
| created_by | UUID | 建立者 ID |
| created_at | TIMESTAMP | 建立時間 |

### project_required_docs（專案所需文件）
| 欄位 | 型態 | 說明 |
|------|------|------|
| id | UUID | 主鍵 |
| project_id | UUID | 專案 ID |
| doc_name | VARCHAR | 文件名稱 |
| created_at | TIMESTAMP | 建立時間 |

### uploads（上傳記錄）
| 欄位 | 型態 | 說明 |
|------|------|------|
| id | UUID | 主鍵 |
| project_id | UUID | 專案 ID |
| doc_id | UUID | 文件項目 ID |
| file_name | VARCHAR | 檔案名稱 |
| file_path | VARCHAR | 儲存路徑 |
| file_size | BIGINT | 檔案大小 |
| uploader_ip | VARCHAR | 上傳者 IP |
| version | INT | 版本號 |
| status | ENUM | UPLOADED_PENDING / APPROVED / REJECTED |
| created_at | TIMESTAMP | 上傳時間 |

### reviews（審核記錄）
| 欄位 | 型態 | 說明 |
|------|------|------|
| id | UUID | 主鍵 |
| upload_id | UUID | 上傳記錄 ID |
| reviewer_id | UUID | 審核者 ID |
| status | ENUM | APPROVED / REJECTED |
| comment | TEXT | 審核備註 |
| created_at | TIMESTAMP | 審核時間 |

---

## 🎯 MVP 開發優先順序

### Phase 1：基礎架構（第 1-2 週）
1. 建立資料庫 Schema
2. 實作管理者登入系統
3. 建立基礎後端 API 框架

### Phase 2：專案管理（第 3 週）
1. 專案建立功能
2. 文件清單設定
3. 產生專案上傳連結

### Phase 3：檔案上傳（第 4 週）
1. 前端上傳介面
2. 後端檔案接收與儲存
3. 檔案資訊記錄

### Phase 4：審核功能（第 5 週）
1. 管理端文件列表頁面
2. 審核通過/退回功能
3. 狀態同步顯示

### Phase 5：優化與測試（第 6 週）
1. 檔案型態與大小限制
2. 檔案版本控制
3. 整體測試與修正

---

## 🚀 MVP 成功標準

- ✅ 管理者能登入並建立專案
- ✅ 系統能產生專案上傳連結
- ✅ 廠商能透過連結上傳檔案
- ✅ 管理者能在後台看到上傳的檔案
- ✅ 管理者能審核檔案（通過/退回）
- ✅ 前端能即時顯示審核狀態

---

## 📝 後續擴充功能（Post-MVP）

- 病毒掃描機制（ClamAV Worker）
- Email / LINE Notify 通知
- 細緻的權限管理（RBAC）
- 稽核日誌追蹤
- 檔案預覽功能
- 批次操作功能
- 報表與統計功能

