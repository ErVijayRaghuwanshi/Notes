# 🏗️ Data Platform Architecture - Big Data Notes

---

## 1. Introduction

Platform architecture is where interviews combine all the individual tools into one coherent system. Strong answers show how storage, compute, streaming, metadata, orchestration, and access layers work together without blurring their responsibilities.

### Why it matters
- This is the synthesis layer for big-data interviews.
- It tests whether you think in platforms, not isolated tools.
- Good architecture answers balance batch, streaming, governance, and cost.

---

## 2. Core Concepts

- **Batch architecture**: Scheduled processing over accumulated data.
- **Streaming architecture**: Continuous ingestion and near-realtime processing.
- **Lambda architecture**: Separate batch and speed layers.
- **Kappa architecture**: Streaming-centric architecture with replay capability.
- **Lakehouse**: Data platform combining lake flexibility with table/warehouse semantics.
- **Bronze / Silver / Gold**: Progressive refinement layers for data quality and usability.
- **Lineage**: Tracking how data moves and transforms across the platform.
- **Governance**: Ownership, policies, quality, access control, and metadata.

---

## 3. Platform Blueprint

```text
Sources -> Kafka / batch ingest / CDC
             |
        Orchestration (Airflow)
             |
        Compute (Spark)
             |
  Table formats (Delta / Iceberg / Hudi)
             |
  Access layer (Trino / Hive / BI / Solr)
             |
 governance, lineage, observability
```

---

## 4. Trade-offs and Comparisons

| Pattern | Best For | Benefit | Trade-off |
|---------|----------|---------|-----------|
| Batch | Daily/hourly ETL | Simpler and cheaper | Higher latency |
| Streaming | Realtime pipelines | Fresh data | Higher operational complexity |
| Lambda | Mixed freshness needs | Clear batch + speed roles | Duplication of logic |
| Kappa | Stream-first platforms | Unified processing model | Replay and state design become critical |

| Layer | Responsibility | Avoid Confusing With |
|-------|----------------|----------------------|
| Orchestration | Scheduling and dependencies | Data execution engine |
| Compute | Transforming and enriching data | Long-term storage or serving layer |
| Table format | Reliable table semantics | Raw compute engine |
| Query engine | Interactive access | ETL orchestration |

---

## 5. Practical Examples

### Bronze / Silver / Gold
```text
Bronze -> raw ingest with minimal transformation
Silver -> cleaned, deduplicated, conformed data
Gold   -> curated metrics and business-ready views
```

### Good platform split
```text
Kafka handles event transport
Spark handles transformation
Delta/Iceberg handle reliable tables
Trino handles analyst querying
Airflow handles scheduling and backfills
```

### Governance checklist
```text
- dataset ownership
- schema contracts
- lineage
- access control
- freshness SLA
- quality checks
```

---

## 6. Cheat Sheet

- Keep orchestration, execution, storage, and serving responsibilities distinct.
- Batch vs streaming is a product and cost decision, not just a technology decision.
- Bronze / silver / gold is a useful communication model for data quality tiers.
- Lineage and governance are platform features, not documentation afterthoughts.
- Multi-engine access requires strong metadata and table-format choices.

---

## 7. Hands-on Drills

1. Design a lakehouse platform for product analytics plus ML features.
2. Compare lambda and kappa for a fraud-detection pipeline.
3. Explain how governance fits into a self-service data platform.

---

## 8. Real-world Scenarios and Failure Modes

- **Streaming where batch would do**: Platform becomes harder and more expensive than necessary.
- **No ownership model**: Data quality and broken dashboards go unresolved.
- **Multiple engines writing the same tables carelessly**: Metadata and interoperability issues appear fast.
- **No lineage**: Root-cause analysis after bad data incidents becomes slow and political.

---

## 9. Interview Q&A

**Q1: What is a lakehouse?**  
A platform combining data-lake storage flexibility with warehouse-style table reliability.

**Q2: Lambda vs kappa?**  
Lambda separates batch and speed layers; kappa uses a streaming-first model with replay.

**Q3: What are bronze, silver, and gold layers?**  
Data quality tiers from raw ingest to business-ready curated outputs.

**Q4: Why is lineage important?**  
It helps trace where data came from and what transformations affected it.

**Q5: Why separate orchestration from compute?**  
Scheduling concerns and data processing concerns scale differently and should stay distinct.

**Q6: What is governance in a data platform?**  
Policies, ownership, quality, security, and metadata management.

**Q7: Why use multiple query engines?**  
Different users and workloads need different latency and access patterns.

**Q8: When is streaming overkill?**  
When the product can tolerate hourly or daily freshness with much simpler operations.

**Q9: What makes a strong data-platform answer?**  
Clear separation of layers, ownership, freshness strategy, and reliable table semantics.

**Q10: What is the main risk of a multi-engine lakehouse?**  
Inconsistent metadata or write semantics if interoperability is poorly designed.
