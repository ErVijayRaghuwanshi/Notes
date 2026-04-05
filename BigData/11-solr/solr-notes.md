# 🔎 Solr - Big Data Notes

---

## 1. Introduction

Solr appears in interviews when the data platform supports search use cases alongside batch and analytics. It is useful for discussing indexing, relevance, schema design, and the difference between analytical querying and search retrieval.

### Why it matters
- Search workloads behave differently from Spark or warehouse workloads.
- Solr is still present in enterprise data platforms and search-heavy stacks.
- It helps explain indexing, analyzers, and near-realtime retrieval trade-offs.

---

## 2. Core Concepts

- **Collection**: Logical search index in SolrCloud.
- **Shard**: Partition of a collection.
- **Replica**: Copy of a shard for availability and scale.
- **Core**: Single searchable index instance.
- **Schema**: Field definitions and types.
- **Analyzer**: Tokenization and normalization pipeline for indexing/querying.
- **Inverted index**: Mapping from tokens to documents.
- **SolrCloud**: Distributed Solr deployment with coordinated cluster behavior.

---

## 3. Search Flow

```text
Source data
   |
Spark / ingestion jobs
   |
Transform and index documents
   |
Solr collection
   |
query -> shard routing -> ranking -> response
```

---

## 4. Trade-offs and Comparisons

| Engine | Best For | Benefit | Trade-off |
|--------|----------|---------|-----------|
| Solr | Enterprise search and schema control | Mature search features | Separate serving/index layer to operate |
| Warehouse SQL | Analytics and aggregation | Rich analytical queries | Not optimized for search relevance |
| Trino | Interactive SQL federation | Fast SQL over many sources | Not a search engine |

| Solr Design Choice | Benefit | Risk |
|--------------------|---------|------|
| More shards | More scale | Operational overhead and query fanout |
| Rich analyzers | Better recall/relevance | Schema tuning complexity |

---

## 5. Practical Examples

### Search index use cases
```text
- Product search
- Log/event search
- Metadata catalog search
- Full-text search over documents
```

### Pipeline pattern
```text
Kafka / batch source -> Spark enrich -> Solr index
```

### Good interview distinction
```text
Solr serves search
Trino serves SQL queries
Spark builds and enriches the search index
```

---

## 6. Cheat Sheet

- Solr is for search and retrieval, not large-scale ETL execution.
- Schema and analyzers strongly influence relevance.
- Shards scale data; replicas scale availability and read throughput.
- Search index freshness and ingestion lag are key platform concerns.

---

## 7. Hands-on Drills

1. Explain when to use Solr instead of warehouse SQL.
2. Design a Spark-to-Solr indexing pipeline.
3. Tune shard vs replica count for a read-heavy search workload.

---

## 8. Real-world Scenarios and Failure Modes

- **Index lag grows**: Ingestion or commit strategy cannot keep up with document volume.
- **Bad analyzer choice**: Search quality degrades even though indexing succeeds.
- **Too many shards**: Query coordination overhead grows and operations become noisy.

---

## 9. Interview Q&A

**Q1: What problem does Solr solve?**  
Full-text search and document retrieval with indexing and relevance features.

**Q2: What is an inverted index?**  
A structure mapping tokens to matching documents.

**Q3: Shard vs replica in Solr?**  
Shards partition data; replicas copy shards for availability and read scale.

**Q4: Why use analyzers?**  
They transform text consistently for indexing and querying.

**Q5: Solr vs Trino?**  
Solr is for search; Trino is for distributed SQL queries.

**Q6: Why might Spark feed Solr?**  
Spark can clean, enrich, and prepare data before indexing.

**Q7: What is SolrCloud?**  
A distributed Solr mode for managing collections, shards, and replicas.

**Q8: Why can search freshness lag matter?**  
Users may not find recently indexed content immediately.

**Q9: What is schema design in Solr?**  
Defining fields, types, analyzers, and indexing behavior.

**Q10: Why is Solr relevant in data platforms?**  
It complements analytical engines by serving search-centric access patterns.
