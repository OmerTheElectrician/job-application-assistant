import { DependencyMap } from './dependency-tracker';
import * as fs from 'fs';
import * as path from 'path';

function analyzeTypeUsage() {
  const typeUsage = new Map<string, Set<string>>();
  
  DependencyMap.forEach((deps, file) => {
    deps.types.forEach(type => {
      if (!typeUsage.has(type)) {
        typeUsage.set(type, new Set([file]));
      } else {
        typeUsage.get(type)?.add(file);
      }
    });
  });

  console.log('\nType Usage Analysis:');
  typeUsage.forEach((files, type) => {
    console.log(`\n"${type}" is used in:`);
    files.forEach(file => console.log(`  - ${file}`));
  });
}

async function analyzeDependencies() {
  try {
    console.log('Starting dependency analysis...');

    DependencyMap.forEach((deps, file) => {
      console.log(`\nAnalyzing ${file}:`);
      console.log('- Imports:', deps.imports);
      console.log('- Functions:', deps.functions);
      console.log('- Types:', deps.types);
    });

    console.log('\nChecking for redundancies...');
    findRedundancies();
    
    console.log('\nAnalyzing type usage...');
    analyzeTypeUsage();
    
    console.log('\nChecking for circular dependencies...');
    detectCircularDependencies();
    
    console.log('\nAnalysis complete!');
  } catch (error) {
    console.error('Error during analysis:', error);
    process.exit(1);
  }
}

analyzeDependencies();

function findRedundancies() {
  const redundancies = new Map<string, Set<string>>();
  
  // Check for duplicate functions
  const allFunctions = new Map<string, string[]>();
  
  DependencyMap.forEach((deps, file) => {
    deps.functions.forEach(func => {
      if (!allFunctions.has(func)) {
        allFunctions.set(func, [file]);
      } else {
        allFunctions.get(func)?.push(file);
      }
    });
  });
  
  // Log redundancies
  allFunctions.forEach((files, func) => {
    if (files.length > 1) {
      console.log(`Function "${func}" appears in multiple files:`, files);
    }
  });
  
  return redundancies;
}

findRedundancies();

function detectCircularDependencies() {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  
  function checkFile(file: string, depPath: string[] = []): void {
    if (recursionStack.has(file)) {
      console.log(`Circular dependency detected: ${depPath.join(' -> ')} -> ${file}`);
      return;
    }
    
    if (visited.has(file)) return;
    
    visited.add(file);
    recursionStack.add(file);
    
    const deps = DependencyMap.get(file);
    if (deps) {
      deps.imports.forEach(imp => {
        if (imp.startsWith('.')) {
          const resolvedPath = path.resolve(
            path.dirname(file),
            imp.replace(/\@\//, '')
          );
          checkFile(resolvedPath, [...depPath, file]);
        }
      });
    }
    
    recursionStack.delete(file);
  }
  
  DependencyMap.forEach((_, file) => {
    if (!visited.has(file)) {
      checkFile(file);
    }
  });
}