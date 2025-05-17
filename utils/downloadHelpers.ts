import { FormattedDocument } from '@/types/document';
import { DocumentService } from '@/services/documentService';

export async function handleDownload(
  formattedDoc: FormattedDocument, 
  format: 'pdf' | 'docx'
): Promise<void> {
  try {
    const buffer = await DocumentService.generateFile(formattedDoc, format);
    const blob = new Blob([buffer], { 
      type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `optimized-cv.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
}
