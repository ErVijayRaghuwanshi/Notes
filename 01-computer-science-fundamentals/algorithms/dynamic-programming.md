# Dynamic Programming (DP)

Dynamic Programming is a core algorithmic technique for solving optimization problems by breaking them down into smaller, overlapping subproblems. It's one of the most frequently tested topics in technical interviews.

## 📖 Core Concepts

### What is Dynamic Programming?

Dynamic Programming is an optimization technique that:
- **Breaks down complex problems** into simpler subproblems
- **Stores solutions** to avoid redundant calculations (memoization)
- **Builds solutions** from smaller subproblems (optimal substructure)
- **Guarantees optimal solutions** when applicable

### When to Use DP?

Use DP when a problem has:
1. **Overlapping Subproblems**: Same subproblems solved multiple times
2. **Optimal Substructure**: Optimal solution contains optimal solutions to subproblems
3. **Choices at each step**: Decision-making that affects future states

### DP Approaches

**Top-Down (Memoization)**:
```python
def fib(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fib(n-1, memo) + fib(n-2, memo)
    return memo[n]
```

**Bottom-Up (Tabulation)**:
```python
def fib(n):
    if n <= 1:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]
```

## 🔥 Top DP Problem Patterns & Examples

### 1. Linear DP (1D) - Foundational

#### Climbing Stairs (Easy)
**Problem**: Count ways to climb n stairs (1 or 2 steps at a time)

**Pattern**: Classic Fibonacci
```python
def climbStairs(n):
    if n <= 2:
        return n
    dp = [0] * (n + 1)
    dp[1], dp[2] = 1, 2
    for i in range(3, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]
```

**Key Insight**: Each step can be reached from previous two steps
- Time: O(n), Space: O(n) → Can optimize to O(1) with two variables

#### House Robber (Medium)
**Problem**: Maximum sum without robbing adjacent houses

**Pattern**: Decision DP (rob or skip)
```python
def rob(nums):
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    
    dp = [0] * len(nums)
    dp[0] = nums[0]
    dp[1] = max(nums[0], nums[1])
    
    for i in range(2, len(nums)):
        dp[i] = max(dp[i-1], dp[i-2] + nums[i])
    
    return dp[-1]
```

**Key Insight**: At each house, choose max of (rob current + skip previous) or (skip current)
- Time: O(n), Space: O(n) → Can optimize to O(1)

#### Min Cost Climbing Stairs (Easy)
**Problem**: Find minimum cost to reach top

**Pattern**: Minimum path accumulation
```python
def minCostClimbingStairs(cost):
    n = len(cost)
    dp = [0] * (n + 1)
    
    for i in range(2, n + 1):
        dp[i] = min(dp[i-1] + cost[i-1], dp[i-2] + cost[i-2])
    
    return dp[n]
```

**Key Insight**: Minimum cost to reach step i from previous two steps
- Time: O(n), Space: O(n)

#### Decode Ways (Medium)
**Problem**: Count ways to decode a string (1-26 → A-Z)

**Pattern**: String partitioning
```python
def numDecodings(s):
    if not s or s[0] == '0':
        return 0
    
    n = len(s)
    dp = [0] * (n + 1)
    dp[0] = 1
    dp[1] = 1
    
    for i in range(2, n + 1):
        one_digit = int(s[i-1:i])
        two_digits = int(s[i-2:i])
        
        if one_digit >= 1:
            dp[i] += dp[i-1]
        if 10 <= two_digits <= 26:
            dp[i] += dp[i-2]
    
    return dp[n]
```

**Key Insight**: Check single digit (1-9) and two-digit (10-26) combinations
- Time: O(n), Space: O(n)

### 2. 0/1 Knapsack & Subsets

#### Partition Equal Subset Sum (Medium)
**Problem**: Can array be partitioned into two equal sum subsets?

**Pattern**: Subset sum variant
```python
def canPartition(nums):
    total = sum(nums)
    if total % 2 != 0:
        return False
    
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True
    
    for num in nums:
        for j in range(target, num - 1, -1):
            dp[j] = dp[j] or dp[j - num]
    
    return dp[target]
```

**Key Insight**: Transform to subset sum with target = total/2
- Time: O(n × sum), Space: O(sum)

#### Coin Change (Medium)
**Problem**: Minimum coins to make amount

**Pattern**: Unbounded knapsack
```python
def coinChange(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for i in range(1, amount + 1):
        for coin in coins:
            if i >= coin:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1
```

**Key Insight**: For each amount, try all coins and take minimum
- Time: O(amount × coins), Space: O(amount)

#### Target Sum (Medium)
**Problem**: Assign +/- to reach target

**Pattern**: Transform to subset sum
```python
def findTargetSumWays(nums, target):
    total = sum(nums)
    if abs(target) > total or (total + target) % 2 != 0:
        return 0
    
    subset_sum = (total + target) // 2
    dp = [0] * (subset_sum + 1)
    dp[0] = 1
    
    for num in nums:
        for j in range(subset_sum, num - 1, -1):
            dp[j] += dp[j - num]
    
    return dp[subset_sum]
```

**Key Insight**: P - N = target, P + N = sum → P = (sum + target) / 2
- Time: O(n × sum), Space: O(sum)

### 3. Grid DP (2D)

#### Unique Paths (Medium)
**Problem**: Count paths in m×n grid (only right/down)

**Pattern**: Grid traversal
```python
def uniquePaths(m, n):
    dp = [[1] * n for _ in range(m)]
    
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i-1][j] + dp[i][j-1]
    
    return dp[m-1][n-1]
```

**Key Insight**: Paths to (i,j) = paths to (i-1,j) + paths to (i,j-1)
- Time: O(m×n), Space: O(m×n) → Can optimize to O(n)

#### Unique Paths II (Medium)
**Problem**: Paths with obstacles

**Pattern**: Grid with constraints
```python
def uniquePathsWithObstacles(grid):
    if not grid or grid[0][0] == 1:
        return 0
    
    m, n = len(grid), len(grid[0])
    dp = [[0] * n for _ in range(m)]
    dp[0][0] = 1
    
    for i in range(m):
        for j in range(n):
            if grid[i][j] == 1:
                dp[i][j] = 0
            elif i > 0 or j > 0:
                dp[i][j] = (dp[i-1][j] if i > 0 else 0) + \
                           (dp[i][j-1] if j > 0 else 0)
    
    return dp[m-1][n-1]
```

**Key Insight**: Set dp[i][j] = 0 if obstacle, else sum from top and left
- Time: O(m×n), Space: O(m×n)

#### Minimum Path Sum (Medium)
**Problem**: Minimum cost path from top-left to bottom-right

**Pattern**: Minimum cost accumulation
```python
def minPathSum(grid):
    m, n = len(grid), len(grid[0])
    dp = [[0] * n for _ in range(m)]
    dp[0][0] = grid[0][0]
    
    for i in range(1, m):
        dp[i][0] = dp[i-1][0] + grid[i][0]
    for j in range(1, n):
        dp[0][j] = dp[0][j-1] + grid[0][j]
    
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])
    
    return dp[m-1][n-1]
```

**Key Insight**: Accumulate minimum cost from top or left
- Time: O(m×n), Space: O(m×n)

#### Maximal Square (Medium)
**Problem**: Largest square of 1s in binary matrix

**Pattern**: 2D DP with neighbors
```python
def maximalSquare(matrix):
    if not matrix:
        return 0
    
    m, n = len(matrix), len(matrix[0])
    dp = [[0] * n for _ in range(m)]
    max_side = 0
    
    for i in range(m):
        for j in range(n):
            if matrix[i][j] == '1':
                if i == 0 or j == 0:
                    dp[i][j] = 1
                else:
                    dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1
                max_side = max(max_side, dp[i][j])
    
    return max_side * max_side
```

**Key Insight**: Square size limited by smallest neighbor square + 1
- Time: O(m×n), Space: O(m×n)

### 4. String DP & LCS (Longest Common Subsequence)

#### Longest Common Subsequence (Medium)
**Problem**: Length of longest common subsequence

**Pattern**: 2D string comparison
```python
def longestCommonSubsequence(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    return dp[m][n]
```

**Key Insight**: If match, extend diagonal; else take max from top/left
- Time: O(m×n), Space: O(m×n)

#### Edit Distance (Hard)
**Problem**: Minimum operations to convert string A to B

**Pattern**: Wagner-Fischer algorithm
```python
def minDistance(word1, word2):
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(
                    dp[i-1][j],    # delete
                    dp[i][j-1],    # insert
                    dp[i-1][j-1]   # replace
                )
    
    return dp[m][n]
```

**Key Insight**: Three operations - insert, delete, replace
- Time: O(m×n), Space: O(m×n)

#### Longest Palindromic Subsequence (Medium)
**Problem**: Length of longest palindromic subsequence

**Pattern**: LCS with reverse
```python
def longestPalindromeSubseq(s):
    n = len(s)
    dp = [[0] * n for _ in range(n)]
    
    for i in range(n):
        dp[i][i] = 1
    
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            if s[i] == s[j]:
                dp[i][j] = dp[i+1][j-1] + 2
            else:
                dp[i][j] = max(dp[i+1][j], dp[i][j-1])
    
    return dp[0][n-1]
```

**Key Insight**: If endpoints match, add 2 to inner subsequence
- Time: O(n²), Space: O(n²)

#### Word Break (Medium)
**Problem**: Can string be segmented into dictionary words?

**Pattern**: String partitioning
```python
def wordBreak(s, wordDict):
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    word_set = set(wordDict)
    
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break
    
    return dp[n]
```

**Key Insight**: Check all possible splits, use set for O(1) lookup
- Time: O(n² × m) where m is max word length, Space: O(n)

### 5. Longest Increasing Subsequence (LIS)

#### Longest Increasing Subsequence (Medium)
**Problem**: Length of longest strictly increasing subsequence

**Pattern**: Sequence ordering
```python
# O(n²) solution
def lengthOfLIS(nums):
    n = len(nums)
    dp = [1] * n
    
    for i in range(1, n):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    
    return max(dp)

# O(n log n) solution with binary search
def lengthOfLIS_optimized(nums):
    from bisect import bisect_left
    tails = []
    
    for num in nums:
        pos = bisect_left(tails, num)
        if pos == len(tails):
            tails.append(num)
        else:
            tails[pos] = num
    
    return len(tails)
```

**Key Insight**: For each element, find longest sequence ending at it
- Time: O(n²) or O(n log n), Space: O(n)

#### Russian Doll Envelopes (Hard)
**Problem**: Maximum nested envelopes

**Pattern**: 2D LIS
```python
def maxEnvelopes(envelopes):
    from bisect import bisect_left
    
    # Sort by width ascending, height descending
    envelopes.sort(key=lambda x: (x[0], -x[1]))
    
    # Find LIS on heights
    heights = [h for w, h in envelopes]
    tails = []
    
    for h in heights:
        pos = bisect_left(tails, h)
        if pos == len(tails):
            tails.append(h)
        else:
            tails[pos] = h
    
    return len(tails)
```

**Key Insight**: Sort to reduce 2D problem to 1D LIS
- Time: O(n log n), Space: O(n)

### 6. Interval DP

#### Burst Balloons (Hard)
**Problem**: Maximum coins from bursting balloons

**Pattern**: Interval optimization
```python
def maxCoins(nums):
    nums = [1] + nums + [1]
    n = len(nums)
    dp = [[0] * n for _ in range(n)]
    
    for length in range(2, n):
        for left in range(n - length):
            right = left + length
            for k in range(left + 1, right):
                dp[left][right] = max(
                    dp[left][right],
                    dp[left][k] + dp[k][right] + 
                    nums[left] * nums[k] * nums[right]
                )
    
    return dp[0][n-1]
```

**Key Insight**: Consider each balloon as last to burst in interval
- Time: O(n³), Space: O(n²)

#### Minimum Cost to Merge Stones (Hard)
**Problem**: Minimum cost to merge piles into one

**Pattern**: Interval merging
```python
def mergeStones(stones, k):
    n = len(stones)
    if (n - 1) % (k - 1) != 0:
        return -1
    
    prefix = [0]
    for stone in stones:
        prefix.append(prefix[-1] + stone)
    
    dp = [[float('inf')] * n for _ in range(n)]
    for i in range(n):
        dp[i][i] = 0
    
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            for mid in range(i, j, k - 1):
                dp[i][j] = min(dp[i][j], dp[i][mid] + dp[mid + 1][j])
            if (j - i) % (k - 1) == 0:
                dp[i][j] += prefix[j + 1] - prefix[i]
    
    return dp[0][n - 1]
```

**Key Insight**: Divide interval at valid merge points
- Time: O(n³/k), Space: O(n²)

### 7. State Machine (Stock Problems)

#### Best Time to Buy and Sell Stock II (Medium)
**Problem**: Maximum profit with multiple transactions

**Pattern**: Greedy (simple case)
```python
def maxProfit(prices):
    profit = 0
    for i in range(1, len(prices)):
        if prices[i] > prices[i-1]:
            profit += prices[i] - prices[i-1]
    return profit
```

**Key Insight**: Add all positive differences
- Time: O(n), Space: O(1)

#### Best Time to Buy and Sell Stock with Cooldown (Medium)
**Problem**: Maximum profit with cooldown

**Pattern**: State machine DP
```python
def maxProfit(prices):
    if not prices:
        return 0
    
    n = len(prices)
    hold = [0] * n
    sold = [0] * n
    rest = [0] * n
    
    hold[0] = -prices[0]
    
    for i in range(1, n):
        hold[i] = max(hold[i-1], rest[i-1] - prices[i])
        sold[i] = hold[i-1] + prices[i]
        rest[i] = max(rest[i-1], sold[i-1])
    
    return max(sold[-1], rest[-1])
```

**Key Insight**: Three states - hold stock, just sold, resting
- Time: O(n), Space: O(n) → Can optimize to O(1)

### 8. Trees/Graph DP

#### House Robber III (Medium)
**Problem**: Maximum money from binary tree (no adjacent nodes)

**Pattern**: Tree DP
```python
def rob(root):
    def dfs(node):
        if not node:
            return (0, 0)  # (rob, not_rob)
        
        left = dfs(node.left)
        right = dfs(node.right)
        
        rob = node.val + left[1] + right[1]
        not_rob = max(left) + max(right)
        
        return (rob, not_rob)
    
    return max(dfs(root))
```

**Key Insight**: Post-order traversal with two states per node
- Time: O(n), Space: O(h) where h is height

#### Unique Binary Search Trees (Medium)
**Problem**: Count structurally unique BSTs with n nodes

**Pattern**: Catalan numbers
```python
def numTrees(n):
    dp = [0] * (n + 1)
    dp[0] = dp[1] = 1
    
    for nodes in range(2, n + 1):
        for root in range(1, nodes + 1):
            left = root - 1
            right = nodes - root
            dp[nodes] += dp[left] * dp[right]
    
    return dp[n]
```

**Key Insight**: For each root, multiply left and right subtree counts
- Time: O(n²), Space: O(n)

## 💡 Tips for Mastering DP

### 1. Identify Patterns

Learn to recognize these core patterns:
- **Linear/1D DP**: Fibonacci, house robber, decode ways
- **2D/Grid DP**: Unique paths, minimum path sum
- **Knapsack**: 0/1 knapsack, unbounded knapsack, subset sum
- **LCS**: String comparison, edit distance
- **LIS**: Sequence ordering, envelope nesting
- **Interval DP**: Burst balloons, merge stones
- **State Machine**: Stock problems with states
- **Tree DP**: Binary tree optimization

### 2. Problem-Solving Framework

**Step 1: Identify if it's a DP problem**
- Optimization (min/max)
- Counting (number of ways)
- Decision making with constraints

**Step 2: Define the state**
- What information do we need to track?
- What are the dimensions? (1D, 2D, 3D)

**Step 3: Write the recurrence relation**
- How does current state relate to previous states?
- What are the base cases?

**Step 4: Determine the order**
- Top-down (recursion + memoization)
- Bottom-up (iteration + tabulation)

**Step 5: Optimize space**
- Can we reduce dimensions?
- Do we only need previous row/column?

### 3. Top-Down vs. Bottom-Up

**Use Top-Down when**:
- Problem is easier to think recursively
- Not all subproblems need to be solved
- Easier to implement initially

**Use Bottom-Up when**:
- Need better space optimization
- Want to avoid recursion overhead
- All subproblems must be solved anyway

### 4. Common Pitfalls

- **Not handling base cases**: Always initialize properly
- **Wrong iteration order**: Ensure dependencies are met
- **Off-by-one errors**: Be careful with indices
- **Integer overflow**: Use appropriate data types
- **Not optimizing space**: Look for space optimization opportunities

### 5. Practice Strategy

**Week 1-2: Foundations**
- Linear DP (Fibonacci, climbing stairs, house robber)
- Basic grid problems (unique paths)

**Week 3-4: Intermediate**
- Knapsack variants (coin change, subset sum)
- String DP (LCS, edit distance)

**Week 5-6: Advanced**
- LIS and variants
- Interval DP
- State machine DP

**Week 7-8: Mastery**
- Tree/Graph DP
- Multi-dimensional DP
- Optimization techniques

### 6. Resources

**Online Platforms**:
- LeetCode DP tag (sorted by acceptance rate)
- DP for Beginners guide
- Ultimate Dynamic Programming Roadmap (Reddit)

**Books**:
- "Dynamic Programming for Coding Interviews"
- "Introduction to Algorithms" (CLRS)

**Practice Sets**:
- Blind 75 (DP problems)
- Grind 75 (DP section)
- NeetCode 150 (DP problems)

## 🔗 Related

- [Back to Algorithms](README.md)
- [Data Structures](../data-structures/)
- [Design Patterns](../design-patterns/)
