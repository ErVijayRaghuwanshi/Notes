# 🧱 Delta Lake and Delta Tables - Big Data Notes

---

## 1. Introduction

Delta Lake is one of the most common lakehouse interview topics because it solves practical reliability problems in data lakes: concurrent writes, schema control, and update/delete support on open storage.

### Why it matters
- Turns file-based lakes into production-grade tables.
- Supports reliable ETL, streaming, and incremental processing.
- Often sits at the center of Spark-based lakehouse architectures.

---

## 2. Core Concepts

- **Delta table**: Table format with transaction log and ACID semantics.
- **`_delta_log`**: Log of commits and table metadata.
- **ACID transaction**: Atomic, isolated table commit over data files.
- **Schema enforcement**: Preventing incompatible writes.
- **Schema evolution**: Controlled changes to table schema.
- **MERGE**: Upsert-style update into a Delta table.
- **Time travel**: Read previous table versions.
- **OPTIMIZE / VACUUM**: Maintenance for file layout and stale file cleanup.

---

## 3. Delta Flow

```text
Spark batch / stream
        |
   Delta write transaction
        |
   data files + _delta_log commit
        |
  readers see consistent snapshot
```

---

## 4. Trade-offs and Comparisons

| Format | Best For | Benefit | Trade-off |
|--------|----------|---------|-----------|
| Plain Parquet | Simple file-based storage | Lightweight | No table transactions or reliable upserts |
| Delta Lake | Spark-heavy lakehouse | Strong ACID + mature Spark integration | Ecosystem support less universal than Iceberg |
| Iceberg | Multi-engine table access | Strong engine interoperability | Different tooling/operational model |

---

## 5. Practical Examples

### Table operations
```sql
MERGE INTO target t
USING updates u
ON t.id = u.id
WHEN MATCHED THEN UPDATE SET *
WHEN NOT MATCHED THEN INSERT *
```

### Medallion flow
```text
Bronze -> raw landing
Silver -> cleaned and standardized
Gold   -> business-ready aggregates
```

### Legacy deep dives
- [Delta Lake 101](../../03-big-data-engineering/spark/integrations/Delta_Lake_101.md)
- [Livy Delta Lake](../../03-big-data-engineering/spark/integrations/Livy_Delta_Lake.md)

---

## 6. Cheat Sheet

- Delta adds ACID semantics on top of data-lake files.
- `_delta_log` is the control plane for table state.
- MERGE is core for CDC and incremental ETL.
- OPTIMIZE and compaction matter for read performance.
- VACUUM needs retention awareness and safety controls.

---

## 7. Hands-on Drills

1. Explain why Delta is safer than plain Parquet for production tables.
2. Design a bronze-to-silver merge pipeline.
3. Diagnose a Delta table with too many tiny files.

---

## 8. Real-world Scenarios and Failure Modes

- **Many small files**: Query performance drops until compaction or OPTIMIZE runs.
- **Schema drift from upstream JSON**: Enforce contracts and evolve deliberately.
- **Unsafe VACUUM**: Removes files needed for time travel or slow readers.
- **Concurrent upserts**: Transaction log manages isolation, but workload shape still matters.

---

## 9. Interview Q&A

**Q1: What problem does Delta Lake solve?**  
It adds reliable table semantics like ACID transactions and schema control to data lakes.

**Q2: What is `_delta_log`?**  
The transaction log containing commit history and table metadata.

**Q3: Why use MERGE?**  
To implement upserts and CDC-style updates efficiently.

**Q4: What is time travel?**  
Reading a previous snapshot version of the table.

**Q5: Delta vs Parquet?**  
Parquet is a file format; Delta is a table format layered on top of files.

**Q6: Why is schema enforcement useful?**  
It prevents corrupted or incompatible writes from silently entering production tables.

**Q7: What does VACUUM do?**  
It removes no-longer-needed old files after a retention period.

**Q8: Why compact Delta files?**  
To reduce small-file overhead and improve scan performance.

**Q9: Can Delta be used for streaming and batch together?**  
Yes, that is one of its strongest platform patterns.

**Q10: When might Iceberg be a better fit?**  
When broader multi-engine interoperability is a top priority.
