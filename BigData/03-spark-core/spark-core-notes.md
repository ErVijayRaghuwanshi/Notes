# ⚡ Spark Core - Big Data Notes

---

## 1. Introduction

Spark Core is the heart of many data-engineering interviews. It covers the execution model that later shows up in Spark SQL, Structured Streaming, and lakehouse pipelines: lazy evaluation, DAG planning, stages, shuffles, and fault recovery through lineage.

### Why it matters
- Spark remains the default compute engine in many data platforms.
- Understanding stages and shuffles is key to debugging performance.
- The core model explains both batch and streaming behavior.

---

## 2. Core Concepts

- **RDD**: Low-level resilient distributed dataset.
- **DataFrame**: Distributed tabular abstraction with schema.
- **Dataset**: Typed API, used more often in Scala/Java than Python.
- **Transformation**: Lazy operation that defines a new dataset.
- **Action**: Operation that triggers execution.
- **Stage**: Group of tasks separated by shuffle boundaries.
- **Task**: Smallest unit of execution on one partition.
- **Lineage**: Dependency graph used for recomputation on failure.

---

## 3. Execution Model

```text
Source Data
   |
Transformations
   |
Logical DAG
   |
Stage Planning
   |
Tasks per Partition
   |
Executors
```

### Narrow vs wide
```text
Narrow: map, filter, union
Wide: groupByKey, reduceByKey, join, repartition
```

---

## 4. Trade-offs and Comparisons

| Abstraction | Best For | Benefit | Trade-off |
|-------------|----------|---------|-----------|
| RDD | Fine-grained control | Flexible and explicit | More manual optimization |
| DataFrame | Most ETL and analytics | Optimized planner and SQL support | Less explicit low-level control |
| Dataset | Strong typing in Scala/Java | Compile-time safety | Less common in Python-heavy teams |

| Operation Type | Benefit | Cost |
|----------------|---------|------|
| Narrow transformation | Better pipelining | Limited reshaping |
| Wide transformation | Enables aggregation and joins | Shuffle, network, disk, spill |

---

## 5. Practical Examples

### PySpark example
```python
df = spark.read.parquet("/warehouse/sales")
result = (
    df.filter("amount > 100")
      .groupBy("country")
      .sum("amount")
)
result.write.mode("overwrite").parquet("/warehouse/gold/top_sales")
```

### Job reasoning
```text
filter -> narrow
groupBy -> wide, shuffle boundary
write -> action
```

### Legacy deep dives
- [Actions vs Transformations](../../03-big-data-engineering/spark/core-concepts/Actions_vs_Transformations.md)
- [Narrow vs Wide Transformations](../../03-big-data-engineering/spark/core-concepts/Narrow_vs_Wide_Transformations.md)

---

## 6. Cheat Sheet

- Transformations are lazy; actions trigger execution.
- One shuffle often means a new stage boundary.
- Prefer DataFrame API for production ETL unless low-level control is required.
- Wide transformations are the main source of cost and performance pain.
- Lineage enables fault recovery without full dataset replication.

---

## 7. Hands-on Drills

1. Explain how Spark turns a DataFrame pipeline into stages.
2. Identify wide transformations in a slow ETL job.
3. Compare RDD and DataFrame choices for a custom parsing workload.

---

## 8. Real-world Scenarios and Failure Modes

- **Job unexpectedly creates many stages**: Inspect shuffles and unnecessary repartitions.
- **Driver OOM from `collect()`**: Keep data distributed or sample instead.
- **Slow groupBy over skewed keys**: Repartition, salt, or pre-aggregate.
- **Task failures on one executor**: Spark can recompute lost partitions via lineage.

---

## 9. Interview Q&A

**Q1: What is lazy evaluation in Spark?**  
Spark records transformations and waits until an action is called before executing.

**Q2: What is the difference between transformation and action?**  
Transformations define work; actions trigger actual execution.

**Q3: What is a stage?**  
A group of tasks Spark can run without crossing a shuffle boundary.

**Q4: Why prefer DataFrame over RDD in most cases?**  
It benefits from Catalyst and Tungsten optimizations.

**Q5: What is lineage?**  
The dependency graph Spark uses to recompute lost partitions after failure.

**Q6: What causes a shuffle?**  
Operations that require data movement across partitions, like joins and aggregations.

**Q7: What is a task in Spark?**  
The work performed on one partition by one executor slot.

**Q8: Why is `groupByKey()` often discouraged?**  
It can move more data than necessary and create memory pressure.

**Q9: What happens if an executor dies?**  
Spark can reschedule and recompute affected partitions from lineage.

**Q10: How do narrow transformations help performance?**  
They avoid full data redistribution and pipeline more efficiently.
