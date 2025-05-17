import { FormattedDocument, ProcessingOptions, DocumentOptions } from '@/types/document';
import { ACCEPTED_FILE_TYPES, FILE_SIZE_LIMIT } from '@/config/constants';
import { ErrorCodes } from './constants';
import { APIError } from './error';

// Consolidate all document-related validation
export function validateDocument(doc: unknown): asserts doc is FormattedDocument {
  if (!doc || typeof doc !== 'object') {
    throw new APIError('Invalid document format', 400, ErrorCodes.DOCUMENT.INVALID_FORMAT);
  }

  const document = doc as FormattedDocument;
  if (!Array.isArray(document.sections)) {
    throw new APIError('Invalid document structure', 400, ErrorCodes.DOCUMENT.INVALID_STRUCTURE);
  }

  document.sections.forEach((section, index) => {
    if (!section.content || !Array.isArray(section.content)) {
      throw new APIError(
        `Invalid section content at index ${index}`,
        400,
        ErrorCodes.DOCUMENT.INVALID_CONTENT
      );
    }
  });
}

// Combined options validation
export function validateOptions(options: unknown): asserts options is DocumentOptions {
  if (!options || typeof options !== 'object') {
    throw new APIError('Invalid options', 400, ErrorCodes.OPTIONS.INVALID);
  }

  const opts = options as Partial<DocumentOptions>;
  
  if (opts.aiProcessing && typeof opts.maxTokens !== 'number') {
    throw new APIError('Missing token limit for AI processing', 400, ErrorCodes.OPTIONS.MISSING_AI_CONFIG);
  }
}

// File validation with improved type checking
export async function validateFileUpload(file: File | null | undefined) {
  if (!file) {
    throw new APIError('No file provided', 400, ErrorCodes.FILE.EMPTY);
  }

  if (file.size > FILE_SIZE_LIMIT) {
    throw new APIError('File too large', 400, ErrorCodes.FILE.TOO_LARGE);
  }

  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    throw new APIError('Unsupported file type', 400, ErrorCodes.FILE.INVALID_TYPE);
  }
}