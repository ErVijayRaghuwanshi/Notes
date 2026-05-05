---
title: YAML Pipelines with dlt, dbt & Trino
layout: default
render_with_liquid: false
---
{% raw %}
# 🛠️ YAML Pipelines with dlt, dbt & Trino — Data Engineering Notes

How to replace PySpark pipelines with 4 YAML files + SQL, enabling analysts to build data pipelines in 1 day instead of 1–3 weeks.

---

## 1. Introduction

**What is this?** A declarative data pipeline architecture where ingestion, transformation, and orchestration are configured entirely through YAML and SQL — no Python required for 90% of pipelines.

**Why it matters:** Traditional PySpark pipelines require Python expertise, creating a bottleneck where analysts must wait for developers. This stack empowers analysts to self-serve.

**Stack at a glance:**

| Layer | Tool | Purpose |
|-------|------|---------|
| Ingestion | **dlt** (data load tool) | Load data from APIs/DBs into object storage |
| Transformation | **dbt** on **Trino** | Pure SQL transformations with dependency graph |
| Orchestration | **Airflow + Cosmos** | Auto-generated DAGs from YAML config |
| Storage | **Delta Lake** (S3) | Object storage format |
| BI | **Superset** | Visualization layer |

---

## 2. Core Concepts

- **dlt (data load tool):** Declarative data ingestion. Configure sources, endpoints, auth, and write strategies entirely in YAML. Handles pagination, retries, serialization automatically.
- **dbt (data build tool):** SQL-first transformation framework. Models link via `ref()`, auto-building a dependency graph. Supports incremental, table, view, and ephemeral materializations.
- **Trino:** Distributed SQL query engine with federated access across multiple data stores. Faster than Spark for standard SQL workloads with lower resource usage.
- **Cosmos:** Airflow library that reads dbt project manifests and auto-generates DAGs with proper task dependencies.
- **`ref()`:** dbt function that references another model, automatically establishing execution order.
- **`source()`:** dbt function that references raw input tables defined in `sources.yaml`.
- **Incremental materialization:** dbt strategy where only new/changed data is processed, using merge/upsert patterns.

---

## 3. The Four YAML Files

### 3.1 `dlt.yaml` — Data Ingestion

Configures data loading from external sources. Replaces handwritten Python scripts for API calls, pagination, retries, and serialization.

```yaml
product: sg-team
feature: billing
schema: billing_tarification

dag:
  dag_id: dlt_billing_tarification
  schedule: "0 4 * * *"
  description: "Daily refresh of tarification data"
  tags:
    - billing

alerts:
  enabled: true
  severity: warning

source:
  type: rest_api
  client:
    base_url: "https://internal-api.example.com"
    auth:
      type: bearer
      token: dlt-billing.token
  resources:
    - name: tarification_data
      endpoint:
        path: /tarificationData
        method: POST
        json:
          firstPeriod: "{{ previous_month_date }}"
          lastPeriod: "{{ previous_month_date }}"
          pricingPlanLine: CurrentPlan
      write_disposition: replace
      processing_steps:
        - map: dlt_custom.billing_tarification_data.map

    - name: charges_raw
      columns:
        staffUserName:
          data_type: text
          nullable: true
      endpoint:
        path: /data-feed/charges
        method: POST
        json:
          firstPeriod: "{{ previous_month_date }}"
          lastPeriod: "{{ previous_month_date }}"
      write_disposition: replace

    - name: discounts_raw
      endpoint:
        path: /data-feed/discounts
        method: POST
        json:
          firstPeriod: "{{ previous_month_date }}"
          lastPeriod: "{{ previous_month_date }}"
      write_disposition: replace
```

💡 **Key concepts:**
- `write_disposition: replace` — overwrite every time (full refresh)
- `processing_steps` — custom transformation hooks
- `columns` — explicit type definitions
- `alerts` — built-in alerting configuration

### 3.2 `dbt_project.yaml` — Project Configuration

```yaml
name: mau_period
version: '1.0.0'

models:
  mau_period:
    +on_table_exists: replace
    +on_schema_change: append_new_columns
```

### 3.3 `sources.yaml` — Input Table Descriptions

Replaces typed Spark schemas. Describes all input tables:

```yaml
sources:
  - name: final
    database: data_platform
    schema: final
    tables:
      - name: inapps_targetings_v2
      - name: inapps_clicks_v2
      - name: customerstracking_visits
      - name: processingorders_orders
      - name: cdp_mergedcustomers_v2
```

### 3.4 `dag.yaml` — Airflow Orchestration

```yaml
product: sg-team
feature: billing
schema: mau
schedule: "15 21 * * *"  # every day at 00:15 MSK

params:
  - name: start_date
    description: "Start date (YYYY-MM-DD). Leave empty for auto"
    default: ""
  - name: end_date
    description: "End date (YYYY-MM-DD). Leave empty for auto"
    default: ""
  - name: months_back
    description: "Months to look back (default: 5)"
    default: 5

alerts:
  enabled: true
  severity: warning
```

---

## 4. Practical Examples

### 4.1 Intermediate Model — Event Preparation

```sql
-- int_mau_events_visits.sql
{{ config(materialized='table') }}

WITH period AS (
    SELECT
        YEAR(CURRENT_DATE - INTERVAL '5' MONTH) AS start_year,
        MONTH(CURRENT_DATE - INTERVAL '5' MONTH) AS start_month,
        YEAR(CURRENT_DATE) AS end_year,
        MONTH(CURRENT_DATE) AS end_month
),
events AS (
    SELECT src._tenant, src.unmergedCustomerId,
           'visits' AS src_type, src.endpoint
    FROM {{ source('final', 'customerstracking_visits') }} src
    CROSS JOIN period p
    WHERE src.unmergedCustomerId IS NOT NULL
),
events_with_customer AS (
    SELECT e._tenant,
           COALESCE(mc.mergedCustomerId, e.unmergedCustomerId) AS customerId,
           e.src_type, e.endpoint
    FROM events e
    LEFT JOIN {{ ref('int_merged_customers') }} mc
      ON e._tenant = mc._tenant
      AND e.unmergedCustomerId = mc.unmergedCustomerId
)
SELECT ewc._tenant, ewc.customerId, ewc.src_type, ewc.endpoint
FROM events_with_customer ewc
WHERE EXISTS (
    SELECT 1 FROM {{ ref('int_actual_customers') }} ac
    WHERE ewc._tenant = ac._tenant
      AND ewc.customerId = ac.customerId
)
```

### 4.2 Union Model — Merge All Sources

```sql
-- int_mau_events.sql
SELECT * FROM {{ ref('int_mau_events_inapps_targetings') }}
UNION ALL
SELECT * FROM {{ ref('int_mau_events_inapps_clicks') }}
UNION ALL
SELECT * FROM {{ ref('int_mau_events_visits') }}
UNION ALL
SELECT * FROM {{ ref('int_mau_events_orders') }}
-- ...plus 6 more sources
```

### 4.3 Data Mart — Incremental Aggregation

```sql
-- mau_period_datamart.sql
{{ config(
    materialized='incremental',
    incremental_strategy='merge',
    unique_key=['_tenant', 'start_year', 'start_month', 'end_year', 'end_month']
) }}

{%- set months_back = var('months_back', 5) | int -%}

WITH period AS (
    SELECT
        YEAR(CURRENT_DATE - INTERVAL '{{ months_back }}' MONTH) AS start_year,
        MONTH(CURRENT_DATE - INTERVAL '{{ months_back }}' MONTH) AS start_month,
        YEAR(CURRENT_DATE) AS end_year,
        MONTH(CURRENT_DATE) AS end_month
),
events_resolved AS (
    SELECT * FROM {{ ref('int_mau_events') }}
),
metrics_by_tenant AS (
    SELECT
        er._tenant,
        COUNT(DISTINCT CASE WHEN src_type = 'visits'
              THEN customerId END) AS CustomersTracking_Visits,
        COUNT(DISTINCT CASE WHEN src_type = 'orders'
              THEN customerId END) AS ProcessingOrders_Orders,
        COUNT(DISTINCT customerId) AS MAU
    FROM events_resolved er
    GROUP BY er._tenant
)
SELECT m.*, p.start_year, p.start_month, p.end_year, p.end_month
FROM metrics_by_tenant m
CROSS JOIN period p
```

### 4.4 Airflow DAG Auto-Generation (Cosmos)

The only Python code in the entire setup — written once, works for all dbt projects:

```python
def _build_dbt_project_dags(project_path: Path, environ: dict) -> list[DbtDag]:
    config_dict = yaml.safe_load(dag_config_path.read_text())
    config = DagConfig.model_validate(config_dict)

    params = {}
    operator_vars = {}
    for param in config.params:
        params[param.name] = Param(
            default=param.default if param.default is not None else "",
            description=param.description,
        )
        operator_vars[param.name] = f"{{{{ params.{param.name} }}}}"

    with DbtDag(
        dag_id=f"dbt_{project_path.name}",
        schedule=config.schedule,
        params=params,
        project_config=ProjectConfig(dbt_project_path=project_path),
        profile_config=ProfileConfig(
            profile_name="default",
            target_name=project_name,
            profile_mapping=TrinoLDAPProfileMapping(
                conn_id="trino_default",
                profile_args={
                    "database": profile_database,
                    "schema": profile_schema,
                },
            ),
        ),
        operator_args={"vars": operator_vars},
    ) as dag:
        create_schema = SQLExecuteQueryOperator(
            task_id="create_schema",
            conn_id="trino_default",
            sql=f"CREATE SCHEMA IF NOT EXISTS {profile_database}.{profile_schema} ...",
        )
        for unique_id, _ in dag.dbt_graph.filtered_nodes.items():
            task = dag.tasks_map[unique_id]
            if not task.upstream_task_ids:
                create_schema >> task
```

💡 **How Cosmos works:**
- Reads `manifest.json` from the dbt project
- Parses model dependency graph from `ref()` calls
- Creates one Airflow task per dbt model
- Auto-wires task dependencies

---

## 5. Trade-offs and Comparisons

| Aspect | PySpark | YAML + dbt + Trino |
|--------|---------|---------------------|
| Delivery time | 1–3 weeks | 1 day |
| Required skills | Python + Spark | SQL + YAML + Git |
| Pipeline owner | Developers | Analysts |
| Ingestion code | ~200 lines Python | ~40 lines YAML |
| Fault tolerance | Task-level retry | Query-level (all or nothing) |
| Custom logic (UDFs) | Python (easy) | Java (hard) |
| Incremental loading | Manual implementation | Built-in via dbt config |
| Dependency graph | Manual DAG wiring | Auto-generated from `ref()` |
| Federated queries | Requires separate connectors | Native Trino support |

🎯 **When to use each:**
- **YAML + dbt + Trino:** Standard SQL transformations, API ingestion, recurring metrics, analyst-owned pipelines (~90% of cases)
- **PySpark:** Complex non-SQL transformations, custom Python UDFs, terabyte-scale fault-tolerant processing (~10% of cases)

---

## 6. Real-world Scenarios and Failure Modes

### ⚠️ dlt + Delta: Experimental Upsert
- dlt's Delta connector is **experimental** — merge strategy didn't work out of the box
- **Workaround:** Use `replace` instead of `merge` (sacrificing incrementality), or write custom `processing_steps`

### ⚠️ Trino's Limited Fault Tolerance
- Fault tolerance writes intermediate results to S3 — prohibitively expensive at terabyte scale
- Without fault tolerance: one worker failure = entire query fails
- **Mitigation:** DAG-level retries + decompose heavy models into chains of intermediate ones

### ⚠️ UDFs and Custom Logic
- Trino UDFs require **Java** — separate repo, build pipeline, deploy JARs across all workers
- dbt Python models only work with Snowflake/Databricks/BigQuery (not Trino)
- When SQL can't express the logic → either unmaintainable SQL monster or standalone script breaking lineage

### ⚠️ ~10% of Pipelines Still Need PySpark
- Transformations that fundamentally don't fit into SQL
- dbt Jinja macros are no substitute for full Python
- Complex ML feature engineering, graph processing, custom aggregations

---

## 7. Analyst Workflow

1. **Create folder:** `dbt-projects/my_new_pipeline/`
2. **Write `dlt.yaml`** (if external ingestion needed)
3. **Write SQL models** in `models/` + `sources.yaml`
4. **Create** `dbt_project.yaml` and `dag.yaml`
5. **Push to Git** → Review → Merge → CI/CD builds → Airflow picks up

📋 **What analysts need to learn:**
- `ref()` and `source()` concepts
- `table` vs `incremental` materialization
- Git basics
- (Taught via internal workshops + step-by-step guides)

---

## 8. Cheat Sheet

| dbt Function | Purpose |
|--------------|---------|
| `{{ ref('model') }}` | Reference another model, auto-build dependency |
| `{{ source('name', 'table') }}` | Reference raw input table |
| `{{ config(materialized='table') }}` | Full rebuild every run |
| `{{ config(materialized='incremental') }}` | Only process new/changed data |
| `{{ var('name', default) }}` | Parameterized variable from dag.yaml |

| dlt Config | Purpose |
|------------|---------|
| `write_disposition: replace` | Full overwrite |
| `write_disposition: merge` | Upsert (experimental for Delta) |
| `write_disposition: append` | Append-only |
| `processing_steps` | Custom transform hooks |

---

## 🔗 Related Topics

- [Data Platform Architecture Notes](data-platform-architecture-notes.md)
- [Trino & Interactive Querying Notes](../13-trino-and-interactive-querying/trino-and-interactive-querying-notes.md)
- [Spark Core Notes](../03-spark-core/spark-core-notes.md)
- [Airflow & Orchestration Notes](../07-airflow-and-orchestration/airflow-and-orchestration-notes.md)
- [Delta Lake Notes](../08-delta-lake-and-delta-tables/delta-lake-and-delta-tables-notes.md)

---

*Source: "4 YAML Files Instead of PySpark" by Kiril Kazlou, Towards Data Science (Apr 29, 2026)*

*Last updated: May 2026*
{% endraw %}
