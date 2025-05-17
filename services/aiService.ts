import OpenAI from 'openai';
import { FormattedDocument } from '@/types/document';

export class AIService {
  private static openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  public static async optimizeCV(doc: FormattedDocument): Promise<FormattedDocument> {
    // Move optimizeFormattedCV logic from aiHandler.ts here
  }

  public static async validateTokenCount(text: string): Promise<void> {
    // Move validateAIRequest logic from validation.ts here
  }
}