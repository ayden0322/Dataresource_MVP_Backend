export const STATUS_LABELS = {
  DRAFT: '草稿',
  ACTIVE: '進行中',
  COMPLETED: '已完成',
  ARCHIVED: '已歸檔',
  PENDING: '待上傳',
  UPLOADED: '已上傳',
  APPROVED: '已通過',
  REJECTED: '已退回',
} as const

export const STATUS_COLORS = {
  DRAFT: 'gray',
  ACTIVE: 'blue',
  COMPLETED: 'green',
  ARCHIVED: 'gray',
  PENDING: 'yellow',
  UPLOADED: 'blue',
  APPROVED: 'green',
  REJECTED: 'red',
} as const

