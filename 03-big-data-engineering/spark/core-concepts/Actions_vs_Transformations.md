# 📘 Transformation vs Action in Apache Spark

---

## 🔹 1. What is Apache Spark Execution Model?

Apache Spark follows a **lazy execution model**:

* Operations are not executed immediately
* Spark waits until an **action** is called
* This allows Spark to **optimize** the entire workflow

Based on execution behavior, Spark operations are classified into:

* **Transformations**
* **Actions**

---

## 🔹 2. Transformations in Spark

### ✅ Definition

A **transformation** defines **what needs to be done** to the data but **does not execute immediately**.

### 🔑 Key Characteristics

* **Lazy evaluation**
* Builds **logical plan**
* Creates a **new RDD/DataFrame**
* Adds nodes to the **DAG**
* Enables Spark optimizations (Catalyst & Tungsten)

### 📌 What Transformations Do

* Filter data
* Change structure
* Combine datasets
* Define computation logic

### 🧠 Common Examples

```python
map()
filter()
groupBy()
select()
withColumn()
join()
distinct()
repartition()
```

### 📌 Example

```python
df2 = df.filter(df.age > 25)
```

👉 No execution happens at this step.

---

## 🔹 3. Actions in Spark

### ✅ Definition

An **action** triggers the **actual execution** of the Spark job.

### 🔑 Key Characteristics

* Executes the **entire DAG**
* Converts logical plan into **physical execution**
* Returns a result to the driver **or** writes data to storage
* Marks the **end of a Spark job**

### 📌 What Actions Do

* Count records
* Collect results
* Display data
* Save output to storage

### 🧠 Common Examples

```python
count()
collect()
show()
take()
first()
save()
write()
foreach()
```

### 📌 Example

```python
df.count()
```

👉 This triggers job execution.

---

## 🔥 4. Transformation vs Action – Comparison

| Feature      | Transformation    | Action               |
| ------------ | ----------------- | -------------------- |
| Execution    | Lazy              | Immediate            |
| Purpose      | Define logic      | Trigger computation  |
| DAG          | Builds DAG        | Executes DAG         |
| Output       | New RDD/DataFrame | Value or data output |
| Optimization | ✅ Yes             | ❌ No                 |
| Reusability  | ✅ Yes             | ❌ No                 |
| Job Trigger  | ❌ No              | ✅ Yes                |
| Examples     | `map`, `filter`   | `count`, `collect`   |

---

## 🔁 5. End-to-End Example (Very Important)

```python
df2 = df.filter(df.age > 25)     # Transformation (lazy)
df3 = df2.groupBy("city")       # Transformation (wide)
df3.count()                     # Action → job starts
```

### What Happens Internally?

1. **Transformations**

   * Build the **logical plan**
   * Create the **DAG**
   * No execution yet

2. **Action**

   * Triggers execution
   * DAG is split into **stages**
   * Wide transformation causes **shuffle**
   * Tasks execute on executors
   * Result returned to driver

---

## 🔹 6. DAG, Stages, and Jobs

| Term  | Meaning                          |
| ----- | -------------------------------- |
| DAG   | Logical execution plan           |
| Stage | Set of pipelined transformations |
| Job   | Triggered by an action           |
| Task  | Unit of work on one partition    |

👉 **One action = one Spark job**

---

## ⚠️ 7. Common Interview Traps

### ❌ Using `collect()` on Big Data

* Brings **entire dataset to driver**
* Can cause **OutOfMemoryError**
* Safe only for small datasets

---

### ❌ Misunderstanding `groupBy()`

* `groupBy()` → wide transformation
* Causes heavy shuffle
* Prefer `reduceByKey()` or `agg()`

---

## 🚀 8. Spark Optimization Tips (Real-World)

* Chain transformations before actions
* Reduce number of actions
* Avoid unnecessary `collect()`
* Cache reused DataFrames before actions
* Minimize wide transformations
* Tune `spark.sql.shuffle.partitions`

---

## 🧠 9. Interview Questions & Answers

### Q1. What is the difference between transformation and action?

**Answer:**
Transformations define computation and are lazily evaluated, while actions trigger actual execution.

---

### Q2. Why does Spark use lazy evaluation?

**Answer:**
To optimize execution by combining operations, reducing shuffles, and improving performance.

---

### Q3. Can a transformation trigger a Spark job?

**Answer:**
No. Only actions trigger Spark jobs.

---

### Q4. How many jobs are created if there are two actions?

**Answer:**
Each action creates a **separate Spark job**.

---

### Q5. What happens if an action is called twice?

**Answer:**
The DAG is executed twice unless the dataset is cached or persisted.

---

### Q6. Does `show()` trigger a job?

**Answer:**
Yes. `show()` is an action.

---

### Q7. Why is `collect()` risky?

**Answer:**
It loads all data into the driver’s memory.

---

## 🔹 10. One-Line Interview Summary

> **Transformations define the computation lazily, while actions trigger execution and produce results.**


