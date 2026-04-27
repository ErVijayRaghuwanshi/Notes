# Final Revision Sheet — Interview Day

## 60-Minute Pre-Interview Checklist

### Mindset (5 min)
- [ ] I design for **quality + reliability + safety + cost**
- [ ] I explain **why** choices were made, not just what
- [ ] I have concrete examples for **production, scale, leadership**
- [ ] I ask clarifying questions before solutioning
- [ ] I communicate trade-offs clearly and confidently

---

## Quick Technical Recap (20 min)

### Conversational AI Architecture
```
Channel → Session Manager → NLU/Router → RAG/Tools → Generation → Guardrails → Response
```
- Hybrid architecture for enterprise reliability
- Explicit handoff for high-risk scenarios
- Observability at every layer

### LLM/RAG Key Points
- **Prompting**: System instructions + context + tools + policy + user input
- **RAG**: Chunk → Embed → Index → Retrieve → Rerank → Generate
- **Hallucination**: Ground with retrieval, confidence fallback, tool-calling for facts
- **Fine-tune vs RAG**: RAG for dynamic knowledge, fine-tune for stable style

### Agentic AI
- **Pattern**: Plan → Execute → Validate loop
- **Enterprise**: Bounded autonomy + approval workflows + full audit
- **Safety**: Policy engine, human-in-loop for high-risk, kill switch

### MLOps
- Version everything (code, data, models, prompts)
- Canary/shadow deployment
- Monitor: quality, latency, cost, drift
- Fast rollback capability

### System Design Framework
```
Requirements → Estimation → High-Level Design → Deep Dive → Scale/Reliability → Security
```

---

## Key Metrics to Remember (5 min)

| Metric | Target | What It Measures |
|--------|--------|------------------|
| Task Completion | >85% | User goals achieved |
| Containment | >70% | No human needed |
| Intent Accuracy | >90% | NLU quality |
| Groundedness | >95% | No hallucination |
| P95 Latency | <2s | Response speed |
| Availability | >99.9% | System uptime |

---

## STAR Stories Ready (10 min)

Review your prepared stories:

1. **AI Feature Launch** — ownership, shipped outcome
2. **Production Failure** — incident handling, prevention
3. **Cross-Functional** — PM/UX collaboration
4. **Technical Disagreement** — evidence-driven resolution
5. **Mentoring** — quality uplift
6. **Innovation** — POC to product

**For each, remember:**
- Specific numbers and outcomes
- YOUR contribution (not "we")
- What you learned

---

## Red Flags to Avoid (5 min)

### Technical
- ❌ Speaking only in research terms without production constraints
- ❌ Overclaiming agentic AI without governance strategy
- ❌ Ignoring latency/cost when discussing LLM solutions
- ❌ Not having metrics tied to business outcomes
- ❌ Jumping to solution without clarifying requirements

### Behavioral
- ❌ Vague answers without numbers or ownership
- ❌ Blaming others for failures
- ❌ Not using STAR structure
- ❌ Rambling beyond 2 minutes

### System Design
- ❌ Skipping requirements clarification
- ❌ Ignoring non-functional requirements
- ❌ Over-engineering for small scale
- ❌ Forgetting failure scenarios

---

## 30-Second Role Pitch (Practice Aloud)

> "I'm an AI/ML engineer with strong software engineering depth who builds conversational AI systems from prototype to production. My focus is on reliable, scalable LLM applications with strong guardrails, measurable outcomes, and cross-functional execution. I'm particularly excited about Genesys's agentic AI direction and would contribute by accelerating practical, safe, enterprise-grade conversational capabilities."

---

## Questions for Interviewers (5 min)

Pick 2-3 based on interviewer role:

**For Engineering Manager:**
- "What does success look like in the first 90 days?"
- "What are the biggest technical challenges?"

**For Technical Lead:**
- "What's the current Virtual Agents architecture?"
- "How are you approaching agentic AI safety?"

**For Product:**
- "How do you measure Conversational AI success?"
- "What's the collaboration model with engineering?"

---

## Final 10 Minutes Before Interview

- [ ] Water nearby
- [ ] Quiet environment confirmed
- [ ] Notes accessible but not distracting
- [ ] Camera/mic tested
- [ ] Deep breath — you're prepared

---

## Quick Self-Assessment

Rate yourself 1-5:

| Area | Score | If <3, Review |
|------|-------|---------------|
| Conversational AI architecture | | Section 02 |
| LLM/RAG trade-offs | | Section 03 |
| Agentic AI + safety | | Section 04 |
| System design structure | | Section 06 |
| Behavioral stories | | Section 08 |
| Communication confidence | | Practice aloud |

---

## Emergency Phrases

**If you don't know something:**
> "I haven't worked directly with that, but based on my understanding of [related area], I would approach it by..."

**If you need time to think:**
> "That's a great question. Let me think through this for a moment..."

**If you made a mistake:**
> "Actually, let me correct that. What I meant was..."

**If question is unclear:**
> "Just to make sure I understand correctly, are you asking about X or Y?"

---

## Good Luck! 🎯

Remember:
- They want you to succeed
- It's a conversation, not an interrogation
- Show your thinking process
- Be yourself — they're evaluating culture fit too
