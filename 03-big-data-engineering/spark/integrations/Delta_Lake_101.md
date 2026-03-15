# Delta Lake 101 Guide

A practical, interview-focused introduction to Delta Lake for reliable data lakes on top of object storage.

## 1) What is Delta Lake?

Delta Lake is an open table format that adds **ACID transactions**, **schema enforcement**, **time travel**, and **reliable upserts/deletes** to data lakes (Parquet on S3/ADLS/GCS/HDFS).

### Why teams use it
- Prevents corrupted/partial writes
- Supports batch + streaming on the same table
- Enables `MERGE`, `UPDATE`, `DELETE`
- Improves governance and reproducibility with table history

## 2) Core Concepts

### Transaction Log (`_delta_log`)
- Delta stores metadata and commit history as JSON/Parquet files in `_delta_log`.
- Each commit is a new version (`00000000000000000010.json`, etc.).

### ACID Guarantees
- **Atomicity**: Commit fully succeeds or fails
- **Consistency**: Constraints/schema checks are enforced
- **Isolation**: Concurrent writers use optimistic concurrency control
- **Durability**: Committed versions remain recoverable

### Time Travel
Query previous snapshots by version or timestamp.

```sql
SELECT * FROM sales VERSION AS OF 10;
SELECT * FROM sales TIMESTAMP AS OF '2026-03-01 10:00:00';
```

## 3) Delta vs Plain Parquet

| Capability | Parquet | Delta Lake |
|---|---|---|
| ACID transactions | No | Yes |
| Upsert/Delete/Update | Hard/manual rewrite | Native (`MERGE/DELETE/UPDATE`) |
| Schema enforcement | Weak | Strong |
| Time travel | No | Yes |
| Table history | No | Yes |

## 4) Create and Use Delta Tables

### SQL
```sql
CREATE TABLE IF NOT EXISTS sales (
  order_id STRING,
  customer_id STRING,
  amount DECIMAL(12,2),
  event_time TIMESTAMP
) USING DELTA;
```

### PySpark write
```python
(
  df.write
    .format("delta")
    .mode("append")
    .save("s3://datalake/sales")
)
```

## 5) Upserts with MERGE (Most Important)

```sql
MERGE INTO sales AS target
USING sales_updates AS source
ON target.order_id = source.order_id
WHEN MATCHED THEN UPDATE SET
  target.amount = source.amount,
  target.event_time = source.event_time
WHEN NOT MATCHED THEN INSERT *;
```

Use cases:
- CDC ingestion
- Slowly changing dimensions
- Late-arriving events correction

## 6) Schema Enforcement and Evolution

### Enforcement
- Writes fail when incoming schema is incompatible.

### Evolution
Allow controlled schema changes.

```python
(
  df_new.write
    .format("delta")
    .mode("append")
    .option("mergeSchema", "true")
    .save("s3://datalake/sales")
)
```

## 7) Performance Best Practices

1. **Partition wisely**
   - Partition by low-to-medium cardinality columns (`date`, `region`), not high-cardinality IDs.
2. **Optimize small files**
   - Compact many tiny files into fewer larger files.
3. **Z-Ordering (if supported in your runtime)**
   - Co-locate data by frequently filtered columns.
4. **Vacuum old files**
   - Clean obsolete files after retention window.
5. **Avoid over-partitioning**
   - Too many partitions increase metadata overhead.

## 8) Operations You Should Know

```sql
-- See commit history
DESCRIBE HISTORY sales;

-- Delete old/invalid records
DELETE FROM sales WHERE event_time < '2024-01-01';

-- Update rows
UPDATE sales SET amount = amount * 1.05 WHERE customer_id = 'C1001';

-- Optimize table files (runtime dependent)
OPTIMIZE sales;

-- Remove obsolete files (be careful with retention)
VACUUM sales RETAIN 168 HOURS;
```

## 9) Common Production Patterns

### Bronze / Silver / Gold (Medallion)
- **Bronze**: raw ingest
- **Silver**: cleaned + deduplicated
- **Gold**: business aggregates and serving tables

### Streaming + Batch Unification
- Stream writes into Delta tables
- Batch jobs read the same Delta table consistently

## 10) Interview Q&A

### Q1: Why Delta Lake over Parquet?
**Answer:** Delta adds ACID transactions, time travel, schema enforcement, and upserts/deletes, making lake data reliable for production.

### Q2: How does Delta handle concurrent writes?
**Answer:** It uses optimistic concurrency control with commit conflict detection in `_delta_log`.

### Q3: What is time travel used for?
**Answer:** Debugging bad writes, reproducing reports, rollback/recovery, and auditability.

### Q4: When does `MERGE` become expensive?
**Answer:** Large tables with poor partitioning, many small files, or non-selective join conditions.

### Q5: What are the biggest Delta performance pitfalls?
**Answer:** Small file problem, over-partitioning, missing data skipping opportunities, and aggressive vacuum without retention planning.

## One-line Summary

> Delta Lake turns a data lake into a reliable data platform by adding ACID transactions, schema control, and versioned table operations.
