declare module 'mammoth' {
  interface Message {
    type: 'warning' | 'error'
    message: string
    location?: {
      path: string[]
      value?: string
    }
  }

  interface ConversionResult {
    value: string
    messages: Message[]  // More specific type for messages
  }

  interface Options {
    buffer?: Buffer | Uint8Array  // Support both Buffer and Uint8Array
    path?: string
    styleMap?: string[]
    includeDefaultStyleMap?: boolean
    convertImage?: (image: { buffer: Buffer }) => Promise<{ src: string }>
  }

  function extractRawText(options: Options): Promise<ConversionResult>
  
  export { extractRawText, ConversionResult, Options, Message }
}