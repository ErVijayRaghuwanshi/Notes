# Behavioral Interview — Preparation Guide

## STAR Framework

### Structure
```
S - SITUATION: Set the context (1-2 sentences)
    - When and where?
    - What was the project/team?
    - What was the challenge?

T - TASK: Your specific responsibility (1 sentence)
    - What were YOU responsible for?
    - What was the goal?

A - ACTION: What YOU did (bulk of answer - 3-5 sentences)
    - Specific steps you took
    - Decisions you made
    - How you influenced others
    - Technical details where relevant

R - RESULT: Quantified outcome (1-2 sentences)
    - Measurable impact
    - What you learned
    - What you'd do differently
```

### Quality Checklist
- [ ] Focuses on YOUR contribution, not team's
- [ ] Includes specific technical details
- [ ] Has quantified results (numbers, percentages)
- [ ] Shows learning or growth
- [ ] Under 2 minutes (unless asked to elaborate)

---

## Story Templates (Customize with Your Experience)

### Story 1: End-to-End AI Feature Launch

**Theme**: Ownership, ambiguity handling, shipped outcome

```
SITUATION:
"At [Company], our customer support team was handling 50K+ tickets/month 
with 4-hour average response time. Leadership wanted to explore AI automation 
but had no clear requirements or success criteria."

TASK:
"I was tasked with leading the technical design and implementation of an 
AI-powered ticket classification and routing system."

ACTION:
"First, I analyzed 3 months of ticket data to identify patterns and 
defined success metrics with stakeholders: 80% classification accuracy, 
30% reduction in response time.

I designed a hybrid architecture: BERT-based classifier for intent 
detection, rule-based routing for high-confidence cases, and human 
escalation for edge cases.

I built the MVP in 4 weeks, ran shadow testing for 2 weeks to validate 
accuracy, then rolled out gradually with a kill switch.

When we hit 70% accuracy initially, I analyzed failure cases, added 
domain-specific training data, and implemented confidence thresholds 
that improved accuracy to 85%."

RESULT:
"We achieved 85% classification accuracy, reduced average response time 
by 40% (4 hours to 2.4 hours), and the system now handles 60% of tickets 
without human intervention. I learned the importance of defining clear 
metrics upfront and building in observability from day one."
```

### Story 2: Production Model Failure

**Theme**: Incident handling, root cause analysis, prevention

```
SITUATION:
"Our production NLU model started showing degraded performance—intent 
accuracy dropped from 92% to 75% over a weekend. Customer complaints 
increased 3x."

TASK:
"As the on-call ML engineer, I was responsible for diagnosing the issue 
and restoring service quality."

ACTION:
"I immediately checked our monitoring dashboards and noticed the accuracy 
drop correlated with a traffic spike from a new marketing campaign.

I analyzed the failing queries and found they contained product names 
from a new product line that wasn't in our training data—a distribution 
shift.

For immediate mitigation, I lowered confidence thresholds to route more 
queries to human agents, reducing customer impact within 2 hours.

For the fix, I collected 500 labeled examples of the new product queries, 
fine-tuned the model, and deployed within 48 hours.

I then implemented automated drift detection that alerts when input 
distribution shifts beyond a threshold."

RESULT:
"We restored accuracy to 91% within 48 hours. The drift detection system 
has since caught 3 similar issues before they impacted customers. I learned 
to always monitor input distribution, not just output metrics."
```

### Story 3: Cross-Functional Influence

**Theme**: Working with PM/UX/Ops, stakeholder alignment

```
SITUATION:
"Product wanted to launch a new AI feature that would auto-respond to 
customer queries. UX had concerns about user trust, and Ops worried 
about handling edge cases."

TASK:
"I needed to find a technical solution that addressed all stakeholders' 
concerns while delivering the product goal."

ACTION:
"I organized a design review with all stakeholders to understand their 
specific concerns:
- Product: Time to market, feature completeness
- UX: User trust, transparency about AI
- Ops: Escalation paths, monitoring

I proposed a phased approach:
1. Phase 1: AI suggests responses, human approves (builds trust)
2. Phase 2: Auto-respond for high-confidence, human for rest
3. Phase 3: Full automation with human oversight

I created a prototype showing the UX flow with clear AI disclosure 
and easy human escalation button.

I built dashboards showing real-time accuracy and escalation rates 
to address Ops concerns."

RESULT:
"All stakeholders aligned on the phased approach. Phase 1 launched in 
6 weeks instead of the original 12-week full automation plan. User 
trust scores remained stable, and we reached Phase 3 within 4 months. 
I learned that showing, not telling, is the best way to build alignment."
```

### Story 4: Technical Disagreement Resolution

**Theme**: Evidence-driven decisions, relationship management

```
SITUATION:
"A senior engineer on my team strongly advocated for fine-tuning a 
custom LLM for our use case. I believed RAG with a base model would 
be more maintainable and cost-effective."

TASK:
"I needed to resolve this disagreement constructively while ensuring 
we made the right technical decision."

ACTION:
"Instead of debating opinions, I proposed we run a structured evaluation:
- Define success criteria together (accuracy, latency, cost, maintainability)
- Build minimal prototypes of both approaches
- Evaluate on the same test set

I built the RAG prototype; they built the fine-tuned version. We spent 
2 weeks on this.

Results showed:
- Fine-tuned: 88% accuracy, $0.002/query, 6-week update cycle
- RAG: 85% accuracy, $0.005/query, same-day updates

I acknowledged the accuracy advantage of fine-tuning but highlighted 
that our knowledge base changes weekly, making RAG's update speed 
critical.

We agreed on RAG for the initial launch with a plan to revisit 
fine-tuning for stable, high-volume intents."

RESULT:
"We launched with RAG and achieved 86% accuracy in production. The 
other engineer later thanked me for the structured approach. We've 
since collaborated on several projects. I learned that data beats 
opinions and that framing disagreements as experiments preserves 
relationships."
```

### Story 5: Mentoring / Leading Engineers

**Theme**: Code/design quality uplift, team enablement

```
SITUATION:
"I joined a team where ML code quality was inconsistent—no tests, 
no documentation, frequent production issues from code changes."

TASK:
"As the senior engineer, I was responsible for improving code quality 
and engineering practices."

ACTION:
"I started by understanding the team's constraints—tight deadlines, 
no formal training on ML engineering practices.

I introduced changes incrementally:
1. Week 1-2: Added pre-commit hooks for linting, created PR template
2. Week 3-4: Wrote testing guide with examples, paired with each 
   engineer to add tests to their code
3. Month 2: Introduced design doc template for new features
4. Month 3: Set up CI/CD pipeline with automated testing

I made sure to celebrate wins—highlighted good PRs in team meetings, 
created a 'quality champion' rotation.

I also documented common patterns and anti-patterns in a team wiki."

RESULT:
"Test coverage went from 15% to 70% in 3 months. Production incidents 
from code changes dropped by 60%. Two junior engineers have since 
led their own feature launches with high-quality code. I learned that 
sustainable change requires both systems (CI/CD) and culture (recognition)."
```

### Story 6: Innovation / POC to Product

**Theme**: Experimentation discipline, business impact

```
SITUATION:
"I noticed our support agents spent 30% of their time searching for 
information across multiple knowledge bases. I hypothesized that a 
RAG-based assistant could help."

TASK:
"I wanted to validate this idea and, if successful, get it prioritized 
on the product roadmap."

ACTION:
"I spent 2 weekends building a quick prototype using LangChain and 
our existing knowledge base.

I demoed it to 5 support agents and collected feedback:
- 4/5 found it useful
- Key request: Show source documents for verification

I refined the prototype to include citations and measured time savings 
in a 1-week pilot with 10 agents.

I then created a business case:
- 25% reduction in search time
- Projected $200K/year savings
- 4-week development estimate

I presented to product leadership with the prototype demo and data."

RESULT:
"The project was prioritized for Q2. We launched in 6 weeks (I led 
the technical implementation). Support agents now use it for 70% of 
queries, and we've measured 30% reduction in average handle time. 
I learned that showing a working prototype with real user feedback 
is more persuasive than any slide deck."
```

---

## Common Behavioral Questions

### Leadership & Ownership
1. "Tell me about a project you led from start to finish."
2. "Describe a time you took ownership beyond your job description."
3. "How do you prioritize when everything is urgent?"

### Problem Solving
4. "Tell me about the most complex technical problem you've solved."
5. "Describe a time you had to make a decision with incomplete information."
6. "How do you approach debugging a production issue?"

### Collaboration
7. "Tell me about a time you had to work with a difficult colleague."
8. "How do you handle disagreements with your manager?"
9. "Describe a successful cross-functional project."

### Failure & Learning
10. "Tell me about a time you failed."
11. "What's the biggest mistake you've made in your career?"
12. "Describe a time you received critical feedback."

### Innovation
13. "Tell me about a time you improved a process or system."
14. "How do you stay current with new technologies?"
15. "Describe a time you proposed a new idea."

---

## Answer Quality Tips

### Do's
- **Be specific**: Names, numbers, dates, technologies
- **Own your contribution**: "I did X" not "We did X"
- **Quantify results**: "Reduced latency by 40%" not "Made it faster"
- **Show learning**: "I learned that..." or "Next time I would..."
- **Be concise**: 2 minutes max unless asked to elaborate

### Don'ts
- **Don't be vague**: "I worked on a big project" → specify
- **Don't blame others**: Even if they were at fault
- **Don't ramble**: Stick to STAR structure
- **Don't lie**: Interviewers can tell, and they check references
- **Don't be negative**: Focus on solutions, not complaints

---

## Genesys-Specific Behavioral Themes

Based on the JD, prepare stories that demonstrate:

1. **Innovation in AI/ML**: POCs, research-to-production
2. **Production systems ownership**: Scale, reliability, incidents
3. **Cross-functional leadership**: Product, UX, customers
4. **Technical influence**: Design reviews, mentoring, standards
5. **Customer focus**: Enterprise needs, SLAs, compliance

### Questions They Might Ask
- "How do you balance innovation with production stability?"
- "Tell me about a time you translated research into a shipped product."
- "How do you handle customer requirements that conflict with technical best practices?"
- "Describe your experience leading technical initiatives across teams."
