const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const seedProblems = JSON.parse(fs.readFileSync(path.join(rootDir, 'src', 'data', 'seedProblems.json'), 'utf8'));

console.log('=== Blind 75 Problem Content Status ===\n');

let readyCount = 0;

for (const p of seedProblems) {
  const metaPath = path.join(rootDir, 'content', 'problems', String(p.id), 'meta.json');
  const starterPath = path.join(rootDir, 'content', 'problems', String(p.id), 'starter', 'Solution.java');
  const statementPath = path.join(rootDir, 'content', 'problems', String(p.id), 'statement.md');
  const refPath = path.join(rootDir, 'server', 'private', String(p.id), 'Solution.java');
  const hiddenPath = path.join(rootDir, 'server', 'private', String(p.id), 'tests.json');

  const hasMeta = fs.existsSync(metaPath);
  const hasStarter = fs.existsSync(starterPath);
  const hasStatement = fs.existsSync(statementPath);
  const hasRef = fs.existsSync(refPath);
  const hasHidden = fs.existsSync(hiddenPath);

  if (hasMeta && hasStarter && hasStatement && hasRef && hasHidden) {
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    const hidden = JSON.parse(fs.readFileSync(hiddenPath, 'utf8'));
    console.log(`[READY] #${p.id.toString().padEnd(4)} Day ${p.day.toString().padEnd(2)} - ${p.title.padEnd(35)} (Samples: ${meta.examples.length}, Hidden: ${hidden.length})`);
    readyCount++;
  } else if (hasMeta || hasStarter || hasStatement || hasRef || hasHidden) {
    console.log(`[PARTIAL] #${p.id.toString().padEnd(4)} Day ${p.day.toString().padEnd(2)} - ${p.title}`);
  }
}

console.log(`\nTotal Ready: ${readyCount} / ${seedProblems.length} problems`);
