export const API_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  supportedFormats: ['pdf', 'docx'],
  exportFormats: ['pdf', 'docx'],
  aiModel: 'gpt-3.5-turbo',
  maxTokens: 2000,
  temperature: 0.7,
  rateLimits: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60
  }
} as const;