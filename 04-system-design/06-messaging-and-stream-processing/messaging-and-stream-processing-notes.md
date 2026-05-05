# 📨 Messaging and Stream Processing - System Design Notes

---

## 1. Introduction

Queues and event streams decouple producers from consumers, smooth traffic spikes, and enable asynchronous workflows. They appear in almost every interview once the design includes notifications, media processing, analytics, or integration with other services.

### Why it matters
- Protects downstream systems from sudden bursts.
- Lets user-facing flows stay fast while heavy work runs later.
- Supports event-driven architectures and audit-friendly pipelines.

---

## 2. Core Concepts

- **Queue**: Messages are consumed by one worker from a work pool.
- **Pub/Sub**: Messages are broadcast to multiple subscribers.
- **Topic**: Logical stream name in a messaging system.
- **Partition**: Ordered subset of a stream used for parallelism.
- **Consumer group**: Workers sharing the load for a topic.
- **DLQ**: Dead-letter queue for messages that repeatedly fail.
- **At-most-once**: No duplicates, but messages may be lost.
- **At-least-once**: Messages may be duplicated but should not be lost.
- **Exactly-once**: Strongest guarantee, usually costly and limited in scope.

---

## 3. Architecture View

```text
API Service
   |
   +--> Queue ----------------> Worker Pool
   |                              |
   |                              +--> Email / SMS provider
   |                              +--> Image / video processing
   |
   +--> Event Stream ----------> Analytics Consumer
                                  Search Indexer
                                  Fraud / Rules Engine
```

---

## 4. Comparison Tables and Trade-offs

| Pattern | Best For | Benefits | Trade-offs |
|---------|----------|----------|-----------|
| Queue | Background jobs | Simple work distribution | One consumer handles each message |
| Pub/Sub | Fan-out events | Multiple independent consumers | Harder replay/debugging |
| Log-based stream | Ordered event history | Replay and auditability | More operational complexity |

| Guarantee | Benefit | Cost |
|-----------|---------|------|
| At-most-once | Simpler and fast | Possible loss |
| At-least-once | Safer delivery | Deduplication needed |
| Exactly-once | Strong correctness story | Higher complexity and narrower applicability |

---

## 5. Practical Examples

### Notification flow
```text
1. User creates order
2. Order service writes order to DB
3. Order service publishes "order_created"
4. Notification service consumes event
5. Sends email / SMS / push
6. Failures go to DLQ after retry limit
```

### Partitioning strategy
```text
Topic: chat_messages
Partition key: conversation_id
Benefit: message order preserved within each conversation
```

### Idempotent consumer
```text
processed_events(event_id primary key)
if event_id already exists -> skip
else perform side effect and record event_id
```

---

## 6. Cheat Sheet

- Use queues to absorb spikes and protect synchronous paths.
- Use event streams when multiple consumers need the same data.
- Partition by a key that balances load and preserves needed ordering.
- Assume at-least-once delivery unless proven otherwise.
- Add retry policy, poison message handling, and DLQ strategy.
- Track lag, retry counts, and consumer health.

---

## 7. Hands-on Design Drills

1. Add async email delivery to a signup workflow.
2. Design an event stream for order analytics and fraud detection.
3. Preserve per-chat ordering in a messaging system.

---

## 8. Real-world Scenarios and Failure Modes

- **Consumer falls behind**: Increase partitions or consumers, reduce per-message work.
- **Poison message loops forever**: Retry cap, DLQ, manual replay tooling.
- **Duplicate delivery causes double emails**: Idempotent handlers and dedup keys.
- **One partition is hot**: Better partition key or key spreading strategy.

---

## 9. Interview Q&A

**Q1: Queue vs pub/sub?**  
A queue sends work to one consumer; pub/sub fans the same event out to many consumers.

**Q2: Why use async messaging?**  
It decouples services and keeps user-facing latency low.

**Q3: What is a DLQ?**  
A holding area for messages that fail repeated processing attempts.

**Q4: What does at-least-once mean?**  
Messages can be delivered more than once, so consumers must be idempotent.

**Q5: Why partition a stream?**  
To scale throughput with parallel consumers.

**Q6: How preserve ordering?**  
Route related events with the same partition key.

**Q7: What is consumer lag?**  
How far behind a consumer is from the latest available messages.

**Q8: Why might exactly-once be misleading?**  
It often applies only within a specific system boundary and still needs careful end-to-end design.

**Q9: When use Kafka-like logs over simple queues?**  
When replay, auditing, or many independent consumers matter.

**Q10: How handle poison messages?**  
Retry with limits, then move to DLQ for inspection or replay.
