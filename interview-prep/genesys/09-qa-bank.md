# Question & Answer Bank — High-Probability Interview Questions

## Technical Questions

### Q1: How would you reduce hallucinations in a customer-facing bot?

**Model Answer:**
```
Multi-layered approach:

1. RETRIEVAL GROUNDING
   - RAG to ground responses in verified knowledge
   - Include source citations
   - Restrict LLM to only use provided context

2. PROMPT ENGINEERING
   - "Only answer based on provided context"
   - "If unsure, say 'I don't have that information'"
   - Structured output format

3. CONFIDENCE-BASED FALLBACK
   - Confidence scoring on responses
   - Below threshold → clarify or escalate
   - Track calibration over time

4. TOOL-CALLING FOR FACTS
   - Call APIs instead of generating facts
   - "Your balance is $X" → call get_balance() API

5. OUTPUT VALIDATION
   - Post-generation fact checking
   - Policy compliance validation
   - Consistency check with history

6. MONITORING
   - Track hallucination categories
   - User feedback signals
   - Regular golden dataset evaluation

Target: >95% groundedness for customer-facing responses.
```

---

### Q2: When would you fine-tune vs use prompting + RAG?

**Model Answer:**
```
USE PROMPTING + RAG WHEN:
- Knowledge changes frequently
- Need quick iteration
- Limited training data
- Multiple domains, shared model
- Cost sensitivity
- Explainability important

USE FINE-TUNING WHEN:
- Consistent style/format hard to prompt
- Domain-specific terminology
- Latency critical (shorter prompts)
- High volume justifies training cost
- Proprietary behavior needed

HYBRID (OFTEN BEST):
- Fine-tune for domain adaptation/style
- RAG for dynamic knowledge
- Example: Fine-tuned tone + RAG for product info
```

---

### Q3: How would you evaluate conversational AI quality?

**Model Answer:**
```
OFFLINE METRICS:
- NLU: Intent accuracy, Entity F1, OOS detection
- Retrieval: Recall@K, MRR, NDCG
- Generation: Groundedness, relevance, fluency

ONLINE METRICS:
- Task: Completion rate, containment, FCR
- UX: CSAT, conversation length, abandonment
- Ops: Escalation rate, fallback rate, latency

SEGMENTATION:
- By intent, channel, tenant, time

CONTINUOUS:
- Daily golden set runs
- A/B testing
- Weekly human evaluation
- Drift detection
```

---

### Q4: What does agentic AI mean in enterprise production?

**Model Answer:**
```
DEFINITION:
AI that can plan, execute actions via tools, observe results, 
and adapt—with BOUNDED autonomy within guardrails.

ENTERPRISE REQUIREMENTS:

1. SAFETY CONSTRAINTS
   - Policy engine for allowed actions
   - Risk-based classification
   - Human approval for high-impact
   - Kill switch capability

2. AUDITABILITY
   - Full decision traces
   - Replayable sequences
   - Compliance reporting

3. BOUNDED AUTONOMY
   - Clear scope (what agent CAN'T do)
   - Max steps/time constraints
   - Escalation triggers
   - Graceful degradation

4. GOVERNANCE
   - Approval workflows
   - Rate limiting
   - Tenant-specific policies

EXAMPLE:
- Order lookup → autonomous (low risk)
- Modify address → autonomous with rules (medium)
- Process refund >$100 → requires approval (high)
- Cancel account → always human (critical)
```

---

### Q5: How do you design AI systems for global scale?

**Model Answer:**
```
1. REGIONAL DEPLOYMENT
   - Multi-region (US, EU, APAC)
   - GeoDNS routing
   - Data residency compliance

2. STATELESS SERVICES
   - State in distributed cache/DB
   - Horizontal scaling
   - Simple failover

3. MULTI-TENANT ISOLATION
   - Tenant-scoped data
   - Per-tenant rate limits
   - Config-driven behavior

4. ASYNC PROCESSING
   - Queue-based for non-real-time
   - Event-driven
   - Backpressure handling

5. CACHING
   - Edge, application, response caches
   - Embedding cache for retrieval

6. OBSERVABILITY
   - Distributed tracing
   - Per-tenant metrics
   - SLO alerting
```

---

### Q6: How do you handle model drift?

**Model Answer:**
```
DRIFT TYPES:
1. Data drift: Input distribution changes
2. Concept drift: Relationship between input/output changes
3. Label drift: Target distribution changes

DETECTION:
- Statistical tests (KS, PSI) on features
- Accuracy monitoring on labeled samples
- Embedding space monitoring

RESPONSE:
- Automated alerts on threshold breach
- Increased human evaluation
- Retraining pipeline trigger
- Rollback if severe

PREVENTION:
- Diverse training data
- Regular retraining schedule
- Continuous evaluation
```

---

## System Design Questions

### Q7: Design a multi-tenant LLM assistant platform

**Key Points:**
```
1. CLARIFY
   - Tenant count, isolation needs
   - Latency SLA, QPS
   - Compliance requirements

2. ARCHITECTURE
   - Channel gateway → Orchestrator → NLU/RAG/Tools → Guardrails
   - Stateless orchestration
   - Tenant-isolated data layer

3. MULTI-TENANCY
   - Config-driven behavior per tenant
   - Data isolation (separate indexes or metadata filtering)
   - Per-tenant rate limits and quotas

4. SCALE
   - Horizontal scaling on orchestration
   - Caching strategy
   - Regional deployment

5. RELIABILITY
   - Graceful degradation levels
   - Circuit breakers
   - Fast rollback
```

---

### Q8: Design tool-using support agent with approvals

**Key Points:**
```
1. AGENT ARCHITECTURE
   - Planner → Executor → Validator loop
   - Tool catalog with risk levels
   - Memory management

2. APPROVAL WORKFLOW
   - Risk assessment on each action
   - Auto-approve low risk
   - Queue medium risk for supervisor
   - Escalate high risk to human

3. SAFETY
   - Policy engine
   - Action constraints
   - Full audit logging
   - Kill switch

4. FAILURE HANDLING
   - Tool retry with backoff
   - Graceful fallback to non-agentic
   - Human escalation path
```

---

## Behavioral Questions

### Q9: Tell me about a complex AI project you led.

**Answer Framework:**
```
SITUATION: [Project context, scale, challenge]
TASK: [Your specific responsibility]
ACTION:
- How you scoped the problem
- Technical decisions you made
- How you handled obstacles
- Cross-functional collaboration
RESULT: [Quantified impact, learnings]
```

---

### Q10: Tell me about a production model failure.

**Answer Framework:**
```
SITUATION: [What failed, impact]
TASK: [Your role in resolution]
ACTION:
- How you detected/diagnosed
- Immediate mitigation
- Root cause analysis
- Long-term fix
RESULT: [Resolution time, prevention measures]
```

---

### Q11: How do you handle conflicting priorities?

**Answer Framework:**
```
- Clarify impact and urgency of each
- Align with stakeholders on criteria
- Make data-driven tradeoffs
- Communicate decisions clearly
- Example: [Specific situation]
```

---

### Q12: How do you influence without authority?

**Answer Framework:**
```
- Build credibility through expertise
- Use data and prototypes
- Find common ground
- Incremental trust building
- Example: [Specific situation]
```

---

## Questions to Ask Interviewers

### About the Role
1. "What does success look like for this role in the first 90 days?"
2. "What are the biggest technical challenges the team is facing?"
3. "How do you measure success for Conversational AI initiatives?"

### About the Team
4. "What's the team structure and how does this role fit in?"
5. "How does the team balance research exploration vs production delivery?"
6. "What's the collaboration model with product and UX?"

### About Technology
7. "What's the current architecture of the Virtual Agents engine?"
8. "How is the team approaching agentic capabilities while maintaining safety?"
9. "What's the tech stack for ML infrastructure?"

### About Culture
10. "How does Genesys support engineering growth and learning?"
11. "What do you enjoy most about working here?"
12. "What's the biggest change you'd like to see in the team?"
