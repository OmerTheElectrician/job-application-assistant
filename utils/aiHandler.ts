import OpenAI from 'openai';
import { FormattedDocument } from '@/types/document';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function optimizeFormattedCV(doc: FormattedDocument): Promise<FormattedDocument> {
  const prompt = `
    Optimize this CV while preserving formatting:

    ${doc.sections.map(section => {
      const format = [];
      if (section.formatting.isHeading) format.push('[HEADING]');
      if (section.formatting.isBold) format.push('[BOLD]');
      if (section.formatting.isList) format.push('[LIST]');
      return `${format.join(' ')}${section.text}`;
    }).join('\n')}

    Improve the content while keeping the formatting tags.
    Make it more professional and impactful.
    Return the optimized text with the same formatting tags.
  `;

  const completion = await openai.chat.completions.create({
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

  // Parse AI response back into formatted document
  const response = completion.choices[0].message.content || '';
  const sections = response.split('\n').map(line => {
    const formatting = {
      isHeading: line.includes('[HEADING]'),
      isBold: line.includes('[BOLD]'),
      isList: line.includes('[LIST]')
    };
    const text = line.replace(/\[(HEADING|BOLD|LIST)\]/g, '').trim();
    return { text, formatting };
  });

  return {
    sections,
    metadata: doc.metadata
  };
}