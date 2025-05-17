import { FormattedDocument } from '@/types/document';
import { DocumentService } from '@/services/documentService';

export async function handleDownload(
  document: FormattedDocument, 
  format: 'pdf' | 'docx'
): Promise<void> {
  const buffer = await DocumentService.generateFile(document, format);
  // Handle download UI logic
}
