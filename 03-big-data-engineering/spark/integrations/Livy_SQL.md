Awesome 👍
Below is a **comprehensive, end-to-end guide** on **using Spark SQL with Apache Livy**, written in a practical way so you can actually *use* it, not just read it.

---

# Comprehensive Guide: Using Spark SQL with Apache Livy

## 1. What is Apache Livy and why use it?

**Apache Livy** is a REST service that lets you submit **Spark jobs remotely** without managing Spark binaries or sessions manually.

Why teams use Livy:

* Run Spark SQL from **REST / notebooks / apps**
* Multi-user support
* Session management
* Secure (Kerberos, impersonation)
* Works well with **HDFS + Hive**

Typical flow:

```
Client → Livy → Spark → HDFS / Hive
```

---

## 2. Architecture overview

```
[ Client ]
    |
 REST API
    |
[ Livy Server ]
    |
 Spark Driver
    |
[ Spark Cluster (local / standalone / YARN) ]
    |
[ HDFS / Hive Metastore ]
```

Key points:

* Livy **creates Spark sessions**
* Spark SQL runs **inside those sessions**
* HDFS access happens as **Livy user or impersonated user**

---

## 3. Starting a Livy Spark session

### Create a Spark session via REST

```http
POST /sessions
Content-Type: application/json

{
  "kind": "spark",
  "conf": {
    "spark.sql.catalogImplementation": "hive"
  }
}
```

Response:

```json
{
  "id": 0,
  "state": "starting"
}
```

Once state = `idle`, you’re ready.

---

## 4. Spark SQL basics in Livy

You interact with Spark SQL by submitting **statements**.

### Submit a Spark SQL statement

```http
POST /sessions/0/statements
Content-Type: application/json

{
  "code": "spark.sql(\"SHOW DATABASES\").show()"
}
```

---

## 5. Understanding HDFS user behavior

### Default behavior

* Spark runs as the **Livy OS user**
* HDFS permissions apply to that user

Check current user:

```sql
SELECT current_user();
```

### Impersonation (optional)

If enabled:

```properties
livy.impersonation.enabled=true
```

Then HDFS operations run as the **requesting user**.

---

## 6. Loading data into Spark SQL

### From HDFS (CSV example)

```scala
val df = spark.read
  .option("header", "true")
  .csv("hdfs:///user/data/employees.csv")
```

### From Parquet

```scala
val df = spark.read.parquet("hdfs:///warehouse/emp")
```

### From Hive table

```scala
val df = spark.table("default.emp_hive")
```

---

## 7. Registering temp tables (very important)

### Session-scoped temp table

```scala
df.createOrReplaceTempView("employees")
```

Query:

```sql
SELECT * FROM employees;
```

📌 Scope:

* Only available in **this Livy session**
* Deleted when session ends

---

### SQL-only temp view

```sql
CREATE OR REPLACE TEMP VIEW employees AS
SELECT * FROM parquet.`hdfs:///warehouse/emp`;
```

---

### Global temp view

```scala
df.createOrReplaceGlobalTempView("employees")
```

Query:

```sql
SELECT * FROM global_temp.employees;
```

📌 Scope:

* Available to **all Spark sessions**
* Removed when Spark application stops

---

## 8. Working with Hive tables (persistent storage)

### Create managed Hive table

```sql
CREATE TABLE emp_hive (
  id INT,
  name STRING,
  salary INT
)
STORED AS PARQUET;
```

* Stored in HDFS warehouse
* Uses Hive metastore
* Persists after session ends

---

### External Hive table

```sql
CREATE EXTERNAL TABLE emp_ext (
  id INT,
  name STRING
)
STORED AS PARQUET
LOCATION 'hdfs:///external/emp';
```

* Spark does not manage data lifecycle
* Good for shared datasets

---

## 9. Temp table vs Hive table (comparison)

| Feature        | Temp View | Global Temp  | Hive Table   |
| -------------- | --------- | ------------ | ------------ |
| Persistent     | ❌         | ❌            | ✅            |
| Stored in HDFS | ❌         | ❌            | ✅            |
| Session scope  | Yes       | All sessions | All sessions |
| Needs Hive     | ❌         | ❌            | ✅            |

---

## 10. Common Spark SQL operations via Livy

### Insert data

```sql
INSERT INTO emp_hive
SELECT id, name, salary FROM employees;
```

### Create table from query

```sql
CREATE TABLE emp_parquet
USING parquet
AS SELECT * FROM employees;
```

### Cache table

```sql
CACHE TABLE employees;
```

---

## 11. Error handling & debugging

### Check statement output

```http
GET /sessions/0/statements/3
```

### Common errors

* **Permission denied** → HDFS user mismatch
* **Table not found** → Temp table session ended
* **Hive not found** → `spark.sql.catalogImplementation=hive` missing

---

## 12. Best practices

✅ Use **temp views** for intermediate data
✅ Use **Hive tables** for long-term storage
✅ Clean up unused Livy sessions
✅ Validate HDFS permissions early
✅ Enable impersonation in multi-user setups

---

## 13. Typical production workflow

```
1. Create Livy session
2. Load data from HDFS/Hive
3. Register temp views
4. Run Spark SQL transformations
5. Save results to Hive / HDFS
6. Close session
```

---

## 14. When NOT to use temp tables

❌ Reporting data
❌ Multi-session sharing
❌ Long-running pipelines

Use **Hive or external tables** instead.

---

If you want next, I can:

* Show **exact curl commands**
* Explain **Livy + Kerberos**
* Walk through **end-to-end Spark SQL ETL**
* Help tune **Spark SQL performance**
* Explain **warehouse directory & permissions**

Just say the word 👌
