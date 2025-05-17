SCHULE FOS\INFORMATIK WEBSEITEN\2-ProjektBewerbungsOptimierungsWebseite\bewerbungs-optimizer\README.md
# Bewerbungs-Optimizer

A web application that helps optimize job applications using AI. Built with Next.js and OpenAI.

## Features
- Upload CV/resume files (PDF/DOCX)
- Extract and analyze content
- Provide AI-powered improvement suggestions
- Export optimized documents as PDF

## Tech Stack
- Next.js 13 with App Router
- TypeScript
- Tailwind CSS
- OpenAI GPT-3.5
- PDF parsing and generation (pdf-parse, pdfkit)
- DOCX parsing (mammoth)

## Setup
1. Clone the repository
2. Install dependencies: 
   ```bash
   npm install
   ```
3. Create `.env.local` and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_key_here
   ```
4. Run development server: 
   ```bash
   npm run dev
   ```

## Project Structure
- `/app` - Next.js app directory with routes and API endpoints
- `/components` - Reusable UI components
- `/styles` - Global styles and Tailwind configuration
- `/types` - TypeScript type definitions
- `/uploads` - Temporary storage for uploaded files
- `/exports` - Generated PDF files

## Development
Running tests:
```bash
npm run test
```

Building for production:
```bash
npm run build
```

## License
MIT