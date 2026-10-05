import fs from 'fs';
import path from 'path';
import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import { ProblemMeta } from '../../src/types/index';
import { JudgeExecutionResult, RawTestOutput } from './runner';

const execAsync = promisify(exec);

let cachedCCmd: string | null = null;

/**
 * Finds the working C compiler on host OS (gcc, clang).
 */
export async function getCCompilerCommand(): Promise<string> {
  if (cachedCCmd) return cachedCCmd;

  const candidates = process.platform === 'win32'
    ? ['gcc', 'clang']
    : ['gcc', 'clang'];

  for (const cmd of candidates) {
    try {
      await execAsync(`${cmd} --version`);
      cachedCCmd = cmd;
      return cmd;
    } catch {
      // try next
    }
  }

  cachedCCmd = 'gcc';
  return 'gcc';
}

function generateParamExtraction(meta: ProblemMeta): string {
  return meta.params
    .map((p) => {
      const t = p.type.trim();
      if (t === 'int[]') {
        return `
        JVal* j_${p.name} = json_get(inputs, "${p.name}");
        int ${p.name}Size = j_${p.name} ? j_${p.name}->arr_len : 0;
        int* ${p.name} = (int*)arena_alloc(${p.name}Size * sizeof(int));
        for (int i = 0; i < ${p.name}Size; i++) ${p.name}[i] = (int)j_${p.name}->arr[i]->n;
        `;
      }
      if (t === 'char[]') {
        return `
        JVal* j_${p.name} = json_get(inputs, "${p.name}");
        int ${p.name}Size = j_${p.name} ? j_${p.name}->arr_len : 0;
        char* ${p.name} = (char*)arena_alloc((${p.name}Size + 1) * sizeof(char));
        for (int i = 0; i < ${p.name}Size; i++) ${p.name}[i] = j_${p.name}->arr[i]->s[0];
        ${p.name}[${p.name}Size] = '\\0';
        `;
      }
      if (t === 'int[][]') {
        return `
        JVal* j_${p.name} = json_get(inputs, "${p.name}");
        int ${p.name}Size = j_${p.name} ? j_${p.name}->arr_len : 0;
        int** ${p.name} = (int**)arena_alloc(${p.name}Size * sizeof(int*));
        int* ${p.name}ColSize = (int*)arena_alloc(${p.name}Size * sizeof(int));
        for (int i = 0; i < ${p.name}Size; i++) {
            JVal* row = j_${p.name}->arr[i];
            ${p.name}ColSize[i] = row ? row->arr_len : 0;
            ${p.name}[i] = (int*)arena_alloc(${p.name}ColSize[i] * sizeof(int));
            for (int j = 0; j < ${p.name}ColSize[i]; j++) ${p.name}[i][j] = (int)row->arr[j]->n;
        }
        `;
      }
      if (t === 'char[][]') {
        return `
        JVal* j_${p.name} = json_get(inputs, "${p.name}");
        int ${p.name}Size = j_${p.name} ? j_${p.name}->arr_len : 0;
        char** ${p.name} = (char**)arena_alloc(${p.name}Size * sizeof(char*));
        int* ${p.name}ColSize = (int*)arena_alloc(${p.name}Size * sizeof(int));
        for (int i = 0; i < ${p.name}Size; i++) {
            JVal* row = j_${p.name}->arr[i];
            ${p.name}ColSize[i] = row ? row->arr_len : 0;
            ${p.name}[i] = (char*)arena_alloc((${p.name}ColSize[i] + 1) * sizeof(char));
            for (int j = 0; j < ${p.name}ColSize[i]; j++) ${p.name}[i][j] = row->arr[j]->s[0];
            ${p.name}[${p.name}ColSize[i]] = '\\0';
        }
        `;
      }
      if (t === 'String[]' || t === 'List<String>') {
        return `
        JVal* j_${p.name} = json_get(inputs, "${p.name}");
        int ${p.name}Size = j_${p.name} ? j_${p.name}->arr_len : 0;
        char** ${p.name} = (char**)arena_alloc(${p.name}Size * sizeof(char*));
        for (int i = 0; i < ${p.name}Size; i++) ${p.name}[i] = j_${p.name}->arr[i]->s;
        `;
      }
      if (t === 'int') {
        return `int ${p.name} = (int)json_get(inputs, "${p.name}")->n;`;
      }
      if (t === 'long') {
        return `long long ${p.name} = (long long)json_get(inputs, "${p.name}")->n;`;
      }
      if (t === 'double' || t === 'float') {
        return `double ${p.name} = json_get(inputs, "${p.name}")->n;`;
      }
      if (t === 'boolean') {
        return `bool ${p.name} = json_get(inputs, "${p.name}")->b;`;
      }
      if (t === 'char') {
        return `char ${p.name} = json_get(inputs, "${p.name}")->s[0];`;
      }
      if (t === 'String') {
        return `char* ${p.name} = json_get(inputs, "${p.name}")->s;`;
      }
      if (t === 'ListNode') {
        return `struct ListNode* ${p.name} = build_list(json_get(inputs, "${p.name}"));`;
      }
      if (t === 'TreeNode') {
        return `struct TreeNode* ${p.name} = build_tree(json_get(inputs, "${p.name}"));`;
      }
      return `// Unhandled param ${p.name}`;
    })
    .join('\n');
}

function generateInplaceCall(meta: ProblemMeta): string {
  const callArgs = meta.params
    .map((p) => {
      const t = p.type.trim();
      if (t === 'int[]' || t === 'char[]') return `${p.name}, ${p.name}Size`;
      if (t === 'int[][]' || t === 'char[][]') return `${p.name}, ${p.name}Size, ${p.name}ColSize`;
      return p.name;
    })
    .join(', ');

  const printActual =
    meta.params[0]?.type === 'int[]'
      ? `print_int_array(${meta.params[0].name}, ${meta.params[0].name}Size);`
      : meta.params[0]?.type === 'int[][]'
      ? `print_int_matrix(${meta.params[0].name}, ${meta.params[0].name}Size, ${meta.params[0].name}ColSize);`
      : `printf("null");`;

  return `
        ${meta.methodName}(${callArgs});
        clock_t t_end = clock();
        double elapsed_ms = ((double)(t_end - t_start) * 1000.0) / CLOCKS_PER_SEC;

        printf("  {\\"index\\": %d, \\"verdict\\": \\"OK\\", \\"actual\\": ", test_idx);
        ${printActual}
        printf(", \\"runtimeMs\\": %.2f}", elapsed_ms);
  `;
}

function generateStandardCall(meta: ProblemMeta): string {
  const ret = meta.returnType?.trim() || '';
  const hasReturnSizeColSizes =
    ret === 'int[][]' || ret === 'char[][]' || ret === 'List<List<Integer>>' || ret === 'List<List<String>>';
  const hasReturnSizeOnly =
    ret === 'int[]' ||
    ret === 'char[]' ||
    ret === 'String[]' ||
    ret === 'List<Integer>' ||
    ret === 'List<String>' ||
    ret === 'boolean[]' ||
    ret === 'List<Boolean>';

  const callParams = meta.params.map((p) => {
    const t = p.type.trim();
    if (t === 'int[]' || t === 'char[]' || t === 'String[]' || t === 'List<String>')
      return `${p.name}, ${p.name}Size`;
    if (t === 'int[][]' || t === 'char[][]')
      return `${p.name}, ${p.name}Size, ${p.name}ColSize`;
    return p.name;
  });

  if (hasReturnSizeColSizes) {
    callParams.push('&returnSize', '&returnColumnSizes');
  } else if (hasReturnSizeOnly) {
    callParams.push('&returnSize');
  }

  const callArgs = callParams.join(', ');

  if (ret === 'int[]' || ret === 'List<Integer>') {
    return `
        int returnSize = 0;
        int* res = ${meta.methodName}(${callArgs});
        clock_t t_end = clock();
        double elapsed_ms = ((double)(t_end - t_start) * 1000.0) / CLOCKS_PER_SEC;
        printf("  {\\"index\\": %d, \\"verdict\\": \\"OK\\", \\"actual\\": ", test_idx);
        print_int_array(res, returnSize);
        printf(", \\"runtimeMs\\": %.2f}", elapsed_ms);
    `;
  }
  if (ret === 'int[][]' || ret === 'List<List<Integer>>') {
    return `
        int returnSize = 0;
        int* returnColumnSizes = NULL;
        int** res = ${meta.methodName}(${callArgs});
        clock_t t_end = clock();
        double elapsed_ms = ((double)(t_end - t_start) * 1000.0) / CLOCKS_PER_SEC;
        printf("  {\\"index\\": %d, \\"verdict\\": \\"OK\\", \\"actual\\": ", test_idx);
        print_int_matrix(res, returnSize, returnColumnSizes);
        printf(", \\"runtimeMs\\": %.2f}", elapsed_ms);
    `;
  }
  if (ret === 'String[]' || ret === 'List<String>') {
    return `
        int returnSize = 0;
        char** res = ${meta.methodName}(${callArgs});
        clock_t t_end = clock();
        double elapsed_ms = ((double)(t_end - t_start) * 1000.0) / CLOCKS_PER_SEC;
        printf("  {\\"index\\": %d, \\"verdict\\": \\"OK\\", \\"actual\\": ", test_idx);
        print_str_array(res, returnSize);
        printf(", \\"runtimeMs\\": %.2f}", elapsed_ms);
    `;
  }
  if (ret === 'List<List<String>>') {
    return `
        int returnSize = 0;
        int* returnColumnSizes = NULL;
        char*** res = ${meta.methodName}(${callArgs});
        clock_t t_end = clock();
        double elapsed_ms = ((double)(t_end - t_start) * 1000.0) / CLOCKS_PER_SEC;
        printf("  {\\"index\\": %d, \\"verdict\\": \\"OK\\", \\"actual\\": ", test_idx);
        print_str_matrix(res, returnSize, returnColumnSizes);
        printf(", \\"runtimeMs\\": %.2f}", elapsed_ms);
    `;
  }
  if (ret === 'ListNode') {
    return `
        struct ListNode* res = ${meta.methodName}(${callArgs});
        clock_t t_end = clock();
        double elapsed_ms = ((double)(t_end - t_start) * 1000.0) / CLOCKS_PER_SEC;
        printf("  {\\"index\\": %d, \\"verdict\\": \\"OK\\", \\"actual\\": ", test_idx);
        print_list(res);
        printf(", \\"runtimeMs\\": %.2f}", elapsed_ms);
    `;
  }
  if (ret === 'TreeNode') {
    return `
        struct TreeNode* res = ${meta.methodName}(${callArgs});
        clock_t t_end = clock();
        double elapsed_ms = ((double)(t_end - t_start) * 1000.0) / CLOCKS_PER_SEC;
        printf("  {\\"index\\": %d, \\"verdict\\": \\"OK\\", \\"actual\\": ", test_idx);
        print_tree(res);
        printf(", \\"runtimeMs\\": %.2f}", elapsed_ms);
    `;
  }
  if (ret === 'boolean') {
    return `
        bool res = ${meta.methodName}(${callArgs});
        clock_t t_end = clock();
        double elapsed_ms = ((double)(t_end - t_start) * 1000.0) / CLOCKS_PER_SEC;
        printf("  {\\"index\\": %d, \\"verdict\\": \\"OK\\", \\"actual\\": %s, \\"runtimeMs\\": %.2f}", test_idx, res ? "true" : "false", elapsed_ms);
    `;
  }
  if (ret === 'int') {
    return `
        int res = ${meta.methodName}(${callArgs});
        clock_t t_end = clock();
        double elapsed_ms = ((double)(t_end - t_start) * 1000.0) / CLOCKS_PER_SEC;
        printf("  {\\"index\\": %d, \\"verdict\\": \\"OK\\", \\"actual\\": %d, \\"runtimeMs\\": %.2f}", test_idx, res, elapsed_ms);
    `;
  }
  if (ret === 'double' || ret === 'float') {
    return `
        double res = ${meta.methodName}(${callArgs});
        clock_t t_end = clock();
        double elapsed_ms = ((double)(t_end - t_start) * 1000.0) / CLOCKS_PER_SEC;
        printf("  {\\"index\\": %d, \\"verdict\\": \\"OK\\", \\"actual\\": %f, \\"runtimeMs\\": %.2f}", test_idx, res, elapsed_ms);
    `;
  }
  if (ret === 'String') {
    return `
        char* res = ${meta.methodName}(${callArgs});
        clock_t t_end = clock();
        double elapsed_ms = ((double)(t_end - t_start) * 1000.0) / CLOCKS_PER_SEC;
        printf("  {\\"index\\": %d, \\"verdict\\": \\"OK\\", \\"actual\\": \\"%s\\", \\"runtimeMs\\": %.2f}", test_idx, res ? res : "", elapsed_ms);
    `;
  }
  return `
        ${meta.methodName}(${callArgs});
        clock_t t_end = clock();
        double elapsed_ms = ((double)(t_end - t_start) * 1000.0) / CLOCKS_PER_SEC;
        printf("  {\\"index\\": %d, \\"verdict\\": \\"OK\\", \\"actual\\": null, \\"runtimeMs\\": %.2f}", test_idx, elapsed_ms);
  `;
}

function generateClassCall(meta: ProblemMeta): string {
  const className = meta.className || 'Trie';
  const lowerPrefix = className.charAt(0).toLowerCase() + className.slice(1);

  let opBranches = '';
  if (className === 'Trie') {
    opBranches = `
            else if (strcmp(op, "insert") == 0) {
                trieInsert(obj, a->arr[0]->s);
                printf("null");
            } else if (strcmp(op, "search") == 0) {
                bool res = trieSearch(obj, a->arr[0]->s);
                printf("%s", res ? "true" : "false");
            } else if (strcmp(op, "startsWith") == 0) {
                bool res = trieStartsWith(obj, a->arr[0]->s);
                printf("%s", res ? "true" : "false");
            }
    `;
  } else if (className === 'WordDictionary') {
    opBranches = `
            else if (strcmp(op, "addWord") == 0) {
                wordDictionaryAddWord(obj, a->arr[0]->s);
                printf("null");
            } else if (strcmp(op, "search") == 0) {
                bool res = wordDictionarySearch(obj, a->arr[0]->s);
                printf("%s", res ? "true" : "false");
            }
    `;
  } else if (className === 'MedianFinder') {
    opBranches = `
            else if (strcmp(op, "addNum") == 0) {
                medianFinderAddNum(obj, (int)a->arr[0]->n);
                printf("null");
            } else if (strcmp(op, "findMedian") == 0) {
                double res = medianFinderFindMedian(obj);
                printf("%f", res);
            }
    `;
  }

  return `
        JVal* ops = json_get(inputs, "operations");
        JVal* args = json_get(inputs, "args");
        ${className}* obj = NULL;

        printf("  {\\"index\\": %d, \\"verdict\\": \\"OK\\", \\"actual\\": [", test_idx);
        for (int op_i = 0; op_i < ops->arr_len; op_i++) {
            if (op_i > 0) printf(", ");
            char* op = ops->arr[op_i]->s;
            JVal* a = args->arr[op_i];

            if (strcmp(op, "${className}") == 0) {
                obj = ${lowerPrefix}Create();
                printf("null");
            }
            ${opBranches}
        }
        if (obj) {
            ${lowerPrefix}Free(obj);
        }
        clock_t t_end = clock();
        double elapsed_ms = ((double)(t_end - t_start) * 1000.0) / CLOCKS_PER_SEC;
        printf("], \\"runtimeMs\\": %.2f}", elapsed_ms);
  `;
}

/**
 * Generates the Driver.c source code tailored to the problem's meta signature.
 */
function generateDriverC(meta: ProblemMeta): string {
  const isInplace = typeof meta.kind === 'string' && meta.kind.startsWith('inplace:');
  const isClass = meta.kind === 'class';

  const executionBody = isClass
    ? generateClassCall(meta)
    : `${generateParamExtraction(meta)}\n${isInplace ? generateInplaceCall(meta) : generateStandardCall(meta)}`;

  return `
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <limits.h>
#include <math.h>
#include <time.h>

// Forward struct definitions
struct ListNode {
    int val;
    struct ListNode *next;
};

struct TreeNode {
    int val;
    struct TreeNode *left;
    struct TreeNode *right;
};

struct Node {
    int val;
    int numNeighbors;
    struct Node** neighbors;
};

// Include User Solution (Line numbers in Solution.h map 1:1)
#include "Solution.h"

// Memory Arena for JSON AST and test inputs
static char arena_buf[32 * 1024 * 1024];
static size_t arena_pos = 0;
static void* arena_alloc(size_t sz) {
    sz = (sz + 7) & ~7;
    if (arena_pos + sz > sizeof(arena_buf)) return NULL;
    void* p = &arena_buf[arena_pos];
    arena_pos += sz;
    return p;
}

// Minimal C JSON AST
typedef enum { J_NULL, J_BOOL, J_NUM, J_STR, J_ARR, J_OBJ } JType;
typedef struct JVal JVal;
struct JVal {
    JType type;
    bool b;
    double n;
    char* s;
    JVal** arr;
    int arr_len;
    char** keys;
    JVal** vals;
    int obj_len;
};

static void skip_ws(const char* s, int* i) {
    while (s[*i] == ' ' || s[*i] == '\\t' || s[*i] == '\\n' || s[*i] == '\\r') (*i)++;
}

static JVal* parse_val(const char* s, int* i);

static char* parse_str(const char* s, int* i) {
    (*i)++; // skip open quote
    int start = *i;
    while (s[*i] && s[*i] != '"') {
        if (s[*i] == '\\\\' && s[*i + 1]) (*i)++;
        (*i)++;
    }
    int len = *i - start;
    char* res = (char*)arena_alloc(len + 1);
    int w = 0;
    for (int k = start; k < *i; k++) {
        if (s[k] == '\\\\' && k + 1 < *i) {
            k++;
            if (s[k] == 'n') res[w++] = '\\n';
            else if (s[k] == 't') res[w++] = '\\t';
            else if (s[k] == 'r') res[w++] = '\\r';
            else res[w++] = s[k];
        } else {
            res[w++] = s[k];
        }
    }
    res[w] = '\\0';
    if (s[*i] == '"') (*i)++;
    return res;
}

static JVal* parse_val(const char* s, int* i) {
    skip_ws(s, i);
    JVal* v = (JVal*)arena_alloc(sizeof(JVal));
    v->type = J_NULL;
    if (!s[*i]) return v;

    if (s[*i] == '"') {
        v->type = J_STR;
        v->s = parse_str(s, i);
    } else if (s[*i] == '[') {
        v->type = J_ARR;
        (*i)++;
        skip_ws(s, i);
        int cap = 16;
        v->arr = (JVal**)arena_alloc(cap * sizeof(JVal*));
        v->arr_len = 0;
        if (s[*i] == ']') { (*i)++; return v; }
        while (s[*i]) {
            if (v->arr_len >= cap) {
                cap *= 2;
                JVal** new_arr = (JVal**)arena_alloc(cap * sizeof(JVal*));
                memcpy(new_arr, v->arr, v->arr_len * sizeof(JVal*));
                v->arr = new_arr;
            }
            v->arr[v->arr_len++] = parse_val(s, i);
            skip_ws(s, i);
            if (s[*i] == ',') (*i)++;
            else if (s[*i] == ']') { (*i)++; break; }
        }
    } else if (s[*i] == '{') {
        v->type = J_OBJ;
        (*i)++;
        skip_ws(s, i);
        int cap = 16;
        v->keys = (char**)arena_alloc(cap * sizeof(char*));
        v->vals = (JVal**)arena_alloc(cap * sizeof(JVal*));
        v->obj_len = 0;
        if (s[*i] == '}') { (*i)++; return v; }
        while (s[*i]) {
            skip_ws(s, i);
            if (s[*i] != '"') break;
            char* k = parse_str(s, i);
            skip_ws(s, i);
            if (s[*i] == ':') (*i)++;
            JVal* val = parse_val(s, i);
            if (v->obj_len >= cap) {
                cap *= 2;
                char** new_k = (char**)arena_alloc(cap * sizeof(char*));
                JVal** new_v = (JVal**)arena_alloc(cap * sizeof(JVal*));
                memcpy(new_k, v->keys, v->obj_len * sizeof(char*));
                memcpy(new_v, v->vals, v->obj_len * sizeof(JVal*));
                v->keys = new_k;
                v->vals = new_v;
            }
            v->keys[v->obj_len] = k;
            v->vals[v->obj_len] = val;
            v->obj_len++;
            skip_ws(s, i);
            if (s[*i] == ',') (*i)++;
            else if (s[*i] == '}') { (*i)++; break; }
        }
    } else if (strncmp(&s[*i], "true", 4) == 0) {
        v->type = J_BOOL;
        v->b = true;
        *i += 4;
    } else if (strncmp(&s[*i], "false", 5) == 0) {
        v->type = J_BOOL;
        v->b = false;
        *i += 5;
    } else if (strncmp(&s[*i], "null", 4) == 0) {
        v->type = J_NULL;
        *i += 4;
    } else {
        char* end;
        v->type = J_NUM;
        v->n = strtod(&s[*i], &end);
        *i = (int)(end - s);
    }
    return v;
}

static JVal* json_get(JVal* obj, const char* key) {
    if (!obj || obj->type != J_OBJ) return NULL;
    for (int k = 0; k < obj->obj_len; k++) {
        if (strcmp(obj->keys[k], key) == 0) return obj->vals[k];
    }
    return NULL;
}

static struct ListNode* build_list(JVal* j) {
    if (!j || j->type != J_ARR || j->arr_len == 0) return NULL;
    struct ListNode dummy;
    dummy.val = 0;
    dummy.next = NULL;
    struct ListNode* curr = &dummy;
    for (int k = 0; k < j->arr_len; k++) {
        struct ListNode* node = (struct ListNode*)arena_alloc(sizeof(struct ListNode));
        node->val = (int)j->arr[k]->n;
        node->next = NULL;
        curr->next = node;
        curr = node;
    }
    return dummy.next;
}

static struct TreeNode* build_tree(JVal* j) {
    if (!j || j->type != J_ARR || j->arr_len == 0 || j->arr[0]->type == J_NULL) return NULL;
    struct TreeNode* root = (struct TreeNode*)arena_alloc(sizeof(struct TreeNode));
    root->val = (int)j->arr[0]->n;
    root->left = NULL;
    root->right = NULL;

    struct TreeNode* queue[20000];
    int head = 0, tail = 0;
    queue[tail++] = root;
    int idx = 1;

    while (head < tail && idx < j->arr_len) {
        struct TreeNode* curr = queue[head++];
        if (idx < j->arr_len && j->arr[idx]->type != J_NULL) {
            curr->left = (struct TreeNode*)arena_alloc(sizeof(struct TreeNode));
            curr->left->val = (int)j->arr[idx]->n;
            curr->left->left = NULL;
            curr->left->right = NULL;
            queue[tail++] = curr->left;
        }
        idx++;
        if (idx < j->arr_len && j->arr[idx]->type != J_NULL) {
            curr->right = (struct TreeNode*)arena_alloc(sizeof(struct TreeNode));
            curr->right->val = (int)j->arr[idx]->n;
            curr->right->left = NULL;
            curr->right->right = NULL;
            queue[tail++] = curr->right;
        }
        idx++;
    }
    return root;
}

static void print_int_array(int* arr, int size) {
    printf("[");
    for (int i = 0; i < size; i++) {
        printf("%d%s", arr[i], i + 1 < size ? ", " : "");
    }
    printf("]");
}

static void print_int_matrix(int** mat, int rows, int* colSizes) {
    printf("[");
    for (int i = 0; i < rows; i++) {
        int cols = colSizes ? colSizes[i] : 0;
        printf("[");
        for (int j = 0; j < cols; j++) {
            printf("%d%s", mat[i][j], j + 1 < cols ? ", " : "");
        }
        printf("]%s", i + 1 < rows ? ", " : "");
    }
    printf("]");
}

static void print_str_array(char** arr, int size) {
    printf("[");
    for (int i = 0; i < size; i++) {
        printf("\\"%s\\"%s", arr[i] ? arr[i] : "", i + 1 < size ? ", " : "");
    }
    printf("]");
}

static void print_str_matrix(char*** mat, int rows, int* colSizes) {
    printf("[");
    for (int i = 0; i < rows; i++) {
        int cols = colSizes ? colSizes[i] : 0;
        printf("[");
        for (int j = 0; j < cols; j++) {
            printf("\\"%s\\"%s", mat[i][j] ? mat[i][j] : "", j + 1 < cols ? ", " : "");
        }
        printf("]%s", i + 1 < rows ? ", " : "");
    }
    printf("]");
}

static void print_list(struct ListNode* head) {
    if (!head) {
        printf("[]");
        return;
    }
    printf("[");
    struct ListNode* curr = head;
    while (curr) {
        printf("%d%s", curr->val, curr->next ? ", " : "");
        curr = curr->next;
    }
    printf("]");
}

static void print_tree(struct TreeNode* root) {
    if (!root) {
        printf("[]");
        return;
    }
    struct TreeNode* queue[20000];
    int head = 0, tail = 0;
    queue[tail++] = root;

    static char buf[20000][32];
    int token_count = 0;

    while (head < tail) {
        struct TreeNode* curr = queue[head++];
        if (curr) {
            snprintf(buf[token_count++], sizeof(buf[0]), "%d", curr->val);
            queue[tail++] = curr->left;
            queue[tail++] = curr->right;
        } else {
            snprintf(buf[token_count++], sizeof(buf[0]), "null");
        }
    }
    while (token_count > 0 && strcmp(buf[token_count - 1], "null") == 0) {
        token_count--;
    }

    printf("[");
    for (int i = 0; i < token_count; i++) {
        printf("%s%s", buf[i], i + 1 < token_count ? ", " : "");
    }
    printf("]");
}

int main() {
    FILE* f = fopen("input.json", "rb");
    if (!f) {
        fprintf(stderr, "Cannot open input.json\\n");
        return 1;
    }
    fseek(f, 0, SEEK_END);
    long fsz = ftell(f);
    fseek(f, 0, SEEK_SET);
    char* json_text = (char*)malloc(fsz + 1);
    fread(json_text, 1, fsz, f);
    json_text[fsz] = '\\0';
    fclose(f);

    int pos = 0;
    JVal* root = parse_val(json_text, &pos);
    if (!root || root->type != J_ARR) {
        fprintf(stderr, "Invalid input JSON root\\n");
        free(json_text);
        return 1;
    }

    printf("[\\n");
    for (int t = 0; t < root->arr_len; t++) {
        if (t > 0) printf(",\\n");
        JVal* item = root->arr[t];
        int test_idx = (int)json_get(item, "index")->n;
        JVal* inputs = json_get(item, "inputs");

        clock_t t_start = clock();

        ${executionBody}
    }
    printf("\\n]\\n");

    free(json_text);
    return 0;
}
  `;
}

export interface CExecutionOptions {
  problemMeta: ProblemMeta;
  code: string;
  tests: { index: number; inputs: Record<string, unknown> }[];
  timeLimitMs?: number;
  memoryLimitMb?: number;
}

/**
 * Execute C solution against input test cases.
 */
export async function executeCSolution(options: CExecutionOptions): Promise<JudgeExecutionResult> {
  const { problemMeta, code, tests, timeLimitMs = 2000 } = options;

  const compiler = await getCCompilerCommand();
  const runId = `judge_c_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const scratchDir = path.resolve(process.cwd(), '.scratch', runId);
  fs.mkdirSync(scratchDir, { recursive: true });

  const solutionPath = path.join(scratchDir, 'Solution.h');
  const driverPath = path.join(scratchDir, 'Driver.c');
  const inputPath = path.join(scratchDir, 'input.json');
  const exePath = path.join(scratchDir, process.platform === 'win32' ? 'Driver.exe' : 'Driver');

  try {
    // 1. Write user solution (1:1 line numbers)
    fs.writeFileSync(solutionPath, code, 'utf8');

    // 2. Write inputs
    fs.writeFileSync(inputPath, JSON.stringify(tests), 'utf8');

    // 3. Generate Driver.c
    const driverSrc = generateDriverC(problemMeta);
    fs.writeFileSync(driverPath, driverSrc, 'utf8');

    // 4. Compile with GCC / Clang
    const isWin = process.platform === 'win32';
    const staticFlag = isWin ? '-static' : '';
    const compileCmd = `${compiler} -std=c11 -O2 ${staticFlag} "${driverPath}" -lm -o "${exePath}"`;

    try {
      await execAsync(compileCmd, { cwd: scratchDir, timeout: 15000 });
    } catch (compileErr: any) {
      const errOut = (compileErr.stderr || compileErr.stdout || compileErr.message || '').toString();
      const cleaned = errOut
        .split('\n')
        .map((l: string) => l.replace(new RegExp(scratchDir.replace(/\\/g, '\\\\'), 'g'), ''))
        .filter((l: string) => !l.includes('Driver.c:') || l.includes('Solution.h'))
        .join('\n')
        .trim();

      return {
        verdict: 'Compile Error',
        compileError: cleaned || 'C Compilation Error',
        totalRuntimeMs: 0,
      };
    }

    // 5. Run compiled Driver
    const startTime = Date.now();
    const runResult = await new Promise<{ stdout: string; stderr: string; code: number | null }>((resolve) => {
      const child = spawn(exePath, [], {
        cwd: scratchDir,
        windowsHide: true,
      });

      let stdout = '';
      let stderr = '';
      let killed = false;

      const timer = setTimeout(() => {
        killed = true;
        child.kill();
      }, Math.max(timeLimitMs * tests.length, 3000));

      child.stdout.on('data', (d) => {
        stdout += d.toString();
      });
      child.stderr.on('data', (d) => {
        stderr += d.toString();
      });

      child.on('close', (exitCode) => {
        clearTimeout(timer);
        if (killed) {
          resolve({ stdout, stderr: 'Time Limit Exceeded', code: 124 });
        } else {
          resolve({ stdout, stderr, code: exitCode });
        }
      });

      child.on('error', (err) => {
        clearTimeout(timer);
        resolve({ stdout, stderr: err.message, code: 1 });
      });
    });

    const totalRuntimeMs = Date.now() - startTime;

    if (runResult.code === 124) {
      return {
        verdict: 'Time Limit Exceeded',
        error: 'Execution exceeded time limit',
        totalRuntimeMs,
      };
    }

    if (runResult.code !== 0 && !runResult.stdout.trim().endsWith(']')) {
      return {
        verdict: 'Runtime Error',
        error: runResult.stderr || `Process exited with code ${runResult.code}`,
        totalRuntimeMs,
      };
    }

    // Parse JSON outputs
    try {
      const trimmed = runResult.stdout.trim();
      const jsonStart = trimmed.indexOf('[');
      const jsonEnd = trimmed.lastIndexOf(']');
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error('No JSON output array found');
      }
      const parsedOutputs = JSON.parse(trimmed.slice(jsonStart, jsonEnd + 1)) as RawTestOutput[];

      return {
        verdict: 'Accepted',
        totalRuntimeMs,
        testOutputs: parsedOutputs,
      };
    } catch (parseErr: any) {
      return {
        verdict: 'Runtime Error',
        error: `Output parse failed: ${parseErr.message}\nRaw stdout: ${runResult.stdout.slice(0, 500)}`,
        totalRuntimeMs,
      };
    }
  } finally {
    try {
      fs.rmSync(scratchDir, { recursive: true, force: true });
    } catch {
      // ignore scratch cleanup error
    }
  }
}
