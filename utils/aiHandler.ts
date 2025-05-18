import OpenAI from 'openai';
import { FormattedDocument, DocumentContent } from '@/types/document';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function optimizeFormattedCV(doc: FormattedDocument): Promise<FormattedDocument> {
  const prompt = `
    Optimize this CV while preserving formatting:

    ${doc.sections.map(section => 
      section.content.map(content => {
        const format = [];
        if (content.formatting.isHeading) format.push('[HEADING]');
        if (content.formatting.isBold) format.push('[BOLD]');
        if (content.formatting.isList) format.push('[LIST]');
        return `${format.join(' ')}${content.text}`;
      }).join('\n')
    ).join('\n\n')}

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
  const sections = response.split('\n\n')
    .filter(sectionText => sectionText.trim().length > 0)
    .map(sectionText => ({
      content: sectionText.split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => ({
          text: line.replace(/\[(HEADING|BOLD|LIST)\]/g, '').trim(),
          formatting: {
            isHeading: line.includes('[HEADING]'),
            isBold: line.includes('[BOLD]'),
            isItalic: false,
            isList: line.includes('[LIST]')
          }
        }))
    }));

  return {
    sections,
    metadata: {
      ...doc.metadata,
      lastModified: new Date().toISOString()
    }
  };
}