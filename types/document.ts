export interface TextStyle {
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  isStrikethrough?: boolean;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  backgroundColor?: string;
  letterSpacing?: number;
  lineHeight?: number;
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
}

export interface ParagraphStyle {
  alignment?: 'left' | 'center' | 'right' | 'justify';
  indentation?: number;
  spacing?: {
    before?: number;
    after?: number;
    line?: number;
  };
  borders?: {
    top?: boolean;
    bottom?: boolean;
    left?: boolean;
    right?: boolean;
    style?: 'solid' | 'dotted' | 'dashed';
  };
}

export interface ListProperties {
  type: 'bullet' | 'numbered' | 'checkbox';
  level: number;
  marker?: string;
  isChecked?: boolean;
}

export interface FormattedText {
  text: string;
  formatting: TextStyle;
  paragraph?: ParagraphStyle;
  list?: ListProperties;
  isHeading?: boolean;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  links?: {
    url?: string;
    tooltip?: string;
  };
  position?: {
    page?: number;
    x?: number;
    y?: number;
  };
}

export interface CVSection {
  type: 'personalInfo' | 'summary' | 'experience' | 'education' | 'skills' | 'languages' | 'certificates' | 'projects' | 'interests' | 'references' | 'custom';
  title: string;
  content: FormattedText[];
  importance: number; // AI can use this to prioritize sections
  keywords?: string[]; // For better AI analysis
  confidence?: number; // AI's confidence in section classification
}

export interface DocumentMetadata {
  created: string;
  lastModified: string;
}

export interface DocumentContent {
  text: string;
  formatting: {
    isHeading: boolean;
    isBold: boolean;
    isItalic: boolean;
    isList: boolean;
  };
}

export interface DocumentSection {
  content: DocumentContent[];
  type?: string;
  title?: string;
}

export interface FormattedDocument {
  sections: DocumentSection[];
  metadata: {
    created: string;
    lastModified: string;
  };
}

export interface ExperienceEntry {
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  isCurrentRole?: boolean;
  location?: string;
  responsibilities: string[];
  achievements: string[];
  technologies?: string[];
  industry?: string;
  teamSize?: number;
  reportingTo?: string;
}

export interface EducationEntry {
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  grade?: string;
  honors?: string[];
  thesis?: {
    title: string;
    description: string;
    grade?: string;
  };
  relevantCourses?: string[];
}

export interface SkillAssessment {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number;
  lastUsed?: Date;
  certifications?: string[];
  projects?: string[];
}

export interface AIAnalysisResult {
  sectionScores: {
    [key: string]: {
      relevance: number;
      completeness: number;
      impact: number;
      clarity: number;
    };
  };
  overallAssessment: {
    targetIndustryFit: number;
    experienceRelevance: number;
    skillsMatch: number;
    presentationQuality: number;
  };
  suggestions: {
    priority: 'high' | 'medium' | 'low';
    category: 'content' | 'format' | 'language' | 'structure';
    description: string;
    originalText?: string;
    suggestedText?: string;
    reasoning?: string;
  }[];
  keywordAnalysis: {
    missing: string[];
    overused: string[];
    recommended: string[];
  };
  industryAlignment: {
    targetIndustry?: string;
    matchScore: number;
    missingKeyCompetencies: string[];
  };
  languageQuality: {
    grammar: number;
    vocabulary: number;
    tone: number;
    actionVerbs: string[];
    passiveVoice: boolean[];
  };
}

export interface ProcessingOptions {
  extractImages?: boolean;
  preserveFormatting?: boolean;
  detectLanguage?: boolean;
  performAnalysis?: boolean;
  maxSectionLength?: number;
  targetLanguage?: string;
  confidenceThreshold?: number;
  enhancementLevel?: 'light' | 'moderate' | 'aggressive';
  targetPosition?: string;
  targetIndustry?: string;
  experienceLevel?: 'entry' | 'mid' | 'senior' | 'executive';
  optimizationPreferences?: {
    focusAreas: ('skills' | 'experience' | 'education' | 'achievements')[];
    tone: 'professional' | 'confident' | 'modest' | 'innovative';
    lengthPreference: 'concise' | 'detailed' | 'comprehensive';
    specialEmphasis?: string[];
  };
  aiOptions?: {
    model: 'gpt-3.5-turbo' | 'gpt-4' | 'claude-2';
    temperature: number;
    maxTokens: number;
    multipleVariants?: boolean;
    requireExplanations?: boolean;
  };
}

// Create an index file for better type exports
export interface DocumentOptions {
  aiProcessing?: boolean;
  maxTokens?: number;
  model?: string;
  exportFormat?: 'pdf' | 'docx';
}