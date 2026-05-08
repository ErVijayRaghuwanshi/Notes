# 🌲 Depth-First Search (DFS) — Detailed Notes

> Systematic graph/tree exploration by going deep along a path before backtracking.

---

## Why DFS?
- Explore/connectivity checks, component counting, and path existence
- Topological sorting (DAGs), cycle detection, bridges/articulation points
- Backtracking problems (combinatorics, permutations, subsets, N-Queens)

---

## Core Ideas
- Use recursion (call stack) or an explicit stack (iterative)
- Mark nodes as visited; for directed graphs maintain states for cycle detection
- Preorder/Inorder/Postorder for trees are DFS traversals

---

## Pseudocode (Recursive, Graph)
```
DFS(G, u, visited):
  visited.add(u)
  process(u)  # e.g., record order
  for v in G[u]:
    if v not in visited:
      DFS(G, v, visited)
```

Time: O(V + E)
Space: O(V) recursion/stack depth

---

## Python: Recursive DFS (Graph)
```python
def dfs_recursive(adj, start):
    visited = set()
    order = []

    def dfs(u):
        visited.add(u)
        order.append(u)
        for v in adj.get(u, []):
            if v not in visited:
                dfs(v)

    dfs(start)
    return order
```

---

## Python: Iterative DFS (Graph)
```python
def dfs_iterative(adj, start):
    visited = set()
    order = []
    stack = [start]

    while stack:
        u = stack.pop()
        if u in visited:
            continue
        visited.add(u)
        order.append(u)
        # Push neighbors in reverse to mimic recursive order (if desired)
        for v in reversed(adj.get(u, [])):
            if v not in visited:
                stack.append(v)
    return order
```

---

## Cycle Detection (Directed Graph) via Colors
```python
WHITE, GRAY, BLACK = 0, 1, 2

def has_cycle(adj):
    color = {u: WHITE for u in adj}

    def dfs(u):
        color[u] = GRAY
        for v in adj.get(u, []):
            if color[v] == GRAY:
                return True  # back-edge
            if color[v] == WHITE and dfs(v):
                return True
        color[u] = BLACK
        return False

    return any(dfs(u) for u in adj if color[u] == WHITE)
```

---

## Topological Sort (DFS Post-order)
```python
def topo_sort(adj):
    visited = set()
    order = []

    def dfs(u):
        visited.add(u)
        for v in adj.get(u, []):
            if v not in visited:
                dfs(v)
        order.append(u)

    for u in adj:
        if u not in visited:
            dfs(u)
    order.reverse()
    return order
```

---

## Tree Traversals (DFS)
```python
# Binary tree traversals

def preorder(root):
    res = []
    def dfs(node):
        if not node: return
        res.append(node.val)
        dfs(node.left)
        dfs(node.right)
    dfs(root)
    return res


def inorder(root):
    res = []
    def dfs(node):
        if not node: return
        dfs(node.left)
        res.append(node.val)
        dfs(node.right)
    dfs(root)
    return res


def postorder(root):
    res = []
    def dfs(node):
        if not node: return
        dfs(node.left)
        dfs(node.right)
        res.append(node.val)
    dfs(root)
    return res
```

---

## Backtracking Template
```python
def backtrack(path, choices):
    if done(path):
        output(path)
        return
    for choice in choices:
        if not is_valid(path, choice):
            continue
        apply(path, choice)
        backtrack(path, extend(choices, choice))
        undo(path, choice)
```

Use-cases: permutations, combinations, subsets, n-queens, word search, sudoku.

---

## Pitfalls & Tips
- Stack overflow for very deep recursion (consider iterative or sys.setrecursionlimit)
- For directed cycle detection, use color states instead of visited alone
- For weighted shortest paths, DFS is not suitable; use Dijkstra/Bellman-Ford
- When exploring grids, guard indices first and mark visited early

---

## Practice Prompts
- Topological ordering of courses (prerequisites)
- Count connected components in an undirected graph
- All paths from source to target in a DAG
- Word search on 2D grid using backtracking
