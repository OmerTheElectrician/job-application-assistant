import { NextResponse } from 'next/server';
import { APIError } from './error';
import type { APIResponse } from './types';

export function createAPIResponse<T>(
  data: T, 
  status = 200,
  metadata?: Record<string, unknown>
): NextResponse {
  const response: APIResponse<T> = {
    success: true,
    data,
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: crypto.randomUUID(),
      ...metadata
    }
  };

  return NextResponse.json(response, { status });
}

export function createErrorResponse(
  error: Error | APIError,
  status = 500
): NextResponse {
  return NextResponse.json({
    success: false,
    error: {
      message: error.message,
      code: error instanceof APIError ? error.code : 'INTERNAL_ERROR'
    },
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: crypto.randomUUID()
    }
  }, { status });
}