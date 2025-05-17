export function validateEnv() {
  const requiredEnvVars = [
    'OPENAI_API_KEY',
    'UPLOAD_DIR',
    'MAX_FILE_SIZE',
    'ALLOWED_FILE_TYPES'
  ] as const

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`)
    }
  }

  return {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY as string,
    UPLOAD_DIR: process.env.UPLOAD_DIR as string,
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE as string),
    ALLOWED_FILE_TYPES: (process.env.ALLOWED_FILE_TYPES as string).split(','),
  }
}