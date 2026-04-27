# System Design — Interview Preparation

## System Design Framework

### Answer Structure (45-60 minutes)

```
1. REQUIREMENTS (5-7 min)
   - Clarify functional requirements
   - Clarify non-functional requirements
   - Define scope and constraints

2. ESTIMATION (3-5 min)
   - Traffic/load estimates
   - Storage estimates
   - Bandwidth estimates

3. HIGH-LEVEL DESIGN (10-15 min)
   - Core components
   - Data flow
   - API design

4. DEEP DIVE (15-20 min)
   - Detailed component design
   - Data model
   - Key algorithms

5. SCALE & RELIABILITY (10 min)
   - Scaling strategies
   - Failure handling
   - Performance optimization

6. SECURITY & GOVERNANCE (5 min)
   - Authentication/Authorization
   - Data protection
   - Compliance considerations
```

---

## Design Problem 1: Multi-Tenant Virtual Agent Platform

### Problem Statement
Design a global virtual agent platform that serves 7,500+ enterprise customers across 100+ countries, handling customer support conversations via chat and voice.

### 1. Requirements Clarification

**Functional Requirements**
- Multi-channel support (chat, voice, web, mobile)
- Intent recognition and entity extraction
- Knowledge base retrieval (RAG)
- Tool/API integration for actions
- Human handoff capability
- Conversation history and context
- Multi-language support

**Non-Functional Requirements**
- Latency: P95 < 2 seconds for response
- Availability: 99.9% uptime
- Scale: 10M+ conversations/day globally
- Multi-tenancy: Complete data isolation
- Compliance: GDPR, HIPAA, SOC2

**Clarifying Questions to Ask**
- "What's the expected QPS per tenant?"
- "Are there specific compliance requirements?"
- "What's the budget for LLM API costs?"
- "Do tenants bring their own models?"

### 2. Estimation

```
Traffic:
- 7,500 tenants
- Average 1,000 conversations/tenant/day
- = 7.5M conversations/day
- = ~90 conversations/second average
- Peak: 3x = ~270 conversations/second
- Average 10 turns/conversation = 2,700 messages/second peak

Storage:
- 1KB per message average
- 7.5M conversations × 10 turns × 1KB = 75GB/day
- 90-day retention = 6.75TB active storage

LLM Tokens:
- 1,000 tokens/turn average (prompt + completion)
- 75M turns/day × 1,000 tokens = 75B tokens/day
```

### 3. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         GLOBAL LOAD BALANCER                            │
│                    (GeoDNS, SSL termination)                            │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
            ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
            │  US-EAST    │ │  EU-WEST    │ │  APAC       │
            │  Region     │ │  Region     │ │  Region     │
            └─────────────┘ └─────────────┘ └─────────────┘
                    │               │               │
                    └───────────────┴───────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────────┐
│                         CHANNEL GATEWAY                                  │
│   Chat Adapter │ Voice Adapter │ Web Widget │ Mobile SDK │ API         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────────┐
│                    CONVERSATION ORCHESTRATOR                             │
│   Session Manager │ Context Manager │ Routing Engine │ State Machine   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        ▼                           ▼                           ▼
┌─────────────┐            ┌─────────────┐            ┌─────────────┐
│     NLU     │            │     RAG     │            │    TOOLS    │
│   Service   │            │   Service   │            │   Service   │
│             │            │             │            │             │
│ Intent/     │            │ Retrieval + │            │ CRM, Ticket │
│ Entity      │            │ Generation  │            │ APIs        │
└─────────────┘            └─────────────┘            └─────────────┘
        │                           │                           │
        └───────────────────────────┴───────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────────┐
│                         GUARDRAILS SERVICE                               │
│   PII Detection │ Policy Enforcement │ Content Filtering │ Audit       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                     │
│   Conversation DB │ Vector Store │ Config Store │ Analytics            │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4. Component Deep Dive

**Conversation Orchestrator**
```python
class ConversationOrchestrator:
    def process_message(self, tenant_id, session_id, message):
        # 1. Load session context
        context = self.session_manager.get_context(tenant_id, session_id)
        
        # 2. Get tenant configuration
        config = self.config_store.get_tenant_config(tenant_id)
        
        # 3. NLU processing
        nlu_result = self.nlu_service.process(
            message=message,
            context=context,
            model=config.nlu_model
        )
        
        # 4. Route based on intent
        if nlu_result.intent in config.faq_intents:
            response = self.rag_service.answer(message, context, config)
        elif nlu_result.intent in config.action_intents:
            response = self.tools_service.execute(nlu_result, context, config)
        elif nlu_result.confidence < config.confidence_threshold:
            response = self.handle_low_confidence(nlu_result, context)
        else:
            response = self.llm_service.generate(message, context, config)
        
        # 5. Apply guardrails
        response = self.guardrails.process(response, config.policies)
        
        # 6. Update context
        self.session_manager.update_context(tenant_id, session_id, message, response)
        
        return response
```

**Multi-Tenant Data Model**
```sql
-- Tenant configuration
CREATE TABLE tenants (
    tenant_id UUID PRIMARY KEY,
    name VARCHAR(255),
    config JSONB,  -- NLU model, LLM settings, policies
    created_at TIMESTAMP
);

-- Conversations (partitioned by tenant)
CREATE TABLE conversations (
    conversation_id UUID,
    tenant_id UUID,
    channel VARCHAR(50),
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    status VARCHAR(50),
    metadata JSONB,
    PRIMARY KEY (tenant_id, conversation_id)
) PARTITION BY HASH (tenant_id);

-- Messages (partitioned by tenant + time)
CREATE TABLE messages (
    message_id UUID,
    conversation_id UUID,
    tenant_id UUID,
    role VARCHAR(20),  -- user, assistant, system
    content TEXT,
    metadata JSONB,  -- intent, entities, latency, tokens
    created_at TIMESTAMP,
    PRIMARY KEY (tenant_id, conversation_id, message_id)
) PARTITION BY RANGE (created_at);

-- Vector store (per-tenant isolation)
-- Option A: Separate index per tenant
-- Option B: Shared index with tenant_id metadata filter
```

### 5. Scaling Strategy

**Horizontal Scaling**
```
- Stateless orchestrator: Scale based on request rate
- NLU service: Scale based on inference load
- RAG service: Scale based on retrieval + generation load
- Tools service: Scale based on API call volume

Auto-scaling triggers:
- CPU > 70%
- Request latency P95 > 1.5s
- Queue depth > 1000
```

**Caching Strategy**
```
Layer 1: Edge cache (CDN)
- Static assets, common responses

Layer 2: Application cache (Redis)
- Session context (TTL: 30 min)
- Tenant config (TTL: 5 min)
- Frequent query embeddings (TTL: 1 hour)

Layer 3: Response cache
- FAQ responses by query hash (TTL: 1 hour)
- Only for non-personalized responses
```

**Database Scaling**
```
- Read replicas for analytics queries
- Sharding by tenant_id for large tenants
- Time-based partitioning for messages
- Archive to cold storage after 90 days
```

### 6. Reliability & Failure Handling

**Failure Scenarios**
```
LLM API failure:
- Retry with exponential backoff
- Fallback to cached responses
- Graceful degradation to FAQ-only mode
- Human escalation for critical conversations

Database failure:
- Multi-AZ deployment
- Read replica promotion
- Circuit breaker for writes

Service failure:
- Health checks every 10s
- Automatic instance replacement
- Traffic rerouting to healthy instances
```

**Graceful Degradation**
```
Level 1 (Full): LLM + RAG + Tools
Level 2 (Reduced): RAG + Tools only
Level 3 (Basic): FAQ retrieval only
Level 4 (Minimal): Static responses + human escalation
```

### 7. Security & Governance

**Multi-Tenant Isolation**
```
- Separate encryption keys per tenant (KMS)
- Row-level security in database
- Tenant-scoped API keys
- Network isolation (VPC per tenant tier)
```

**Compliance**
```
- PII detection and redaction
- Audit logging for all actions
- Data residency (regional deployment)
- Right to deletion (GDPR)
- Consent management
```

---

## Design Problem 2: Agentic Customer Support Assistant

### Problem Statement
Design an AI assistant that can autonomously handle customer support tasks including order management, refunds, and account changes, with appropriate safety guardrails.

### 1. Requirements Clarification

**Functional Requirements**
- Understand customer intent and context
- Execute actions via backend APIs
- Handle multi-step workflows
- Request human approval for high-risk actions
- Maintain conversation context
- Learn from feedback

**Non-Functional Requirements**
- Latency: < 5 seconds for action completion
- Safety: Zero unauthorized high-risk actions
- Auditability: Full trace of all decisions
- Reliability: Graceful handling of tool failures

**Scope Definition**
```
In scope:
- Order status, tracking, modification
- Refunds (with approval workflow)
- Account preference updates
- FAQ and knowledge queries

Out of scope:
- Payment method changes
- Account deletion
- Legal/compliance queries
```

### 2. Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                                   │
│                    (Chat, Voice, Web)                                   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────────┐
│                      INPUT PROCESSING                                    │
│   PII Detection │ Intent Classification │ Context Retrieval            │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────────┐
│                         AGENT CORE                                       │
│                                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                │
│  │   PLANNER   │ →  │  EXECUTOR   │ →  │  VALIDATOR  │                │
│  │             │    │             │    │             │                │
│  │ Goal decomp │    │ Tool calls  │    │ Policy check│                │
│  │ Step plan   │    │ Error handle│    │ Quality gate│                │
│  └─────────────┘    └─────────────┘    └─────────────┘                │
│         │                  │                  │                        │
│         └──────────────────┴──────────────────┘                        │
│                            │                                            │
│                    ┌───────────────┐                                   │
│                    │    MEMORY     │                                   │
│                    │               │                                   │
│                    │ Short-term    │                                   │
│                    │ Long-term     │                                   │
│                    └───────────────┘                                   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────────┐
│                         TOOL LAYER                                       │
│                                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │   Order     │  │   Refund    │  │   Account   │  │  Knowledge  │   │
│  │   Service   │  │   Service   │  │   Service   │  │   Service   │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────────┐
│                      APPROVAL WORKFLOW                                   │
│   Risk Assessment │ Approval Queue │ Human Review │ Audit Log          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3. Agent Core Design

**Planner Component**
```python
class Planner:
    def create_plan(self, goal: str, context: Context) -> Plan:
        prompt = f"""
        Goal: {goal}
        Context: {context}
        Available tools: {self.tool_catalog}
        
        Create a step-by-step plan to achieve this goal.
        For each step, specify:
        - Action to take
        - Required information
        - Success criteria
        - Fallback if step fails
        
        Output as JSON.
        """
        
        plan = self.llm.generate(prompt)
        validated_plan = self.validate_plan(plan)
        return validated_plan
    
    def validate_plan(self, plan: Plan) -> Plan:
        # Check all tools exist
        # Check no prohibited actions
        # Check step count within limits
        # Check estimated cost within budget
        return plan
```

**Executor Component**
```python
class Executor:
    def execute_plan(self, plan: Plan, context: Context) -> Result:
        results = []
        
        for step in plan.steps:
            # Check if step requires approval
            if self.requires_approval(step):
                approval = self.request_approval(step, context)
                if not approval.granted:
                    return self.handle_approval_denied(step, context)
            
            # Execute step
            try:
                result = self.execute_step(step, context)
                results.append(result)
                
                # Update context with result
                context.add_observation(step, result)
                
            except ToolError as e:
                # Handle tool failure
                recovery = self.recover_from_error(step, e, context)
                if recovery.should_retry:
                    result = self.execute_step(step, context)
                elif recovery.should_skip:
                    continue
                else:
                    return self.escalate_to_human(step, e, context)
        
        return Result(steps=results, success=True)
```

**Validator Component**
```python
class Validator:
    def validate_action(self, action: Action, context: Context) -> ValidationResult:
        checks = [
            self.check_policy_compliance(action),
            self.check_data_access(action, context.user),
            self.check_rate_limits(action, context.user),
            self.check_business_rules(action),
        ]
        
        if all(check.passed for check in checks):
            return ValidationResult(approved=True)
        else:
            failed_checks = [c for c in checks if not c.passed]
            return ValidationResult(
                approved=False,
                reasons=[c.reason for c in failed_checks]
            )
```

### 4. Tool Catalog Design

```python
tool_catalog = {
    "get_order_status": {
        "description": "Get current status of an order",
        "parameters": {
            "order_id": {"type": "string", "required": True}
        },
        "risk_level": "low",
        "requires_approval": False,
        "rate_limit": "100/minute"
    },
    
    "modify_order": {
        "description": "Modify an existing order (address, items)",
        "parameters": {
            "order_id": {"type": "string", "required": True},
            "modifications": {"type": "object", "required": True}
        },
        "risk_level": "medium",
        "requires_approval": False,
        "constraints": {
            "order_status": ["pending", "processing"],
            "time_limit": "24 hours from order"
        }
    },
    
    "process_refund": {
        "description": "Process a refund for an order",
        "parameters": {
            "order_id": {"type": "string", "required": True},
            "amount": {"type": "number", "required": True},
            "reason": {"type": "string", "required": True}
        },
        "risk_level": "high",
        "requires_approval": True,
        "approval_rules": {
            "auto_approve_if": {
                "amount_less_than": 50,
                "order_age_less_than_days": 30,
                "customer_refunds_this_month": {"less_than": 2}
            },
            "escalate_if": {
                "amount_greater_than": 500,
                "customer_flagged": True
            }
        }
    }
}
```

### 5. Approval Workflow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      ACTION REQUEST                                      │
│   Tool: process_refund │ Amount: $150 │ Order: #12345                  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      RISK ASSESSMENT                                     │
│   Check auto-approve rules │ Check escalation rules │ Calculate risk   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
            ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
            │ AUTO-APPROVE│ │ QUEUE FOR   │ │  ESCALATE   │
            │             │ │ REVIEW      │ │  TO HUMAN   │
            │ Low risk,   │ │             │ │             │
            │ within rules│ │ Medium risk │ │ High risk   │
            └─────────────┘ └─────────────┘ └─────────────┘
                    │               │               │
                    ▼               ▼               ▼
            ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
            │  EXECUTE    │ │ SUPERVISOR  │ │   HUMAN     │
            │  ACTION     │ │ REVIEW      │ │   AGENT     │
            │             │ │ (5 min SLA) │ │   TAKEOVER  │
            └─────────────┘ └─────────────┘ └─────────────┘
                    │               │               │
                    └───────────────┴───────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         AUDIT LOG                                        │
│   Action │ Decision │ Approver │ Timestamp │ Context │ Outcome         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6. Failure Handling

```python
failure_handling = {
    "tool_timeout": {
        "retry": 2,
        "backoff": "exponential",
        "fallback": "inform_user_and_retry_later"
    },
    
    "tool_error": {
        "4xx": "inform_user_invalid_request",
        "5xx": "retry_then_escalate",
        "network": "retry_with_backoff"
    },
    
    "approval_timeout": {
        "action": "inform_user_pending",
        "escalate_after": "10 minutes"
    },
    
    "plan_failure": {
        "action": "replan_with_constraints",
        "max_replans": 2,
        "fallback": "escalate_to_human"
    },
    
    "safety_violation": {
        "action": "immediate_stop",
        "log": "security_alert",
        "escalate": "security_team"
    }
}
```

### 7. Metrics & Monitoring

```python
metrics = {
    # Success metrics
    "task_completion_rate": "% of goals achieved",
    "first_contact_resolution": "% resolved without escalation",
    "step_efficiency": "avg steps to completion",
    
    # Safety metrics
    "policy_violations": "count of blocked actions",
    "approval_rate": "% of high-risk actions approved",
    "false_positive_rate": "unnecessary escalations",
    
    # Performance metrics
    "end_to_end_latency": "time from request to resolution",
    "tool_latency": "per-tool response time",
    "approval_latency": "time in approval queue",
    
    # Quality metrics
    "customer_satisfaction": "post-interaction survey",
    "error_rate": "% of failed tool calls",
    "escalation_rate": "% requiring human help"
}
```

---

## Interview Tips

### Common Mistakes to Avoid
- Jumping to solution without clarifying requirements
- Ignoring non-functional requirements
- Over-engineering for small scale
- Under-engineering for large scale
- Forgetting failure scenarios
- Ignoring security/compliance

### What Interviewers Look For
- Structured thinking and communication
- Trade-off analysis (not just one solution)
- Depth in areas of expertise
- Awareness of practical constraints
- Ability to handle follow-up questions
