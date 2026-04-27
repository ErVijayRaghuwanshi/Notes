# MLOps & AWS Deployment — Deep Dive

## MLOps for AI Systems

### End-to-End ML Pipeline

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           DATA PIPELINE                                  │
│  Collection → Validation → Preprocessing → Feature Engineering → Storage│
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         TRAINING PIPELINE                                │
│  Experiment Tracking → Training → Evaluation → Model Registry           │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        DEPLOYMENT PIPELINE                               │
│  Validation → Packaging → Deployment → Rollout → Monitoring             │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        MONITORING & FEEDBACK                             │
│  Performance Metrics → Drift Detection → Alerts → Retraining Triggers  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Versioning Strategy

### What to Version

| Artifact | Tool Options | Why |
|----------|--------------|-----|
| **Code** | Git | Reproducibility |
| **Data** | DVC, Delta Lake, LakeFS | Data lineage |
| **Models** | MLflow, W&B, SageMaker Registry | Model lineage |
| **Prompts** | Git, Prompt management tools | Prompt iteration |
| **Configs** | Git, Feature flags | Environment parity |
| **Experiments** | MLflow, W&B, Neptune | Comparison & selection |

### Model Registry Best Practices

```python
# Model metadata to track
model_metadata = {
    "model_id": "intent-classifier-v2.3.1",
    "model_type": "fine-tuned-bert",
    "training_data_version": "dataset-v1.2",
    "training_date": "2024-04-15",
    "metrics": {
        "accuracy": 0.94,
        "f1_macro": 0.91,
        "latency_p95_ms": 45
    },
    "stage": "staging",  # staging | production | archived
    "approved_by": "ml-team-lead",
    "deployment_config": {
        "min_instances": 2,
        "max_instances": 10,
        "instance_type": "ml.g4dn.xlarge"
    }
}
```

---

## CI/CD for ML

### Pipeline Stages

```yaml
# Example CI/CD pipeline
stages:
  - lint_and_test
  - data_validation
  - training
  - evaluation
  - staging_deployment
  - integration_tests
  - production_deployment
  - monitoring_setup

lint_and_test:
  - code_linting (flake8, black)
  - unit_tests (pytest)
  - type_checking (mypy)

data_validation:
  - schema_validation
  - data_quality_checks
  - drift_detection_vs_baseline

training:
  - hyperparameter_optimization
  - model_training
  - artifact_logging

evaluation:
  - offline_metrics_computation
  - regression_test_vs_baseline
  - bias_and_fairness_checks
  - gate: metrics_above_threshold

staging_deployment:
  - deploy_to_staging
  - smoke_tests
  - shadow_traffic_evaluation

integration_tests:
  - end_to_end_conversation_tests
  - tool_integration_tests
  - latency_benchmarks

production_deployment:
  - canary_deployment (5% traffic)
  - monitor_for_1_hour
  - gradual_rollout (25% → 50% → 100%)
  - gate: no_degradation_detected

monitoring_setup:
  - dashboard_update
  - alert_configuration
  - runbook_verification
```

### Testing Pyramid for ML

```
                    ┌─────────────┐
                    │   E2E Tests │  ← Full conversation flows
                    │   (Few)     │
                    └─────────────┘
                   ┌───────────────┐
                   │ Integration   │  ← Model + tools + services
                   │ Tests (Some)  │
                   └───────────────┘
                  ┌─────────────────┐
                  │  Component Tests│  ← Individual model evaluation
                  │  (Many)         │
                  └─────────────────┘
                 ┌───────────────────┐
                 │   Unit Tests      │  ← Data processing, utilities
                 │   (Most)          │
                 └───────────────────┘
```

---

## Deployment Strategies

### Canary Deployment

```
┌─────────────────────────────────────────────────────────────┐
│                      LOAD BALANCER                          │
└─────────────────────────────────────────────────────────────┘
                    │                    │
            ┌───────┴───────┐    ┌───────┴───────┐
            │   95% traffic │    │   5% traffic  │
            ▼               │    ▼               │
     ┌─────────────┐        │    ┌─────────────┐
     │  Model v1   │        │    │  Model v2   │  ← Canary
     │  (Current)  │        │    │  (New)      │
     └─────────────┘        │    └─────────────┘
                            │
                    Monitor metrics
                    If good → increase traffic
                    If bad → rollback
```

### Shadow Deployment

```
┌─────────────────────────────────────────────────────────────┐
│                      INCOMING REQUEST                        │
└─────────────────────────────────────────────────────────────┘
                    │
            ┌───────┴───────┐
            ▼               ▼
     ┌─────────────┐  ┌─────────────┐
     │  Model v1   │  │  Model v2   │  ← Shadow (no response to user)
     │  (Serves)   │  │  (Logs only)│
     └─────────────┘  └─────────────┘
            │               │
            ▼               ▼
       Response         Compare outputs
       to user          offline
```

### Blue-Green Deployment

```
┌─────────────────────────────────────────────────────────────┐
│                      LOAD BALANCER                          │
│                    (Switch on deploy)                       │
└─────────────────────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
 ┌─────────────┐         ┌─────────────┐
 │    BLUE     │         │    GREEN    │
 │  (Current)  │         │   (New)     │
 │  Model v1   │         │  Model v2   │
 └─────────────┘         └─────────────┘

Instant switch, instant rollback capability
```

---

## Monitoring & Observability

### Metrics to Track

**Model Performance**
```python
metrics = {
    # Quality metrics
    "intent_accuracy": gauge,
    "entity_f1": gauge,
    "response_groundedness": gauge,
    "hallucination_rate": gauge,
    
    # Latency metrics
    "inference_latency_p50": histogram,
    "inference_latency_p95": histogram,
    "inference_latency_p99": histogram,
    "end_to_end_latency": histogram,
    
    # Throughput metrics
    "requests_per_second": counter,
    "tokens_per_second": counter,
    
    # Error metrics
    "error_rate": gauge,
    "timeout_rate": gauge,
    "fallback_rate": gauge,
    
    # Cost metrics
    "tokens_consumed": counter,
    "api_cost_usd": counter
}
```

**Drift Detection**
```python
drift_monitors = {
    "input_drift": {
        "method": "KL_divergence",
        "baseline": "training_distribution",
        "threshold": 0.1,
        "alert": "slack_channel"
    },
    "output_drift": {
        "method": "PSI",  # Population Stability Index
        "baseline": "last_week_distribution",
        "threshold": 0.2,
        "alert": "pagerduty"
    },
    "concept_drift": {
        "method": "accuracy_degradation",
        "baseline": "deployment_accuracy",
        "threshold": 0.05,
        "alert": "retrain_trigger"
    }
}
```

### Conversational AI-Specific Observability

```python
# Turn-level tracing
trace = {
    "conversation_id": "conv_123",
    "turn_id": "turn_5",
    "timestamp": "2024-04-27T10:30:00Z",
    "user_input": "What's my order status?",
    "detected_intent": "order_status",
    "intent_confidence": 0.95,
    "entities": [{"type": "order_id", "value": "12345"}],
    "retrieved_docs": ["doc_456", "doc_789"],
    "retrieval_latency_ms": 45,
    "tool_calls": [
        {"tool": "get_order_status", "input": {"order_id": "12345"}, "latency_ms": 120}
    ],
    "llm_prompt_tokens": 850,
    "llm_completion_tokens": 120,
    "llm_latency_ms": 450,
    "response": "Your order #12345 is shipped and arriving April 28th.",
    "guardrail_checks": {"pii_detected": False, "policy_violation": False},
    "total_latency_ms": 650
}
```

---

## AWS Services for AI Workloads

### Compute Options

| Service | Use Case | Pros | Cons |
|---------|----------|------|------|
| **SageMaker Endpoints** | Model hosting | Managed, autoscaling | Cost, vendor lock-in |
| **ECS/Fargate** | Containerized inference | Flexible, familiar | More ops overhead |
| **EKS** | Kubernetes workloads | Portable, ecosystem | Complexity |
| **Lambda** | Light inference | Serverless, cheap at low scale | Cold starts, limits |
| **Bedrock** | Managed LLMs | Easy, no infra | Limited customization |

### Storage Options

| Service | Use Case | Pros | Cons |
|---------|----------|------|------|
| **S3** | Documents, artifacts | Cheap, durable | Not for real-time |
| **DynamoDB** | Session state, metadata | Fast, scalable | Query limitations |
| **RDS/Aurora** | Structured data | SQL, transactions | Scale limits |
| **OpenSearch** | Hybrid search | Full-text + vector | Operational overhead |
| **ElastiCache** | Caching | Fast, managed | Memory costs |

### AI/ML Specific Services

| Service | Use Case |
|---------|----------|
| **SageMaker** | Training, hosting, MLOps |
| **Bedrock** | Managed foundation models |
| **Comprehend** | NLP (sentiment, entities) |
| **Lex** | Conversational interfaces |
| **Transcribe** | Speech-to-text |
| **Polly** | Text-to-speech |
| **Kendra** | Enterprise search |

### Reference Architecture (Conversational AI on AWS)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           API GATEWAY                                    │
│                    (Rate limiting, auth, routing)                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    ECS/EKS - Orchestration Service                       │
│              (Conversation management, routing, state)                  │
└─────────────────────────────────────────────────────────────────────────┘
          │              │              │              │
          ▼              ▼              ▼              ▼
   ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐
   │ SageMaker │  │  Bedrock  │  │ OpenSearch│  │  Lambda   │
   │ Endpoints │  │   LLMs    │  │  (RAG)    │  │  (Tools)  │
   │ (Custom)  │  │           │  │           │  │           │
   └───────────┘  └───────────┘  └───────────┘  └───────────┘
          │              │              │              │
          └──────────────┴──────────────┴──────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                     │
│   DynamoDB (state) │ S3 (docs) │ ElastiCache (cache) │ RDS (analytics) │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         OBSERVABILITY                                    │
│   CloudWatch │ X-Ray (tracing) │ OpenSearch (logs) │ Grafana           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Cost Optimization

### LLM Cost Strategies

```python
cost_optimization = {
    "caching": {
        "strategy": "Cache frequent queries and responses",
        "savings": "30-50% token reduction",
        "tools": ["ElastiCache", "Redis"]
    },
    "model_selection": {
        "strategy": "Use smaller models for simple tasks",
        "example": "GPT-3.5 for classification, GPT-4 for generation",
        "savings": "10x cost difference"
    },
    "prompt_optimization": {
        "strategy": "Minimize prompt tokens",
        "techniques": ["Compression", "Dynamic context", "Summarization"],
        "savings": "20-40% token reduction"
    },
    "batching": {
        "strategy": "Batch non-real-time requests",
        "use_case": "Offline evaluation, bulk processing",
        "savings": "Volume discounts"
    }
}
```

### Infrastructure Cost Strategies

```python
infra_optimization = {
    "right_sizing": "Match instance type to workload",
    "spot_instances": "Use for training, non-critical batch jobs",
    "reserved_capacity": "Commit for predictable baseline load",
    "autoscaling": "Scale down during low traffic",
    "serverless": "Use Lambda for bursty, low-volume workloads"
}
```

---

## Interview Discussion Points

### Questions to expect:
1. "How do you deploy ML models to production?"
2. "How do you monitor model performance?"
3. "How do you handle model drift?"
4. "What's your CI/CD pipeline for ML?"

### Key points to emphasize:
- Versioning everything (code, data, models, prompts)
- Automated evaluation gates before deployment
- Canary/shadow deployment for safe rollouts
- Comprehensive monitoring with drift detection
- Fast rollback mechanisms
- Cost-aware architecture decisions
