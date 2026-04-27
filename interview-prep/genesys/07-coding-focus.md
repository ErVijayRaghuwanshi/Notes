# Coding & ML Engineering — Interview Focus

## High-Yield DSA Patterns for AI/Backend Roles

### Pattern 1: Hash Maps & Strings
**Relevance**: Text processing, entity extraction, caching, deduplication

```python
# Example: Intent frequency counter
from collections import Counter, defaultdict

def analyze_intents(conversations):
    """Analyze intent distribution across conversations."""
    intent_counts = Counter()
    intent_by_channel = defaultdict(Counter)
    
    for conv in conversations:
        for turn in conv['turns']:
            intent = turn.get('intent')
            channel = conv.get('channel')
            if intent:
                intent_counts[intent] += 1
                intent_by_channel[channel][intent] += 1
    
    return {
        'total': dict(intent_counts),
        'by_channel': {k: dict(v) for k, v in intent_by_channel.items()}
    }

# Time: O(n * m) where n = conversations, m = turns
# Space: O(k) where k = unique intents
```

```python
# Example: Sliding window for token counting
def count_tokens_in_window(text, window_size=512):
    """Count tokens in sliding windows for chunking."""
    tokens = text.split()  # Simplified tokenization
    windows = []
    
    for i in range(0, len(tokens), window_size // 2):  # 50% overlap
        window = tokens[i:i + window_size]
        windows.append({
            'start': i,
            'end': i + len(window),
            'token_count': len(window),
            'text': ' '.join(window)
        })
    
    return windows
```

### Pattern 2: Heaps & Priority Queues
**Relevance**: Top-K retrieval, ranking, scheduling

```python
import heapq

def top_k_similar_documents(query_embedding, doc_embeddings, k=10):
    """Find top-K most similar documents using min-heap."""
    # Min-heap of size K (store negative similarity for max behavior)
    heap = []
    
    for doc_id, doc_embedding in doc_embeddings.items():
        similarity = cosine_similarity(query_embedding, doc_embedding)
        
        if len(heap) < k:
            heapq.heappush(heap, (similarity, doc_id))
        elif similarity > heap[0][0]:
            heapq.heapreplace(heap, (similarity, doc_id))
    
    # Return sorted by similarity (highest first)
    return sorted(heap, reverse=True)

# Time: O(n log k) where n = documents
# Space: O(k)
```

```python
def merge_k_sorted_results(result_lists):
    """Merge K sorted retrieval results (e.g., from multiple indexes)."""
    heap = []
    
    # Initialize heap with first element from each list
    for i, results in enumerate(result_lists):
        if results:
            heapq.heappush(heap, (-results[0]['score'], i, 0, results[0]))
    
    merged = []
    seen_ids = set()
    
    while heap:
        neg_score, list_idx, elem_idx, item = heapq.heappop(heap)
        
        # Deduplicate
        if item['id'] not in seen_ids:
            seen_ids.add(item['id'])
            merged.append(item)
        
        # Add next element from same list
        if elem_idx + 1 < len(result_lists[list_idx]):
            next_item = result_lists[list_idx][elem_idx + 1]
            heapq.heappush(heap, (-next_item['score'], list_idx, elem_idx + 1, next_item))
    
    return merged

# Time: O(n log k) where n = total items, k = number of lists
```

### Pattern 3: Graph Traversal (BFS/DFS)
**Relevance**: Workflow dependencies, conversation flow, knowledge graphs

```python
from collections import deque

def find_conversation_paths(start_intent, end_intent, transitions):
    """Find all paths from start intent to end intent (BFS)."""
    graph = defaultdict(list)
    for src, dst in transitions:
        graph[src].append(dst)
    
    queue = deque([(start_intent, [start_intent])])
    all_paths = []
    
    while queue:
        current, path = queue.popleft()
        
        if current == end_intent:
            all_paths.append(path)
            continue
        
        for neighbor in graph[current]:
            if neighbor not in path:  # Avoid cycles
                queue.append((neighbor, path + [neighbor]))
    
    return all_paths
```

```python
def topological_sort_workflow(tasks, dependencies):
    """Sort workflow tasks by dependencies (Kahn's algorithm)."""
    graph = defaultdict(list)
    in_degree = defaultdict(int)
    
    for task in tasks:
        in_degree[task] = 0
    
    for dep, task in dependencies:
        graph[dep].append(task)
        in_degree[task] += 1
    
    # Start with tasks that have no dependencies
    queue = deque([t for t in tasks if in_degree[t] == 0])
    order = []
    
    while queue:
        task = queue.popleft()
        order.append(task)
        
        for dependent in graph[task]:
            in_degree[dependent] -= 1
            if in_degree[dependent] == 0:
                queue.append(dependent)
    
    if len(order) != len(tasks):
        raise ValueError("Circular dependency detected")
    
    return order

# Time: O(V + E)
# Space: O(V + E)
```

### Pattern 4: Sliding Window / Two Pointers
**Relevance**: Streaming data, context windows, token limits

```python
def find_optimal_context_window(messages, max_tokens=4096):
    """Find the largest recent context that fits in token limit."""
    # Start from most recent, expand backward
    total_tokens = 0
    start_idx = len(messages)
    
    for i in range(len(messages) - 1, -1, -1):
        msg_tokens = count_tokens(messages[i]['content'])
        if total_tokens + msg_tokens > max_tokens:
            break
        total_tokens += msg_tokens
        start_idx = i
    
    return messages[start_idx:]
```

```python
def detect_repeated_patterns(conversation, min_length=3):
    """Detect if user is repeating themselves (frustration signal)."""
    messages = [m['content'].lower() for m in conversation if m['role'] == 'user']
    
    for window_size in range(min_length, len(messages) // 2 + 1):
        for i in range(len(messages) - window_size * 2 + 1):
            window1 = messages[i:i + window_size]
            window2 = messages[i + window_size:i + window_size * 2]
            
            if similarity(window1, window2) > 0.8:
                return True, i
    
    return False, -1
```

### Pattern 5: Dynamic Programming
**Relevance**: Sequence alignment, edit distance, optimal chunking

```python
def edit_distance(s1, s2):
    """Calculate edit distance between two strings (for fuzzy matching)."""
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
    
    return dp[m][n]

# Time: O(m * n)
# Space: O(m * n), can optimize to O(n)
```

```python
def optimal_document_chunking(doc_length, chunk_sizes, overlap_penalty):
    """Find optimal chunking strategy using DP."""
    # dp[i] = minimum cost to chunk document up to position i
    dp = [float('inf')] * (doc_length + 1)
    dp[0] = 0
    parent = [-1] * (doc_length + 1)
    
    for i in range(1, doc_length + 1):
        for chunk_size in chunk_sizes:
            if i >= chunk_size:
                # Cost = previous cost + chunk cost + overlap penalty
                cost = dp[i - chunk_size] + chunk_cost(chunk_size)
                if i < doc_length:
                    cost += overlap_penalty
                
                if cost < dp[i]:
                    dp[i] = cost
                    parent[i] = i - chunk_size
    
    # Reconstruct solution
    chunks = []
    pos = doc_length
    while pos > 0:
        chunks.append((parent[pos], pos))
        pos = parent[pos]
    
    return chunks[::-1], dp[doc_length]
```

---

## Python Best Practices for Interviews

### Code Quality Checklist

```python
# ✅ Good: Clear function signature with types
def process_message(
    message: str,
    context: dict[str, Any],
    config: Config
) -> Response:
    """Process a user message and return a response.
    
    Args:
        message: The user's input message
        context: Conversation context including history
        config: Configuration for processing
        
    Returns:
        Response object containing the assistant's reply
        
    Raises:
        ValidationError: If message is empty or too long
    """
    pass

# ❌ Bad: Unclear signature
def process(m, c, cfg):
    pass
```

### Error Handling

```python
# ✅ Good: Specific exceptions with context
class ToolExecutionError(Exception):
    def __init__(self, tool_name: str, reason: str, retryable: bool = False):
        self.tool_name = tool_name
        self.reason = reason
        self.retryable = retryable
        super().__init__(f"Tool '{tool_name}' failed: {reason}")

def execute_tool(tool_name: str, params: dict) -> dict:
    try:
        result = tool_registry[tool_name].execute(params)
        return result
    except KeyError:
        raise ToolExecutionError(tool_name, "Tool not found", retryable=False)
    except TimeoutError:
        raise ToolExecutionError(tool_name, "Timeout", retryable=True)
    except Exception as e:
        raise ToolExecutionError(tool_name, str(e), retryable=False)
```

### Testing Patterns

```python
import pytest
from unittest.mock import Mock, patch

class TestIntentClassifier:
    @pytest.fixture
    def classifier(self):
        return IntentClassifier(model_path="test_model")
    
    def test_classify_simple_intent(self, classifier):
        result = classifier.classify("What's my order status?")
        assert result.intent == "order_status"
        assert result.confidence > 0.8
    
    def test_classify_low_confidence(self, classifier):
        result = classifier.classify("asdfghjkl")
        assert result.confidence < 0.5
        assert result.intent == "unknown"
    
    @pytest.mark.parametrize("input_text,expected_intent", [
        ("cancel my order", "order_cancellation"),
        ("where is my package", "order_tracking"),
        ("I want a refund", "refund_request"),
    ])
    def test_classify_multiple_intents(self, classifier, input_text, expected_intent):
        result = classifier.classify(input_text)
        assert result.intent == expected_intent
    
    @patch('classifier.model.predict')
    def test_model_failure_handling(self, mock_predict, classifier):
        mock_predict.side_effect = RuntimeError("Model error")
        
        with pytest.raises(ClassificationError):
            classifier.classify("test input")
```

---

## ML Engineering Pitfalls

### Pitfall 1: Offline vs Online Metric Mismatch

```python
# Problem: Model improves on test set but degrades in production

# Root causes:
# 1. Test set doesn't represent production distribution
# 2. Evaluation metric doesn't capture user satisfaction
# 3. Data leakage in evaluation

# Solution:
evaluation_strategy = {
    "offline": {
        "metrics": ["accuracy", "f1", "latency"],
        "dataset": "held_out_test_set",
        "gate": "must_beat_baseline"
    },
    "shadow": {
        "metrics": ["response_quality_llm_judge", "user_similarity"],
        "duration": "1_week",
        "traffic": "10%_shadow"
    },
    "online": {
        "metrics": ["task_completion", "csat", "escalation_rate"],
        "rollout": "canary_then_gradual",
        "rollback_trigger": "5%_degradation"
    }
}
```

### Pitfall 2: Data Leakage

```python
# ❌ Bad: Leakage through preprocessing
def prepare_data(df):
    # Fitting scaler on ALL data including test
    scaler = StandardScaler()
    df['feature'] = scaler.fit_transform(df[['feature']])
    
    train, test = train_test_split(df)
    return train, test

# ✅ Good: Fit only on training data
def prepare_data(df):
    train, test = train_test_split(df)
    
    scaler = StandardScaler()
    train['feature'] = scaler.fit_transform(train[['feature']])
    test['feature'] = scaler.transform(test[['feature']])  # Only transform
    
    return train, test, scaler
```

### Pitfall 3: Prompt Overfitting

```python
# Problem: Prompt works great on test cases, fails on real queries

# Signs of prompt overfitting:
# - Prompt includes specific examples that match test set
# - Prompt is very long and specific
# - Small prompt changes cause large quality swings

# Solution:
prompt_testing_strategy = {
    "diverse_test_set": {
        "sources": ["production_logs", "adversarial", "edge_cases"],
        "size": "500+_examples",
        "refresh": "weekly"
    },
    "ablation_testing": {
        "test": "remove_each_prompt_section",
        "measure": "quality_impact"
    },
    "robustness_testing": {
        "variations": ["typos", "rephrasing", "different_styles"],
        "threshold": "90%_same_behavior"
    }
}
```

### Pitfall 4: Ignoring Latency

```python
# Problem: Model is accurate but too slow for production

# Latency budget breakdown (target: 2s total)
latency_budget = {
    "input_processing": "50ms",
    "intent_classification": "100ms",
    "retrieval": "200ms",
    "reranking": "150ms",
    "llm_generation": "1000ms",
    "guardrails": "100ms",
    "response_formatting": "50ms",
    "buffer": "350ms"
}

# Optimization strategies:
optimizations = {
    "caching": "Cache embeddings, frequent queries",
    "batching": "Batch multiple requests where possible",
    "model_selection": "Use smaller models for simple tasks",
    "streaming": "Stream responses to reduce perceived latency",
    "async": "Parallelize independent operations",
    "early_exit": "Return early for high-confidence cases"
}
```

### Pitfall 5: Cost Blindness

```python
# Problem: Solution works but costs $10 per conversation

# Cost tracking
def track_llm_cost(func):
    def wrapper(*args, **kwargs):
        start_tokens = get_token_count()
        result = func(*args, **kwargs)
        end_tokens = get_token_count()
        
        tokens_used = end_tokens - start_tokens
        cost = calculate_cost(tokens_used)
        
        metrics.record("llm_cost", cost)
        metrics.record("tokens_used", tokens_used)
        
        return result
    return wrapper

# Cost optimization strategies
cost_strategies = {
    "prompt_compression": "Reduce prompt tokens by 30%",
    "response_limits": "Cap max_tokens appropriately",
    "model_routing": "Use GPT-3.5 for simple, GPT-4 for complex",
    "caching": "Cache responses for repeated queries",
    "batching": "Batch API calls for volume discounts"
}
```

---

## Interview Coding Checklist

### Before Coding
- [ ] Clarify inputs, outputs, and constraints
- [ ] Ask about edge cases
- [ ] Discuss approach before coding
- [ ] Confirm time/space complexity expectations

### While Coding
- [ ] Start with brute force if stuck
- [ ] Use meaningful variable names
- [ ] Handle edge cases explicitly
- [ ] Think out loud

### After Coding
- [ ] Walk through with an example
- [ ] Analyze time and space complexity
- [ ] Discuss potential optimizations
- [ ] Mention testing strategy

### Common Edge Cases
```python
edge_cases = [
    "Empty input",
    "Single element",
    "All same elements",
    "Already sorted / reverse sorted",
    "Very large input",
    "Unicode / special characters",
    "Negative numbers / zero",
    "Floating point precision",
    "Null / None values",
    "Concurrent access"
]
```
