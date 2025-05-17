export const FILE_SIZE_LIMIT = 5 * 1024 * 1024 // 5MB
export const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
] as const

export const MIN_TEXT_LENGTH = 100

export const PDF_CONFIG = {
  margin: 72, // 1 inch margins
  size: 'A4',
  font: 'Helvetica'
} as const

export const API_ROUTES = {
  UPLOAD: '/api/upload',
  EXPORT: '/api/export',
  SUGGESTIONS: '/api/suggestions'
} as const