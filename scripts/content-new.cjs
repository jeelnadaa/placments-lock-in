const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const id = process.argv[2];

if (!id) {
  console.error('Usage: npm run content:new <problem-id>');
  process.exit(1);
}

const seedProblems = JSON.parse(fs.readFileSync(path.join(rootDir, 'src', 'data', 'seedProblems.json'), 'utf8'));
const prob = seedProblems.find((p) => p.id === Number(id));

if (!prob) {
  console.error(`Problem ID ${id} not found in Blind 75 seed.`);
  process.exit(1);
}

const contentDir = path.join(rootDir, 'content', 'problems', String(id));
const privateDir = path.join(rootDir, 'server', 'private', String(id));

fs.mkdirSync(path.join(contentDir, 'starter'), { recursive: true });
fs.mkdirSync(privateDir, { recursive: true });

const meta = {
  id: prob.id,
  className: 'Solution',
  methodName: 'solve',
  params: [{ name: 'param', type: 'int[]' }],
  returnType: 'int',
  kind: 'function',
  comparator: 'exact',
  timeLimitMs: 2000,
  memoryLimitMb: 256,
  examples: [
    { input: { param: [1, 2, 3] }, output: 6 }
  ],
  constraints: [
    '1 <= param.length <= 10^5'
  ]
};

const statement = `# ${prob.title}

Given an input \`param\`, solve the problem.

[Official LeetCode Problem #${prob.id}](${prob.leetcodeUrl})
`;

const starter = `class Solution {
    public int solve(int[] param) {
        
    }
}
`;

const refSolution = `class Solution {
    public int solve(int[] param) {
        int sum = 0;
        for (int x : param) sum += x;
        return sum;
    }
}
`;

const tests = [
  { inputs: { param: [1, 2, 3] }, expected: 6 }
];

fs.writeFileSync(path.join(contentDir, 'meta.json'), JSON.stringify(meta, null, 2), 'utf8');
fs.writeFileSync(path.join(contentDir, 'statement.md'), statement, 'utf8');
fs.writeFileSync(path.join(contentDir, 'starter', 'Solution.java'), starter, 'utf8');
fs.writeFileSync(path.join(privateDir, 'Solution.java'), refSolution, 'utf8');
fs.writeFileSync(path.join(privateDir, 'tests.json'), JSON.stringify(tests, null, 2), 'utf8');

console.log(`Scaffolded problem #${id} (${prob.title}) in content/problems/${id} and server/private/${id}`);
