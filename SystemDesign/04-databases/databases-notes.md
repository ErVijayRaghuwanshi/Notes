# 🗄️ Databases - System Design Notes

---

## 1. Introduction

Database design sits at the center of most system design interviews. Strong answers show not just SQL vs NoSQL knowledge, but how data access patterns, consistency needs, and scaling limits drive the choice.

### Why it matters
- Poor schema choices become long-term product bottlenecks.
- Indexes, replication, and partitioning shape both performance and cost.
- Data model decisions often determine service boundaries.

---

## 2. Core Concepts

- **Relational DB**: Structured tables with joins and ACID transactions.
- **NoSQL DB**: Key-value, document, wide-column, or graph stores.
- **Index**: Auxiliary structure that speeds lookups.
- **Replication**: Keeping copies of data on multiple nodes.
- **Sharding**: Splitting data across partitions.
- **Transaction**: Unit of atomic work.
- **ACID**: Atomicity, consistency, isolation, durability.
- **Read replica**: Follower optimized for read scale.

---

## 3. Data Flow

```text
Write path:
Client --> App --> Primary DB --> WAL / Replication --> Replicas

Read path:
Client --> App --> Cache --> Read Replica / Search Index

Scale path:
App --> Shard Router --> shard-1 / shard-2 / shard-n
```

---

## 4. Comparison Tables and Trade-offs

| Choice | Best For | Benefits | Trade-offs |
|--------|----------|----------|-----------|
| SQL | Transactions, reporting, strong integrity | Joins, constraints, mature tooling | Harder horizontal scale |
| Key-value | Sessions, counters, lookups | Very fast, simple | Limited query flexibility |
| Document | Flexible product/user profiles | Schema flexibility | Join-like queries get harder |
| Wide-column | Very large write-heavy workloads | High scale, tunable consistency | More complex modeling |

| Technique | Benefit | Cost |
|----------|---------|------|
| Secondary index | Faster reads | Slower writes, more storage |
| Read replicas | Scale reads | Replica lag |
| Sharding | Scale storage and write load | Rebalancing and cross-shard queries |
| Denormalization | Faster reads | Write amplification and inconsistency risk |

---

## 5. Practical Examples

### Social feed metadata schema
```sql
users(id, name, created_at)
posts(id, author_id, body, created_at)
follows(follower_id, followee_id, created_at)
likes(user_id, post_id, created_at)
```

### Common indexes
```text
posts(author_id, created_at desc)
follows(follower_id)
likes(post_id)
```

### Shard key example
```text
orders shard key = customer_id
Good when most reads are customer scoped
Bad for large enterprise tenants with uneven load
```

---

## 6. Cheat Sheet

- Start from access patterns, not database brand names.
- Use SQL when consistency and joins are central.
- Use NoSQL when scale, flexibility, or simple access patterns dominate.
- Add indexes only for proven query paths.
- Mention read replicas before sharding for read-heavy growth.
- Pick shard keys that spread load and preserve locality.

---

## 7. Hands-on Design Drills

1. Model an orders system for a marketplace.
2. Design a comments store with pagination and moderation filters.
3. Pick a shard key for a multi-tenant billing platform.

---

## 8. Real-world Scenarios and Failure Modes

- **Replica lag hurts read-after-write UX**: Route recent reads to primary or session cache.
- **Hot partition from celebrity account**: Change key design, add fanout strategies, cache aggressively.
- **Too many secondary indexes**: Write latency spikes and storage cost rises.
- **Cross-shard reporting query**: Use pre-aggregations, OLAP store, or async pipelines.

---

## 9. Interview Q&A

**Q1: SQL vs NoSQL?**  
SQL is stronger for transactions and joins; NoSQL is often better for simple access patterns at very large scale.

**Q2: What is sharding?**  
Splitting data horizontally across multiple database nodes.

**Q3: Why can indexes hurt performance?**  
They speed reads but slow writes and increase storage.

**Q4: What is replica lag?**  
Delay between primary writes and replica visibility.

**Q5: When denormalize data?**  
When read performance and query simplicity matter more than normalized writes.

**Q6: What is a composite index?**  
An index across multiple columns that supports combined filters or sorting.

**Q7: How do you choose a shard key?**  
Use a field that spreads traffic, preserves locality, and avoids hotspots.

**Q8: What is read-after-write consistency?**  
A user sees their own recent write immediately in a follow-up read.

**Q9: When use read replicas?**  
When reads dominate and some replication lag is acceptable.

**Q10: Why separate OLTP and OLAP?**  
Transactional workloads and analytical queries have very different performance shapes.
