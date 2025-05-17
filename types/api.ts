export interface PersonalInfo {
  name: string
  email: string
  phone: string
  address: string
}

export interface Experience {
  company: string
  position: string
  dates: string
  responsibilities: string[]
  location?: string  // Add optional location field
}

export interface Education {
  degree: string
  institution: string
  dates: string
  location?: string  // Add optional location field
  grade?: string     // Add optional grade field
}

export interface CVData {
  personalInfo: PersonalInfo
  experience: Experience[]
  education: Education[]
  skills: string[]
  languages?: string[]  // Add optional languages field
}

export interface Suggestion {
  type: 'ai' | 'error' | 'warning'  // Use literal types for better type safety
  section: string
  message: string
}

export interface APIResponse {
  message: string
  error?: string
  fileId?: string
  documentUrl?: string
  suggestions?: Suggestion[]  // Use the new Suggestion interface
}