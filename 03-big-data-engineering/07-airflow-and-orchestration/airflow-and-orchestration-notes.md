# ⏱️ Airflow and Orchestration - Big Data Notes

---

## 1. Introduction

Airflow is commonly used to coordinate data workflows, but interviews also test whether you distinguish orchestration from execution. A scheduler should control dependencies, retries, and timing; it should not become the data-processing engine itself.

### Why it matters
- Many real data platforms depend on DAG orchestration for reliability.
- Strong answers separate Airflow from Spark, Kafka, and query engines clearly.
- Operational maturity often shows up in backfills, retries, and alerting patterns.

---

## 2. Core Concepts

- **DAG**: Directed acyclic graph of workflow tasks.
- **Scheduler**: Decides when runnable tasks should start.
- **Executor**: Runs task instances, directly or via worker infrastructure.
- **Operator**: Task type, such as Bash, Spark submit, or SQL execution.
- **Backfill**: Running historical intervals after the fact.
- **Retry**: Automatic rerun after failure.
- **Sensor**: Task waiting for an external condition.
- **SLA / alerting**: Monitoring workflow timeliness and failures.

---

## 3. Control Flow

```text
Airflow Scheduler
      |
      +--> DAG parse / schedule
      |
      +--> Task queue / executor
               |
               +--> Spark job
               +--> SQL task
               +--> file arrival sensor
               +--> Kafka trigger / downstream step
```

---

## 4. Trade-offs and Comparisons

| Choice | Best For | Benefit | Trade-off |
|--------|----------|---------|-----------|
| Airflow | Batch orchestration and dependencies | Flexible DAG control | Not a low-latency stream orchestrator |
| Simple cron | Very small jobs | Easy | Weak observability and dependency handling |
| Event-driven orchestration | Reactive workflows | Faster trigger response | More complex coordination |

| Airflow Pattern | Benefit | Risk |
|-----------------|---------|------|
| Retries | Handles transient failures | Duplicates if tasks are not idempotent |
| Backfills | Repairs history | Can overload downstream systems |
| Sensors | Wait for readiness | Worker slot waste if poorly designed |

---

## 5. Practical Examples

### DAG responsibilities
```text
extract raw data
launch Spark transform
validate output row counts
publish metadata
notify downstream consumers
```

### Good practice
```text
Airflow task launches Spark job
Spark job does the heavy compute
Airflow tracks status and dependencies
```

### Failure settings
```text
retries=3
retry_delay=10m
depends_on_past=false
alert on repeated failure or SLA miss
```

---

## 6. Cheat Sheet

- Airflow orchestrates; Spark executes.
- DAGs should be idempotent and backfill-safe.
- Retry logic must match downstream side effects.
- Sensors are useful but can be expensive if misused.
- Backfills need resource planning and downstream protection.

---

## 7. Hands-on Drills

1. Design an Airflow DAG for daily bronze-to-gold ETL.
2. Explain how you would backfill 90 days safely.
3. Compare schedule-based orchestration with event-driven triggers.

---

## 8. Real-world Scenarios and Failure Modes

- **Airflow runs Spark inline with huge local logic**: Scheduler becomes a compute bottleneck.
- **Backfill overloads the warehouse**: Use throttling, smaller windows, or queue isolation.
- **Retries produce duplicate loads**: Ensure task outputs are idempotent or use transactional writes.
- **Sensor-heavy DAGs starve workers**: Use deferrable or smarter event-driven patterns.

---

## 9. Interview Q&A

**Q1: What is a DAG in Airflow?**  
A directed acyclic graph describing task dependencies and scheduling.

**Q2: Airflow vs Spark?**  
Airflow orchestrates workflows; Spark executes data processing.

**Q3: What is a backfill?**  
Running workflow intervals for past dates or missed windows.

**Q4: Why do retries require idempotent tasks?**  
Because repeated execution can otherwise duplicate side effects.

**Q5: What is a sensor?**  
A task that waits for an external condition like file arrival or job completion.

**Q6: Why can Airflow be a bottleneck?**  
Poor DAG design, too many tasks, or misuse as a compute layer can overload it.

**Q7: What should Airflow metadata store represent?**  
Workflow state, scheduling info, and task execution history.

**Q8: Why are SLAs useful?**  
They help monitor timeliness, not just success/failure.

**Q9: What makes a DAG production-ready?**  
Idempotency, alerting, retry policy, observability, and backfill safety.

**Q10: When is Airflow a poor fit?**  
For very low-latency per-event orchestration or heavy stream control loops.
