# 🌊 Spark Structured Streaming - Big Data Notes

---

## 1. Introduction

Structured Streaming brings Spark’s DataFrame model to streaming use cases. Interviews use it to test whether you understand streaming trade-offs: event time, state management, checkpoints, exactly-once claims, and integration with Kafka and lakehouse tables.

### Why it matters
- Many modern pipelines blend batch and streaming.
- Stateful streaming decisions directly impact correctness and cost.
- It connects Spark, Kafka, Delta, and orchestration topics naturally.

---

## 2. Core Concepts

- **Micro-batch**: Default execution model processing small batches repeatedly.
- **Continuous processing**: Lower-latency mode with narrower use cases.
- **Trigger**: Schedule for processing new data.
- **Checkpoint**: Durable metadata for progress and recovery.
- **Watermark**: Bound on late-arriving data handling.
- **State store**: Persistent state for aggregations, joins, and deduplication.
- **Output mode**: Append, update, or complete.

---

## 3. Streaming Flow

```text
Kafka / files / CDC source
          |
    Spark Structured Streaming
          |
   stateful operations + watermark
          |
   checkpoint + sink
          |
 Delta / Kafka / console / custom sink
```

---

## 4. Trade-offs and Comparisons

| Model | Best For | Benefit | Trade-off |
|-------|----------|---------|-----------|
| Micro-batch | Most Spark streaming jobs | Mature and flexible | Slightly higher latency |
| Continuous | Very low-latency cases | Lower processing delay | Fewer supported patterns |

| Choice | Benefit | Cost |
|--------|---------|------|
| Watermarking | Limits state growth | Late data may be dropped |
| Stateful aggregation | Rich streaming logic | Stateful storage and recovery overhead |
| Delta sink | Reliable table output | File-layout and compaction management |

---

## 5. Practical Examples

### Kafka to Delta
```python
df = (
    spark.readStream.format("kafka")
    .option("subscribe", "events")
    .load()
)
```

### Streaming concerns
```text
- event time vs processing time
- checkpoint location durability
- output sink idempotency
- state store growth over time
```

### Related legacy deep dives
- [Delta Lake 101](../../03-big-data-engineering/spark/integrations/Delta_Lake_101.md)
- [Spark Declarative Pipelines 101](../../03-big-data-engineering/spark/integrations/Spark_Declarative_Pipelines_101.md)

---

## 6. Cheat Sheet

- Micro-batch is the default mental model.
- Watermarks control late-data tolerance and state retention.
- Checkpoints are required for recovery and exactly-once style semantics.
- “Exactly once” depends on source, sink, and end-to-end idempotency.
- State is powerful but expensive.

---

## 7. Hands-on Drills

1. Design a streaming aggregation with 10-minute late-arrival tolerance.
2. Explain how to recover a job after a driver restart.
3. Compare Kafka-to-Delta streaming with scheduled batch ingestion.

---

## 8. Real-world Scenarios and Failure Modes

- **Checkpoint deleted accidentally**: Job may restart incorrectly or reprocess large amounts of data.
- **Late data floods state store**: Watermark and window settings are too loose.
- **Output duplicates after retry**: Sink or downstream workflow is not idempotent.
- **Small files in Delta sink**: Micro-batch frequency and file compaction need tuning.

---

## 9. Interview Q&A

**Q1: What is Structured Streaming?**  
A streaming model built on Spark’s DataFrame/Dataset APIs.

**Q2: What is a watermark?**  
A rule that limits how long late data is considered for stateful operations.

**Q3: Why are checkpoints important?**  
They store progress and state needed for recovery.

**Q4: Micro-batch vs continuous processing?**  
Micro-batch is more common and flexible; continuous targets lower latency but supports fewer patterns.

**Q5: What is the state store?**  
The persisted state used for aggregations, deduplication, and joins over streams.

**Q6: Does Spark always provide exactly-once processing?**  
Not end to end; it depends on the source, sink, and idempotent handling.

**Q7: Why can streaming jobs create many small files?**  
Frequent micro-batches may write many tiny outputs.

**Q8: What is event time?**  
The time when the event actually occurred, not when it was processed.

**Q9: When use append mode?**  
When completed rows can be emitted once without later updates.

**Q10: Why is late data tricky?**  
Handling it improves correctness but increases state and complexity.
