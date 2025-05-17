import OpenAI from 'openai';
import { FormattedDocument } from '@/types/document';

export class AIService {
  private static openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  public static async optimizeCV(doc: FormattedDocument): Promise<FormattedDocument> {
    if (!doc.sections || doc.sections.length === 0) {
      return doc;
    }

    try {
      const prompt = this.createPrompt(doc);
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a CV optimization expert. Preserve formatting tags while improving content."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7
      });

      const response = completion.choices[0].message.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      return this.parseResponse(response, doc);
    } catch (error) {
      console.error('AI optimization error:', error);
      throw error;
    }
  }

  public static async validateTokenCount(text: string): Promise<void> {
    if (!text || text.length === 0) {
      throw new Error('Empty text provided');
    }

    // Rough estimation: 1 token ≈ 4 characters
    const estimatedTokens = Math.ceil(text.length / 4);
    const TOKEN_LIMIT = 4096; // GPT-3.5 limit

    if (estimatedTokens > TOKEN_LIMIT) {
      throw new Error(`Text too long: estimated ${estimatedTokens} tokens exceeds limit of ${TOKEN_LIMIT}`);
    }
  }

  private static createPrompt(doc: FormattedDocument): string {
    return doc.sections.map(section => {
      const format = [];
      if (section.formatting.isHeading) format.push('[HEADING]');
      if (section.formatting.isBold) format.push('[BOLD]');
      if (section.formatting.isList) format.push('[LIST]');
      return `${format.join(' ')}${section.text}`;
    }).join('\n');
  }

  private static parseResponse(response: string, originalDoc: FormattedDocument): FormattedDocument {
    const sections = response.split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => ({
        text: line.replace(/\[(HEADING|BOLD|LIST)\]/g, '').trim(),
        formatting: {
          isHeading: line.includes('[HEADING]'),
          isBold: line.includes('[BOLD]'),
          isList: line.includes('[LIST]')
        }
      }));

    return {
      sections,
      metadata: {
        ...originalDoc.metadata,
        lastModified: new Date().toISOString()
      }
    };
  }
}