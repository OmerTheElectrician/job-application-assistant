import { NextRequest, NextResponse } from "next/server"
import { Document, Paragraph, TextRun, HeadingLevel } from 'docx'
import { PDFDocument, rgb } from 'pdf-lib'
import { FormattedDocument } from '@/types/document'
import { handleAPIError, APIError } from '../error';
import { createAPIResponse, createErrorResponse } from '../responses';

async function generateDOCX(doc: FormattedDocument): Promise<Buffer> {
  const document = new Document({
    sections: [{
      properties: {},
      children: doc.sections.flatMap(section => 
        section.content.map(content => {
          const paragraph = new Paragraph({
            heading: content.formatting.isHeading ? HeadingLevel.HEADING_1 : undefined,
            children: [
              new TextRun({
                text: content.text,
                bold: content.formatting.isBold,
                italics: content.formatting.isItalic,
                // Add more formatting as needed
              })
            ]
          })
          return paragraph
        })
      )
    }]
  })

  return await document.save()
}

async function generatePDF(doc: FormattedDocument): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage()
  const { width, height } = page.getSize()
  
  let yOffset = height - 50 // Start from top

  for (const section of doc.sections) {
    for (const content of section.content) {
      const fontSize = content.formatting.isHeading ? 16 : 12
      page.drawText(content.text, {
        x: 50,
        y: yOffset,
        size: fontSize,
        color: rgb(0, 0, 0)
      })
      yOffset -= fontSize + 10 // Space between lines
    }
  }

  return await pdfDoc.save()
}

export async function POST(request: NextRequest) {
  try {
    const { document, format } = await request.json() as { 
      document: FormattedDocument, 
      format: 'pdf' | 'docx' 
    };

    if (!document || !format) {
      throw new APIError('Missing required fields', 400, 'INVALID_REQUEST');
    }

    if (!['pdf', 'docx'].includes(format)) {
      throw new APIError('Unsupported format', 400, 'INVALID_FORMAT');
    }

    let buffer: Buffer | Uint8Array
    let contentType: string
    let fileName: string

    if (format === 'pdf') {
      buffer = await generatePDF(document)
      contentType = 'application/pdf'
      fileName = 'optimized-cv.pdf'
    } else {
      buffer = await generateDOCX(document)
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      fileName = 'optimized-cv.docx'
    }

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`
      }
    })

  } catch (error) {
    return handleAPIError(error);
  }
}