# ⚡ Rapid-Fire Technical Big Data Questions

Use these for short mock-interview rounds focused on platform fundamentals and practical trade-offs.

---

## Foundations

**Q1: Hadoop vs Spark?**  
Hadoop is the broader ecosystem; Spark is a compute engine often used within modern data platforms.

**Q2: What is YARN?**  
A cluster scheduler and resource manager for distributed applications.

**Q3: What problem does HDFS solve?**  
Distributed storage for large files with replication and high-throughput access.

**Q4: Why is the small-file problem bad in HDFS?**  
Too many small files overload metadata and hurt job efficiency.

**Q5: What is lazy evaluation in Spark?**  
Spark records transformations and waits for an action before executing.

## Spark and Streaming

**Q6: What causes a shuffle in Spark?**  
Operations like joins, aggregations, and repartitions that move data across partitions.

**Q7: DataFrame vs RDD?**  
DataFrames are usually preferred because Spark can optimize them more effectively.

**Q8: What is AQE?**  
Adaptive Query Execution adjusts Spark plans at runtime using observed statistics.

**Q9: What is a watermark in Structured Streaming?**  
A rule controlling how long late events are considered in stateful operations.

**Q10: Does Spark always provide exactly-once processing?**  
Not end to end; it depends on source, sink, and idempotent handling.

## Messaging and Lakehouse

**Q11: What is a Kafka partition?**  
An ordered log segment within a topic.

**Q12: Why does partition key choice matter in Kafka?**  
It determines ordering and load balance.

**Q13: What problem does Delta Lake solve?**  
Reliable ACID-style table operations on data-lake files.

**Q14: Delta vs Iceberg?**  
Delta is often stronger in Spark-centric environments; Iceberg is often stronger for broad multi-engine interoperability.

**Q15: Where does Hudi fit?**  
In incremental ingestion and CDC-heavy use cases.

## Query and Platform

**Q16: What is Hive metastore?**  
A metadata service storing table schemas, locations, and partitions.

**Q17: What is Trino?**  
A distributed SQL engine for interactive analytics across multiple sources.

**Q18: Solr vs Trino?**  
Solr is for search; Trino is for distributed SQL.

**Q19: Airflow vs Spark?**  
Airflow orchestrates workflows; Spark executes data processing.

**Q20: What is a lakehouse?**  
A data platform combining lake storage with warehouse-style table reliability.
