import { NextResponse } from 'next/server';

export async function GET() {
  if (!process.env.OPENAI_API_KEY) {
    console.warn('OpenAI API key not found');
    return NextResponse.json({ 
      status: 'degraded',
      message: 'API configuration incomplete'
    }, { status: 503 });
  }

  return NextResponse.json({ status: 'operational' });
}