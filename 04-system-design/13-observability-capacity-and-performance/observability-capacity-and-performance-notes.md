# 📊 Observability, Capacity and Performance - System Design Notes

---

## 1. Introduction

You cannot operate what you cannot observe. Good system design answers include how to measure health, debug failures, and plan growth before incidents force the issue.

### Why it matters
- Metrics and traces validate whether the design actually works.
- Capacity planning prevents surprise outages and overspending.
- Performance work needs evidence, not guesswork.

---

## 2. Core Concepts

- **Metrics**: Numeric time-series signals like QPS, latency, and error rate.
- **Logs**: Structured event records for detailed troubleshooting.
- **Tracing**: End-to-end request path across services.
- **SLO**: Service level objective, a target like 99.9% availability.
- **SLI**: The measured indicator supporting the SLO.
- **Error budget**: Allowed unreliability before slowing releases or taking action.
- **Capacity planning**: Forecasting resources for expected growth.
- **Profiling**: Measuring where time or memory is spent.

---

## 3. Observability Stack

```text
Clients
  |
Services
  |-- Metrics ---> TSDB / dashboards / alerts
  |-- Logs ------> Central log store
  |-- Traces ----> Trace backend
  |
On-call response --> dashboards, alerts, runbooks
```

---

## 4. Comparison Tables and Trade-offs

| Signal | Best For | Benefits | Trade-offs |
|--------|----------|----------|-----------|
| Metrics | Trends and alerting | Cheap and fast | Low detail |
| Logs | Deep debugging | Rich context | High volume and cost |
| Traces | Latency path analysis | Great for distributed systems | Sampling and instrumentation overhead |

| Performance Technique | Benefit | Cost |
|-----------------------|---------|------|
| Caching | Lower latency | Staleness and invalidation |
| Batching | Better throughput | Added delay |
| Async processing | Faster user response | Operational complexity |
| Precomputation | Fast reads | Extra storage and freshness work |

---

## 5. Practical Examples

### Golden signals
```text
- Latency
- Traffic
- Errors
- Saturation
```

### Example SLO
```text
Checkout API
Availability SLO: 99.95% monthly
Latency SLO: p95 < 300 ms
Error rate: < 0.2%
```

### Capacity estimate
```text
Current peak: 4k RPS
Growth forecast: 15% per quarter
Next 2 quarters peak ~= 5.3k RPS
Provision with 30% headroom -> ~6.9k RPS target
```

---

## 6. Cheat Sheet

- Metrics tell you that something is wrong.
- Logs help explain what happened.
- Traces show where the latency came from.
- Define SLOs for critical user journeys, not every internal metric.
- Track saturation before utilization hits 100%.
- Capacity planning should include growth, seasonality, and failure headroom.

---

## 7. Hands-on Design Drills

1. Define SLIs and SLOs for a login service.
2. Instrument a feed API to debug high p99 latency.
3. Plan capacity for a sale day with 8x traffic spike.

---

## 8. Real-world Scenarios and Failure Modes

- **Alert fatigue**: Alerts without clear action create noise and missed incidents.
- **High CPU but low user pain**: Focus on user-facing SLIs first.
- **Storage cost from logs explodes**: Sampling, retention tiers, and structured logs.
- **Slow request path unclear**: Distributed tracing with correlation IDs.

---

## 9. Interview Q&A

**Q1: Metrics vs logs vs traces?**  
Metrics show trends, logs show detailed events, and traces show request flow across services.

**Q2: What is an SLO?**  
A target level of reliability or performance for a service.

**Q3: What is an error budget?**  
The amount of acceptable unreliability before corrective action is needed.

**Q4: Why monitor p95 or p99 latency?**  
Tail latency better captures bad user experiences than averages alone.

**Q5: What are the golden signals?**  
Latency, traffic, errors, and saturation.

**Q6: Why use structured logs?**  
They are easier to query, aggregate, and correlate.

**Q7: What is capacity planning?**  
Forecasting future resource needs from growth and workload patterns.

**Q8: Why sample traces?**  
To control storage and cost while keeping enough insight.

**Q9: What is a runbook?**  
A documented response guide for common operational issues.

**Q10: Why are correlation IDs useful?**  
They link related logs and traces across services.
