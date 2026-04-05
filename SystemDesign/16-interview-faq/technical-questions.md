# ⚡ Rapid-Fire Technical System Design Questions

Use these for short mock-interview rounds. Keep answers concise, structured, and trade-off driven.

---

## Foundations

**Q1: What is horizontal scaling?**  
Adding more machines or instances to handle traffic instead of making one machine larger.

**Q2: Why is p99 latency important?**  
It captures the slowest user experiences that averages hide.

**Q3: What is statelessness and why is it useful?**  
Any instance can handle any request, which simplifies scaling and failover.

**Q4: What is CAP theorem?**  
During a network partition, a distributed system must trade off consistency and availability.

**Q5: What is eventual consistency?**  
Reads may be stale temporarily, but replicas converge over time.

## Data and Storage

**Q6: SQL vs NoSQL?**  
SQL is stronger for transactions and joins; NoSQL is often better for simple access patterns at very large scale.

**Q7: What is sharding?**  
Horizontal partitioning of data across nodes to increase scale.

**Q8: What is replica lag?**  
Delay before replicas reflect primary writes.

**Q9: Why use object storage instead of a database for files?**  
It is cheaper, more durable, and better suited for large binary data.

**Q10: What is cache-aside?**  
Read from cache first, load from origin on miss, then populate cache.

## Communication and APIs

**Q11: REST vs gRPC?**  
REST is simpler and public-client friendly; gRPC is efficient and strongly typed for internal services.

**Q12: Why use idempotency keys?**  
They make retries safe for create-like operations.

**Q13: Queue vs pub/sub?**  
A queue distributes work to one consumer; pub/sub fans events out to many consumers.

**Q14: What is a DLQ?**  
A queue for messages that failed processing repeatedly.

**Q15: L4 vs L7 load balancer?**  
L4 routes by transport metadata; L7 routes using application-layer data like host or path.

## Architecture and Reliability

**Q16: Monolith vs microservices?**  
Monoliths are simpler to build and operate; microservices help when scale and team boundaries justify the added complexity.

**Q17: What is a saga pattern?**  
A distributed workflow using local transactions plus compensating actions.

**Q18: What is a circuit breaker?**  
A protection mechanism that stops sending traffic to an unhealthy dependency.

**Q19: What is graceful degradation?**  
Serving a reduced but still useful experience during failure.

**Q20: What is an SLO?**  
A target reliability or performance goal for a service.

## Estimation

**Q21: How do you convert requests/day to RPS?**  
Divide by 86,400 and then apply a peak multiplier.

**Q22: Why do back-of-the-envelope estimation in interviews?**  
To ground the design in concrete assumptions and size the main components.

**Q23: What is headroom?**  
Reserved extra capacity for spikes, failures, and growth.

**Q24: What is read-after-write consistency?**  
A user sees their own recent write immediately in a follow-up read.

**Q25: What makes a strong system design answer?**  
Clear requirements, scale assumptions, sound architecture, trade-offs, bottlenecks, and failure handling.
