# 🔍 Binary Search — Detailed Notes

> Highly efficient divide-and-conquer search algorithm operating on sorted linear structures in $O(\log n)$ time.

---

## 1. Introduction & Core Concept

Binary Search is a classic search algorithm that repeatedly halves the search space to locate a target element within a sorted array or list. It represents the quintessential divide-and-conquer technique.

### 📌 Core Principle
At each step, look at the middle element:
1. If the middle element matches the target, the search is complete.
2. If the target is smaller than the middle element, discard the right half of the search space and search the left half.
3. If the target is larger than the middle element, discard the left half and search the right half.

---

## 2. Complexity Analysis

| Scenario | Time Complexity | Space Complexity | Notes |
| :--- | :--- | :--- | :--- |
| **Best Case** | $O(1)$ | $O(1)$ | Target is exactly at the middle element on the first check. |
| **Average Case** | $O(\log n)$ | $O(1)$ | Halves the search space at each iteration. |
| **Worst Case** | $O(\log n)$ | $O(1)$ | Iterates until the search space contains a single element. |
| **Recursive Space** | $O(\log n)$ | $O(\log n)$ | If implemented recursively, takes stack frame space. |

---

## 3. Standard Implementation Templates

Here are the industry-standard templates for Binary Search variants in Python.

### Variant 1: Exact Match (Classic Search)
Use this when you only need to determine if a target is in a sorted array and return its index.

```python
def binary_search_exact(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        # Prevent potential integer overflow in languages like C++/Java
        mid = left + (right - left) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
            
    return -1  # Target not found
```

### Variant 2: Leftmost / Lower Bound (First Occurrence)
Use this to find the first occurrence of a target (which may be duplicated) or the correct index to insert an element while maintaining sort order.

```python
def binary_search_leftmost(arr, target):
    left, right = 0, len(arr)  # Note search space range [0, N]
    
    while left < right:
        mid = left + (right - left) // 2
        
        if arr[mid] >= target:
            right = mid  # Contract search space from right
        else:
            left = mid + 1
            
    return left  # Index of first occurrence or insertion point
```

### Variant 3: Rightmost / Upper Bound (Last Occurrence)
Use this to find the last occurrence of a target or the last index where the element is less than or equal to the target.

```python
def binary_search_rightmost(arr, target):
    left, right = 0, len(arr)
    
    while left < right:
        mid = left + (right - left) // 2
        
        if arr[mid] > target:
            right = mid
        else:
            left = mid + 1  # Contract search space from left
            
    return left - 1  # Index of last occurrence
```

---

## 4. Advanced: Binary Search on Answer

A powerful interview pattern is **Binary Search on Answer** (or Search Space on Range). Here, the search space is not a physical array, but a continuous or discrete range of integer answers $[L, R]$ representing possible solutions. We search this range to find the optimal valid solution using a helper feasibility checker.

### Pattern Framework
```python
def binary_search_on_answer(min_possible, max_possible, inputs):
    left, right = min_possible, max_possible
    best_ans = -1
    
    # Define checker: returns True if solution 'val' is feasible
    def is_feasible(val):
        # Business logic checking if 'val' meets constraints
        return True 

    while left <= right:
        mid = left + (right - left) // 2
        if is_feasible(mid):
            best_ans = mid
            # If seeking minimum feasible, go left:
            right = mid - 1 
            # If seeking maximum feasible, go right:
            # left = mid + 1
        else:
            # If 'mid' is too small/invalid, search larger values:
            left = mid + 1
            # If 'mid' is too large/invalid, search smaller values:
            # right = mid - 1
            
    return best_ans
```

### Typical LeetCode Problems
- **LeetCode 875**: Koko Eating Bananas
- **LeetCode 1011**: Capacity To Ship Packages Within D Days
- **LeetCode 410**: Split Array Largest Sum

---

## 5. Common Pitfalls & Gotchas

* **Integer Overflow**: Calculating `mid = (left + right) // 2` can cause integer overflow in static languages (C, C++, Java) if `left + right` exceeds $2^{31}-1$. Always use `mid = left + (right - left) // 2`.
* **Infinite Loops**: Using `left = mid` or `right = mid` inside a `left <= right` loop can result in an infinite loop when `left` and `right` differ by 1. Keep bounds updates strict (`mid + 1` / `mid - 1`) or adjust the loop condition (`left < right`).
* **Unsorted Input**: Binary search **requires** the input array to be sorted. Running it on an unsorted list yields garbage results.
* **Off-by-One Boundaries**: Be extremely careful with index ranges. Determine whether the search space is inclusive `[0, N-1]` or exclusive `[0, N]`.

---

## 6. Interview Q&A

**Q1: Why is Binary Search O(log N)?**
> At each iteration of the loop, the size of the search space is divided by 2. If we start with $N$ elements, after $k$ steps we have $N / 2^k$ elements left. The search terminates when the search space is reduced to 1 element:
> $$ \frac{N}{2^k} = 1 \implies N = 2^k \implies k = \log_2 N $$
> Thus, the maximum number of comparison operations required is logarithmic with respect to the input size.

**Q2: What is the difference between Binary Search on arrays vs. on a BST?**
> - **Sorted Array**: Requires contiguous memory. Searching is $O(\log n)$ using indexes. Insertion or deletion requires $O(n)$ time due to shifting elements.
> - **Binary Search Tree**: Memory is allocated dynamically in nodes. Average search, insertion, and deletion are all $O(\log n)$. However, worst-case is $O(n)$ if the tree is unbalanced (degenerate tree).

---

## 🖼️ Visual Flow

```mermaid
flowchart TD
  Start((Start)) --> Init["Initialize: left = 0, right = N - 1"]
  Init --> Loop{left <= right?}
  Loop -- No --> NotFound["Return -1 (Not Found)"]
  Loop -- Yes --> Calc["Calculate: mid = left + (right - left) // 2"]
  Calc --> Compare{arr[mid] == target?}
  Compare -- Yes --> ReturnIndex["Return mid"]
  Compare -- No (target < arr[mid]) --> GoLeft["Update: right = mid - 1"]
  Compare -- No (target > arr[mid]) --> GoRight["Update: left = mid + 1"]
  GoLeft --> Loop
  GoRight --> Loop
  ReturnIndex --> End((End))
  NotFound --> End
```

---
*Last updated: May 2026*
