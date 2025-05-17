"use client";

import { NextResponse } from 'next/server';

export class APIError extends Error {
  constructor(
    public message: string,
    public code: string = 'UNKNOWN_ERROR',
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export async function logError(error: unknown, context?: Record<string, unknown>) {
  console.error('API Error:', error, context);
}

export function handleAPIError(error: unknown) {
  const apiError = error instanceof APIError ? error : new APIError('Internal Server Error');
  return NextResponse.json({ error: apiError.message }, { status: apiError.statusCode });
}