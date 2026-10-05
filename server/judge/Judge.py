import sys
import os
import json
import time
import io
import traceback
from collections import deque

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

    def __repr__(self):
        return f"ListNode({self.val})"

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

    def __repr__(self):
        return f"TreeNode({self.val})"

class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []

    def __repr__(self):
        return f"Node({self.val})"

class Interval:
    def __init__(self, start=0, end=0):
        self.start = start
        self.end = end

    def __repr__(self):
        return f"Interval({self.start}, {self.end})"

# Serialization / Deserialization helpers
def deserialize_list_node(val):
    if not val or not isinstance(val, list):
        return None
    dummy = ListNode(0)
    curr = dummy
    for x in val:
        curr.next = ListNode(int(x))
        curr = curr.next
    return dummy.next

def serialize_list_node(head):
    if head is None:
        return []
    res = []
    curr = head
    seen = set()
    while curr:
        if id(curr) in seen:
            break
        seen.add(id(curr))
        res.append(curr.val)
        curr = curr.next
    return res

def deserialize_tree_node(val):
    if not val or not isinstance(val, list) or val[0] is None:
        return None
    root = TreeNode(val[0])
    queue = deque([root])
    i = 1
    n = len(val)
    while queue and i < n:
        node = queue.popleft()
        if i < n and val[i] is not None:
            node.left = TreeNode(val[i])
            queue.append(node.left)
        i += 1
        if i < n and val[i] is not None:
            node.right = TreeNode(val[i])
            queue.append(node.right)
        i += 1
    return root

def serialize_tree_node(root):
    if root is None:
        return []
    res = []
    queue = deque([root])
    while queue:
        node = queue.popleft()
        if node:
            res.append(node.val)
            queue.append(node.left)
            queue.append(node.right)
        else:
            res.append(None)
    # Strip trailing Nones
    while res and res[-1] is None:
        res.pop()
    return res

def deserialize_graph_node(val):
    if not val or not isinstance(val, list):
        return None
    n = len(val)
    nodes = {i + 1: Node(i + 1) for i in range(n)}
    for i, adj in enumerate(val):
        curr = nodes[i + 1]
        for neighbor_idx in adj:
            if neighbor_idx in nodes:
                curr.neighbors.append(nodes[neighbor_idx])
    return nodes[1] if 1 in nodes else None

def serialize_graph_node(node):
    if node is None:
        return []
    visited = {}
    queue = deque([node])
    visited[node.val] = node
    while queue:
        curr = queue.popleft()
        for neighbor in curr.neighbors:
            if neighbor.val not in visited:
                visited[neighbor.val] = neighbor
                queue.append(neighbor)
    max_val = max(visited.keys()) if visited else 0
    res = []
    for i in range(1, max_val + 1):
        if i in visited:
            res.append([nbr.val for nbr in visited[i].neighbors])
        else:
            res.append([])
    return res

def deserialize_param(val, param_type):
    if val is None:
        return None
    pt = param_type.strip()
    if pt == 'ListNode':
        return deserialize_list_node(val)
    if pt == 'ListNode[]' and isinstance(val, list):
        return [deserialize_list_node(item) for item in val]
    if pt == 'TreeNode':
        return deserialize_tree_node(val)
    if pt == 'Node':
        return deserialize_graph_node(val)
    if pt == 'char[][]' and isinstance(val, list):
        return [[str(c) for c in row] for row in val]
    if pt == 'char[]' and isinstance(val, list):
        return [str(c) for c in val]
    return val

def serialize_result(res, return_type):
    if isinstance(res, ListNode):
        return serialize_list_node(res)
    if isinstance(res, TreeNode):
        return serialize_tree_node(res)
    if isinstance(res, Node):
        return serialize_graph_node(res)
    if isinstance(res, list):
        if len(res) > 0 and isinstance(res[0], ListNode):
            return [serialize_list_node(item) for item in res]
        return res
    if isinstance(res, tuple):
        return list(res)
    if res is None:
        if return_type in ('ListNode', 'TreeNode', 'Node'):
            return []
        return None
    return res

def main():
    if len(sys.argv) < 2:
        print("Usage: python Judge.py <input.json>")
        sys.exit(1)

    input_file = sys.argv[1]
    with open(input_file, 'r', encoding='utf-8') as f:
        config = json.load(f)

    import builtins
    import collections
    import heapq
    import math
    import bisect
    import itertools
    import functools
    from collections import defaultdict, Counter, deque
    from typing import List, Optional, Dict, Set, Tuple

    builtins.ListNode = ListNode
    builtins.TreeNode = TreeNode
    builtins.Node = Node
    builtins.Interval = Interval
    builtins.defaultdict = defaultdict
    builtins.Counter = Counter
    builtins.deque = deque
    builtins.heapq = heapq
    builtins.math = math
    builtins.bisect = bisect
    builtins.itertools = itertools
    builtins.functools = functools
    builtins.List = List
    builtins.Optional = Optional
    builtins.Dict = Dict
    builtins.Set = Set
    builtins.Tuple = Tuple

    # Import user solution module
    import Solution as user_solution

    class_name = config.get('className', 'Solution')
    method_name = config.get('methodName')
    param_defs = config.get('params', [])
    return_type = config.get('returnType', 'void')
    kind = config.get('kind', 'function')
    tests = config.get('tests', [])

    results = []

    for test in tests:
        test_index = test.get('index', 0)
        inputs_dict = test.get('inputs', {})

        # Prepare captured stdout
        captured_stdout = io.StringIO()
        old_stdout = sys.stdout
        sys.stdout = captured_stdout

        start_time = time.perf_counter()
        try:
            if kind == 'class':
                # Class-based design problem (e.g. Trie)
                cls = getattr(user_solution, class_name)
                commands = inputs_dict.get('commands', [])
                args_list = inputs_dict.get('args', [])

                inst = None
                class_outputs = []

                for cmd, args in zip(commands, args_list):
                    if cmd == class_name:
                        inst = cls(*args)
                        class_outputs.append(None)
                    else:
                        method = getattr(inst, cmd)
                        out = method(*args)
                        class_outputs.append(out)

                elapsed_ms = (time.perf_counter() - start_time) * 1000.0
                sys.stdout = old_stdout

                results.append({
                    "index": test_index,
                    "runtimeMs": round(elapsed_ms, 2),
                    "stdout": captured_stdout.getvalue(),
                    "verdict": "OK",
                    "actual": class_outputs
                })

            elif kind.startswith('inplace:'):
                inplace_idx = int(kind.split(':')[1])
                target_class = getattr(user_solution, class_name, user_solution.Solution)
                sol = target_class()
                fn = getattr(sol, method_name)

                args = []
                for p in param_defs:
                    raw_val = inputs_dict.get(p['name'])
                    args.append(deserialize_param(raw_val, p['type']))

                fn(*args)
                elapsed_ms = (time.perf_counter() - start_time) * 1000.0
                sys.stdout = old_stdout

                actual_val = serialize_result(args[inplace_idx], return_type)
                results.append({
                    "index": test_index,
                    "runtimeMs": round(elapsed_ms, 2),
                    "stdout": captured_stdout.getvalue(),
                    "verdict": "OK",
                    "actual": actual_val
                })

            else:
                # Standard function call
                target_class = getattr(user_solution, class_name, user_solution.Solution)
                sol = target_class()
                fn = getattr(sol, method_name)

                args = []
                for p in param_defs:
                    raw_val = inputs_dict.get(p['name'])
                    args.append(deserialize_param(raw_val, p['type']))

                res = fn(*args)
                elapsed_ms = (time.perf_counter() - start_time) * 1000.0
                sys.stdout = old_stdout

                actual_val = serialize_result(res, return_type)
                results.append({
                    "index": test_index,
                    "runtimeMs": round(elapsed_ms, 2),
                    "stdout": captured_stdout.getvalue(),
                    "verdict": "OK",
                    "actual": actual_val
                })

        except Exception as e:
            elapsed_ms = (time.perf_counter() - start_time) * 1000.0
            sys.stdout = old_stdout
            tb = traceback.format_exc()
            results.append({
                "index": test_index,
                "runtimeMs": round(elapsed_ms, 2),
                "stdout": captured_stdout.getvalue(),
                "verdict": "Runtime Error",
                "error": f"{type(e).__name__}: {str(e)}",
                "stackTrace": tb
            })

    print(json.dumps(results))

if __name__ == '__main__':
    main()
