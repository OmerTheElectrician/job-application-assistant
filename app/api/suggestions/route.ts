import { NextRequest, NextResponse } from "next/server"
import OpenAI from 'openai'
import { FormattedDocument, AIAnalysisResult } from '@/types/document'
import { createAPIResponse, createErrorResponse } from '../responses';
import { APIError } from '../error';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

async function analyzeDocument(doc: FormattedDocument): Promise<AIAnalysisResult> {
  const prompt = `
    Analyze this CV and provide detailed suggestions:

    ${doc.sections.map(section => section.content.map(c => c.text).join('\n')).join('\n\n')}

    Provide:
    1. Section-by-section analysis
    2. Overall assessment
    3. Industry alignment
    4. Language improvements
    5. Keyword optimization
  `

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are an expert CV analyst. Provide detailed, actionable suggestions."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 2000
  })

  // Parse AI response into structured suggestions
  const analysis = completion.choices[0].message.content || ''
  
  return {
    sectionScores: parseSectionScores(analysis),
    overallAssessment: parseOverallAssessment(analysis),
    suggestions: parseSuggestions(analysis),
    keywordAnalysis: parseKeywords(analysis),
    industryAlignment: parseIndustryFit(analysis),
    languageQuality: parseLanguageQuality(analysis)
  }
}

function parseSectionScores(analysis: string) {
  const scores = {
    personalInfo: { relevance: 0, completeness: 0, impact: 0, clarity: 0 },
    experience: { relevance: 0, completeness: 0, impact: 0, clarity: 0 },
    education: { relevance: 0, completeness: 0, impact: 0, clarity: 0 },
    skills: { relevance: 0, completeness: 0, impact: 0, clarity: 0 }
  }

  // Extract scores from AI response using regex
  const scoreRegex = /(\w+):\s*(\d+)/g
  let match
  while ((match = scoreRegex.exec(analysis)) !== null) {
    const [_, section, score] = match
    if (scores[section]) {
      scores[section].relevance = parseInt(score)
    }
  }

  return scores
}

function parseOverallAssessment(analysis: string) {
  return {
    targetIndustryFit: extractScore(analysis, 'Industry Fit'),
    experienceRelevance: extractScore(analysis, 'Experience'),
    skillsMatch: extractScore(analysis, 'Skills'),
    presentationQuality: extractScore(analysis, 'Presentation')
  }
}

function parseSuggestions(analysis: string) {
  const suggestions = []
  const lines = analysis.split('\n')
  
  for (const line of lines) {
    if (line.startsWith('- ')) {
      const [category, ...description] = line.slice(2).split(':')
      suggestions.push({
        priority: determinePriority(line),
        category: category.toLowerCase() as 'content' | 'format' | 'language' | 'structure',
        description: description.join(':').trim()
      })
    }
  }

  return suggestions
}

function parseKeywords(analysis: string) {
  const keywordSection = analysis.split('Keywords:')[1]?.split('\n') || []
  return {
    missing: extractKeywords(keywordSection, 'Missing'),
    overused: extractKeywords(keywordSection, 'Overused'),
    recommended: extractKeywords(keywordSection, 'Recommended')
  }
}

function parseIndustryFit(analysis: string) {
  return {
    targetIndustry: extractIndustry(analysis),
    matchScore: extractScore(analysis, 'Industry Match'),
    missingKeyCompetencies: extractCompetencies(analysis)
  }
}

function parseLanguageQuality(analysis: string) {
  return {
    grammar: extractScore(analysis, 'Grammar'),
    vocabulary: extractScore(analysis, 'Vocabulary'),
    tone: extractScore(analysis, 'Tone'),
    actionVerbs: extractActionVerbs(analysis),
    passiveVoice: extractPassiveVoice(analysis)
  }
}

// Helper functions
function extractScore(text: string, category: string): number {
  const match = text.match(new RegExp(`${category}[^0-9]*([0-9]+)`))
  return match ? parseInt(match[1]) : 0
}

function determinePriority(suggestion: string): 'high' | 'medium' | 'low' {
  if (suggestion.includes('!') || suggestion.toLowerCase().includes('critical')) {
    return 'high'
  }
  if (suggestion.toLowerCase().includes('should') || suggestion.toLowerCase().includes('recommend')) {
    return 'medium'
  }
  return 'low'
}

function extractKeywords(lines: string[], type: string): string[] {
  const keywordLine = lines.find(line => line.includes(type))
  return keywordLine
    ? keywordLine.split(':')[1].split(',').map(k => k.trim())
    : []
}

function extractIndustry(analysis: string): string | undefined {
  const match = analysis.match(/Industry:\s*([^\.]+)/)
  return match ? match[1].trim() : undefined
}

function extractCompetencies(analysis: string): string[] {
  const competenciesSection = analysis.split('Missing Competencies:')[1]
  return competenciesSection
    ? competenciesSection.split('\n')[0].split(',').map(c => c.trim())
    : []
}

function extractActionVerbs(analysis: string): string[] {
  const verbSection = analysis.split('Action Verbs:')[1]
  return verbSection
    ? verbSection.split('\n')[0].split(',').map(v => v.trim())
    : []
}

function extractPassiveVoice(analysis: string): boolean[] {
  const passiveSection = analysis.split('Passive Voice:')[1]
  return passiveSection
    ? passiveSection.split('\n')[0].split(',').map(p => p.trim() === 'true')
    : []
}

export async function POST(request: NextRequest) {
  try {
    const document = (await request.json()) as FormattedDocument
    const analysis = await analyzeDocument(document)

    return NextResponse.json({
      success: true,
      analysis
    })

  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json(
      { error: "Failed to analyze document" },
      { status: 500 }
    )
  }
}

