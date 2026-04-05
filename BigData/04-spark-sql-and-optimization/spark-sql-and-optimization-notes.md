# 🧠 Spark SQL and Optimization - Big Data Notes

---

## 1. Introduction

Spark SQL is where performance interviews usually get concrete. Interviewers expect you to connect planner behavior, partitioning, joins, and skew with what you see in the Spark UI and in job metrics.

### Why it matters
- Most production Spark workloads are written in DataFrame or SQL style.
- Query plans explain most performance wins and regressions.
- Optimizing the wrong layer wastes cluster cost quickly.

---

## 2. Core Concepts

- **Catalyst**: Spark’s logical and physical query optimizer.
- **Tungsten**: Execution-layer optimizations around memory and code generation.
- **AQE**: Adaptive Query Execution that adjusts plans at runtime.
- **Broadcast join**: Sends a small table to all executors to avoid large shuffles.
- **Partitioning**: Data layout across tasks or files.
- **Bucketing**: Hash-based organization to improve some joins and scans.
- **Skew**: Uneven distribution of data across keys or partitions.
- **Spark UI**: Runtime view into jobs, stages, tasks, shuffle, and spills.

---

## 3. Optimization View

```text
SQL / DataFrame
    |
Logical Plan
    |
Catalyst Optimization
    |
Physical Plan
    |
AQE adjustments
    |
Stages / Tasks / Shuffle / Spill
```

---

## 4. Trade-offs and Comparisons

| Technique | Best For | Benefit | Trade-off |
|-----------|----------|---------|-----------|
| Broadcast join | Small dimension tables | Avoids big shuffle | Broadcast size limits |
| Repartition | Better parallelism or join alignment | Balance work | Full shuffle cost |
| Coalesce | Reduce partitions after wide work | Fewer output files | Less even parallelism |
| Cache | Reused datasets | Faster repeated access | Memory pressure |
| Bucketing | Repeated join patterns | Better scan/join layout | Extra write complexity |

---

## 5. Practical Examples

### Join hint
```python
from pyspark.sql.functions import broadcast

result = fact.join(broadcast(dim), "customer_id")
```

### Common tuning questions
```text
- Is there skew on one key?
- Are output files too small?
- Is shuffle read/write dominating runtime?
- Is AQE enabled and actually helping?
```

### Key UI metrics
```text
shuffle read / write
spill to disk
task duration spread
GC time
input size per partition
```

---

## 6. Cheat Sheet

- Read the physical plan before guessing.
- Broadcast small tables when it clearly avoids a large shuffle.
- AQE helps, but it does not fix bad upstream modeling automatically.
- Repartition for correctness and balance, not blindly.
- Too many tiny files and skew are two of the most common real problems.

---

## 7. Hands-on Drills

1. Explain when to use `repartition()` vs `coalesce()`.
2. Diagnose a slow join with one hot customer key.
3. Walk through a Spark UI screenshot and identify bottlenecks.

---

## 8. Real-world Scenarios and Failure Modes

- **Skewed join**: One partition runs far longer than the rest; use salting, skew handling, or redesign.
- **Cache everything**: Executors spend time evicting and GC thrashing.
- **Tiny-file explosion**: Tune partition counts and compaction strategy.
- **Broadcast too large**: Driver/executor memory problems appear instead of shuffle pain.

---

## 9. Interview Q&A

**Q1: What is Catalyst?**  
Spark’s optimizer that rewrites logical plans into efficient physical execution plans.

**Q2: What is AQE?**  
Adaptive Query Execution changes parts of the physical plan at runtime using observed statistics.

**Q3: When use a broadcast join?**  
When one side is small enough to ship to all executors efficiently.

**Q4: Repartition vs coalesce?**  
Repartition can increase or decrease partitions with shuffle; coalesce usually reduces them with less movement.

**Q5: What is data skew?**  
Uneven key or partition distribution causing stragglers.

**Q6: Why is the Spark UI important?**  
It shows stage boundaries, shuffle costs, spills, and task imbalance.

**Q7: What causes disk spill?**  
Not enough executor memory for sort, aggregation, or shuffle processing.

**Q8: Why can too many partitions hurt?**  
Scheduling overhead and tiny output files can outweigh parallelism gains.

**Q9: What is Tungsten?**  
Spark execution optimizations around memory layout and code generation.

**Q10: What is the first thing to inspect in a slow Spark SQL job?**  
The plan and runtime metrics, especially shuffle, skew, and file layout.
