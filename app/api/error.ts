"use client";

import { NextResponse } from 'next/server';

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export async function logError(error: unknown, context?: Record<string, unknown>) {
  console.error('API Error:', error, context);
}

export function handleAPIError(error: unknown) {
  const apiError = error instanceof APIError ? error : new APIError('Internal Server Error', 500, 'UNKNOWN_ERROR');
  return NextResponse.json({ error: apiError.message }, { status: apiError.statusCode });
}