export interface FileDependencies {
  imports: string[];
  exports: string[];
  functions: string[];
  types: string[];
}

export const DependencyMap = new Map<string, FileDependencies>([
  ['api/upload/route.ts', {
    imports: [
      '@/types/document',
      '@/services/documentService'
    ],
    exports: ['POST'],
    functions: ['processUpload'],
    types: ['FormattedDocument']
  }],
  ['api/export/route.ts', {
    imports: [
      '@/types/document',
      '@/services/documentService',
      '../responses'
    ],
    exports: ['POST'],
    functions: ['generateDocument'],
    types: ['ExportOptions']
  }],
  ['services/documentService.ts', {
    imports: [
      'docx',
      'pdf-lib',
      'pdfjs-dist',
      'mammoth',
      '@/types/document'
    ],
    exports: ['processDocument', 'generateDocument'],
    functions: ['extractText', 'formatDocument'],
    types: ['DocumentOptions']
  }],
  ['services/aiService.ts', {
    imports: [
      'openai',
      '@/types/document'
    ],
    exports: ['optimizeCV'],
    functions: ['analyzeDocument', 'generateSuggestions'],
    types: ['AIAnalysisResult']
  }],
  ['components/export-options.tsx', {
    imports: [
      '@/types/document',
      '@/components/ui',
      '@/services/documentService'
    ],
    exports: ['ExportOptions'],
    functions: ['handleDownload'],
    types: ['ExportOptionsProps']
  }],
  ['types/document.ts', {
    imports: [],
    exports: [
      'FormattedDocument',
      'ProcessingOptions',
      'DocumentOptions',
      'AIAnalysisResult'
    ],
    functions: [],
    types: [
      'FormattedDocument',
      'ProcessingOptions',
      'DocumentOptions',
      'AIAnalysisResult'
    ]
  }]
]);

export interface ImportAnalysis {
  absolutePaths: string[];
  relativePaths: string[];
  duplicates: string[];
}

export function analyzeImportPaths(deps: FileDependencies): ImportAnalysis {
  const paths = {
    absolutePaths: deps.imports.filter(i => i.startsWith('@/')),
    relativePaths: deps.imports.filter(i => i.startsWith('.')),
    duplicates: findDuplicateImports(deps.imports)
  };
  return paths;
}

function findDuplicateImports(imports: string[]): string[] {
  return imports.filter((item, index) => imports.indexOf(item) !== index);
}