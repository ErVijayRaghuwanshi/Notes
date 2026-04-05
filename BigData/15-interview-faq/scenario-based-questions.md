# 🧠 Scenario-Based Big Data Questions

Use these to practice architecture and troubleshooting follow-ups after the initial design.

---

**Q1: Your Spark job is slow, but cluster CPU looks low. Where do you inspect next?**  
Look at shuffle, skew, task imbalance, input file layout, spills, and query plan issues before assuming compute shortage.

**Q2: Your HDFS cluster is healthy, but NameNode memory keeps growing. What is a likely cause?**  
A small-file explosion or excessive partition/file counts increasing metadata load.

**Q3: A Kafka topic has one partition far behind the others. What do you suspect first?**  
Hot partitioning from a bad key or one consumer processing a disproportionately heavy partition.

**Q4: Airflow backfill for 180 days begins to overwhelm your lakehouse. What do you change?**  
Throttle concurrency, batch historical windows, isolate queues, and confirm downstream tables can absorb the replay safely.

**Q5: Your Structured Streaming job restarts and begins duplicating data. What do you inspect?**  
Checkpoint integrity, sink idempotency, offset management, and whether downstream writes are transactional.

**Q6: Your Delta table query performance keeps degrading over time. What are the top suspects?**  
Many small files, poor partitioning, missing compaction/OPTIMIZE, and stale data layout assumptions.

**Q7: Analysts want one SQL engine across Hive, Iceberg, and a relational DB. What platform component do you propose?**  
An interactive distributed query layer like Trino, with careful connector and metadata governance.

**Q8: Search results are stale even though the warehouse tables are current. Why might that happen?**  
The Solr indexing pipeline is lagging, or commit/index refresh behavior is not keeping up.

**Q9: A team wants streaming for every pipeline because it feels modern. How do you push back?**  
Compare freshness needs against complexity, state cost, operational burden, and whether batch already meets the product SLA.

**Q10: Two engines write to the same lakehouse table and strange metadata issues appear. What is the first concern?**  
Whether the chosen table format and catalog configuration safely support that multi-engine write pattern.
