# Spark Declarative Pipelines Programming Guide (Spark 4.1) - 101

Official reference:
https://spark.apache.org/docs/latest/declarative-pipelines-programming-guide.html

This note mirrors the official guide structure and examples for quick interview revision.

## What is Spark Declarative Pipelines (SDP)?

Spark Declarative Pipelines (SDP) is a declarative framework for building reliable, maintainable, and testable data pipelines on Spark. You define what tables should exist and what their contents should be, while SDP handles orchestration, compute management, and error handling.

SDP supports both batch and streaming use cases:
- Data ingestion from cloud storage (S3, ADLS Gen2, GCS)
- Data ingestion from message buses (Kafka, Kinesis, Pub/Sub, EventHub)
- Incremental batch and streaming transformations

## Quick install

```bash
pip install pyspark[pipelines]
```

## Key Concepts

### Flows

A flow is the foundational processing concept in SDP. A flow reads from a source, applies user-defined logic, and writes to a target dataset.

Example:

```sql
CREATE STREAMING TABLE target_table AS
SELECT * FROM STREAM source_table;
```

This defines `target_table` and a flow that continuously writes new data from `source_table`.

### Datasets

A dataset is a queryable object that is the output of one or more flows.

Types:
- **Streaming Table**: one or more streaming flows write to it (incremental processing)
- **Materialized View**: precomputed into a table; exactly one batch flow writes to it
- **Temporary View**: scoped to a single pipeline execution; useful intermediate abstraction

### Pipelines

A pipeline is the primary unit of development/execution in SDP. It can contain flows, streaming tables, and materialized views. During execution, SDP analyzes dependencies and orchestrates order/parallelization automatically.

### Pipeline Projects

A pipeline project is a set of `.py` and/or `.sql` source files that define datasets and flows, plus a YAML pipeline spec.

Pipeline spec fields:
- `libraries` (required): paths to source files
- `storage` (required): checkpoint directory for streams
- `database` or `schema` (optional): default output database
- `catalog` (optional): default output catalog
- `configuration` (optional): Spark configs

Example `spark-pipeline.yml`:

```yaml
name: my_pipeline
libraries:
  - glob:
      include: transformations/**
catalog: my_catalog
database: my_db
configuration:
  spark.sql.shuffle.partitions: "1000"
```

## The spark-pipelines Command Line Interface

`spark-pipelines` is the primary CLI for project creation, validation, and execution. It is built on `spark-submit` (except `--class`).

### spark-pipelines init

```bash
spark-pipelines init --name my_pipeline
```

Generates a starter pipeline project with spec file and sample definitions.

### spark-pipelines run

```bash
spark-pipelines run --spec spark-pipeline.yml
```

Runs pipeline execution and monitors progress.

### spark-pipelines dry-run

```bash
spark-pipelines dry-run --spec spark-pipeline.yml
```

Validates without reading/writing data. Catches issues like:
- Syntax errors (Python/SQL)
- Analysis errors (missing tables/columns)
- Graph validation errors (cyclic dependencies)

## Programming with SDP in Python

Import module:

```python
from pyspark import pipelines as dp
```

### Creating a Materialized View with Python

```python
from pyspark import pipelines as dp

@dp.materialized_view
def basic_mv():
    return spark.table("samples.nyctaxi.trips")
```

Named version:

```python
from pyspark import pipelines as dp

@dp.materialized_view(name="trips_mv")
def basic_mv():
    return spark.table("samples.nyctaxi.trips")
```

### Creating a Temporary View with Python

```python
from pyspark import pipelines as dp

@dp.temporary_view
def basic_tv():
    return spark.table("samples.nyctaxi.trips")
```

### Creating a Streaming Table with Python

```python
from pyspark import pipelines as dp

@dp.table
def basic_st():
    return spark.readStream.table("samples.nyctaxi.trips")
```

### Loading Data from a Streaming Source

Kafka example:

```python
from pyspark import pipelines as dp

@dp.table
def ingestion_st():
    return (
        spark.readStream.format("kafka")
        .option("kafka.bootstrap.servers", "localhost:9092")
        .option("subscribe", "orders")
        .load()
    )
```

Batch read example:

```python
from pyspark import pipelines as dp

@dp.materialized_view
def batch_mv():
    return spark.read.format("json").load("/datasets/retail-org/sales_orders")
```

### Querying Tables Defined in Your Pipeline

```python
from pyspark import pipelines as dp
from pyspark.sql.functions import col

@dp.table
def orders():
    return (
        spark.readStream.format("kafka")
        .option("kafka.bootstrap.servers", "localhost:9092")
        .option("subscribe", "orders")
        .load()
    )

@dp.materialized_view
def customers():
    return spark.read.format("csv").option("header", True).load("/datasets/retail-org/customers")

@dp.materialized_view
def customer_orders():
    return (
        spark.table("orders")
        .join(spark.table("customers"), "customer_id")
        .select(
            "customer_id",
            "order_number",
            "state",
            col("order_datetime").cast("int").cast("timestamp").cast("date").alias("order_date"),
        )
    )

@dp.materialized_view
def daily_orders_by_state():
    return (
        spark.table("customer_orders")
        .groupBy("state", "order_date")
        .count()
        .withColumnRenamed("count", "order_count")
    )
```

### Creating Tables in a For Loop

```python
from pyspark import pipelines as dp
from pyspark.sql.functions import collect_list, col

@dp.temporary_view()
def customer_orders():
    orders = spark.table("samples.tpch.orders")
    customer = spark.table("samples.tpch.customer")

    return (
        orders.join(customer, orders.o_custkey == customer.c_custkey)
        .select(
            col("c_custkey").alias("custkey"),
            col("c_name").alias("name"),
            col("c_nationkey").alias("nationkey"),
            col("c_phone").alias("phone"),
            col("o_orderkey").alias("orderkey"),
            col("o_orderstatus").alias("orderstatus"),
            col("o_totalprice").alias("totalprice"),
            col("o_orderdate").alias("orderdate"),
        )
    )

@dp.temporary_view()
def nation_region():
    nation = spark.table("samples.tpch.nation")
    region = spark.table("samples.tpch.region")

    return (
        nation.join(region, nation.n_regionkey == region.r_regionkey)
        .select(
            col("n_name").alias("nation"),
            col("r_name").alias("region"),
            col("n_nationkey").alias("nationkey"),
        )
    )

region_list = spark.table("samples.tpch.region").select(collect_list("r_name")).collect()[0][0]

for region in region_list:
    @dp.table(name=f"{region.lower().replace(' ', '_')}_customer_orders")
    def regional_customer_orders(region_filter=region):
        customer_orders = spark.table("customer_orders")
        nation_region = spark.table("nation_region")

        return (
            customer_orders.join(nation_region, customer_orders.nationkey == nation_region.nationkey)
            .select(
                col("custkey"),
                col("name"),
                col("phone"),
                col("nation"),
                col("region"),
                col("orderkey"),
                col("orderstatus"),
                col("totalprice"),
                col("orderdate"),
            )
            .filter(f"region = '{region_filter}'")
        )
```

### Using Multiple Flows to Write to a Single Target

```python
from pyspark import pipelines as dp

dp.create_streaming_table("customers_us")

@dp.append_flow(target="customers_us")
def append1():
    return spark.readStream.table("customers_us_west")

@dp.append_flow(target="customers_us")
def append2():
    return spark.readStream.table("customers_us_east")
```

## Programming with SDP in SQL

### Creating a Materialized View with SQL

```sql
CREATE MATERIALIZED VIEW basic_mv
AS SELECT * FROM samples.nyctaxi.trips;
```

### Creating a Temporary View with SQL

```sql
CREATE TEMPORARY VIEW basic_tv
AS SELECT * FROM samples.nyctaxi.trips;
```

### Creating a Streaming Table with SQL

```sql
CREATE STREAMING TABLE basic_st
AS SELECT * FROM STREAM samples.nyctaxi.trips;
```

### Querying Tables Defined in Your Pipeline

```sql
CREATE STREAMING TABLE orders
AS SELECT * FROM STREAM orders_source;

CREATE MATERIALIZED VIEW customers
AS SELECT * FROM customers_source;

CREATE MATERIALIZED VIEW customer_orders
AS SELECT
  c.customer_id,
  o.order_number,
  c.state,
  date(timestamp(int(o.order_datetime))) order_date
FROM orders o
INNER JOIN customers c
ON o.customer_id = c.customer_id;

CREATE MATERIALIZED VIEW daily_orders_by_state
AS SELECT state, order_date, count(*) order_count
FROM customer_orders
GROUP BY state, order_date;
```

### Using Multiple Flows to Write to a Single Target

```sql
CREATE STREAMING TABLE customers_us;

CREATE FLOW append1
AS INSERT INTO customers_us
SELECT * FROM STREAM(customers_us_west);

CREATE FLOW append2
AS INSERT INTO customers_us
SELECT * FROM STREAM(customers_us_east);
```

## Important Considerations

### Python Considerations

- SDP may evaluate pipeline definition code multiple times during planning/runs.
- Dataset-defining functions should only include code needed to define dataset logic.
- Dataset functions must return a Spark DataFrame.
- Do not perform side-effect writes/actions inside dataset definitions.

Avoid these operations in SDP dataset code:
- `collect()`
- `count()`
- `toPandas()`
- `save()`
- `saveAsTable()`
- `start()`
- `toTable()`

### SQL Considerations

- `PIVOT` clause is not supported in SDP SQL.
- In Python `for`-loop dataset generation, keep loop value lists additive/stable to avoid non-deterministic definitions.

## One-line Summary

> Spark Declarative Pipelines lets you define pipeline datasets and flows declaratively in Python/SQL while Spark manages dependency planning and execution semantics.
