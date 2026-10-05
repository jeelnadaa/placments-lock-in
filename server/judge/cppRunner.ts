import fs from 'fs';
import path from 'path';
import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import { ProblemMeta, VerdictType } from '../../src/types/index';
import { JudgeExecutionResult, RawTestOutput } from './runner';

const execAsync = promisify(exec);

let cachedCppCmd: string | null = null;

/**
 * Finds the working C++ compiler on host OS (g++, clang++).
 */
export async function getCppCompilerCommand(): Promise<string> {
  if (cachedCppCmd) return cachedCppCmd;

  const candidates = process.platform === 'win32'
    ? ['g++', 'clang++']
    : ['g++', 'clang++'];

  for (const cmd of candidates) {
    try {
      await execAsync(`${cmd} --version`);
      cachedCppCmd = cmd;
      return cmd;
    } catch {
      // try next
    }
  }

  cachedCppCmd = 'g++';
  return 'g++';
}

/**
 * Generates the Driver.cpp source code specifically matching the problem's meta signature.
 */
function generateDriverCpp(meta: ProblemMeta): string {
  const isInplace = typeof meta.kind === 'string' && meta.kind.startsWith('inplace:');
  const isClass = meta.kind === 'class';
  const methodName = meta.methodName;

  return `
#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <queue>
#include <stack>
#include <algorithm>
#include <chrono>
#include <cmath>
#include <climits>
#include <memory>
#include <cctype>

using namespace std;

// Standard LeetCode Data Structures
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

class Node {
public:
    int val;
    vector<Node*> neighbors;
    Node() : val(0), neighbors({}) {}
    Node(int _val) : val(_val), neighbors({}) {}
    Node(int _val, vector<Node*> _neighbors) : val(_val), neighbors(_neighbors) {}
};

// Include User Solution (Line numbers match 1:1)
#include "Solution.h"

// Ultra-lightweight JSON Parser
struct Json {
    enum Type { NUL, BOOL, NUM, STR, ARR, OBJ } type = NUL;
    bool b = false;
    double num = 0;
    string str;
    vector<Json> arr;
    unordered_map<string, Json> obj;

    bool is_null() const { return type == NUL; }
};

static void skip_ws(const string& s, size_t& i) {
    while (i < s.size() && (s[i] == ' ' || s[i] == '\\t' || s[i] == '\\n' || s[i] == '\\r')) i++;
}

static Json parse_json_val(const string& s, size_t& i);

static string parse_str_raw(const string& s, size_t& i) {
    i++; // skip open quote
    string res;
    while (i < s.size()) {
        char c = s[i++];
        if (c == '"') break;
        if (c == '\\\\' && i < s.size()) {
            char esc = s[i++];
            if (esc == '"') res += '"';
            else if (esc == '\\\\') res += '\\\\';
            else if (esc == 'n') res += '\\n';
            else if (esc == 't') res += '\\t';
            else if (esc == 'r') res += '\\r';
            else res += esc;
        } else {
            res += c;
        }
    }
    return res;
}

static Json parse_json_val(const string& s, size_t& i) {
    skip_ws(s, i);
    Json j;
    if (i >= s.size()) return j;

    char c = s[i];
    if (c == '"') {
        j.type = Json::STR;
        j.str = parse_str_raw(s, i);
    } else if (c == '[') {
        j.type = Json::ARR;
        i++;
        skip_ws(s, i);
        if (i < s.size() && s[i] == ']') { i++; return j; }
        while (i < s.size()) {
            j.arr.push_back(parse_json_val(s, i));
            skip_ws(s, i);
            if (i < s.size() && s[i] == ',') i++;
            else if (i < s.size() && s[i] == ']') { i++; break; }
        }
    } else if (c == '{') {
        j.type = Json::OBJ;
        i++;
        skip_ws(s, i);
        if (i < s.size() && s[i] == '}') { i++; return j; }
        while (i < s.size()) {
            skip_ws(s, i);
            if (s[i] != '"') break;
            string key = parse_str_raw(s, i);
            skip_ws(s, i);
            if (i < s.size() && s[i] == ':') i++;
            j.obj[key] = parse_json_val(s, i);
            skip_ws(s, i);
            if (i < s.size() && s[i] == ',') i++;
            else if (i < s.size() && s[i] == '}') { i++; break; }
        }
    } else if (c == 't' || c == 'f') {
        j.type = Json::BOOL;
        if (s.substr(i, 4) == "true") { j.b = true; i += 4; }
        else { j.b = false; i += 5; }
    } else if (c == 'n') {
        j.type = Json::NUL;
        i += 4;
    } else {
        j.type = Json::NUM;
        size_t start = i;
        if (s[i] == '-') i++;
        while (i < s.size() && (isdigit(s[i]) || s[i] == '.' || s[i] == 'e' || s[i] == 'E' || s[i] == '+' || s[i] == '-')) i++;
        j.num = stod(s.substr(start, i - start));
    }
    return j;
}

static Json parse_json(const string& s) {
    size_t i = 0;
    return parse_json_val(s, i);
}

// JSON Serializers
static string escape_json(const string& s) {
    string res;
    for (char c : s) {
        if (c == '"') res += "\\\\\\"";
        else if (c == '\\\\') res += "\\\\\\\\";
        else if (c == '\\n') res += "\\\\n";
        else if (c == '\\t') res += "\\\\t";
        else if (c == '\\r') res += "\\\\r";
        else res += c;
    }
    return res;
}

static string serialize(int v) { return to_string(v); }
static string serialize(long long v) { return to_string(v); }
static string serialize(double v) {
    ostringstream oss;
    oss << v;
    return oss.str();
}
static string serialize(bool v) { return v ? "true" : "false"; }
static string serialize(char v) { return string("\\"") + v + "\\""; }
static string serialize(const string& v) { return string("\\"") + escape_json(v) + "\\""; }

template<typename T>
static string serialize(const vector<T>& v) {
    string res = "[";
    for (size_t i = 0; i < v.size(); i++) {
        if (i > 0) res += ", ";
        res += serialize(v[i]);
    }
    res += "]";
    return res;
}

static string serialize(ListNode* head) {
    if (!head) return "[]";
    string res = "[";
    ListNode* curr = head;
    while (curr) {
        res += to_string(curr->val);
        if (curr->next) res += ", ";
        curr = curr->next;
    }
    res += "]";
    return res;
}

static string serialize(TreeNode* root) {
    if (!root) return "[]";
    vector<string> parts;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        TreeNode* curr = q.front();
        q.pop();
        if (curr) {
            parts.push_back(to_string(curr->val));
            q.push(curr->left);
            q.push(curr->right);
        } else {
            parts.push_back("null");
        }
    }
    while (!parts.empty() && parts.back() == "null") parts.pop_back();
    string res = "[";
    for (size_t i = 0; i < parts.size(); i++) {
        if (i > 0) res += ", ";
        res += parts[i];
    }
    res += "]";
    return res;
}

static ListNode* buildList(const Json& j) {
    if (j.type != Json::ARR || j.arr.empty()) return nullptr;
    ListNode dummy(0);
    ListNode* curr = &dummy;
    for (const auto& item : j.arr) {
        curr->next = new ListNode(static_cast<int>(item.num));
        curr = curr->next;
    }
    return dummy.next;
}

static TreeNode* buildTree(const Json& j) {
    if (j.type != Json::ARR || j.arr.empty()) return nullptr;
    if (j.arr[0].type == Json::NUL) return nullptr;
    TreeNode* root = new TreeNode(static_cast<int>(j.arr[0].num));
    queue<TreeNode*> q;
    q.push(root);
    size_t idx = 1;
    while (!q.empty() && idx < j.arr.size()) {
        TreeNode* curr = q.front();
        q.pop();
        if (idx < j.arr.size() && j.arr[idx].type != Json::NUL) {
            curr->left = new TreeNode(static_cast<int>(j.arr[idx].num));
            q.push(curr->left);
        }
        idx++;
        if (idx < j.arr.size() && j.arr[idx].type != Json::NUL) {
            curr->right = new TreeNode(static_cast<int>(j.arr[idx].num));
            q.push(curr->right);
        }
        idx++;
    }
    return root;
}

static int to_int(const Json& j) { return static_cast<int>(j.num); }
static long long to_long(const Json& j) { return static_cast<long long>(j.num); }
static double to_double(const Json& j) { return j.num; }
static bool to_bool(const Json& j) { return j.b; }
static char to_char(const Json& j) { return j.str.empty() ? ' ' : j.str[0]; }
static string to_string_val(const Json& j) { return j.str; }

static vector<int> to_vector_int(const Json& j) {
    vector<int> res;
    if (j.type != Json::ARR) return res;
    for (const auto& item : j.arr) res.push_back(static_cast<int>(item.num));
    return res;
}

static vector<vector<int>> to_vector_vector_int(const Json& j) {
    vector<vector<int>> res;
    if (j.type != Json::ARR) return res;
    for (const auto& row : j.arr) res.push_back(to_vector_int(row));
    return res;
}

static vector<string> to_vector_string(const Json& j) {
    vector<string> res;
    if (j.type != Json::ARR) return res;
    for (const auto& item : j.arr) res.push_back(item.str);
    return res;
}

static vector<vector<char>> to_vector_vector_char(const Json& j) {
    vector<vector<char>> res;
    if (j.type != Json::ARR) return res;
    for (const auto& row : j.arr) {
        vector<char> r;
        for (const auto& c : row.arr) r.push_back(c.str.empty() ? ' ' : c.str[0]);
        res.push_back(r);
    }
    return res;
}

// Convert JSON param value based on defined type
${meta.params
  .map((p, idx) => {
    const pt = p.type;
    if (pt === 'int') return `static int get_param_${idx}(const Json& j) { return to_int(j); }`;
    if (pt === 'long') return `static long long get_param_${idx}(const Json& j) { return to_long(j); }`;
    if (pt === 'double' || pt === 'float') return `static double get_param_${idx}(const Json& j) { return to_double(j); }`;
    if (pt === 'boolean') return `static bool get_param_${idx}(const Json& j) { return to_bool(j); }`;
    if (pt === 'char') return `static char get_param_${idx}(const Json& j) { return to_char(j); }`;
    if (pt === 'String') return `static string get_param_${idx}(const Json& j) { return to_string_val(j); }`;
    if (pt === 'int[]' || pt === 'List<Integer>') return `static vector<int> get_param_${idx}(const Json& j) { return to_vector_int(j); }`;
    if (pt === 'int[][]' || pt === 'List<List<Integer>>') return `static vector<vector<int>> get_param_${idx}(const Json& j) { return to_vector_vector_int(j); }`;
    if (pt === 'String[]' || pt === 'List<String>') return `static vector<string> get_param_${idx}(const Json& j) { return to_vector_string(j); }`;
    if (pt === 'char[][]') return `static vector<vector<char>> get_param_${idx}(const Json& j) { return to_vector_vector_char(j); }`;
    if (pt.includes('ListNode')) return `static ListNode* get_param_${idx}(const Json& j) { return buildList(j); }`;
    if (pt.includes('TreeNode')) return `static TreeNode* get_param_${idx}(const Json& j) { return buildTree(j); }`;
    return `static vector<int> get_param_${idx}(const Json& j) { return to_vector_int(j); }`;
  })
  .join('\n')}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        cerr << "Usage: Driver <input.json>" << endl;
        return 1;
    }

    ifstream fin(argv[1]);
    if (!fin.is_open()) {
        cerr << "Could not open " << argv[1] << endl;
        return 1;
    }

    stringstream buffer;
    buffer << fin.rdbuf();
    string content = buffer.str();

    Json root = parse_json(content);
    const auto& tests = root.obj["tests"].arr;

    cout << "[" << endl;

    for (size_t tIdx = 0; tIdx < tests.size(); tIdx++) {
        const auto& test = tests[tIdx];
        int testIndex = static_cast<int>(test.obj.at("index").num);
        const auto& inputs = test.obj.at("inputs");

        if (tIdx > 0) cout << "," << endl;

        ${
          isClass
            ? `
        // Class execution (e.g. Trie)
        const auto& commands = inputs.obj.at("commands").arr;
        const auto& args = inputs.obj.at("arguments").arr;
        Trie* obj = nullptr;
        vector<string> outList;
        auto startTime = chrono::high_resolution_clock::now();

        try {
            for (size_t c = 0; c < commands.size(); c++) {
                string cmd = commands[c].str;
                const auto& argList = args[c].arr;
                if (cmd == "Trie") {
                    obj = new Trie();
                    outList.push_back("null");
                } else if (cmd == "insert") {
                    obj->insert(argList[0].str);
                    outList.push_back("null");
                } else if (cmd == "search") {
                    bool res = obj->search(argList[0].str);
                    outList.push_back(res ? "true" : "false");
                } else if (cmd == "startsWith") {
                    bool res = obj->startsWith(argList[0].str);
                    outList.push_back(res ? "true" : "false");
                }
            }
            auto endTime = chrono::high_resolution_clock::now();
            double elapsedMs = chrono::duration<double, milli>(endTime - startTime).count();

            cout << "  {\\n"
                 << "    \\"index\\": " << testIndex << ",\\n"
                 << "    \\"actual\\": " << serialize(outList) << ",\\n"
                 << "    \\"runtimeMs\\": " << elapsedMs << ",\\n"
                 << "    \\"verdict\\": \\"OK\\",\\n"
                 << "    \\"stdout\\": \\"\\"\\n"
                 << "  }";
        } catch (const exception& e) {
            cout << "  {\\n"
                 << "    \\"index\\": " << testIndex << ",\\n"
                 << "    \\"runtimeMs\\": 0,\\n"
                 << "    \\"verdict\\": \\"Runtime Error\\",\\n"
                 << "    \\"error\\": \\"" << escape_json(e.what()) << "\\",\\n"
                 << "    \\"stdout\\": \\"\\"\\n"
                 << "  }";
        }
        `
            : `
        // Standard or Inplace Method execution
        Solution sol;
        ${meta.params
          .map((p, idx) => {
            return `auto p_${idx} = get_param_${idx}(inputs.obj.at("${p.name}"));`;
          })
          .join('\n        ')}

        auto startTime = chrono::high_resolution_clock::now();

        try {
            ${
              isInplace
                ? `
            sol.${methodName}(${meta.params.map((_, idx) => `p_${idx}`).join(', ')});
            auto endTime = chrono::high_resolution_clock::now();
            double elapsedMs = chrono::duration<double, milli>(endTime - startTime).count();

            cout << "  {\\n"
                 << "    \\"index\\": " << testIndex << ",\\n"
                 << "    \\"actual\\": " << serialize(p_0) << ",\\n"
                 << "    \\"runtimeMs\\": " << elapsedMs << ",\\n"
                 << "    \\"verdict\\": \\"OK\\",\\n"
                 << "    \\"stdout\\": \\"\\"\\n"
                 << "  }";
            `
                : `
            auto result = sol.${methodName}(${meta.params.map((_, idx) => `p_${idx}`).join(', ')});
            auto endTime = chrono::high_resolution_clock::now();
            double elapsedMs = chrono::duration<double, milli>(endTime - startTime).count();

            cout << "  {\\n"
                 << "    \\"index\\": " << testIndex << ",\\n"
                 << "    \\"actual\\": " << serialize(result) << ",\\n"
                 << "    \\"runtimeMs\\": " << elapsedMs << ",\\n"
                 << "    \\"verdict\\": \\"OK\\",\\n"
                 << "    \\"stdout\\": \\"\\"\\n"
                 << "  }";
            `
            }
        } catch (const exception& e) {
            cout << "  {\\n"
                 << "    \\"index\\": " << testIndex << ",\\n"
                 << "    \\"runtimeMs\\": 0,\\n"
                 << "    \\"verdict\\": \\"Runtime Error\\",\\n"
                 << "    \\"error\\": \\"" << escape_json(e.what()) << "\\",\\n"
                 << "    \\"stdout\\": \\"\\"\\n"
                 << "  }";
        }
        `
        }
    }

    cout << endl << "]" << endl;
    return 0;
}
`;
}

export async function executeCppSolution(params: {
  problemMeta: ProblemMeta;
  code: string;
  tests: { index: number; inputs: Record<string, unknown> }[];
  timeLimitMs?: number;
  memoryLimitMb?: number;
}): Promise<JudgeExecutionResult> {
  const { problemMeta, code, tests, timeLimitMs = 2500 } = params;

  const rootDir = process.cwd();
  const runId = `run-cpp-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const runDir = path.join(rootDir, 'scratch', 'runs', runId);

  fs.mkdirSync(runDir, { recursive: true });

  try {
    const compilerCmd = await getCppCompilerCommand();

    // 1. Write Solution.h directly with user code (1:1 line numbers)
    fs.writeFileSync(path.join(runDir, 'Solution.h'), code, 'utf8');

    // 2. Generate Driver.cpp
    const driverCode = generateDriverCpp(problemMeta);
    fs.writeFileSync(path.join(runDir, 'Driver.cpp'), driverCode, 'utf8');

    // 3. Write input.json
    const payload = {
      tests: tests.map((t) => ({
        index: t.index,
        inputs: t.inputs,
      })),
    };
    fs.writeFileSync(path.join(runDir, 'input.json'), JSON.stringify(payload), 'utf8');

    // 4. Compile Driver.cpp with user's Solution.h
    const exeName = process.platform === 'win32' ? 'Driver.exe' : 'Driver.out';
    const staticFlag = process.platform === 'win32' ? '-static -static-libgcc -static-libstdc++' : '';
    const compileCmd = `${compilerCmd} -O2 -std=c++17 ${staticFlag} Driver.cpp -o ${exeName}`;

    try {
      await execAsync(compileCmd, {
        cwd: runDir,
        timeout: 10000,
      });
    } catch (compileErr: any) {
      const rawError = compileErr.stderr || compileErr.stdout || compileErr.message;
      // Clean up compiler messages: hide internal temp paths
      const cleaned = rawError.replace(new RegExp(runDir.replace(/\\\\/g, '\\\\\\\\'), 'g'), '');
      return {
        verdict: 'Compile Error',
        compileError: cleaned,
        totalRuntimeMs: 0,
        error: cleaned,
      };
    }

    // 5. Execute compiled binary
    const totalTimeLimit = Math.max(timeLimitMs * tests.length, 3000) + 1000;
    const exePath = path.join(runDir, exeName);

    let rawOutput = '';
    let rawError = '';
    let timedOut = false;

    const child = spawn(exePath, ['input.json'], {
      cwd: runDir,
    });

    const timer = setTimeout(() => {
      timedOut = true;
      try {
        child.kill();
      } catch {
        // ignore
      }
    }, totalTimeLimit);

    child.stdout.on('data', (d) => {
      rawOutput += d.toString('utf8');
    });

    child.stderr.on('data', (d) => {
      rawError += d.toString('utf8');
    });

    await new Promise<void>((resolve) => {
      child.on('close', (code) => {
        if (code !== 0) {
          rawError += `\nProcess exited with code ${code}`;
        }
        clearTimeout(timer);
        resolve();
      });
      child.on('error', (err) => {
        rawError += `\nSpawn error: ${err.message || String(err)}`;
        clearTimeout(timer);
        resolve();
      });
    });

    if (timedOut) {
      return {
        verdict: 'Time Limit Exceeded',
        totalRuntimeMs: totalTimeLimit,
        error: `Time limit exceeded (over ${totalTimeLimit}ms)`,
        testOutputs: tests.map((t) => ({
          index: t.index,
          runtimeMs: totalTimeLimit,
          stdout: '',
          verdict: 'Time Limit Exceeded',
          error: 'Process killed due to timeout',
        })),
      };
    }

    // 6. Parse JSON result from Driver
    try {
      const parsedOutputs: RawTestOutput[] = JSON.parse(rawOutput.trim());
      const totalRuntimeMs = parsedOutputs.reduce((acc, curr) => acc + (curr.runtimeMs || 0), 0);

      let worstVerdict: VerdictType = 'Accepted';
      for (const out of parsedOutputs) {
        if (out.verdict === 'Runtime Error') {
          worstVerdict = 'Runtime Error';
          break;
        }
      }

      return {
        verdict: worstVerdict,
        testOutputs: parsedOutputs,
        totalRuntimeMs,
      };
    } catch (parseErr: any) {
      return {
        verdict: 'Runtime Error',
        totalRuntimeMs: 0,
        error: `Failed to parse C++ driver outputs: stdout="${rawOutput.trim()}", stderr="${rawError.trim()}"`,
      };
    }
  } finally {
    try {
      fs.rmSync(runDir, { recursive: true, force: true });
    } catch {
      // ignore
    }
  }
}
