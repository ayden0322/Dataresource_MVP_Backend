export enum UploadStatus {
  PENDING = 'PENDING',
  UPLOADED = 'UPLOADED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface Upload {
  id: string
  projectId: string
  documentId: string
  filename: string
  status: UploadStatus
  version: number
  uploadedAt: Date
}

