import { CVData, APIResponse } from '@/types/api'
import { validateEnv } from '@/config/env'
import { FILE_SIZE_LIMIT, ACCEPTED_FILE_TYPES } from '@/config/constants'
import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"
// Updated document processing imports
import { Document, Paragraph, TextRun } from 'docx'
import { PDFDocument } from 'pdf-lib'
import * as pdfjs from 'pdfjs-dist'
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

// Initialize PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Helper function to extract text from PDF
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer)  // Pass Buffer directly
    return data.text
  } catch (error) {
    console.error('Error extracting PDF text:', error)
    throw new Error('Failed to extract text from PDF')
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

    ${formattedDoc.sections.map(section => {
      const format = [];
      if (section.formatting.isHeading) format.push('[HEADING]');
      if (section.formatting.isBold) format.push('[BOLD]');
      if (section.formatting.isList) format.push('[LIST]');
      return `${format.join(' ')}${section.text}`;
    }).join('\n')}

    Achte besonders auf:
    - Professionelle Ausdrucksweise
    - Klare Darstellung der Qualifikationen
    - Überzeugenden Schreibstil
    - Relevante Schlüsselwörter
    
    Gib nur den optimierten Text zurück.
  `

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
  const optimizedSections = completion.choices[0].message.content?.split('\n')
    .map(line => {
      const formatting = {
        isHeading: line.includes('[HEADING]'),
        isBold: line.includes('[BOLD]'),
        isList: line.includes('[LIST]')
      };
      const text = line.replace(/\[(HEADING|BOLD|LIST)\]/g, '').trim();
      return { text, formatting };
    }) || formattedDoc.sections;

  return {
    sections: optimizedSections,
    metadata: formattedDoc.metadata
  };
}

export async function POST(request: NextRequest) {
  const { buffer, options } = await parseRequest(request);
  const document = await DocumentService.processDocument(buffer, options);
  return NextResponse.json({ document });
}