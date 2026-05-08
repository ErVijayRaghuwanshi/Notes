# 🔍 Breadth-First Search (BFS) — Detailed Notes

> Level-order/Layered traversal for graphs and trees. Guarantees shortest path in unweighted graphs.

---

## Why BFS?
- Finds the minimum number of edges from a source to all reachable nodes (unweighted graphs)
- Level-order traversal for trees (useful for zigzag levels, averages per level, etc.)
- Template for multi-source flood fill, grid problems, and shortest transformation steps

---

## Core Ideas
- Use a queue FIFO to expand nodes layer-by-layer
- Maintain a `visited` set to avoid revisiting nodes (critical for graphs)
- For trees, `visited` is usually unnecessary; for graphs, it’s required

---

## Pseudocode (Graph, Adjacency List)
```
BFS(G, start):
  create empty queue Q
  visited = set([start])
  dist = {start: 0}  # optional: shortest edge distance from start
  enqueue(Q, start)

  while Q not empty:
    u = dequeue(Q)
    process(u)  # e.g., record order
    for v in G[u]:
      if v not in visited:
        visited.add(v)
        dist[v] = dist[u] + 1
        enqueue(Q, v)
```

Time: O(V + E)
Space: O(V)

---

## Python: BFS on Graph (Shortest Paths)
```python
from collections import deque

def bfs_shortest_edges(adj, start):
    # adj: dict[node] -> list[neighbor]
    q = deque([start])
    visited = {start}
    dist = {start: 0}
    parent = {start: None}

    while q:
        u = q.popleft()
        for v in adj.get(u, []):
            if v not in visited:
                visited.add(v)
                parent[v] = u
                dist[v] = dist[u] + 1
                q.append(v)
    return dist, parent

# Reconstruct path from start to target using parent
def build_path(parent, target):
    if target not in parent:  # unreachable
        return []
    path = []
    cur = target
    while cur is not None:
        path.append(cur)
        cur = parent.get(cur)
    return list(reversed(path))
```

---

## Python: Level-Order Traversal (Binary Tree)
```python
from collections import deque

def level_order(root):
    if not root:
        return []
    q = deque([root])
    res = []
    while q:
        level_size = len(q)
        level = []
        for _ in range(level_size):
            node = q.popleft()
            level.append(node.val)
            if node.left: q.append(node.left)
            if node.right: q.append(node.right)
        res.append(level)
    return res
```

---

## Grid BFS Template (4-directional)
```python
from collections import deque

def bfs_grid(grid, sr, sc):
    R, C = len(grid), len(grid[0])
    q = deque([(sr, sc)])
    visited = {(sr, sc)}
    dist = {(sr, sc): 0}
    dirs = [(1,0), (-1,0), (0,1), (0,-1)]

    def in_bounds(r, c):
        return 0 <= r < R and 0 <= c < C

    while q:
        r, c = q.popleft()
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if in_bounds(nr, nc) and grid[nr][nc] != '#' and (nr, nc) not in visited:
                visited.add((nr, nc))
                dist[(nr, nc)] = dist[(r, c)] + 1
                q.append((nr, nc))
    return dist
```

Use-cases: shortest path in a maze, number of islands (with slight modifications), rotting oranges, wall-and-gates.

---

## Multi-Source BFS
Initialize the queue with multiple starting nodes at distance 0 (e.g., all gates, all initially rotten oranges). Distances propagate in waves.

```python
from collections import deque

def multi_source_bfs(starts, adj):
    q = deque(starts)
    dist = {s: 0 for s in starts}
    visited = set(starts)
    while q:
        u = q.popleft()
        for v in adj.get(u, []):
            if v not in visited:
                visited.add(v)
                dist[v] = dist[u] + 1
                q.append(v)
    return dist
```

---

## Common Pitfalls
- Forgetting `visited` in graphs → infinite loops on cycles
- Marking visited too late (after dequeue) → duplicates in queue; prefer marking when enqueuing
- Using BFS for weighted shortest paths (use Dijkstra instead)
- Mixing grid bounds/obstacles checks order

---

## Practice Prompts
- Shortest path in unweighted graph between two nodes
- Word ladder (transformations with dictionary)
- Minimum steps to reach all nodes from multiple sources
- Level averages in a binary tree; Zigzag level order
