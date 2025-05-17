import { Document, Paragraph, TextRun } from 'docx';
import { PDFDocument } from 'pdf-lib';
import * as pdfjs from 'pdfjs-dist';
import mammoth from 'mammoth';
import { FormattedDocument, ProcessingOptions } from '@/types/document';
import { extractTextFromPDF, extractTextFromDOCX, generateFormattedDocument } from '@/services/documentService';

// Initialize PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export async function processDocument(
  buffer: Buffer,
  fileType: string,
  options?: ProcessingOptions
): Promise<FormattedDocument> {
  const text = fileType.includes('pdf')
    ? await extractTextFromPDF(buffer)
    : await extractTextFromDOCX(buffer);

  return generateFormattedDocument(text);
}

