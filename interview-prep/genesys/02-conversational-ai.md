# Conversational AI — Deep Dive

## Enterprise Virtual Agent Architecture

### Reference Architecture (7 Layers)

```
┌─────────────────────────────────────────────────────────────┐
│                    1. CHANNEL LAYER                         │
│   Voice │ Chat │ Web │ SMS │ WhatsApp │ Social │ Email     │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│              2. SESSION & STATE MANAGER                     │
│   User context │ Conversation history │ Memory policy       │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                 3. NLU + ROUTING LAYER                      │
│   Intent classification │ Entity extraction │ Policy router │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│               4. KNOWLEDGE + TOOLS LAYER                    │
│   RAG retrieval │ CRM lookup │ Ticket APIs │ Calculators   │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│              5. RESPONSE GENERATION LAYER                   │
│   Template responses │ LLM generation │ Personalization    │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                6. SAFETY & GUARDRAILS                       │
│   PII redaction │ Policy filters │ Action constraints      │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│             7. OBSERVABILITY & LEARNING LOOP                │
│   Traces │ Metrics │ Feedback │ Continuous improvement     │
└─────────────────────────────────────────────────────────────┘
```

---

## NLU Pipeline (Natural Language Understanding)

### Intent Classification

**What it does**: Maps user utterance to predefined intent categories

**Approaches**:
1. **Classical ML**: TF-IDF/embeddings + classifier (SVM, Random Forest, Neural)
2. **Deep Learning**: BERT/RoBERTa fine-tuned on domain data
3. **LLM-based**: Few-shot classification with GPT-4/Claude
4. **Hybrid**: Rule-based for high-confidence patterns + ML for rest

**Key considerations**:
- **Multi-intent handling**: User says "Check my balance and transfer $100"
- **Confidence thresholds**: Below threshold → clarification or fallback
- **Out-of-scope detection**: Recognize when intent is not supported
- **Intent hierarchy**: Parent/child intents for complex domains

**Metrics**:
- Accuracy, Precision, Recall, F1 (per intent and macro)
- Confusion matrix analysis for misclassification patterns
- Out-of-scope detection rate

### Entity Extraction

**What it does**: Extracts structured information from utterances

**Entity types**:
- **Named entities**: Person, Organization, Location, Date, Time
- **Domain entities**: Account number, Product name, Order ID
- **Slot values**: Amount, Duration, Quantity

**Approaches**:
1. **Rule-based**: Regex patterns for structured entities (phone, email, dates)
2. **Sequence labeling**: BiLSTM-CRF, BERT + token classification
3. **LLM extraction**: Structured output with JSON schema
4. **Hybrid**: Rules for high-precision entities + ML for fuzzy extraction

**Challenges**:
- **Ambiguity**: "Book a flight to Paris" — Paris, Texas or Paris, France?
- **Coreference**: "Transfer $100 to him" — who is "him"?
- **Partial entities**: "My number is 555..." (incomplete)

---

## Dialogue Management

### Dialogue State Tracking (DST)

**Purpose**: Maintain conversation context across turns

**State components**:
- **Intent history**: Sequence of detected intents
- **Slot values**: Extracted and confirmed entity values
- **Dialogue acts**: System and user actions
- **Belief state**: Probability distribution over possible states

**Approaches**:
1. **Rule-based FSM**: Finite state machines for simple flows
2. **Frame-based**: Slot-filling with confirmation loops
3. **Neural DST**: TRADE, TripPy, SimpleTOD
4. **LLM-based**: Context-in-prompt with structured state output

### Policy Management

**What it does**: Decides next system action given current state

**Action types**:
- **Inform**: Provide information to user
- **Request**: Ask for missing slot values
- **Confirm**: Verify extracted information
- **Execute**: Perform backend action
- **Clarify**: Handle ambiguity
- **Escalate**: Transfer to human agent

**Policy approaches**:
1. **Rule-based**: Decision trees, business rules
2. **Supervised learning**: Learn from human agent logs
3. **Reinforcement learning**: Optimize for task completion
4. **LLM reasoning**: Chain-of-thought for complex decisions

---

## NLG Pipeline (Natural Language Generation)

### Response Generation Strategies

**1. Template-based**
```
Templates:
- "Your balance is {balance} as of {date}."
- "I've transferred {amount} to {recipient}."

Pros: Predictable, compliant, fast
Cons: Rigid, limited personalization
Use when: Transactional responses, regulated domains
```

**2. Retrieval-based**
```
Process:
1. Retrieve similar past responses
2. Rank by relevance and quality
3. Return best match or adapt

Pros: Consistent quality, uses proven responses
Cons: Limited to seen patterns
Use when: FAQ-style interactions
```

**3. LLM Generation**
```
Process:
1. Construct prompt with context, constraints, style
2. Generate response with temperature control
3. Apply post-processing and safety checks

Pros: Flexible, natural, handles novel situations
Cons: Hallucination risk, latency, cost
Use when: Open-ended conversations, personalization needed
```

**4. Hybrid Approach (Recommended for Enterprise)**
```
Decision logic:
- High-stakes/transactional → Template
- FAQ/known patterns → Retrieval
- Open-ended/complex → LLM with guardrails
```

---

## Fallback and Error Handling

### Fallback Hierarchy

```
Level 1: Clarification
  "I didn't quite understand. Did you mean X or Y?"

Level 2: Rephrasing request
  "Could you please rephrase that?"

Level 3: Guided options
  "I can help you with: A, B, or C. Which would you like?"

Level 4: Human escalation
  "Let me connect you with a specialist who can help."
```

### Error Recovery Patterns

**ASR errors (Voice)**:
- Confidence-based confirmation: "Did you say 'transfer $500'?"
- Phonetic similarity handling: "fifty" vs "fifteen"
- Spell-out mode for critical info: "Please spell your name"

**NLU errors**:
- Low confidence → clarification
- Multiple intents → disambiguation
- Out-of-scope → graceful decline + alternatives

**Backend errors**:
- Timeout → retry with backoff
- Service unavailable → apologize + offer callback
- Data not found → confirm input + suggest alternatives

---

## Production Metrics

### Conversation Quality Metrics

| Metric | Definition | Target |
|--------|------------|--------|
| **Task Completion Rate** | % of conversations achieving user goal | >85% |
| **Containment Rate** | % handled without human escalation | >70% |
| **First Contact Resolution** | % resolved in single session | >75% |
| **Fallback Rate** | % of turns hitting fallback | <10% |
| **Escalation Rate** | % transferred to human | <30% |

### User Experience Metrics

| Metric | Definition | Target |
|--------|------------|--------|
| **CSAT** | Customer satisfaction score | >4.0/5 |
| **NPS** | Net Promoter Score | >30 |
| **Conversation Length** | Avg turns to resolution | <8 |
| **Response Latency** | P95 response time | <2s |

### Technical Metrics

| Metric | Definition | Target |
|--------|------------|--------|
| **Intent Accuracy** | Correct intent classification | >90% |
| **Entity F1** | Entity extraction quality | >85% |
| **Groundedness** | Responses grounded in facts | >95% |
| **Availability** | System uptime | >99.9% |

---

## Design Trade-offs

### Pure LLM vs Hybrid Architecture

| Aspect | Pure LLM | Hybrid (Recommended) |
|--------|----------|----------------------|
| Flexibility | High | Medium |
| Predictability | Low | High |
| Compliance | Harder | Easier |
| Latency | Higher | Lower |
| Cost | Higher | Lower |
| Debugging | Harder | Easier |

### When to use what

**Use templates/rules when**:
- Regulatory compliance required
- Transactional accuracy critical
- Response must be deterministic
- Low latency essential

**Use LLM generation when**:
- Open-ended conversation needed
- Personalization important
- Novel situations expected
- User experience prioritized over cost

---

## Interview Discussion Points

### Architecture questions to expect:
1. "How would you design a virtual agent for customer support?"
2. "How do you handle multi-turn conversations?"
3. "What's your approach to fallback handling?"

### Key points to emphasize:
- Hybrid architecture for enterprise reliability
- Explicit handoff policies for high-risk scenarios
- Observability at every layer
- Continuous improvement loop from production data
