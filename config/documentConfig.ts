export const DOCUMENT_CONFIG = {
  pdf: {
    maxSize: 10 * 1024 * 1024, // 10MB
    acceptedTypes: ['application/pdf']
  },
  docx: {
    maxSize: 5 * 1024 * 1024, // 5MB
    acceptedTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  },
  formatting: {
    defaultFontSize: 12,
    headingFontSize: 16,
    fontFamily: 'Arial',
    lineSpacing: 1.15
  }
};