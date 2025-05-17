import { 
  FormattedDocument, 
  DocumentOptions, 
  DocumentSection 
} from '@/types/document';
import { 
  ACCEPTED_FILE_TYPES, 
  FILE_SIZE_LIMIT,
  AcceptedFileType 
} from '@/config/constants';
import { ErrorCodes } from './constants';
import { APIError } from './error';

// Consolidate all document-related validation
export function validateDocument(doc: unknown): asserts doc is FormattedDocument {
  if (!isObject(doc)) {
    throw new APIError('Invalid document format', 400, ErrorCodes.DOCUMENT.INVALID_FORMAT);
  }

  if (!Array.isArray(doc.sections)) {
    throw new APIError('Invalid document structure', 400, ErrorCodes.DOCUMENT.INVALID_STRUCTURE);
  }

  doc.sections.forEach((section, index) => validateSection(section, index));

  if (!isValidMetadata(doc.metadata)) {
    throw new APIError('Invalid document metadata', 400, ErrorCodes.DOCUMENT.INVALID_METADATA);
  }
}

// Combined options validation
export function validateOptions(options: unknown): asserts options is DocumentOptions {
  if (!isObject(options)) {
    throw new APIError('Invalid options', 400, ErrorCodes.OPTIONS.INVALID);
  }

  const opts = options as Partial<DocumentOptions>;
  
  if (opts.aiProcessing) {
    validateAIOptions(opts);
  }

  if (opts.exportFormat && !['pdf', 'docx'].includes(opts.exportFormat)) {
    throw new APIError('Invalid export format', 400, ErrorCodes.OPTIONS.INVALID_FORMAT);
  }
}

// File validation with improved type checking
export async function validateFileUpload(file: unknown): Promise<void> {
  if (!isFile(file)) {
    throw new APIError('Invalid file', 400, ErrorCodes.FILE.INVALID);
  }

  if (file.size > FILE_SIZE_LIMIT) {
    throw new APIError(
      `File too large. Maximum size: ${FILE_SIZE_LIMIT / 1024 / 1024}MB`,
      400, 
      ErrorCodes.FILE.TOO_LARGE
    );
  }

  if (!isAcceptedFileType(file.type)) {
    throw new APIError(
      `Unsupported file type. Accepted types: PDF, DOCX`,
      400,
      ErrorCodes.FILE.INVALID_TYPE
    );
  }
}

// Add this helper function
function isAcceptedFileType(type: string): type is AcceptedFileType {
  return ACCEPTED_FILE_TYPES.includes(type as AcceptedFileType);
}

// Helper functions
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isFile(value: unknown): value is File {
  return value instanceof File;
}

function validateSection(section: unknown, index: number): asserts section is DocumentSection {
  if (!isObject(section)) {
    throw new APIError(
      `Invalid section at index ${index}`,
      400,
      ErrorCodes.DOCUMENT.INVALID_SECTION
    );
  }

  if (typeof section.text !== 'string') {
    throw new APIError(
      `Invalid section text at index ${index}`,
      400,
      ErrorCodes.DOCUMENT.INVALID_CONTENT
    );
  }

  if (!isObject(section.formatting)) {
    throw new APIError(
      `Invalid section formatting at index ${index}`,
      400,
      ErrorCodes.DOCUMENT.INVALID_FORMAT
    );
  }
}

function isValidMetadata(metadata: unknown): boolean {
  if (!isObject(metadata)) return false;
  
  const { created, lastModified } = metadata as Record<string, unknown>;
  return (
    typeof created === 'string' &&
    typeof lastModified === 'string' &&
    !isNaN(Date.parse(created)) &&
    !isNaN(Date.parse(lastModified))
  );
}

function validateAIOptions(opts: Partial<DocumentOptions>): void {
  if (typeof opts.maxTokens !== 'number' || opts.maxTokens <= 0) {
    throw new APIError(
      'Invalid token limit for AI processing',
      400,
      ErrorCodes.OPTIONS.INVALID_AI_CONFIG
    );
  }

  if (opts.model && typeof opts.model !== 'string') {
    throw new APIError(
      'Invalid AI model specified',
      400,
      ErrorCodes.OPTIONS.INVALID_AI_MODEL
    );
  }
}