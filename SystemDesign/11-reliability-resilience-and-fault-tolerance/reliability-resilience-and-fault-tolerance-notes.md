# 🛡️ Reliability, Resilience and Fault Tolerance - System Design Notes

---

## 1. Introduction

Reliable systems continue serving useful work when individual components fail. Interviewers want to see that you design for partial failure, not just ideal-case traffic flow.

### Why it matters
- Real systems fail by degree, not all at once.
- Recovery plans influence architecture as much as happy-path throughput.
- Reliability language like SLOs, retries, and degradation makes designs credible.

---

## 2. Core Concepts

- **Reliability**: The system works correctly over time.
- **Availability**: The system is reachable and usable.
- **Resilience**: Ability to absorb and recover from failures.
- **Redundancy**: Extra capacity or components for failover.
- **Circuit breaker**: Stops sending traffic to an unhealthy dependency.
- **Bulkhead**: Isolates resource pools to contain blast radius.
- **Failover**: Switching to a healthy backup component.
- **Graceful degradation**: Preserve core experience while dropping non-critical features.

---

## 3. Resilience Pattern View

```text
Client
  |
Gateway
  |
Service A
  |-- timeout + retry + circuit breaker --> Service B
  |-- queue fallback --------------------> Async workers
  |
Cache / stale response fallback
```

---

## 4. Comparison Tables and Trade-offs

| Pattern | Benefit | Trade-offs |
|---------|---------|-----------|
| Retry with backoff | Recovers transient errors | Retry storms if unbounded |
| Circuit breaker | Protects upstream during failure | Temporary rejection of recoverable traffic |
| Bulkhead isolation | Limits blast radius | Capacity fragmentation |
| Active-active | High availability | Higher cost and consistency complexity |
| Active-passive | Simpler standby | Slower failover |

| Failure Strategy | Best For | Risk |
|------------------|----------|------|
| Graceful degradation | User-facing systems | Reduced experience |
| Queue buffering | Spiky async workloads | Processing delay |
| Stale reads | Read-heavy products | Temporary inconsistency |

---

## 5. Practical Examples

### Dependency timeout strategy
```text
overall SLA: 1 second
service A budget: 250 ms
service B timeout: 120 ms
retries: 1 with jitter
fallback: stale cache if available
```

### Circuit breaker states
```text
Closed    -> normal traffic
Open      -> fail fast, skip dependency
Half-open -> probe a small number of requests
```

### Bulkhead example
```text
Separate worker pools for:
- payments
- notifications
- analytics exports
```

---

## 6. Cheat Sheet

- Expect every dependency to fail eventually.
- Use timeouts, retries, circuit breakers, and fallbacks together.
- Degrade non-critical features before core flows.
- Keep spare capacity for failover and flash traffic.
- Define RPO and RTO for disaster recovery.
- Talk about blast radius, not only uptime percentage.

---

## 7. Hands-on Design Drills

1. Make a checkout system resilient to payment provider slowness.
2. Design a fallback plan for a recommendation service outage.
3. Contain failure when one worker queue is overloaded.

---

## 8. Real-world Scenarios and Failure Modes

- **Dependency slowdown, not outage**: Tight timeouts and fast fallback.
- **Retry storm across many services**: Budgeted retries and circuit breaking.
- **One tenant consumes all workers**: Per-tenant limits and isolated pools.
- **Regional outage**: Traffic failover, replicated data, and degraded feature set.

---

## 9. Interview Q&A

**Q1: Reliability vs availability?**  
Availability is being reachable; reliability is consistently doing the right thing.

**Q2: What is a circuit breaker?**  
A pattern that stops requests to an unhealthy dependency to prevent cascading failure.

**Q3: Why use bulkheads?**  
To isolate failures and prevent one workload from consuming all shared resources.

**Q4: What is graceful degradation?**  
Serving essential functionality while disabling non-critical features.

**Q5: Why are retries dangerous?**  
They can amplify load during an outage if poorly bounded.

**Q6: Active-active vs active-passive?**  
Active-active serves from multiple regions at once; active-passive keeps a standby ready.

**Q7: What is blast radius?**  
The amount of the system impacted by a failure.

**Q8: What is fail-fast behavior?**  
Rejecting quickly instead of waiting on a known-bad dependency.

**Q9: Why keep stale data as fallback?**  
Users often prefer slightly old data over total failure.

**Q10: What are RPO and RTO?**  
RPO is acceptable data loss window; RTO is acceptable recovery time.
