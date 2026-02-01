# 📘 Narrow vs Wide Transformations in Apache Spark

---

## 🔹 1. What is a Transformation in Spark?

A **transformation** is an operation that creates a **new RDD or DataFrame** from an existing one.

### Key Points

* Transformations are **lazy**
* No execution happens until an **action** (e.g., `count()`, `collect()`) is called
* Transformations build a **DAG (Directed Acyclic Graph)** of execution
* Based on data dependency, transformations are classified as:

  * **Narrow Transformations**
  * **Wide Transformations**

---

## 🔹 2. Narrow Transformations

### ✅ Definition

A **narrow transformation** is one in which **each output partition depends on only one input partition**.

### ⚙️ How It Works

* Data does **not move** across the cluster
* Execution happens within the **same executor**
* Multiple narrow transformations can be **pipelined** together

### 📌 Key Characteristics

* ❌ No shuffle
* ❌ No network I/O
* ✅ Fast execution
* ✅ Low memory usage
* ✅ Easy fault recovery
* ✅ Executes within a single stage

### 🧠 Common Examples

```python
map()
filter()
flatMap()
union()
withColumn()
select()
drop()
coalesce()   # without shuffle
```

### 📌 Example

```python
rdd.map(lambda x: x * 2).filter(lambda x: x > 10)
```

👉 Both operations run in the **same stage**.

---

## 🔹 3. Wide Transformations

### ✅ Definition

A **wide transformation** is one in which **each output partition depends on multiple input partitions**.

### ⚙️ How It Works

* Data must be **redistributed** across executors
* Causes **shuffle**
* Requires disk + network I/O
* Creates a **stage boundary** in the DAG

### 📌 Key Characteristics

* ✅ Shuffle required
* ✅ Heavy network traffic
* ❌ Slower execution
* ❌ High memory and disk usage
* ❌ Costly fault recovery
* ❌ Breaks pipelining

### 🧠 Common Examples

```python
groupBy()
groupByKey()
reduceByKey()
join()
distinct()
repartition()
orderBy()
sortByKey()
```

### 📌 Example

```python
rdd.groupByKey()
```

👉 Data is shuffled across partitions based on keys.

---

## 🔥 4. Narrow vs Wide Transformations – Comparison

| Feature            | Narrow Transformation | Wide Transformation |
| ------------------ | --------------------- | ------------------- |
| Dependency         | One-to-one            | Many-to-one         |
| Shuffle            | ❌ No                  | ✅ Yes               |
| Network I/O        | ❌ None                | ✅ Heavy             |
| Disk Usage         | ❌ Minimal             | ✅ High              |
| Performance        | Fast                  | Slower              |
| Memory Usage       | Low                   | High                |
| Fault Recovery     | Easy                  | Costly              |
| Pipeline Execution | ✅ Yes                 | ❌ No                |
| DAG Stages         | Same stage            | New stage created   |
| Examples           | `map`, `filter`       | `groupBy`, `join`   |

---

## 🔹 5. Shuffle in Spark

### What is Shuffle?

Shuffle is the process of **redistributing data across partitions** based on keys.

### Triggered By

* Wide transformations
* Operations like `groupBy`, `join`, `distinct`

### Why Shuffle Is Expensive

* Network transfer
* Disk spill
* Serialization/deserialization
* Increased GC overhead

---

## 🔹 6. reduceByKey vs groupByKey

| Feature              | reduceByKey | groupByKey |
| -------------------- | ----------- | ---------- |
| Transformation Type  | Wide        | Wide       |
| Map-side Aggregation | ✅ Yes       | ❌ No       |
| Data Shuffled        | Less        | More       |
| Performance          | Faster      | Slower     |
| Memory Risk          | Low         | High       |

👉 **Always prefer `reduceByKey()` over `groupByKey()`**

---

## 🔹 7. repartition vs coalesce

| Feature     | repartition                  | coalesce                      |
| ----------- | ---------------------------- | ----------------------------- |
| Shuffle     | Yes                          | No (default)                  |
| Type        | Wide                         | Narrow                        |
| Use Case    | Increase/decrease partitions | Reduce partitions efficiently |
| Performance | Slower                       | Faster                        |

---

## 🔹 8. DAG and Stage Execution

* Narrow transformations are **pipelined** into a single stage
* Wide transformations create **shuffle boundaries**
* Each shuffle creates a **new stage** in the DAG

---

## 🔹 9. Performance Optimization Tips

* Prefer **narrow transformations**
* Avoid unnecessary `groupBy`
* Use `reduceByKey()` or `aggregateByKey()`
* Use **broadcast joins**
* Tune `spark.sql.shuffle.partitions`
* Cache reused datasets

---

## 🧠 10. Interview Questions & Answers

### Q1. What is the main difference between narrow and wide transformations?

**Answer:**
Narrow transformations do not require data shuffling, while wide transformations require shuffling data across partitions.

---

### Q2. Why are wide transformations expensive?

**Answer:**
Because they involve network I/O, disk I/O, serialization, and extra memory usage.

---

### Q3. Is `join()` a wide transformation?

**Answer:**
Yes, joins typically require shuffling data unless a **broadcast join** is used.

---

### Q4. Can a Spark job run in a single stage?

**Answer:**
Yes, if it contains only narrow transformations.

---

### Q5. Why is `groupByKey()` discouraged?

**Answer:**
It shuffles all values without aggregation and can cause memory issues.

---

### Q6. What is map-side aggregation?

**Answer:**
Partial aggregation done before shuffle to reduce data transfer.

---

### Q7. How does Spark handle fault recovery?

**Answer:**
Spark recomputes lost partitions using lineage; narrow transformations make recovery cheaper.

---

## 🔹 11. One-Line Interview Summary

> **Narrow transformations are fast because they avoid shuffling, while wide transformations are expensive due to data movement across the cluster.**

