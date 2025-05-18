import { CVData, APIResponse } from '@/types/api'
import { validateEnv } from '@/config/env'
import { FILE_SIZE_LIMIT, ACCEPTED_FILE_TYPES } from '@/config/constants'
import { NextRequest, NextResponse } from "next/server"
import { Document } from 'docx'
import { PDFDocument } from 'pdf-lib'
import mammoth from "mammoth"
import pdfParse from "pdf-parse"
import OpenAI from 'openai'
import { processDocument } from '@/utils/documentProcessors';
import { ProcessingOptions } from '@/types/document';
import { validateFileUpload } from '../validation';
import { createAPIResponse, createErrorResponse } from '../responses';
import { ErrorCodes } from '../constants';
import { FormattedDocument } from '@/types/document';
import { DocumentService } from '@/services/documentService';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Helper function to extract text from PDF
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

// Helper function to extract text from DOCX
async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  try {
    const { value } = await mammoth.extractRawText({ 
      buffer: buffer  // Pass Buffer directly
    })
    return value
  } catch (error) {
    console.error('Error extracting DOCX text:', error)
    throw new Error('Failed to extract text from DOCX')
  }
}

// Helper function to get AI optimized text
async function getAIOptimizedCV(formattedDoc: FormattedDocument): Promise<FormattedDocument> {
  const prompt = `
    Als erfahrener Bewerbungsexperte, optimiere diese Bewerbung professionell.
    Behalte die Formatierung bei und verbessere den Inhalt:

    ${formattedDoc.sections.map(section => 
      section.content.map(content => {
        const format = [];
        if (content.formatting.isHeading) format.push('[HEADING]');
        if (content.formatting.isBold) format.push('[BOLD]');
        if (content.formatting.isList) format.push('[LIST]');
        return `${format.join(' ')}${content.text}`;
      }).join('\n')
    ).join('\n\n')}

    Achte besonders auf:
    - Professionelle Ausdrucksweise
    - Klare Darstellung der Qualifikationen
    - Überzeugenden Schreibstil
    - Relevante Schlüsselwörter
    
    Gib nur den optimierten Text zurück.
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "Du bist ein Experte für Bewerbungsoptimierung. Behalte die Formatierungstags bei."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 2000
  });

  // Parse AI response back into formatted document
  const optimizedContent = completion.choices[0].message.content?.split('\n\n')
    .map(sectionText => ({
      content: sectionText.split('\n').map(line => ({
        text: line.replace(/\[(HEADING|BOLD|LIST)\]/g, '').trim(),
        formatting: {
          isHeading: line.includes('[HEADING]'),
          isBold: line.includes('[BOLD]'),
          isItalic: false,
          isList: line.includes('[LIST]')
        }
      }))
    })) || formattedDoc.sections;

  return {
    sections: optimizedContent,
    metadata: {
      ...formattedDoc.metadata,
      lastModified: new Date().toISOString()
    }
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    await validateFileUpload(file);
    const buffer = Buffer.from(await file.arrayBuffer());
    
    const document = await processDocument(buffer, file.type);
    return NextResponse.json({ document });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'File processing failed' },
      { status: 500 }
    );
  }
}