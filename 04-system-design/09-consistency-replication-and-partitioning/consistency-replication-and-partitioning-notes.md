# 🔁 Consistency, Replication and Partitioning - System Design Notes

---

## 1. Introduction

Distributed data systems force trade-offs between consistency, availability, latency, and scale. Interviewers care less about textbook definitions alone and more about whether you can choose the right trade-off for the product experience.

### Why it matters
- Explains why replicas lag, conflicts happen, and partitions hurt.
- Drives choices in databases, caches, and event flows.
- Separates beginner answers from production-aware design.

---

## 2. Core Concepts

- **Consistency**: How up-to-date and uniform reads are.
- **Strong consistency**: Reads see the latest committed write.
- **Eventual consistency**: Reads converge over time.
- **Replication**: Copying data across nodes.
- **Leader-follower**: One node accepts writes, followers replicate.
- **Multi-leader**: Writes can happen in multiple regions/nodes.
- **Partitioning**: Splitting data across nodes or key ranges.
- **Quorum**: Read/write acknowledgement threshold.
- **CAP theorem**: During a partition, you trade between consistency and availability.

---

## 3. Data Topology

```text
           +--> Replica A
Primary ---+--> Replica B
           +--> Replica C

Client read path:
App --> local replica / quorum read

Partitioned cluster:
Shard 1 | Shard 2 | Shard 3
```

---

## 4. Comparison Tables and Trade-offs

| Model | Best For | Benefits | Trade-offs |
|-------|----------|----------|-----------|
| Strong consistency | Payments, inventory, auth | Simple correctness | Higher latency, lower availability during partitions |
| Eventual consistency | Feeds, counters, analytics | Better availability and scale | Temporary stale reads |
| Leader-follower | Primary write ownership | Simpler conflict handling | Replica lag, leader failover cost |
| Multi-leader | Multi-region writes | Better regional write latency | Conflict resolution complexity |

| Technique | Benefit | Risk |
|----------|---------|------|
| Quorum writes | Stronger durability/visibility | Higher latency |
| Async replication | Faster writes | Replica lag and temporary loss window |
| Range partitioning | Efficient locality for ordered scans | Hot ranges |
| Hash partitioning | Better balance | Harder range queries |

---

## 5. Practical Examples

### Quorum example
```text
N = 3 replicas
W = 2 write acknowledgements
R = 2 read acknowledgements
R + W > N, so reads intersect writes
```

### Eventual consistency examples
```text
- Social media like counts
- Read replicas for article pages
- Search index catches up a few seconds later
```

### Conflict handling
```text
Last-write-wins        -> simple but lossy
Version vectors        -> accurate but complex
Application merge rule -> best when domain specific
```

---

## 6. Cheat Sheet

- Pick consistency based on user-visible correctness needs.
- Mention replica lag and read-after-write behavior explicitly.
- Strong consistency is costly but necessary for some domains.
- Partitioning increases scale but complicates joins and rebalancing.
- Hash spreads load; range preserves ordering.
- CAP matters specifically during network partitions.

---

## 7. Hands-on Design Drills

1. Choose consistency for cart, checkout, and homepage feed.
2. Compare hash vs range partitioning for time-series data.
3. Explain multi-region writes for chat presence vs payment status.

---

## 8. Real-world Scenarios and Failure Modes

- **Replica lag confuses users**: Route self-reads to primary or use session consistency.
- **Hot range from recent timestamps**: Bucket timestamps or combine with hash.
- **Regional partition**: Pick whether writes pause or continue with conflict resolution.
- **Leader failure**: Automatic election and client retry to new leader.

---

## 9. Interview Q&A

**Q1: What is eventual consistency?**  
The system may return stale data temporarily, but replicas converge over time.

**Q2: What is CAP theorem?**  
During a partition, a distributed system must trade off consistency vs availability.

**Q3: Why use leader-follower replication?**  
It simplifies write ordering and conflict handling.

**Q4: What is replica lag?**  
Delay before follower replicas reflect a committed primary write.

**Q5: Hash vs range partitioning?**  
Hash balances load better; range is better for ordered scans and locality.

**Q6: What is quorum?**  
A minimum number of replicas required to confirm a read or write.

**Q7: When choose strong consistency?**  
For correctness-critical domains like payments, balances, and inventory reservation.

**Q8: Why can multi-leader replication be hard?**  
Concurrent writes can conflict and need resolution.

**Q9: What is read-after-write consistency?**  
A user sees their latest write immediately in subsequent reads.

**Q10: Why does partitioning complicate queries?**  
Joins, aggregations, and rebalancing become distributed operations.
