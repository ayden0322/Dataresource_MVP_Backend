export const ALLOWED_FILE_TYPES = {
  PDF: ['application/pdf'],
  DWG: ['application/acad', 'application/x-acad', 'application/x-dwg'],
  DOC: ['application/msword'],
  DOCX: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
} as const

export const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB

