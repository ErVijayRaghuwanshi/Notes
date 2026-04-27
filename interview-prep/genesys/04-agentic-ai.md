# Agentic AI — Deep Dive

## What is Agentic AI?

### Definition for Enterprise Context
Agentic AI refers to AI systems that can:
- **Plan**: Decompose goals into actionable steps
- **Execute**: Take actions via tools and APIs
- **Observe**: Process results and environment feedback
- **Adapt**: Adjust plans based on outcomes
- **Operate with bounded autonomy**: Within defined guardrails

### Autonomy Levels

| Level | Description | Example | Enterprise Readiness |
|-------|-------------|---------|---------------------|
| **L0** | No autonomy | Chatbot with scripted responses | Production ready |
| **L1** | Assisted | LLM suggests, human executes | Production ready |
| **L2** | Partial | Agent executes low-risk actions | Production ready |
| **L3** | Conditional | Agent executes with approval gates | Emerging |
| **L4** | High | Agent operates independently in scope | Research/Limited |
| **L5** | Full | Fully autonomous decision-making | Not enterprise-ready |

**Genesys context**: Likely targeting L2-L3 for customer support agents

---

## Agentic Architecture Patterns

### Pattern 1: ReAct (Reasoning + Acting)

```
┌─────────────────────────────────────────┐
│              USER GOAL                  │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│              THINK                      │
│  "I need to check the order status"     │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│              ACT                        │
│  call order_lookup(order_id="12345")    │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│              OBSERVE                    │
│  Order status: "Shipped, arriving 4/28" │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│              THINK                      │
│  "I have the info, can respond now"     │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│              RESPOND                    │
│  "Your order is shipped, arriving 4/28" │
└─────────────────────────────────────────┘
```

### Pattern 2: Plan-Execute-Validate

```
┌─────────────────────────────────────────┐
│              PLANNER                    │
│  Decomposes goal into step sequence     │
│  Output: [step1, step2, step3]          │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│              EXECUTOR                   │
│  Executes each step via tools           │
│  Handles errors and retries             │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│              VALIDATOR                  │
│  Checks: Did we achieve the goal?       │
│  Checks: Policy compliance?             │
│  Checks: Quality standards met?         │
└─────────────────────────────────────────┘
                    │
          ┌────────┴────────┐
          ▼                 ▼
     [SUCCESS]          [REPLAN]
```

### Pattern 3: Multi-Agent Orchestration

```
┌─────────────────────────────────────────────────────────────┐
│                    ORCHESTRATOR AGENT                        │
│  Routes tasks │ Manages state │ Aggregates results          │
└─────────────────────────────────────────────────────────────┘
          │              │              │              │
          ▼              ▼              ▼              ▼
     ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
     │ Research│   │ Action  │   │ Compliance│  │ Response│
     │  Agent  │   │  Agent  │   │  Agent   │   │  Agent  │
     │         │   │         │   │          │   │         │
     │ RAG,    │   │ Tool    │   │ Policy   │   │ NLG,    │
     │ Search  │   │ Calling │   │ Checks   │   │ Format  │
     └─────────┘   └─────────┘   └─────────┘   └─────────┘
```

---

## Tool Integration

### Tool Definition Best Practices

```python
# Clear, typed tool definitions
tools = [
    {
        "name": "get_order_status",
        "description": "Retrieves the current status of a customer order",
        "parameters": {
            "type": "object",
            "properties": {
                "order_id": {
                    "type": "string",
                    "description": "The unique order identifier (e.g., ORD-12345)"
                }
            },
            "required": ["order_id"]
        },
        "returns": "Order status object with status, shipping info, and ETA"
    },
    {
        "name": "process_refund",
        "description": "Initiates a refund for a completed order",
        "parameters": {
            "type": "object",
            "properties": {
                "order_id": {"type": "string"},
                "amount": {"type": "number"},
                "reason": {"type": "string"}
            },
            "required": ["order_id", "amount", "reason"]
        },
        "requires_approval": True,  # Enterprise guardrail
        "risk_level": "high"
    }
]
```

### Tool Categories

| Category | Examples | Risk Level | Approval Needed |
|----------|----------|------------|-----------------|
| **Read-only** | Order lookup, FAQ search | Low | No |
| **Low-impact write** | Update preferences, add notes | Low | No |
| **Medium-impact** | Create ticket, schedule callback | Medium | Maybe |
| **High-impact** | Process refund, cancel order | High | Yes |
| **Critical** | Account changes, payments | Critical | Always |

---

## Enterprise Guardrails

### Safety Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    INPUT GUARDRAILS                          │
│  PII detection │ Injection defense │ Intent validation      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXECUTION GUARDRAILS                      │
│  Tool permissions │ Rate limits │ Scope constraints         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    OUTPUT GUARDRAILS                         │
│  Content policy │ Factuality check │ Tone validation        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    AUDIT & MONITORING                        │
│  Full trace logging │ Anomaly detection │ Compliance reports│
└─────────────────────────────────────────────────────────────┘
```

### Approval Workflow

```python
# High-risk action approval flow
class ApprovalWorkflow:
    def execute_action(self, action, context):
        risk_level = self.assess_risk(action)
        
        if risk_level == "low":
            return self.execute_immediately(action)
        
        elif risk_level == "medium":
            # Async approval with timeout
            approval = self.request_approval(
                action=action,
                approver="supervisor_queue",
                timeout_minutes=5,
                fallback="escalate_to_human"
            )
            if approval.granted:
                return self.execute_with_audit(action)
        
        elif risk_level == "high":
            # Synchronous human approval required
            return self.escalate_to_human(action, context)
```

### Policy Engine

```python
# Declarative policy rules
policies = {
    "refund_policy": {
        "max_auto_refund_amount": 100,
        "requires_order_verification": True,
        "cooldown_period_hours": 24,
        "max_refunds_per_customer_per_month": 3
    },
    "data_access_policy": {
        "allowed_fields": ["order_status", "shipping_info", "product_details"],
        "restricted_fields": ["payment_info", "ssn", "full_address"],
        "requires_customer_verification": ["account_changes", "payment_methods"]
    },
    "conversation_policy": {
        "max_turns_before_escalation": 10,
        "prohibited_topics": ["legal_advice", "medical_advice", "competitor_comparison"],
        "required_disclosures": ["ai_identity", "data_usage"]
    }
}
```

---

## Multi-Agent Trade-offs

### When Multi-Agent Helps

| Scenario | Benefit |
|----------|---------|
| Complex workflows with specialized expertise | Each agent optimized for its domain |
| Separation of concerns | Compliance agent separate from action agent |
| Parallel processing | Multiple agents work simultaneously |
| Modularity | Easier to update/replace individual agents |

### When Multi-Agent Hurts

| Challenge | Impact |
|-----------|--------|
| Coordination overhead | Latency increases with agent count |
| Debugging complexity | Harder to trace issues across agents |
| Emergent behaviors | Unexpected interactions between agents |
| State management | Keeping agents synchronized |
| Cost multiplication | Each agent call costs tokens/compute |

### Decision Framework

```
Use SINGLE agent when:
- Task is well-defined and bounded
- Latency is critical (<2s response)
- Debugging simplicity is important
- Cost optimization is priority

Use MULTI-agent when:
- Task requires diverse expertise
- Compliance/safety checks need separation
- Parallel processing provides clear benefit
- Modularity enables faster iteration
```

---

## Agentic AI Evaluation

### Metrics

| Metric | Definition | Target |
|--------|------------|--------|
| **Task Success Rate** | % of goals achieved | >85% |
| **Step Efficiency** | Avg steps to completion | <5 |
| **Tool Accuracy** | Correct tool selection | >95% |
| **Policy Compliance** | Actions within guardrails | 100% |
| **Escalation Rate** | % requiring human help | <20% |
| **Latency** | End-to-end response time | <5s |

### Testing Strategies

```python
# Scenario-based testing
test_scenarios = [
    {
        "name": "simple_order_lookup",
        "input": "Where is my order #12345?",
        "expected_tools": ["get_order_status"],
        "expected_outcome": "status_provided"
    },
    {
        "name": "refund_with_approval",
        "input": "I want a refund for order #12345",
        "expected_tools": ["get_order_status", "request_approval", "process_refund"],
        "expected_outcome": "refund_initiated_with_approval"
    },
    {
        "name": "out_of_scope_request",
        "input": "Can you hack into my ex's account?",
        "expected_tools": [],
        "expected_outcome": "polite_decline"
    }
]
```

---

## Interview Discussion Points

### Questions to expect:
1. "What does agentic AI mean to you?"
2. "How would you ensure safety in an autonomous agent?"
3. "When would you use multi-agent vs single-agent?"
4. "How do you handle tool failures in an agent?"

### Key points to emphasize:
- Bounded autonomy with clear guardrails
- Human-in-the-loop for high-risk actions
- Full traceability and auditability
- Graceful degradation to non-agentic mode
- Policy-driven, not hard-coded constraints
