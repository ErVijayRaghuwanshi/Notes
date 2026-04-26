# Genesys — Senior AI/ML Engineer Interview Preparation Notes

These notes are a focused, interview-ready prep pack for the Genesys Senior AI/ML Engineer (Conversational AI) role, optimized for short-cycle preparation before your interview on the 28th.

---

## 1) Role and Company Snapshot

### Genesys Context (What to internalize)
- Genesys Cloud is an AI-powered Experience Orchestration platform.
- Customer domain is enterprise conversational experience: customer service, virtual agents, voice/chat journeys, and operational efficiency.
- Scale signal from JD: global, enterprise-grade, multi-tenant expectations (7,500+ organizations, 100+ countries).

### What this role really means
This role is **not just model experimentation**. It is a **production AI platform role** requiring:
- Strong software engineering and distributed systems depth.
- Advanced conversational AI and LLM application skills.
- Ability to lead technical initiatives and influence product direction.
- Practical path from research ideas to robust shipped capabilities.
- Readiness for the transition toward **Agentic AI** in enterprise settings.

### Interview signals you should project
- “I can ship reliable AI systems at scale, not just prototypes.”
- “I reason in trade-offs: quality, latency, cost, safety, governance.”
- “I can align model capabilities with product outcomes and customer constraints.”
- “I can lead cross-functional execution with product, UX, and platform teams.”

---

## 2) JD-to-Preparation Mapping

## Responsibility → What to demonstrate

### A) Design POCs that push conversational AI boundaries
Demonstrate:
- A framework for POCs: hypothesis, offline metrics, online metric, rollout criteria.
- Ability to quickly test riskier ideas with contained blast radius.
- Example: “We prototyped retrieval-aware response generation for support intents, then gated rollout on factuality + fallback safety metrics.”

### B) Evolve virtual agent engine for complex NLU/NLG
Demonstrate:
- Conversational pipeline knowledge (intent, entity, policy, generation, fallback).
- How you handle edge cases: ambiguity, out-of-domain, interruptions, escalation.
- Confidence in production architecture + observability.

### C) Deliver roadmap toward Agentic AI
Demonstrate:
- Clear definition of “agentic” in enterprise context: planning + tool use + bounded autonomy + auditability.
- Safety constraints and approvals for high-impact actions.
- Multi-agent orchestration when useful, and when single-agent is enough.

### D) Own cross-functional technical initiatives
Demonstrate:
- Technical leadership examples: design reviews, delegation, quality standards.
- Conflict resolution style between velocity vs correctness.
- Communication that adapts for engineers, PMs, and leadership.

### E) Collaborate with product/customers/vendors
Demonstrate:
- Translating fuzzy business needs into measurable technical outcomes.
- Enterprise customer handling: SLAs, compliance concerns, configuration flexibility.

## Skill Matrix

### Must-Have (prepare deeply)
- Conversational AI/NLP in production.
- LLM application architecture (prompting, retrieval, guardrails).
- System design + distributed systems + software engineering fundamentals.
- MLOps and scalable deployment patterns.

### Good-to-Have (prepare credible depth)
- Multi-agent or tool-using architectures.
- Voice AI/multimodal experience.
- AWS deployment and operations at enterprise scale.
- Responsible AI and governance practices.

### Stretch (prepare concise talking points)
- RL for dialogue optimization.
- Publications/open-source/patents and innovation storytelling.

---

## 3) Two-Day Intensive Preparation Plan (Before 28th)

## Day 1 — Core Technical Depth + System Design

### Session 1 (2.5h): Conversational AI + LLM foundation refresh
- Review architecture patterns:
  - Classical pipeline (NLU + policy + NLG)
  - LLM-native with tool routing
  - Hybrid (intent routing + LLM for generation)
- Prepare crisp definitions:
  - Hallucination, grounding, agentic autonomy levels, guardrails.
- Output: one-page architecture comparison sheet.

### Session 2 (2h): RAG + Vector DB + evaluation
- Revise retrieval stack:
  - chunking, embedding model choice, indexing, reranking.
- Learn failure modes:
  - stale docs, semantic drift, retrieval misses, policy leaks.
- Prepare metrics:
  - recall@k, MRR, answer groundedness, citation rate.
- Output: “RAG design trade-off matrix” you can explain quickly.

### Session 3 (2h): System design drill
- Practice 2 prompts:
  1. Design enterprise virtual agent platform (multi-tenant)
  2. Design agentic assistant with tool integration and approvals
- For each, rehearse:
  - requirements → architecture → scaling → reliability → security/governance → cost.

### Session 4 (1.5h): Behavioral story shaping
- Build STAR stories for:
  - driving a hard technical initiative,
  - handling model failure in production,
  - influencing cross-functional stakeholders,
  - balancing speed vs quality.

## Day 2 — Mocking, polishing, and role-specific synthesis

### Session 1 (2h): Coding + ML engineering round prep
- Do 2 medium DSA + 1 practical backend problem.
- Practice explaining trade-offs and complexity aloud.

### Session 2 (2h): Role-focused Q&A rehearsal
- Practice high-probability questions (section 8).
- Keep answers under 2 minutes unless asked to deep dive.

### Session 3 (1.5h): Personalized project mapping
- Align your top 2-3 projects to JD bullets.
- Add measurable impact for each story.

### Session 4 (1h): Final revision and calm-down
- Read section 10 (final 60-minute revision sheet).
- Prepare interviewer questions and logistics.

---

## 4) Technical Deep-Dive Notes (Targeted)

## 4.1 Conversational AI architecture you should articulate

### Reference architecture (enterprise virtual agent)
1. **Channel layer**: voice/chat/web/messaging adapters
2. **Session/state manager**: user/session memory, context window policy
3. **NLU + routing**:
   - intent/entity models or LLM intent classifier
   - policy router (FAQ vs workflow vs human handoff)
4. **Knowledge + tools**:
   - retrieval system + enterprise connectors
   - deterministic tools (CRM lookup, ticket update)
5. **Response generation**:
   - templated response for transactional certainty
   - LLM generation for conversational flexibility
6. **Safety/guardrails**:
   - policy filters, PII redaction, action constraints
7. **Observability & learning loop**:
   - traces, latency, token cost, fallback rates, CSAT proxy metrics

### Core design choices to discuss
- Hybrid over pure LLM for reliability in enterprise workflows.
- Rule + model composition for predictable behavior.
- Explicit handoff policy to humans for unresolved/high-risk intents.

### Metrics that matter
- Task completion rate
- Containment rate (without harming satisfaction)
- Fallback/escalation rate
- First response latency and P95 latency
- Groundedness/factuality metrics
- Cost per successful conversation

---

## 4.2 LLM systems: prompting, fine-tuning, safety

### Prompt engineering (production mindset)
- Separate system instructions, tool instructions, and response policy.
- Use structured output contracts (JSON schemas) when integrating tools.
- Apply prompt versioning and A/B testing, not ad hoc edits.

### Fine-tuning vs prompt + RAG (interview trade-off)
Use **prompt + retrieval** when:
- Knowledge changes frequently.
- Need quick iteration and lower operational overhead.

Use **fine-tuning** when:
- Consistent style/format behavior is hard to achieve with prompting alone.
- You need domain behavior adaptation and stable output patterns.

### Hallucination mitigation stack
- Retrieval grounding with source constraints.
- “Answer only from provided context” policy.
- Confidence thresholds + fallback response.
- Tool-calling for factual operations.
- Output validation and policy checks.

### Safety in enterprise conversational AI
- PII detection/redaction before logging.
- Prompt injection defenses (input sanitization, tool permission boundaries).
- Restricted action execution with approvals/audit trails.
- Sensitive-domain policy enforcement (regulated scenarios).

---

## 4.3 RAG + Vector DB design choices

### Pipeline
- Ingestion: parse, clean, chunk, metadata tagging.
- Embedding: choose model balancing quality/latency/cost.
- Storage: vector index + metadata filters for tenancy and policy.
- Query: rewrite/expand query where appropriate.
- Retrieval: ANN search + metadata filters + reranking.
- Generation: contextual answer + citations.

### Key trade-offs
- Smaller chunks improve precision; larger chunks improve context continuity.
- Rich metadata enables policy filters but increases indexing complexity.
- Rerankers improve quality but add latency.
- Caching helps cost/latency but risks stale answers.

### Multi-tenant enterprise concern
- Strict tenant isolation (indexes, metadata ACLs, encrypted data paths).
- Configurable retention and deletion compliance.
- Per-tenant model/prompt policy overrides where required.

---

## 4.4 Agentic AI and multi-agent patterns

### Practical agentic architecture (safe enterprise)
- Planner: decomposes goals into steps.
- Executor: calls tools/services for each step.
- Critic/validator: checks policy, quality, and completion.
- Memory manager: stores short-term state and governed long-term memory.

### Where multi-agent helps
- Complex workflows with specialized reasoning/tool expertise.
- Separation of duties (planner vs compliance checker).

### Where it hurts
- Coordination overhead, harder debugging, latency growth, emergent failure modes.

### Enterprise guardrails for agentic systems
- Policy engine for allowed tools/actions.
- Human-in-the-loop for high-risk steps.
- Full action audit logs and replayable traces.
- Kill switch and rollback for unsafe behavior.

---

## 4.5 MLOps for AI systems at scale

### Minimum production MLOps you should mention
- Data/model/prompt versioning.
- Automated offline evaluation gates before deployment.
- Canary or shadow deployment strategies.
- Continuous monitoring for quality drift + latency + cost.
- Fast rollback mechanisms.

### Conversational AI-specific observability
- Turn-level traces (input, retrieval docs, tool calls, output).
- Latency decomposition (retrieval vs model inference vs tools).
- Quality taxonomy of failures (hallucination, policy breach, irrelevant answer).

### CI/CD perspective
- Unit tests for deterministic components.
- Integration tests for tool-calling orchestration.
- Regression sets for conversation quality.
- Policy and safety tests as release blockers.

---

## 4.6 AWS-centric deployment patterns

Potential stack to discuss (conceptual, not mandatory tooling):
- API/front door: API Gateway + service layer.
- Runtime: ECS/EKS or managed inference endpoints.
- Async orchestration: SQS/SNS/Step Functions.
- Data: S3 (documents), RDS/DynamoDB (state), vector store service.
- Observability: CloudWatch + tracing + centralized logs.
- Security: IAM least privilege, KMS encryption, VPC isolation, secrets manager.

### Interview-ready angle
Show that cloud choices are driven by:
- Latency targets,
- compliance/security constraints,
- operational simplicity,
- and cost-performance fit.

---

## 4.7 Voice AI and multimodal considerations

For voice assistant flows, mention:
- Streaming ASR/TTS latency budgets.
- Barge-in handling and interruption management.
- Error recovery for ASR uncertainty.
- Prosody and conversational naturalness vs deterministic transactional behavior.
- Escalation to human agents when confidence drops.

---

## 5) System Design Preparation

## Prompt 1: Design a global virtual agent platform

### Clarify first
- Channels, languages, expected QPS, latency SLA.
- Tenant count and isolation requirements.
- Supported use cases (FAQ, transactional, escalation).

### High-level architecture
- Edge/channel adapters → conversation orchestrator → intent/router → RAG/tool layer → response generation → guardrails → analytics.

### Scale and reliability
- Stateless orchestration services with autoscaling.
- Caching for frequent intents and retrieval results where safe.
- Regional deployment for latency and data locality.
- Graceful degradation (fallback intents, static responses, human handoff).

### Security/governance
- Tenant-isolated data access.
- PII redaction, retention controls, audit logging.
- Policy enforcement per tenant/industry.

### Success metrics
- Completion rate, containment rate, CSAT proxy, P95 latency, cost per session.

## Prompt 2: Design an agentic customer support assistant

### Key design points
- Tool catalog with permission boundaries.
- Planning/execution loop with max-step/time constraints.
- Human approval checkpoints for irreversible actions.
- Traceability of every decision for compliance.

### Failure handling
- Tool failure retry policy.
- Safe fallback to non-agentic response mode.
- Incident workflow for anomalous autonomous behavior.

---

## 6) Coding + ML Engineering Focus

## High-yield coding areas
- Hash maps + strings for text normalization/routing helpers.
- Heaps/priority queues for top-k retrieval utilities.
- Graph/DFS/BFS patterns for workflow dependency resolution.
- Sliding window/two pointers for token/stream processing tasks.

## In-round coding checklist
- Clarify assumptions and input constraints.
- Start with brute force, then optimize.
- Discuss time/space complexity.
- Handle edge cases explicitly.
- Write clean, testable Python (or chosen language).

## ML engineering pitfall talking points
- Offline metric gains not translating to online outcomes.
- Data leakage in eval sets.
- Overfitting to benchmark prompts.
- Ignoring observability until after launch.
- Underestimating costs/token budgets.

---

## 7) Behavioral and Leadership Story Bank (STAR)

Prepare 6 stories with measurable impact:

1. **End-to-end AI feature launch**
   - Focus: ownership, ambiguity handling, shipped outcome.

2. **Model failure in production**
   - Focus: incident handling, root cause, prevention mechanisms.

3. **Cross-functional influence**
   - Focus: working with PM/UX/ops to align scope and quality.

4. **Technical disagreement resolution**
   - Focus: evidence-driven decisions and relationship management.

5. **Mentoring or leading engineers**
   - Focus: code/design quality uplift and team enablement.

6. **Innovation/POC to product transition**
   - Focus: experimentation discipline and business impact.

### STAR quality checklist
- Situation: concise context.
- Task: specific responsibility.
- Action: your direct contribution and decisions.
- Result: quantified impact + lesson learned.

---

## 8) High-Probability Questions + Model Answer Frames

## 8.1 Technical

### Q1) How would you reduce hallucinations in a customer-facing bot?
Answer frame:
- Ground with retrieval + citations.
- Restrict unsupported answers via policy prompts.
- Add confidence-based fallback/handoff.
- Use tool calls for factual operations.
- Monitor hallucination categories and retrain prompts/models.

### Q2) Prompting vs fine-tuning — when do you choose what?
Answer frame:
- Start with prompt + retrieval for speed and maintainability.
- Fine-tune for stable domain behavior/style where needed.
- Choose based on change frequency, cost, and quality gaps.

### Q3) How would you evaluate conversational AI quality?
Answer frame:
- Offline: intent accuracy, retrieval recall@k, groundedness.
- Online: completion/containment, latency, escalation rate, CSAT proxies.
- Segment by intent/tenant/channel for actionable insights.

### Q4) What does agentic AI mean in enterprise production?
Answer frame:
- Goal decomposition + tool use under strict policy bounds.
- Human approvals for high-risk actions.
- Full traceability, replay, and governance controls.

### Q5) How do you design AI systems for global scale?
Answer frame:
- Regional architecture, autoscaling, async queues.
- Multi-tenant isolation and config-driven behavior.
- Observability and SLOs; optimize latency-cost-quality triangle.

## 8.2 System Design

### Q1) Design a multi-tenant LLM assistant platform
- Clarify tenant boundaries and policy needs.
- Present layered architecture and data isolation strategy.
- Explain deployment, monitoring, and failover.

### Q2) Design tool-using support agent with approvals
- Show planner-executor-validator loop.
- Define safety checks and permissioning.
- Add auditability and rollback plan.

## 8.3 Behavioral

### Q1) Tell me about a complex AI project you led.
- Pick story with cross-team complexity + measurable outcome.

### Q2) Tell me about a time your model underperformed in production.
- Emphasize detection speed, response, and systematic fixes.

### Q3) How do you handle conflicting priorities?
- Explain objective prioritization framework and communication.

### Q4) How do you influence without authority?
- Show data, prototypes, and incremental trust-building.

## 8.4 Questions you should ask interviewers
- “How do you measure success for Conversational AI initiatives in this team?”
- “What is the current architecture of the Virtual Agents engine, and what are the biggest scaling bottlenecks?”
- “How is the team approaching agentic capabilities while maintaining enterprise safety and governance?”
- “What are the expectations for this role in the first 90 days?”

---

## 9) Personalization Checklist (Very Important)

Before interview, customize these notes with your specifics:

- Add 2-3 project case studies directly relevant to:
  - conversational AI/LLM systems,
  - distributed production systems,
  - cross-functional technical leadership.
- For each project, capture:
  - problem,
  - your design decisions,
  - trade-offs,
  - measurable outcomes.
- Map your resume bullets to JD keywords:
  - conversational AI,
  - LLM + RAG,
  - MLOps,
  - scale,
  - leadership.
- Prepare one “failure + learning” story that shows maturity and ownership.

---

## 10) Final 60-Minute Revision Sheet (Day of Interview)

## Last-minute recap
- I design for **quality + reliability + safety + cost**.
- I can explain **why architecture choices were made**, not just what they are.
- I have concrete examples for **production incidents, scaling, and leadership**.
- I ask clarifying questions before solutioning.
- I communicate trade-offs clearly and confidently.

## Red flags to avoid
- Speaking only in research terms without production constraints.
- Overclaiming agentic AI without governance strategy.
- Ignoring latency/cost when discussing LLM solutions.
- Not having metrics tied to business outcomes.
- Vague behavioral answers without numbers or ownership details.

## 30-second role pitch (practice)
“I am an AI/ML engineer with strong software engineering depth who builds conversational AI systems from prototype to production. My focus is on reliable, scalable LLM applications with strong guardrails, measurable outcomes, and cross-functional execution. I am particularly excited about Genesys’s agentic AI direction and would contribute by accelerating practical, safe, enterprise-grade conversational capabilities.”

---

## Appendix A: Fast Reference — Architecture Trade-offs

- **Pure LLM agent**: high flexibility, lower predictability.
- **Rule-heavy bot**: high predictability, lower adaptability.
- **Hybrid orchestration**: balanced approach for enterprise reliability.

- **Bigger model**: better reasoning, higher cost/latency.
- **Smaller model + strong retrieval/tools**: lower cost, often enough for support tasks.

- **Single-agent**: simpler ops/debugging.
- **Multi-agent**: specialization benefits at higher complexity.

---

## Appendix B: Quick Self-Assessment (Night Before)

Rate yourself (1-5) on:
- Conversational AI architecture clarity
- LLM/RAG trade-off fluency
- Agentic AI safety/governance articulation
- System design structure and depth
- Behavioral story crispness
- Communication confidence under pressure

Any area below 3: revise corresponding section and do one focused mock answer.
