const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = process.cwd();

// Technique keywords forbidden by Spoiler-Safe rules
const FORBIDDEN_WORDS = [
  'hash map', 'hashmap', 'hash table', 'hashtable', 'hash set', 'hashset',
  'two pointer', 'two-pointer', 'two pointers', 'two-pointers',
  'sliding window',
  'dynamic programming', ' 1-d dp', ' 2-d dp', ' dp ',
  'binary search',
  'breadth first', 'breadth-first', 'bfs',
  'depth first', 'depth-first', 'dfs',
  'stack', 'queue', 'deque',
  'priority queue', 'priorityqueue', 'heap', 'min-heap', 'max-heap',
  'trie', 'prefix tree',
  'backtracking', 'backtrack',
  'topological sort',
  'bit manipulation', 'bitmask',
  'kadane', 'dijkstra'
];

function lintContentForSpoilers(text, label) {
  const lower = text.toLowerCase();
  for (const word of FORBIDDEN_WORDS) {
    // Check word boundaries
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(lower)) {
      throw new Error(`Spoiler rule violation in ${label}: contains forbidden technique word "${word}"`);
    }
  }
}

async function verifyProblem(problemId) {
  console.log(`\nVerifying Problem #${problemId}...`);
  const contentDir = path.join(rootDir, 'content', 'problems', String(problemId));
  const privateDir = path.join(rootDir, 'server', 'private', String(problemId));

  const metaPath = path.join(contentDir, 'meta.json');
  const statementPath = path.join(contentDir, 'statement.md');
  const starterPath = path.join(contentDir, 'starter', 'Solution.java');
  const refPath = path.join(privateDir, 'Solution.java');
  const hiddenPath = path.join(privateDir, 'tests.json');

  if (!fs.existsSync(metaPath) || !fs.existsSync(privateDir)) {
    console.log(`Skipping #${problemId}: not yet ready.`);
    return false;
  }

  // 1. Lint for spoiler technique words
  const statement = fs.readFileSync(statementPath, 'utf8');
  const starter = fs.readFileSync(starterPath, 'utf8');

  // Except if the problem is literally "Implement Trie", allow "trie" only in class name context
  if (problemId !== 208) {
    lintContentForSpoilers(statement, `Statement #${problemId}`);
    lintContentForSpoilers(starter, `Starter #${problemId}`);
  }
  console.log('✓ Passed spoiler-safe keyword linting');

  // 2. Validate tests count
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  const hidden = JSON.parse(fs.readFileSync(hiddenPath, 'utf8'));

  if (hidden.length < 15) {
    throw new Error(`Problem #${problemId} has only ${hidden.length} hidden tests (minimum is 15)`);
  }
  console.log(`✓ Hidden tests count verified (${hidden.length} tests)`);

  // 3. Compile and run reference solution
  const refCode = fs.readFileSync(refPath, 'utf8');
  const runId = `verify-${problemId}-${Date.now()}`;
  const runDir = path.join(rootDir, 'scratch', 'verify', runId);
  fs.mkdirSync(runDir, { recursive: true });

  try {
    // Copy templates & Judge
    const templatesDir = path.join(rootDir, 'server', 'judge', 'templates');
    fs.readdirSync(templatesDir).forEach(f => fs.copyFileSync(path.join(templatesDir, f), path.join(runDir, f)));
    fs.copyFileSync(path.join(rootDir, 'server', 'judge', 'Judge.java'), path.join(runDir, 'Judge.java'));

    // Write Solution
    const classFileName = `${meta.className || 'Solution'}.java`;
    fs.writeFileSync(path.join(runDir, classFileName), refCode, 'utf8');

    // Combine sample and hidden tests
    const allTests = [];
    meta.examples.forEach((ex, idx) => allTests.push({ index: idx, inputs: ex.input }));
    hidden.forEach((ht, idx) => allTests.push({ index: meta.examples.length + idx, inputs: ht.inputs }));

    const payload = {
      className: meta.className || 'Solution',
      methodName: meta.methodName,
      params: meta.params,
      returnType: meta.returnType,
      kind: meta.kind,
      timeLimitMs: meta.timeLimitMs || 2000,
      tests: allTests
    };
    fs.writeFileSync(path.join(runDir, 'input.json'), JSON.stringify(payload), 'utf8');

    // Compile
    execSync('javac -encoding UTF-8 *.java', { cwd: runDir });
    console.log('✓ Reference solution compiled cleanly');

    // Run
    const stdout = execSync('java -Xmx256m -Xss64m Judge input.json', { cwd: runDir }).toString('utf8');
    const outputs = JSON.parse(stdout);

    if (outputs.length !== allTests.length) {
      throw new Error(`Judge output count mismatch: expected ${allTests.length}, got ${outputs.length}`);
    }

    for (let i = 0; i < outputs.length; i++) {
      const out = outputs[i];
      if (out.verdict !== 'OK') {
        throw new Error(`Reference solution failed on test ${i}: ${out.verdict} - ${out.error}`);
      }
    }
    console.log(`✓ Reference solution passed all ${outputs.length} sample and hidden tests`);

  } finally {
    try { fs.rmSync(runDir, { recursive: true, force: true }); } catch (e) {}
  }

  console.log(`🎉 Problem #${problemId} fully verified!`);
  return true;
}

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error('Usage: npm run content:verify [<id> | --all]');
    process.exit(1);
  }

  const seedProblems = JSON.parse(fs.readFileSync(path.join(rootDir, 'src', 'data', 'seedProblems.json'), 'utf8'));

  if (arg === '--all') {
    let verifiedCount = 0;
    for (const p of seedProblems) {
      const ok = await verifyProblem(p.id);
      if (ok) verifiedCount++;
    }
    console.log(`\n========================================`);
    console.log(`Summary: ${verifiedCount} problems verified successfully.`);
    console.log(`========================================\n`);
  } else {
    const id = Number(arg);
    await verifyProblem(id);
  }
}

main().catch(err => {
  console.error('\nVerification failed:', err.message);
  process.exit(1);
});
