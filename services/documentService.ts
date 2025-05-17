import { Document, Packer, Paragraph, TextRun } from 'docx';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';
import { FormattedDocument, DocumentOptions } from '@/types/document';

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

export async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error('DOCX extraction error:', error);
    throw new Error('Failed to extract text from DOCX');
  }
}

export async function generateFormattedDocument(text: string): Promise<FormattedDocument> {
  const sections = text.split('\n\n').map(section => ({
    text: section.trim(),
    formatting: {
      isHeading: false,
      isBold: false,
      isList: false
    }
  }));

  return {
    sections,
    metadata: {
      created: new Date().toISOString(),
      lastModified: new Date().toISOString()
    }
  };
}

export class DocumentService {
  public static async processDocument(
    buffer: Buffer, 
    fileType: string,
    options?: DocumentOptions
  ): Promise<FormattedDocument> {
    const text = await this.extractText(buffer, fileType);
    return this.formatDocument(text, options || {});
  }

  private static async extractText(buffer: Buffer, fileType: string): Promise<string> {
    switch (fileType) {
      case 'application/pdf':
        return extractTextFromPDF(buffer);
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return extractTextFromDOCX(buffer);
      default:
        throw new Error('Unsupported file type');
    }
  }

  private static formatDocument(text: string, options: DocumentOptions): FormattedDocument {
    const sections = text.split('\n\n').map(section => ({
      text: section.trim(),
      formatting: {
        isHeading: false,
        isBold: false,
        isList: section.startsWith('- ') || section.startsWith('• ')
      }
    }));

    return {
      sections: sections.filter(s => s.text.length > 0),
      metadata: {
        created: new Date().toISOString(),
        lastModified: new Date().toISOString()
      }
    };
  }

  public static async generateFile(
    document: FormattedDocument, 
    format: 'pdf' | 'docx'
  ): Promise<Buffer> {
    switch (format) {
      case 'pdf':
        return this.generatePDF(document);
      case 'docx':
        return this.generateDOCX(document);
      default:
        throw new Error('Unsupported format');
    }
  }

  private static async generatePDF(document: FormattedDocument): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    let y = page.getHeight() - 50;
    const fontSize = 12;

    document.sections.forEach(section => {
      const text = section.text;
      page.drawText(text, {
        x: 50,
        y,
        size: section.formatting.isHeading ? fontSize + 4 : fontSize,
        font: section.formatting.isHeading || section.formatting.isBold ? boldFont : regularFont
      });
      y -= section.formatting.isHeading ? 30 : 20;
    });

    return Buffer.from(await pdfDoc.save());
  }

  private static async generateDOCX(document: FormattedDocument): Promise<Buffer> {
    const doc = new Document({
      sections: [{
        properties: {},
        children: document.sections.map(section => {
          return new Paragraph({
            children: [
              new TextRun({
                text: section.text,
                bold: section.formatting.isBold || section.formatting.isHeading,
                size: section.formatting.isHeading ? 32 : 24
              })
            ]
          });
        })
      }]
    });

    return await Packer.toBuffer(doc);
  }
}