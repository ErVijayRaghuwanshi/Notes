# 🚦 Design Rate Limiter

---

## Problem Statement and Assumptions

Design a distributed rate limiter for APIs that protects backend systems from abuse and sudden spikes.

Assume:
- Limits can apply per user, API key, IP, or tenant
- Enforced at the gateway or edge
- Both burst handling and steady-state fairness matter

## Requirements

### Functional
- Allow or reject requests based on policy
- Support multiple dimensions of limits
- Expose remaining quota information

### Non-functional
- Low latency
- Horizontally scalable
- Consistent enough to prevent abuse

## Back-of-the-Envelope Estimates

```text
Edge traffic: 200k RPS peak
Limiter decision must stay in single-digit milliseconds
Counter store must handle heavy read/write traffic
```

## High-level Architecture

```text
Client -> API Gateway -> Rate Limiter -> Counter Store
                          |
                          +--> Config / Policy Store
                          +--> Metrics / audit logs
```

## Data Model and APIs

```text
limit_key = tenant_id:user_id:endpoint
counter(window_start, limit_key, count)
policy(limit_key pattern, algorithm, threshold, burst)
```

```http
Headers:
X-RateLimit-Limit
X-RateLimit-Remaining
X-RateLimit-Reset
```

## Bottlenecks and Deep Dives

- **Algorithms**: token bucket, leaky bucket, fixed window, sliding window log/counter.
- **Distributed consistency**: local counters are fast but can overshoot; centralized counters are stricter but slower.
- **Hot tenants**: shard keys carefully and enforce per-tenant fairness.

## Scaling, Failure Handling and Trade-offs

- Use Redis or in-memory edge counters for fast decisions.
- Token bucket is a good default because it supports bursts cleanly.
- If limiter backend is degraded, decide fail-open or fail-closed based on endpoint criticality.
- Global limits are harder than per-node local limits because coordination is required.

## Interview Summary

Frame the answer around algorithm choice, low-latency enforcement, distributed counters, and clear fail-open vs fail-closed behavior.
