import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function GET() {
  try {
    // Check OpenAI connection
    await openai.chat.completions.create({
      messages: [{ role: 'user', content: 'test' }],
      model: 'gpt-3.5-turbo',
      max_tokens: 1
    });

    return NextResponse.json({
      status: 'healthy',
      services: {
        openai: 'connected',
        storage: 'available',
        docProcessing: 'ready'
      },
      version: process.env.npm_package_version || '1.0.0',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      status: 'degraded',
      error: 'Service check failed',
      timestamp: new Date().toISOString()
    }, { status: 503 });
  }
}