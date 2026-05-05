# 📨 Kafka - Big Data Notes

---

## 1. Introduction

Kafka is one of the most common interview topics in data-platform roles because it sits between operational systems and analytical or streaming consumers. Good answers connect Kafka’s broker model, partitioning, offsets, and delivery guarantees to real pipeline behavior.

### Why it matters
- Buffers event traffic between producers and downstream systems.
- Supports both near-realtime analytics and asynchronous integration.
- Shows whether you understand ordering, durability, and consumer scaling.

---

## 2. Core Concepts

- **Broker**: Kafka server storing partitions.
- **Topic**: Named stream of events.
- **Partition**: Ordered log segment within a topic.
- **Offset**: Consumer position in a partition.
- **Producer**: Writes records to Kafka.
- **Consumer group**: Set of consumers sharing partition work.
- **ISR**: In-sync replicas for partition durability.
- **Compaction**: Retains latest value per key rather than full history.

---

## 3. Architecture View

```text
Producers
   |
Kafka topic
   |
+-------------------------------+
| partition-0 | partition-1 ... |
+-------------------------------+
   |
Consumer Group A   Consumer Group B
Spark stream       Search indexer
```

---

## 4. Trade-offs and Comparisons

| Pattern | Best For | Benefit | Trade-off |
|---------|----------|---------|-----------|
| More partitions | Higher parallelism | Better throughput | More coordination and open files |
| Compacted topic | Latest-state streams | Efficient key-based recovery | Loses full append-only history |
| At-least-once | Safe delivery | Lower loss risk | Duplicates possible |
| Exactly-once-ish pipelines | Financial or stateful flows | Stronger semantics | More complexity and stricter tool support |

---

## 5. Practical Examples

### Common design rules
```text
Partition by:
- user_id for user-local ordering
- account_id for financial entity ordering
- conversation_id for chat ordering
```

### Producer settings to discuss
```text
acks=all
enable.idempotence=true
compression.type=zstd
```

### Kafka with Spark
```text
Kafka -> Structured Streaming -> Delta / Iceberg
Kafka offset tracking + checkpointing control replay behavior
```

---

## 6. Cheat Sheet

- Ordering is only guaranteed within a partition.
- Consumer groups scale reads by distributing partitions.
- Offsets track progress, not business completion.
- Compaction is for latest-state topics, not full audit history.
- Kafka is great for decoupling, but not a warehouse by itself.

---

## 7. Hands-on Drills

1. Choose a partition key for order events.
2. Explain how a consumer resumes after failure.
3. Design a Kafka-to-Delta pipeline with replay support.

---

## 8. Real-world Scenarios and Failure Modes

- **Hot partition**: Poor key choice creates skew and throttles throughput.
- **Consumer lag grows**: Throughput exceeds processing rate or one partition is heavy.
- **Duplicate downstream writes**: Consumers are not idempotent.
- **Too many tiny topics**: Broker metadata and operations become painful.

---

## 9. Interview Q&A

**Q1: What is a Kafka partition?**  
An ordered append-only log segment within a topic.

**Q2: Is ordering guaranteed in Kafka?**  
Only within a single partition.

**Q3: What does a consumer group do?**  
It lets multiple consumers share partitions for one logical application.

**Q4: What is ISR?**  
The set of replicas that are fully caught up enough to participate in durability guarantees.

**Q5: What is log compaction?**  
Retention of the latest record per key instead of all historical records.

**Q6: What causes consumer lag?**  
Consumers processing slower than producers publish.

**Q7: Why does partition key choice matter?**  
It determines ordering and load distribution.

**Q8: Why is Kafka good for big-data pipelines?**  
It buffers events durably and decouples producers from multiple downstream consumers.

**Q9: What is offset commit?**  
Recording consumer progress through a topic partition.

**Q10: Why is Kafka not a replacement for a data warehouse?**  
It is a log/messaging system, not an optimized long-term analytical query layer.
