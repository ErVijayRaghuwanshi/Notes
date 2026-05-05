# 🧊 Iceberg and Open Table Formats - Big Data Notes

---

## 1. Introduction

Open table formats are central to modern lakehouse discussions because they bring table semantics to object storage while supporting multiple query engines. Interviews often use them to test how you reason about interoperability, metadata, and long-term platform choices.

### Why it matters
- Table formats are now a core platform design decision.
- Multi-engine access is often more important than raw file format alone.
- Delta, Iceberg, and Hudi each optimize for slightly different strengths.

---

## 2. Core Concepts

- **Table format**: Layer managing metadata, snapshots, and reliable table operations over files.
- **Iceberg**: Open table format focused on engine interoperability and scalable metadata.
- **Snapshot**: Consistent table version referencing file sets.
- **Manifest**: Metadata listing data files for planning.
- **Partition evolution**: Changing partition strategy without rewriting all historical data.
- **Hudi**: Table format emphasizing incremental ingestion and record-level upsert workflows.

---

## 3. Metadata View

```text
SQL / Spark / Trino / Flink
           |
      table metadata
           |
   snapshots -> manifests -> data files
           |
      object storage / HDFS
```

---

## 4. Trade-offs and Comparisons

| Format | Best For | Benefit | Trade-off |
|--------|----------|---------|-----------|
| Delta | Spark-centric lakehouse | Strong Spark integration and ACID workflows | Multi-engine support depends on surrounding ecosystem |
| Iceberg | Multi-engine analytics | Strong interoperability and snapshot metadata model | Different ops/tooling patterns than Delta |
| Hudi | Incremental ingestion and CDC-style flows | Fast record-level update patterns | More mode complexity to explain and operate |

| Capability | Delta | Iceberg | Hudi |
|-----------|-------|---------|------|
| ACID transactions | Yes | Yes | Yes |
| Time travel | Yes | Yes | Yes |
| Broad engine portability | Medium | High | Medium |
| CDC/upsert ergonomics | High | Medium | High |

---

## 5. Practical Examples

### Good interview framing
```text
Choose Delta when Spark is the center of gravity
Choose Iceberg when multi-engine interoperability matters most
Choose Hudi when incremental ingestion and record-level updates dominate
```

### Why Iceberg stands out
```text
- snapshot-based planning
- manifest metadata
- hidden partitioning concepts
- partition evolution without full rewrite
```

### Design question to expect
```text
How do you let Spark, Trino, and another engine share one lakehouse table safely?
```

---

## 6. Cheat Sheet

- Table formats are the reliability layer above Parquet/ORC files.
- Iceberg is often the most interoperability-focused answer.
- Delta is a strong Spark-first answer.
- Hudi is worth mentioning for CDC and incremental lake ingestion.
- Snapshot and metadata design matter as much as raw data files.

---

## 7. Hands-on Drills

1. Compare Delta and Iceberg for a multi-engine lakehouse.
2. Explain when Hudi fits better than Delta.
3. Describe partition evolution and why it matters.

---

## 8. Real-world Scenarios and Failure Modes

- **One engine writes metadata another engine reads poorly**: Table-format compatibility and catalog support become critical.
- **Partition design changes over time**: Iceberg partition evolution can reduce expensive rewrites.
- **Too many tiny commits**: Metadata planning and query startup degrade.

---

## 9. Interview Q&A

**Q1: What is an open table format?**  
A metadata and transaction layer over data-lake files that provides table semantics.

**Q2: Why is Iceberg popular?**  
It offers strong multi-engine interoperability and scalable snapshot metadata.

**Q3: Delta vs Iceberg?**  
Delta is often stronger in Spark-centric workflows; Iceberg is often stronger for broad multi-engine querying.

**Q4: Where does Hudi fit?**  
In incremental ingestion and CDC-heavy use cases with record-level update focus.

**Q5: What is a snapshot?**  
A consistent version of the table referencing a known set of data files.

**Q6: What is partition evolution?**  
Changing partition strategy without rewriting all old data files.

**Q7: Why are table formats better than plain Parquet directories?**  
They add reliable metadata, schema control, and transactional behavior.

**Q8: Why does interoperability matter?**  
Platforms often want Spark, Trino, and other engines to share the same tables.

**Q9: What is a manifest in Iceberg?**  
A metadata file describing groups of data files for planning.

**Q10: When is Delta a better answer than Iceberg?**  
When Spark is the dominant engine and Delta-native workflows are central.
