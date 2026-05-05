# 📈 Scalability Basics - System Design Notes

---

## 1. Introduction

Scalability is the ability of a system to handle higher traffic, more data, and stricter latency goals without breaking user experience or operational simplicity. In interviews, it frames almost every later choice: data partitioning, caching, queuing, and service decomposition.

### Why it matters
- Converts vague product goals into concrete capacity targets.
- Helps you choose stateless vs stateful components early.
- Prevents over-engineering and under-designing.

---

## 2. Core Concepts

- **Latency**: Time to complete one request.
- **Throughput**: Work completed per unit time, often requests/sec.
- **Availability**: Percentage of time the system is usable.
- **Scalability**: Ability to grow with demand predictably.
- **Elasticity**: Ability to scale up and down automatically.
- **Bottleneck**: The slowest resource in the end-to-end path.
- **Stateless service**: Any instance can handle any request.
- **Stateful service**: Request handling depends on local or sticky state.

---

## 3. Architecture View

```text
Clients
   |
DNS
   |
Load Balancer
   |
+-----------------------------+
| Stateless App Tier          |
| app-1  app-2  app-3  app-n  |
+-----------------------------+
   |              |
   |              +--> Cache
   |
   +--> Queue --> Workers
   |
   +--> Database / Search / Object Storage
```

Key idea: scale stateless compute horizontally first, then protect slower stateful dependencies with caching, batching, and asynchronous work.

---

## 4. Comparison Tables and Trade-offs

| Choice | Best For | Benefits | Trade-offs |
|--------|----------|----------|-----------|
| Vertical scaling | Early stages, simple systems | Easy to operate | Hard upper limit, expensive |
| Horizontal scaling | High growth systems | Better fault isolation | More coordination complexity |
| Sync processing | User-critical immediate response | Simple mental model | Ties latency to slow dependencies |
| Async processing | Notifications, media, analytics | Absorbs spikes | Eventual consistency, retries |
| Stateful tier | Sessions, stream affinity | Lower lookup cost | Harder failover and balancing |
| Stateless tier | APIs, read-heavy services | Easy autoscaling | Requires external state stores |

---

## 5. Practical Examples

### Quick capacity math
```text
2 million DAU
10 requests/user/day
= 20 million requests/day
= ~231 requests/sec average
= 2,300+ requests/sec at 10x peak
```

### Resource budgeting
```text
If one app instance handles 250 RPS safely:
peak 2,300 RPS / 250 = 9.2
Need 10 instances minimum
Add 30% headroom -> 13 instances
```

### Simple autoscaling heuristic
```text
Scale out when:
- CPU > 65% for 5 minutes
- p95 latency > 250 ms
- queue lag > 2 minutes
```

---

## 6. Cheat Sheet

- Start with traffic, data size, read/write ratio, and peak factor.
- Keep web/API tier stateless when possible.
- Use queues to isolate slow background work.
- Add caches before scaling databases aggressively.
- Mention p50, p95, and p99 latency, not just averages.
- Design for graceful degradation under peak load.

---

## 7. Hands-on Design Drills

1. Design a product catalog API serving 5k RPS with heavy read traffic.
2. Redesign an image-processing service that times out during spikes.
3. Explain how you would scale a login service during a festival sale.

---

## 8. Real-world Scenarios and Failure Modes

- **Traffic spike after launch**: Add CDN, cache hot reads, queue non-critical writes.
- **DB CPU saturates before app tier**: Read replicas, caching, query tuning, denormalized views.
- **One tenant dominates traffic**: Rate limits, per-tenant quotas, noisy-neighbor isolation.
- **Autoscaling lags behind bursts**: Keep warm capacity and use queue buffering.

---

## 9. Interview Q&A

**Q1: Vertical vs horizontal scaling?**  
Vertical scaling makes one machine bigger; horizontal scaling adds more machines and improves fault tolerance.

**Q2: Why prefer stateless app servers?**  
They simplify load balancing, failover, and autoscaling.

**Q3: What is a bottleneck?**  
The component that limits throughput or drives most latency.

**Q4: Why care about peak traffic, not average traffic?**  
User-facing systems fail during bursts, not during averages.

**Q5: When would you use async processing?**  
For tasks like emails, video processing, indexing, and report generation.

**Q6: What does graceful degradation mean?**  
Serving a reduced but still useful experience instead of failing completely.

**Q7: What is elasticity?**  
Scaling resources up or down based on demand automatically.

**Q8: How do you find a bottleneck?**  
Measure CPU, memory, disk, network, queue lag, and request traces end to end.

**Q9: Why is p99 latency important?**  
It shows the long-tail experience for the slowest requests users still notice.

**Q10: What is headroom?**  
Extra safe capacity reserved for spikes, failures, or maintenance events.
