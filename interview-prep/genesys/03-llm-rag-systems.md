# LLM & RAG Systems — Deep Dive

## LLM Application Architecture

### Production LLM Stack

```
┌─────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                       │
│   Conversation orchestrator │ Workflow engine │ UI/API      │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                     ORCHESTRATION LAYER                      │
│   Prompt management │ Chain/Agent logic │ Memory management │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                      RETRIEVAL LAYER                         │
│   Query processing │ Vector search │ Reranking │ Filtering  │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                       MODEL LAYER                            │
│   LLM inference │ Embedding models │ Reranker models        │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE LAYER                      │
│   Vector DB │ Cache │ Model serving │ Monitoring            │
└─────────────────────────────────────────────────────────────┘
```

---

## Prompt Engineering (Production Mindset)

### Prompt Structure Best Practices

```
┌─────────────────────────────────────────┐
│           SYSTEM INSTRUCTIONS           │
│  Role, persona, constraints, format     │
├─────────────────────────────────────────┤
│           CONTEXT / KNOWLEDGE           │
│  Retrieved docs, conversation history   │
├─────────────────────────────────────────┤
│           TOOL INSTRUCTIONS             │
│  Available tools, when/how to use them  │
├─────────────────────────────────────────┤
│           RESPONSE POLICY               │
│  Safety rules, what NOT to do           │
├─────────────────────────────────────────┤
│              USER INPUT                 │
│  Current user message                   │
└─────────────────────────────────────────┘
```

### Prompting Techniques

**1. Zero-shot**
```
Classify the following customer message into one of these intents:
[billing, technical_support, sales, general_inquiry]

Message: "My internet has been slow for the past week"
Intent:
```

**2. Few-shot**
```
Classify customer messages:

Message: "I want to cancel my subscription" → Intent: billing
Message: "How do I reset my password?" → Intent: technical_support
Message: "What plans do you offer?" → Intent: sales

Message: "My internet has been slow for the past week"
Intent:
```

**3. Chain-of-Thought (CoT)**
```
Analyze this customer issue step by step:
1. Identify the core problem
2. Determine required information
3. Suggest resolution approach

Customer: "I was charged twice for my order #12345"
Analysis:
```

**4. ReAct (Reasoning + Acting)**
```
You have access to these tools: [order_lookup, refund_process, escalate]

Customer: "I was charged twice for order #12345"

Think: I need to verify the duplicate charge
Action: order_lookup(order_id="12345")
Observation: [Order found, single charge of $50]
Think: Customer claims duplicate, need to check payment history...
```

### Prompt Versioning & Management

**Best practices**:
- Version control all prompts (Git)
- A/B test prompt changes
- Track prompt → output quality metrics
- Separate prompts from code (config-driven)
- Environment-specific prompts (dev/staging/prod)

---

## Fine-tuning vs Prompting Decision Framework

### When to use Prompt + RAG

| Scenario | Why |
|----------|-----|
| Knowledge changes frequently | No retraining needed |
| Quick iteration required | Instant prompt updates |
| Limited training data | Few-shot works well |
| Cost sensitivity | No training compute |
| Multiple domains | Single model, different prompts |

### When to Fine-tune

| Scenario | Why |
|----------|-----|
| Consistent style/format needed | Hard to achieve with prompts |
| Domain-specific terminology | Model learns vocabulary |
| Latency critical | Shorter prompts possible |
| Proprietary behavior | Can't be replicated via prompts |
| High volume, cost optimization | Smaller fine-tuned model cheaper |

### Fine-tuning Approaches

**1. Full Fine-tuning**
- Update all model weights
- Requires significant compute
- Risk of catastrophic forgetting
- Best for major domain shifts

**2. LoRA (Low-Rank Adaptation)**
- Train small adapter layers
- Much lower compute cost
- Preserves base model capabilities
- Good for style/format adaptation

**3. RLHF (Reinforcement Learning from Human Feedback)**
- Align model with human preferences
- Requires reward model + PPO training
- Best for safety and helpfulness
- Complex pipeline to maintain

**4. DPO (Direct Preference Optimization)**
- Simpler alternative to RLHF
- Direct optimization on preference pairs
- Lower compute than RLHF
- Good for preference alignment

---

## RAG Architecture Deep Dive

### End-to-End RAG Pipeline

```
INGESTION PIPELINE
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│  Load   │ → │  Parse  │ → │  Chunk  │ → │  Embed  │ → │  Index  │
│  Docs   │   │  & Clean│   │  Text   │   │  Chunks │   │  Store  │
└─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘

QUERY PIPELINE
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│  Query  │ → │  Query  │ → │  Vector │ → │ Rerank  │ → │ Generate│
│  Input  │   │  Process│   │  Search │   │ Filter  │   │ Response│
└─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘
```

### Chunking Strategies

**1. Fixed-size chunking**
```python
chunk_size = 512  # tokens
overlap = 50      # tokens

Pros: Simple, predictable
Cons: May split semantic units
Use when: Uniform document structure
```

**2. Semantic chunking**
```python
# Split on natural boundaries
- Paragraphs
- Sections (headers)
- Sentences with embedding similarity

Pros: Preserves meaning
Cons: Variable chunk sizes
Use when: Structured documents
```

**3. Recursive chunking**
```python
# Try larger units first, fall back to smaller
separators = ["\n\n", "\n", ". ", " "]

Pros: Balances size and semantics
Cons: More complex logic
Use when: Mixed document types
```

**4. Document-specific chunking**
```python
# Different strategies per doc type
- Code: Function/class level
- Legal: Clause/section level
- FAQ: Question-answer pairs
- Tables: Row or cell level
```

### Embedding Model Selection

| Model | Dimensions | Speed | Quality | Use Case |
|-------|------------|-------|---------|----------|
| OpenAI text-embedding-3-small | 1536 | Fast | Good | General purpose |
| OpenAI text-embedding-3-large | 3072 | Medium | Best | High accuracy needs |
| Cohere embed-v3 | 1024 | Fast | Good | Multilingual |
| BGE-large | 1024 | Medium | Good | Open-source option |
| E5-large-v2 | 1024 | Medium | Good | Instruction-tuned |

**Selection criteria**:
- Latency requirements
- Multilingual needs
- Domain specificity
- Cost constraints
- Open-source vs API preference

### Vector Database Options

| Database | Type | Strengths | Considerations |
|----------|------|-----------|----------------|
| **Pinecone** | Managed | Easy scaling, metadata filtering | Cost at scale |
| **Weaviate** | Open/Managed | Hybrid search, GraphQL | Complexity |
| **Qdrant** | Open/Managed | Performance, filtering | Newer ecosystem |
| **Milvus** | Open-source | Scale, GPU support | Operational overhead |
| **pgvector** | Postgres ext | Familiar, transactional | Scale limits |
| **Chroma** | Open-source | Simple, local dev | Not for production scale |

### Retrieval Optimization

**1. Query Expansion**
```python
# Original: "slow internet"
# Expanded: "slow internet" OR "network latency" OR "bandwidth issues"

Techniques:
- Synonym expansion
- LLM-based query rewriting
- Historical query patterns
```

**2. Hybrid Search**
```python
# Combine dense (semantic) + sparse (keyword) retrieval
score = α * dense_score + (1-α) * sparse_score

# BM25 for keyword matching
# Vector search for semantic similarity
```

**3. Reranking**
```python
# Two-stage retrieval
1. Fast retrieval: Get top-100 candidates
2. Rerank: Cross-encoder scores top-100 → top-10

Models: Cohere Rerank, BGE-reranker, cross-encoders
```

**4. Metadata Filtering**
```python
# Filter before or during search
filters = {
    "tenant_id": "customer_123",
    "doc_type": "policy",
    "updated_after": "2024-01-01"
}
```

---

## Hallucination Mitigation

### Types of Hallucinations

| Type | Description | Example |
|------|-------------|---------|
| **Factual** | Incorrect facts | "The company was founded in 1985" (wrong year) |
| **Fabrication** | Made-up information | Citing non-existent policies |
| **Inconsistency** | Contradicting context | Saying "yes" then "no" to same question |
| **Extrapolation** | Going beyond source | Adding details not in retrieved docs |

### Mitigation Stack

**1. Retrieval Grounding**
```
- Only answer from retrieved context
- Include source citations
- "Based on [Document X]..."
```

**2. Prompt Constraints**
```
System prompt additions:
- "Only use information from the provided context"
- "If information is not available, say 'I don't have that information'"
- "Never make up facts, policies, or procedures"
```

**3. Confidence-based Fallback**
```python
if model_confidence < threshold:
    return "I'm not certain about this. Let me connect you with a specialist."
```

**4. Output Validation**
```python
# Post-generation checks
- Fact extraction + verification against source
- Consistency check with conversation history
- Policy compliance validation
```

**5. Tool-calling for Facts**
```
Instead of: "Your balance is $500" (hallucination risk)
Use: call get_balance(account_id) → return actual value
```

### Evaluation Metrics

| Metric | What it measures | How to compute |
|--------|------------------|----------------|
| **Groundedness** | Response supported by context | NLI model or LLM judge |
| **Faithfulness** | No contradictions to source | Claim extraction + verification |
| **Answer Relevance** | Response addresses question | Semantic similarity |
| **Context Relevance** | Retrieved docs are relevant | Precision of retrieval |

---

## RAG Evaluation Framework

### Offline Metrics

```python
# Retrieval Quality
- Recall@K: % of relevant docs in top-K
- MRR: Mean Reciprocal Rank
- NDCG: Normalized Discounted Cumulative Gain

# Generation Quality
- BLEU, ROUGE: N-gram overlap (limited usefulness)
- BERTScore: Semantic similarity
- Groundedness: % claims supported by context
- Answer correctness: LLM-as-judge evaluation
```

### Online Metrics

```python
# User signals
- Click-through on citations
- Follow-up questions (confusion signal)
- Explicit feedback (thumbs up/down)
- Escalation rate

# System signals
- Latency (retrieval + generation)
- Token usage / cost
- Cache hit rate
```

### Evaluation Dataset Creation

```python
# Golden dataset structure
{
    "query": "What is the return policy?",
    "relevant_docs": ["doc_123", "doc_456"],
    "expected_answer": "30-day return policy...",
    "answer_type": "factual",
    "difficulty": "easy"
}

# Create diverse test cases:
- Simple factual questions
- Multi-hop reasoning
- Ambiguous queries
- Out-of-scope queries
- Adversarial inputs
```

---

## Production Considerations

### Multi-tenant RAG

```
Isolation requirements:
- Separate vector indexes per tenant (strongest)
- Shared index with tenant_id metadata filter (efficient)
- Hybrid: Shared common knowledge + tenant-specific indexes

Security:
- Encrypt embeddings at rest
- Tenant-scoped API keys
- Audit logging for all retrievals
```

### Cost Optimization

```
Strategies:
- Cache frequent queries and responses
- Use smaller embedding models where quality allows
- Batch embedding requests
- Tiered retrieval (cheap first, expensive rerank)
- Token-aware chunking to minimize generation costs
```

### Latency Optimization

```
Targets: P50 < 500ms, P95 < 2s

Techniques:
- Pre-compute embeddings (not at query time)
- Use approximate nearest neighbor (ANN) search
- Limit retrieved chunks (quality vs speed)
- Stream responses to user
- Cache hot queries
```
