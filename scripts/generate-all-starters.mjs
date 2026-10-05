import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  generatePythonStarterCode,
  generateCppStarterCode,
  generateCStarterCode,
  generateGoStarterCode,
} from '../src/utils/starterCode.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const problemsDir = path.join(rootDir, 'content', 'problems');

const entries = fs.readdirSync(problemsDir, { withFileTypes: true });
const problemDirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);

console.log(`Found ${problemDirs.length} problem directories.`);

let generatedCount = 0;

for (const idStr of problemDirs) {
  const probPath = path.join(problemsDir, idStr);
  const metaPath = path.join(probPath, 'meta.json');
  if (!fs.existsSync(metaPath)) {
    continue;
  }

  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  const starterDir = path.join(probPath, 'starter');
  if (!fs.existsSync(starterDir)) {
    fs.mkdirSync(starterDir, { recursive: true });
  }

  // 1. Python
  const pyCode = generatePythonStarterCode(meta);
  fs.writeFileSync(path.join(starterDir, 'Solution.py'), pyCode, 'utf8');

  // 2. C++
  const cppCode = generateCppStarterCode(meta);
  fs.writeFileSync(path.join(starterDir, 'Solution.cpp'), cppCode, 'utf8');

  // 3. C
  const cCode = generateCStarterCode(meta);
  fs.writeFileSync(path.join(starterDir, 'Solution.c'), cCode, 'utf8');

  // 4. Go
  const goCode = generateGoStarterCode(meta);
  fs.writeFileSync(path.join(starterDir, 'Solution.go'), goCode, 'utf8');

  generatedCount++;
}

console.log(`Successfully generated starter code for ${generatedCount} problems across Python, C++, C, and Go!`);
