import { FormattedDocument, AIAnalysisResult } from '@/types/document';

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  };
  metadata?: {
    timestamp: string;
    requestId: string;
  };
}

export type UploadResponse = APIResponse<{
  fileId: string;
  document: FormattedDocument;
}>;

export type AnalysisResponse = APIResponse<{
  analysis: AIAnalysisResult;
}>;

export type ExportResponse = APIResponse<{
  url: string;
  format: 'pdf' | 'docx';
}>;