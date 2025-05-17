export const ProjectStructure = {
  api: {
    routes: [
      'upload/route.ts',
      'export/route.ts',
      'suggestions/route.ts'
    ],
    utils: [
      'error.ts',
      'validation.ts',
      'responses.ts'
    ]
  },
  services: [
    'documentService.ts',
    'aiService.ts'
  ],
  types: [
    'document.ts',
    'api.ts'
  ],
  components: [
    'export-options.tsx',
    'file-upload.tsx'
  ]
}