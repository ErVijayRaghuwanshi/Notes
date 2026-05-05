# 🐝 Hive and Metastore - Big Data Notes

---

## 1. Introduction

Hive still shows up often in interviews because it introduced warehouse-style thinking to data lakes: schemas on files, managed tables, partitions, and a metadata layer shared by engines like Spark.

### Why it matters
- Explains how tables become discoverable and queryable over data-lake storage.
- Builds intuition for partition design, metastore role, and warehouse organization.
- Helps frame modern table formats as an evolution, not a total replacement.

---

## 2. Core Concepts

- **Hive**: SQL warehouse framework over large datasets.
- **Metastore**: Metadata service storing table definitions, schemas, partitions, and locations.
- **Managed table**: Table whose lifecycle is owned by the warehouse.
- **External table**: Table whose data lifecycle is managed separately.
- **Partition**: Logical pruning dimension mapped to path layout.
- **Serde**: Serializer/deserializer for interpreting data formats.
- **Warehouse directory**: Default root location for managed tables.

---

## 3. Metadata View

```text
SQL engine (Hive / Spark / Trino)
          |
      Metastore
          |
   table schema + partitions + location
          |
 HDFS / object storage files
```

---

## 4. Trade-offs and Comparisons

| Table Type | Best For | Benefit | Trade-off |
|------------|----------|---------|-----------|
| Managed | Warehouse-owned datasets | Simpler lifecycle control | Less flexible for shared storage |
| External | Shared or independently managed data | Safer for lakehouse sharing | Lifecycle is outside the engine |

| Partitioning Choice | Benefit | Risk |
|---------------------|---------|------|
| Time partitioning | Simple pruning | Too many tiny partitions if overdone |
| High-cardinality partitioning | Precise filtering | Metadata and small-file explosion |

---

## 5. Practical Examples

### Common partition example
```sql
CREATE EXTERNAL TABLE events (
  user_id STRING,
  event_type STRING,
  ts TIMESTAMP
)
PARTITIONED BY (dt STRING)
STORED AS PARQUET
LOCATION '/warehouse/events';
```

### Spark and Hive
```text
Spark can read Hive metastore definitions
Hive metastore can be shared by multiple compute engines
```

### Good design rule
```text
Partition by columns frequently used for pruning
Avoid partitioning so finely that each partition contains tiny files
```

---

## 6. Cheat Sheet

- Hive is about warehouse-style access over file-based data.
- The metastore is the control plane for table discovery.
- External tables are common in modern data lakes.
- Partitioning is powerful, but over-partitioning hurts badly.
- Spark often uses Hive metastore even when Hive itself is not the main execution engine.

---

## 7. Hands-on Drills

1. Explain managed vs external tables.
2. Choose a partition strategy for daily event data.
3. Describe how Spark uses Hive metastore in a shared platform.

---

## 8. Real-world Scenarios and Failure Modes

- **Metastore outage**: Table discovery and many SQL workflows stop, even if data files still exist.
- **Too many partitions**: Metadata operations slow down and files become tiny.
- **Dropped managed table deletes data unexpectedly**: Use external tables for shared assets.

---

## 9. Interview Q&A

**Q1: What is Hive metastore?**  
A metadata service storing schemas, partitions, and table locations.

**Q2: Managed vs external table?**  
Managed tables let the warehouse own data lifecycle; external tables keep storage lifecycle separate.

**Q3: Why partition Hive tables?**  
To enable pruning and reduce scanned data.

**Q4: Why can over-partitioning be harmful?**  
It creates too many metadata entries and too many tiny files.

**Q5: Does Spark depend on Hive?**  
Not for execution, but it often uses Hive metastore for shared table metadata.

**Q6: What is a warehouse directory?**  
The default location where managed table data is stored.

**Q7: What is partition pruning?**  
Skipping partitions that do not match the query filter.

**Q8: Why use external tables in lakehouses?**  
They are safer for shared storage and multi-engine access.

**Q9: What is a SerDe?**  
A mechanism Hive uses to read and write specific data formats.

**Q10: Why is Hive still relevant?**  
Its metadata and warehouse concepts remain foundational in many modern platforms.
