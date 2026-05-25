# 📈 Advanced Dynamic Programming — Classic Patterns & Interview Q&A

> Mastery guide to identifying patterns, writing optimal state transitions, and solving SDE2 interview scenarios.

---

## 1. The 5 Essential DP Patterns

In coding interviews, you will rarely see a raw Fibonacci question. Instead, problems are variations of five core structural patterns. Master these templates to solve hundreds of LeetCode Medium and Hard problems.

---

### Pattern 1: 0/1 Knapsack & Unbounded Knapsack

#### 📌 Core Concept
Given a set of items, each with a weight and a value, determine the maximum value you can obtain by selecting subset items such that their total weight does not exceed a given capacity $W$. 
* **0/1 Knapsack**: You can either choose an item (`1`) or leave it (`0`). Each item can be used at most once.
* **Unbounded Knapsack**: You can select each item an infinite number of times.

#### 📐 State & Transition (0/1 Knapsack)
* **State**: Let `dp[i][w]` be the maximum value obtained using a subset of the first `i` items with a remaining capacity `w`.
* **Recurrence**:
  $$ dp[i][w] = \max(dp[i-1][w], \text{value}[i-1] + dp[i-1][w - \text{weight}[i-1]]) $$

#### ⚖️ The Scrolling Loop Direction: 0/1 vs. Unbounded
When optimizing a 2D knapsack DP table to a 1D array of size `W + 1`, the **loop direction of the capacity** dictates the item reuse behavior:

```
  0/1 Knapsack       ➔  Scan capacity BACKWARD (W down to weight[i])
  Unbounded Knapsack ➔  Scan capacity FORWARD (weight[i] up to W)
```

* **Why Backward Scanning works for 0/1 Knapsack**: 
  Scanning backward ensures that when we compute `dp[w] = max(dp[w], val + dp[w - weight])`, the state `dp[w - weight]` represents a value from the **previous row** (`i-1`), meaning the item has not yet been selected in the current row.
* **Why Forward Scanning works for Unbounded Knapsack**: 
  Scanning forward allows `dp[w]` to build upon `dp[w - weight]` from the **same row** (`i`), representing that the current item could have already been selected multiple times.

#### 🚀 Worked Example 1: Coin Change I (Min Coins - Unbounded Knapsack)
* **Goal**: Find the **minimum** number of coins needed to make a target amount.
* **State**: `dp[a]` = minimum coins to make amount `a`.
* **Recurrence**: `dp[a] = min(dp[a], 1 + dp[a - coin])` for each coin.

```python
def coin_change_min(coins, amount):
    # Initialize table with infinity, except base case dp[0] = 0
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    # Forward scan since coins can be reused infinitely (Unbounded)
    for coin in coins:
        for a in range(coin, amount + 1):
            dp[a] = min(dp[a], 1 + dp[a - coin])
            
    return dp[amount] if dp[amount] != float('inf') else -1
```

#### 🚀 Worked Example 2: Coin Change II (Total Ways - Unbounded Knapsack)
* **Goal**: Find the **total number of combinations** to make a target amount.
* **State**: `dp[a]` = number of combinations to make amount `a`.
* **Recurrence**: `dp[a] = dp[a] + dp[a - coin]`

```python
def coin_change_combinations(coins, amount):
    # Base Case: 1 way to make amount 0 (using no coins)
    dp = [0] * (amount + 1)
    dp[0] = 1
    
    for coin in coins:
        for a in range(coin, amount + 1):
            dp[a] += dp[a - coin]
            
    return dp[amount]
```

---

### Pattern 2: Longest Common Subsequence (LCS) & Grids

#### 📌 Core Concept
Given two sequences or strings, compare elements cell-by-cell in a 2D coordinate space.

#### 📐 State & Transition
* **State**: Let `dp[i][j]` be the length of the LCS of substrings `s1[0..i-1]` and `s2[0..j-1]`.
* **Recurrence**:
  * If characters match (`s1[i-1] == s2[j-1]`):
    $$ dp[i][j] = 1 + dp[i-1][j-1] $$
  * If characters do not match:
    $$ dp[i][j] = \max(dp[i-1][j], dp[i][j-1]) $$

#### 🚀 Practical Walkthrough: Edit Distance Matrix Tracing
Let's trace **Edit Distance** (LeetCode 72) mapping the source string `"horse"` to the target string `"ros"`.
* **State**: `dp[i][j]` = min operations to convert `s1[0..i-1]` to `s2[0..j-1]`.
* **Recurrence**:
  * If characters match (`s1[i-1] == s2[j-1]`): `dp[i][j] = dp[i-1][j-1]`
  * If mismatch, take min of Insert, Delete, Replace plus 1 operation:
    $$ dp[i][j] = 1 + \min(dp[i][j-1] \text{ (Insert)}, dp[i-1][j] \text{ (Delete)}, dp[i-1][j-1] \text{ (Replace)}) $$

#### 🖼️ The Filled 2D Grid Trace Table
Base cases represent inserting all characters (row 0) or deleting all characters (col 0):

| Index | Target / Source | `""` (0) | `r` (1) | `o` (2) | `s` (3) |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **0** | `""` | **0** | 1 | 2 | 3 |
| **1** | `h` | 1 | **1** (Replace) | 2 | 3 |
| **2** | `o` | 2 | 2 (Delete) | **1** (Match) | 2 (Insert) |
| **3** | `r` | 3 | **2** (Match) | 2 | 2 |
| **4** | `s` | 4 | 3 | 3 | **2** (Match) |
| **5** | `e` | 5 | 4 | 4 | **3** (Replace) |

* **Final Edit Distance**: `dp[5][3] = 3` (Operations: replace 'h' with 'r', remove 'r', replace 'e' with 's').

```python
def edit_distance(s1, s2):
    M, N = len(s1), len(s2)
    dp = [[0] * (N + 1) for _ in range(M + 1)]
    
    # Initialize base cases
    for i in range(M + 1): dp[i][0] = i
    for j in range(N + 1): dp[0][j] = j
        
    for i in range(1, M + 1):
        for j in range(1, N + 1):
            if s1[i - 1] == s2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(
                    dp[i][j - 1],    # Insert
                    dp[i - 1][j],    # Delete
                    dp[i - 1][j - 1] # Replace
                )
    return dp[M][N]
```

---

### Pattern 3: Interval DP

#### 📌 Core Concept
Solves problems where the optimal solution for range `[i, j]` depends on expanding the range. In Bottom-Up tabulation, we must process the table **diagonally** (by interval span lengths) because smaller ranges must be fully solved before evaluating larger ranges.

#### 🚀 Worked Example: Longest Palindromic Substring
* **Goal**: Find the longest contiguous substring that reads the same backward as forward.
* **State**: Let `dp[i][j]` be `True` if substring `s[i..j]` is a palindrome.
* **Recurrence**:
  * Substring `s[i..j]` is a palindrome if `s[i] == s[j]` and the inner substring `s[i+1..j-1]` is also a palindrome:
    $$ dp[i][j] = (s[i] == s[j]) \land (dp[i+1][j-1]) $$

```python
def longest_palindromic_substring(s):
    if not s:
        return ""
    N = len(s)
    dp = [[False] * N for _ in range(N)]
    
    # Base Case: Single characters are palindromes
    for i in range(N):
        dp[i][i] = True
        
    start_idx, max_len = 0, 1
    
    # Loop by interval span lengths L (2 to N)
    for L in range(2, N + 1):
        for i in range(N - L + 1):
            j = i + L - 1
            
            # If span is 2, only compare s[i] and s[j]. Otherwise, check inner substring
            if s[i] == s[j]:
                if L == 2:
                    dp[i][j] = True
                else:
                    dp[i][j] = dp[i + 1][j - 1]
            
            if dp[i][j] and L > max_len:
                start_idx = i
                max_len = L
                
    return s[start_idx : start_idx + max_len]
```
* **Time Complexity**: $O(N^2)$ — Covers half of the 2D grid matrix.
* **Space Complexity**: $O(N^2)$ — State table.

---

### Pattern 4: DP on Trees & Graphs

#### 📌 Core Concept
Tree DP computes states recursively using a bottom-up Post-Order DFS traversal, where child nodes return subproblem results to the parent.

#### 🚀 Worked Example: House Robber III
* **Goal**: Rob houses organized as a binary tree without robbing adjacent parents and children.
* **State**: `dfs(node)` returns a list of two values: `[skip_node_val, choose_node_val]`.

```python
def rob_tree(root):
    def dfs(node):
        if not node:
            return [0, 0]  # [val_if_skipped, val_if_robbed]
            
        left = dfs(node.left)
        right = dfs(node.right)
        
        # 1. If we skip this parent node, we can choose or skip either child
        skip_parent = max(left[0], left[1]) + max(right[0], right[1])
        
        # 2. If we choose this parent node, we MUST skip both children
        choose_parent = node.val + left[0] + right[0]
        
        return [skip_parent, choose_parent]
        
    return max(dfs(root))
```

---

### Pattern 5: Bitmask DP

#### 📌 Core Concept
Bitmask DP is used when states depend on the **subset of visited elements**. Instead of passing a slow hash set of visited nodes (which cannot be easily indexed), we represent the set of visited elements as a single integer (a **bitmask**) where the $i$-th bit is `1` if visited, and `0` if not.

#### 🛠️ Essential Bitwise Operators Cheat Sheet
* **Check if $i$-th element is visited**: `mask & (1 << i) != 0`
* **Set $i$-th element as visited**: `new_mask = mask | (1 << i)`
* **Clear $i$-th element (backtrack)**: `new_mask = mask & ~(1 << i)`
* **All elements visited (size N)**: `mask == (1 << N) - 1`

#### 📐 State & Transition: Traveling Salesperson Problem (TSP)
* **Goal**: Find the minimum cost path that visits every city exactly once and returns to the starting city.
* **State**: Let `dp[mask][u]` be the minimum path cost to visit the subset of cities represented by `mask`, ending at current city `u`.
* **Recurrence**:
  $$ dp(\text{mask}, u) = \min_{v \in \text{unvisited}} (\text{dist}[u][v] + dp(\text{mask} \cup \{v\}, v)) $$

#### 🚀 Python Implementation (Top-Down TSP)
```python
def traveling_salesperson(dist):
    N = len(dist)
    memo = {}
    
    # mask: bitmask representing visited cities
    # u: current city index
    def solve(mask, u):
        # Base Case: All cities have been visited. Return cost back to starting city (0)
        if mask == (1 << N) - 1:
            return dist[u][0]
            
        state = (mask, u)
        if state in memo:
            return memo[state]
            
        min_cost = float('inf')
        
        # Try visiting all other unvisited cities
        for v in range(N):
            # If city v has not been visited yet:
            if not (mask & (1 << v)):
                new_cost = dist[u][v] + solve(mask | (1 << v), v)
                min_cost = min(min_cost, new_cost)
                
        memo[state] = min_cost
        return min_cost
        
    # Start at city 0 with only city 0 visited (mask = 1)
    return solve(1, 0)
```
* **Time Complexity**: $O(N^2 \times 2^N)$ — Extremely fast compared to $O(N!)$ brute-force permutations!
* **Space Complexity**: $O(N \times 2^N)$ — Caching states.

---

## 2. Dynamic Programming Interview Q&A

**Q1: How do you identify a DP problem during an interview?**
> Look for these key terms:
> 1. **Extreme Values**: "Find the **maximum** value, **minimum** path, **shortest** combination."
> 2. **Counting Combinations**: "Count the **total number of ways** to reach X, find **distinct** combinations."
> 3. **Subproblem Dependency**: The choice you make at index `i` restricts or affects choices at index `i+1`.
> 4. If constraints are relatively small ($N \le 10^3$ or $N \le 10^4$), an $O(N^2)$ DP algorithm is highly likely.

**Q2: Should I write Top-Down or Bottom-Up in an interview?**
> * **Recommendation**: **Start with Top-Down (Memoization)**. It is much easier to derive because it maps directly to standard recursion. You simply write the brute-force recursive tree and add a `memo` dictionary.
> * If the interviewer pushes for stack overhead optimizations, translate the base cases and recursion relation into a **Bottom-Up (Tabulation)** loop.

**Q3: How do you perform Space Optimization on a 2D DP table?**
> Check the state transition relation. For example, if:
> $$ dp[i][j] = dp[i-1][j] + dp[i-1][j-c] $$
> The state at row `i` **only** depends on values from row `i-1`. Therefore, you only need to store two rows: `prev_row` and `curr_row`. You can compress this to a single 1D array of size `C` by scanning backwards to prevent overwriting values from the previous iteration.

---

## 3. Checklist of Common DP Mistakes

* **❌ Off-by-One Table Initialization**: Initializing the DP array with size `N` instead of `N+1`. Remember, `dp[i]` represents states up to the $i$-th element, requiring `N+1` elements to cover base case `0` through `N`.
* **❌ Incorrect Loop Boundaries**: In bottom-up DP, accessing indices outside bounds because base cases were not seeded. Ensure base cases like `dp[0]` and `dp[1]` are explicitly set.
* **❌ Overwriting 1D DP Values**: In Knapsack space-optimized arrays, scanning the weight capacity loop forward (`0` to `W`) instead of backward (`W` to `0`). Forward scanning allows reuse, representing **Unbounded Knapsack** (infinite item reuse) rather than **0/1 Knapsack**.
* **❌ Over-engineering recursion**: Trying to write a perfect bottom-up 1D space-optimized DP on the first attempt. Always write the slow recursive version first, memoize it, and iterate to tabulation.

---
*Last updated: May 2026*
