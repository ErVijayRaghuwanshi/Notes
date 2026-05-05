# 🗃️ HDFS - Big Data Notes

---

## 1. Introduction

HDFS is the storage backbone of classic Hadoop platforms and still shows up in interviews because it teaches distributed file-system trade-offs clearly: large-block storage, replication, metadata centralization, and throughput over low-latency access.

### Why it matters
- Explains how big-data storage differs from relational databases and object stores.
- Builds intuition for replication, failure recovery, and small-file problems.
- Still matters directly in on-prem clusters and indirectly in lakehouse design discussions.

---

## 2. Core Concepts

- **NameNode**: Stores filesystem metadata and block locations.
- **DataNode**: Stores actual HDFS blocks.
- **Block**: Fixed-size unit of data storage, often 128 MB or 256 MB.
- **Replication factor**: Number of block copies across nodes.
- **Rack awareness**: Placement strategy to reduce correlated failure risk.
- **HA NameNode**: Active/standby metadata layer for failover.
- **Small-file problem**: Too many tiny files overload metadata and scheduling.

---

## 3. Architecture and Data Flow

```text
Client
  |
  +--> NameNode ---------> block metadata
  |
  +--> DataNode A ----> DataNode B ----> DataNode C
         (replica 1)      (replica 2)      (replica 3)
```

### Write path
```text
1. Client asks NameNode for block targets
2. NameNode returns DataNode pipeline
3. Client streams to first DataNode
4. Replicas are chained to the next DataNodes
5. Acks flow back after successful writes
```

---

## 4. Trade-offs and Comparisons

| Storage | Best For | Benefit | Trade-off |
|---------|----------|---------|-----------|
| HDFS | Large analytic files in cluster | High throughput, locality | Poor for many small files |
| Object storage | Cloud-native data lakes | Cheap, elastic, durable | Higher metadata/listing latency |
| Local FS | Single-machine workloads | Simple | No horizontal scale |

| HDFS Design Choice | Advantage | Drawback |
|--------------------|-----------|----------|
| Large blocks | Fewer metadata entries | Wasteful for tiny files |
| Replication | Simple durability | Higher storage cost |
| Central metadata | Fast lookup | NameNode becomes critical control plane |

---

## 5. Practical Examples

### Common commands
```bash
hdfs dfs -ls /data/raw/events
hdfs dfs -du -h /warehouse
hdfs dfs -put local.csv /data/raw/
hdfs dfs -get /data/gold/report.parquet .
```

### Replica logic
```text
replication factor = 3
1 copy on local rack
1 more on same rack
1 on different rack
```

### Small-file mitigation
```text
- Compact files into larger Parquet/ORC batches
- Use table formats that manage metadata efficiently
- Avoid writing millions of tiny partition files
```

---

## 6. Cheat Sheet

- NameNode holds metadata; DataNodes hold blocks.
- HDFS favors large streaming reads/writes.
- Replication protects data but increases storage cost.
- Small files hurt metadata scalability badly.
- HA solves NameNode availability, not all storage problems.

---

## 7. Hands-on Drills

1. Explain the HDFS write path from client to replicas.
2. Diagnose a small-file problem in a Hive warehouse.
3. Compare HDFS to S3/ADLS for a lakehouse migration.

---

## 8. Real-world Scenarios and Failure Modes

- **NameNode pressure rises**: Check file counts, block counts, and tiny partition output.
- **Node failure**: HDFS re-replicates under-replicated blocks automatically.
- **Bad partitioning creates millions of files**: Compact outputs and revisit partition strategy.
- **Migration to cloud object storage**: Separate storage semantics from compute assumptions.

---

## 9. Interview Q&A

**Q1: What does the NameNode do?**  
It stores filesystem metadata and block placement information.

**Q2: Why does HDFS use large blocks?**  
To reduce metadata overhead and optimize high-throughput access.

**Q3: What is the small-file problem?**  
Too many small files create metadata pressure and poor job efficiency.

**Q4: Why replicate blocks?**  
For durability and availability after node failures.

**Q5: What is rack awareness?**  
A placement strategy that spreads replicas across racks to reduce correlated failure risk.

**Q6: Is HDFS good for low-latency random reads?**  
No, it is optimized for large streaming access.

**Q7: How does HDFS handle DataNode loss?**  
It detects under-replication and creates new copies elsewhere.

**Q8: What is HA NameNode?**  
Active/standby metadata nodes for failover.

**Q9: HDFS vs object storage?**  
HDFS is cluster-native and locality-aware; object storage is more elastic and cloud-friendly.

**Q10: Why do table formats matter on top of HDFS?**  
They improve metadata, schema handling, and reliable table operations.
