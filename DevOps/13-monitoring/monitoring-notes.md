---
title: Monitoring Notes
layout: default
render_with_liquid: false
---
# Monitoring & Observability — DevOps Interview Preparation Notes

---

## 1. Introduction

### Why Monitoring Matters

Monitoring is the foundation of reliable systems. Without it, teams operate blind — unable to detect failures, measure performance, or understand system behavior. In DevOps and SRE practices, monitoring enables:

- **Proactive incident detection** before users are impacted
- **Data-driven capacity planning** and scaling decisions
- **Faster root cause analysis** during outages
- **Continuous improvement** through performance baselines and trend analysis
- **Accountability** via SLOs and error budgets

### Observability vs Monitoring

| Aspect | Monitoring | Observability |
|--------|-----------|---------------|
| **Definition** | Collecting predefined metrics and alerts | Ability to understand internal state from external outputs |
| **Approach** | Known-unknowns (what to watch for) | Unknown-unknowns (explore and discover) |
| **Scope** | Dashboards, alerts, thresholds | Metrics, logs, traces — correlated |
| **Question** | "Is the system working?" | "Why is the system not working?" |
| **Tooling** | Nagios, Zabbix, CloudWatch | Prometheus + Grafana + Jaeger + ELK |

### Three Pillars of Observability

1. **Metrics** — Numeric measurements over time (CPU usage, request rate, error count). Cheap to store, easy to aggregate, ideal for alerting.
2. **Logs** — Timestamped, immutable records of discrete events. Rich context but expensive at scale.
3. **Traces** — End-to-end journey of a request across services. Critical for debugging distributed systems.

### SRE Concepts

- **SLI (Service Level Indicator)** — A quantitative measure of service behavior (e.g., request latency, error rate, availability).
- **SLO (Service Level Objective)** — A target value/range for an SLI (e.g., 99.9% of requests complete in < 300ms).
- **SLA (Service Level Agreement)** — A contract with consequences if SLOs are not met (e.g., refunds, credits).
- **Error Budget** — The allowed amount of unreliability: `Error Budget = 1 - SLO`. For a 99.9% SLO, the error budget is 0.1% (~43 min/month downtime).

### Golden Signals (Google SRE)

1. **Latency** — Time to service a request
2. **Traffic** — Demand on the system (requests/sec)
3. **Errors** — Rate of failed requests
4. **Saturation** — How "full" a resource is

### RED Method (Request-driven services)

- **Rate** — Requests per second
- **Errors** — Failed requests per second
- **Duration** — Distribution of request latencies

### USE Method (Resource-oriented)

- **Utilization** — Percentage of resource busy
- **Saturation** — Degree of queued work
- **Errors** — Count of error events

---

## 2. Core Concepts

---

### 2.1 Prometheus

Prometheus is an open-source monitoring and alerting toolkit, originally built at SoundCloud. It is the graduated CNCF project and the de facto standard for cloud-native monitoring.

#### Architecture

```
                  ┌─────────────┐
                  │ Alertmanager│ ──→ PagerDuty/Slack/Email
                  └──────▲──────┘
                         │ alerts
┌──────────┐      ┌──────┴──────┐      ┌──────────────┐
│Pushgateway│◄────│  Prometheus  │─────►│    Grafana    │
└──────────┘ push │   Server     │ query└──────────────┘
                  │              │
                  │  ┌────────┐  │
                  │  │ TSDB   │  │
                  │  └────────┘  │
                  └──────┬──────┘
                    scrape│ (pull)
            ┌─────────┬──┴──┬──────────┐
            ▼         ▼     ▼          ▼
        node_exp  cadvisor  app    blackbox_exp
```

**Key Components:**

| Component | Role |
|-----------|------|
| **Prometheus Server** | Scrapes and stores time-series data, evaluates rules |
| **Pushgateway** | Accepts pushed metrics from short-lived jobs (batch, cron) |
| **Alertmanager** | Handles alert routing, deduplication, grouping, silencing |
| **Exporters** | Expose metrics from third-party systems (node_exporter, mysqld_exporter, blackbox_exporter) |
| **Service Discovery** | Automatically discovers targets (Kubernetes, Consul, EC2, DNS, file-based) |

#### Data Model

Prometheus stores data as **time series**, each identified by a metric name and key-value label pairs:

```
http_requests_total{method="GET", status="200", handler="/api/users"} 1234 1617235200
│                   │                                                  │    │
metric name         labels                                            value timestamp
```

- **Metric Types:** Counter, Gauge, Histogram, Summary
- **Counter** — Monotonically increasing (requests_total, errors_total)
- **Gauge** — Can go up/down (temperature, memory_usage)
- **Histogram** — Samples in configurable buckets (request_duration_seconds_bucket)
- **Summary** — Pre-calculated quantiles on the client side

#### Scrape Configuration

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  scrape_timeout: 10s

rule_files:
  - "recording_rules.yml"
  - "alerting_rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets: ["alertmanager:9093"]

scrape_configs:
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]

  - job_name: "node-exporter"
    static_configs:
      - targets: ["node-exporter:9100"]

  - job_name: "app"
    metrics_path: /metrics
    scheme: http
    static_configs:
      - targets: ["app:8080"]
    relabel_configs:
      - source_labels: [__address__]
        target_label: instance

  - job_name: "kubernetes-pods"
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_port]
        action: replace
        target_label: __address__
        regex: (.+)
```

#### Recording Rules

Pre-compute expensive queries for faster dashboards:

```yaml
# recording_rules.yml
groups:
  - name: http_recording_rules
    interval: 30s
    rules:
      - record: job:http_requests_total:rate5m
        expr: sum(rate(http_requests_total[5m])) by (job)

      - record: job:http_request_duration_seconds:p99
        expr: histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, job))
```

#### Alerting Rules

```yaml
# alerting_rules.yml
groups:
  - name: instance_alerts
    rules:
      - alert: HighCpuUsage
        expr: 100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage on {{ $labels.instance }}"
          description: "CPU usage is above 80% for more than 5 minutes (current: {{ $value }}%)"

      - alert: HighMemoryUsage
        expr: (1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100 > 85
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High memory usage on {{ $labels.instance }}"

      - alert: PodCrashLooping
        expr: rate(kube_pod_container_status_restarts_total[15m]) * 60 * 15 > 3
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Pod {{ $labels.namespace }}/{{ $labels.pod }} is crash looping"

      - alert: High5xxErrorRate
        expr: sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) > 0.05
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "5xx error rate exceeds 5%"
```

#### Service Discovery

Prometheus supports dynamic target discovery:

- **kubernetes_sd_configs** — Discovers pods, services, endpoints, nodes, ingresses
- **consul_sd_configs** — Discovers services from Consul
- **ec2_sd_configs** — Discovers EC2 instances from AWS
- **file_sd_configs** — Reads targets from JSON/YAML files (for custom integrations)
- **dns_sd_configs** — Discovers targets via DNS SRV records

#### Federation

Hierarchical Prometheus setup where a global instance scrapes aggregated metrics from local instances:

```yaml
scrape_configs:
  - job_name: "federate"
    honor_labels: true
    metrics_path: /federate
    params:
      match[]:
        - '{job="app"}'
        - '{__name__=~"job:.*"}'
    static_configs:
      - targets:
          - "prometheus-dc1:9090"
          - "prometheus-dc2:9090"
```

---

### 2.2 PromQL

PromQL (Prometheus Query Language) is a functional expression language for querying time-series data.

#### Selectors

```promql
# Instant vector — single value per series at current time
http_requests_total

# Label matching
http_requests_total{method="GET", status="200"}
http_requests_total{status=~"5.."}          # regex match
http_requests_total{handler!="/health"}     # not equal
http_requests_total{method=~"GET|POST"}     # regex OR

# Range vector — samples over a time window
http_requests_total[5m]
http_requests_total{method="GET"}[1h]
```

#### Key Functions

| Function | Description | Use Case |
|----------|-------------|----------|
| `rate()` | Per-second average rate of increase over range | Request rate from counter |
| `irate()` | Instant rate using last two data points | Volatile/spiky counters |
| `increase()` | Total increase over range | Total requests in last hour |
| `histogram_quantile()` | Calculate quantile from histogram buckets | p95/p99 latency |
| `avg_over_time()` | Average value over range | Smoothing gauges |
| `max_over_time()` | Max value over range | Peak memory usage |
| `predict_linear()` | Linear regression prediction | Disk full prediction |
| `delta()` | Difference between first and last value in range | Gauge change |
| `absent()` | Returns 1 if no time series match | Detect missing metrics |
| `changes()` | Number of value changes in range | Config change detection |

#### Aggregation Operators

```promql
# sum — total across all series
sum(rate(http_requests_total[5m]))

# avg — average across series
avg(node_cpu_seconds_total{mode="idle"}) by (instance)

# count — number of series
count(up == 1)

# topk — top K series by value
topk(5, rate(http_requests_total[5m]))

# by / without — group or exclude labels
sum by (method, status) (rate(http_requests_total[5m]))
sum without (instance) (rate(http_requests_total[5m]))

# quantile — calculate quantile across series
quantile(0.95, rate(http_requests_total[5m]))

# stddev — standard deviation
stddev(rate(http_requests_total[5m]))

# count_values — count series with each unique value
count_values("version", build_info)
```

#### Practical PromQL Examples

```promql
# CPU Usage Percentage per instance
100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# Memory Usage Percentage
(1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100

# HTTP Request Rate by status code
sum by (status) (rate(http_requests_total[5m]))

# Error Rate Percentage
sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100

# P99 Latency
histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))

# P95 Latency by endpoint
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, handler))

# Disk Space Prediction (hours until full)
predict_linear(node_filesystem_avail_bytes{mountpoint="/"}[6h], 3600 * 24) / 1024 / 1024 / 1024

# Pod Restart Rate
rate(kube_pod_container_status_restarts_total[15m]) * 60 * 15

# Top 5 memory-consuming pods
topk(5, container_memory_usage_bytes{container!=""})

# Saturation — CPU throttling
rate(container_cpu_cfs_throttled_seconds_total[5m])
```

---

### 2.3 Grafana

Grafana is the leading open-source visualization and analytics platform for metrics, logs, and traces.

#### Key Concepts

- **Dashboard** — A collection of panels organized in rows
- **Panel** — Individual visualization (graph, table, stat, gauge, heatmap)
- **Data Source** — Backend that provides data (Prometheus, Elasticsearch, Loki, InfluxDB, CloudWatch)
- **Variables** — Template variables for dynamic dashboards (`$namespace`, `$pod`)
- **Annotations** — Event markers on graphs (deployments, incidents)

#### Dashboard Provisioning (as Code)

```yaml
# provisioning/dashboards/dashboard.yml
apiVersion: 1
providers:
  - name: "default"
    orgId: 1
    folder: "DevOps"
    type: file
    disableDeletion: false
    editable: true
    updateIntervalSeconds: 30
    options:
      path: /var/lib/grafana/dashboards
      foldersFromFilesStructure: true
```

#### Grafana Dashboard JSON Snippet

```json
{
  "dashboard": {
    "title": "Application Overview",
    "tags": ["app", "production"],
    "timezone": "browser",
    "panels": [
      {
        "title": "Request Rate",
        "type": "timeseries",
        "gridPos": { "h": 8, "w": 12, "x": 0, "y": 0 },
        "targets": [
          {
            "expr": "sum(rate(http_requests_total[5m])) by (status)",
            "legendFormat": "{{status}}"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "unit": "reqps",
            "custom": { "drawStyle": "line", "fillOpacity": 10 }
          }
        }
      },
      {
        "title": "P99 Latency",
        "type": "timeseries",
        "gridPos": { "h": 8, "w": 12, "x": 12, "y": 0 },
        "targets": [
          {
            "expr": "histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))",
            "legendFormat": "p99"
          }
        ],
        "fieldConfig": {
          "defaults": { "unit": "s" }
        }
      },
      {
        "title": "Error Rate %",
        "type": "stat",
        "gridPos": { "h": 4, "w": 6, "x": 0, "y": 8 },
        "targets": [
          {
            "expr": "sum(rate(http_requests_total{status=~\"5..\"}[5m])) / sum(rate(http_requests_total[5m])) * 100"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "unit": "percent",
            "thresholds": {
              "steps": [
                { "color": "green", "value": null },
                { "color": "yellow", "value": 1 },
                { "color": "red", "value": 5 }
              ]
            }
          }
        }
      }
    ],
    "templating": {
      "list": [
        {
          "name": "namespace",
          "type": "query",
          "datasource": "Prometheus",
          "query": "label_values(kube_pod_info, namespace)",
          "refresh": 2
        },
        {
          "name": "pod",
          "type": "query",
          "datasource": "Prometheus",
          "query": "label_values(kube_pod_info{namespace=\"$namespace\"}, pod)",
          "refresh": 2
        }
      ]
    }
  }
}
```

#### Grafana Alerting (Unified Alerting)

- Define alert rules with PromQL expressions
- Contact points: Email, Slack, PagerDuty, OpsGenie, Webhooks
- Notification policies for routing based on labels
- Silences and mute timings for maintenance windows

---

### 2.4 ELK Stack

The ELK Stack (Elasticsearch, Logstash, Kibana) is the most popular open-source log management solution.

#### Elasticsearch

- **Distributed search and analytics engine** built on Apache Lucene
- **Index** — A collection of documents (like a database table)
- **Shard** — Horizontal partition of an index (primary + replica shards)
- **Node Roles** — Master, data, ingest, coordinating
- **ILM (Index Lifecycle Management)** — Automate rollover, shrink, delete based on age/size

```yaml
# Index Lifecycle Policy
PUT _ilm/policy/logs_policy
{
  "policy": {
    "phases": {
      "hot": {
        "actions": {
          "rollover": { "max_size": "50gb", "max_age": "1d" }
        }
      },
      "warm": {
        "min_age": "7d",
        "actions": {
          "shrink": { "number_of_shards": 1 },
          "forcemerge": { "max_num_segments": 1 }
        }
      },
      "cold": {
        "min_age": "30d",
        "actions": {
          "freeze": {}
        }
      },
      "delete": {
        "min_age": "90d",
        "actions": { "delete": {} }
      }
    }
  }
}
```

#### Logstash

Logstash is a server-side data processing pipeline: **Input → Filter → Output**

```ruby
# logstash.conf
input {
  beats {
    port => 5044
  }
  kafka {
    bootstrap_servers => "kafka:9092"
    topics => ["app-logs"]
    codec => json
  }
}

filter {
  if [type] == "nginx" {
    grok {
      match => { "message" => "%{COMBINEDAPACHELOG}" }
    }
    date {
      match => ["timestamp", "dd/MMM/yyyy:HH:mm:ss Z"]
    }
    geoip {
      source => "clientip"
    }
  }

  if [level] == "ERROR" {
    mutate {
      add_tag => ["error"]
    }
  }

  mutate {
    remove_field => ["agent", "ecs", "host"]
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "logs-%{[type]}-%{+YYYY.MM.dd}"
    user => "elastic"
    password => "${ES_PASSWORD}"
  }
  # Debug output
  # stdout { codec => rubydebug }
}
```

#### Kibana

- **Discover** — Search and explore logs with KQL (Kibana Query Language)
- **Dashboards** — Visual representations with bar charts, pie charts, data tables
- **KQL Examples:**
  - `status: 500` — All 500 errors
  - `message: "timeout" and service: "payment"` — Timeout errors in payment service
  - `response_time > 1000` — Slow requests
  - `NOT level: "DEBUG"` — Exclude debug logs

#### Filebeat

Lightweight log shipper that forwards logs to Logstash or Elasticsearch:

```yaml
# filebeat.yml
filebeat.inputs:
  - type: log
    enabled: true
    paths:
      - /var/log/app/*.log
    fields:
      type: app
    multiline:
      pattern: '^\d{4}-\d{2}-\d{2}'
      negate: true
      match: after

  - type: container
    paths:
      - /var/lib/docker/containers/*/*.log
    processors:
      - add_kubernetes_metadata:
          host: ${NODE_NAME}
          matchers:
            - logs_path:
                logs_path: "/var/lib/docker/containers/"

output.logstash:
  hosts: ["logstash:5044"]
  loadbalance: true

# Or direct to Elasticsearch
# output.elasticsearch:
#   hosts: ["elasticsearch:9200"]
#   index: "filebeat-%{+yyyy.MM.dd}"

logging.level: info
logging.to_files: true
logging.files:
  path: /var/log/filebeat
  name: filebeat
  keepfiles: 7
```

---

### 2.5 EFK Stack

The EFK Stack replaces Logstash with **Fluentd** or **Fluent Bit**, which is lighter and better suited for Kubernetes environments.

#### Fluentd vs Fluent Bit

| Feature | Fluentd | Fluent Bit |
|---------|---------|------------|
| **Written in** | Ruby + C | C |
| **Memory footprint** | ~40MB | ~450KB |
| **Plugin ecosystem** | 1000+ plugins | ~100 built-in plugins |
| **Use case** | Aggregator, complex routing | Edge/node-level collector |
| **K8s deployment** | DaemonSet or Deployment | DaemonSet |
| **Best for** | Central log aggregation | Lightweight log forwarding |

#### Fluent Bit Kubernetes Configuration

```yaml
# fluent-bit-configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fluent-bit-config
  namespace: logging
data:
  fluent-bit.conf: |
    [SERVICE]
        Flush         5
        Log_Level     info
        Daemon        Off
        Parsers_File  parsers.conf

    [INPUT]
        Name              tail
        Tag               kube.*
        Path              /var/log/containers/*.log
        Parser            cri
        DB                /var/log/flb_kube.db
        Mem_Buf_Limit     5MB
        Skip_Long_Lines   On
        Refresh_Interval  10

    [FILTER]
        Name                kubernetes
        Match               kube.*
        Kube_URL            https://kubernetes.default.svc:443
        Kube_CA_File        /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
        Kube_Token_File     /var/run/secrets/kubernetes.io/serviceaccount/token
        Merge_Log           On
        K8S-Logging.Parser  On
        K8S-Logging.Exclude On

    [OUTPUT]
        Name            es
        Match           *
        Host            elasticsearch.logging.svc.cluster.local
        Port            9200
        Index           fluent-bit
        Type            _doc
        Logstash_Format On
        Logstash_Prefix k8s-logs
        Retry_Limit     False
```

#### Typical EFK Architecture on Kubernetes

```
┌──────────┐  ┌──────────┐  ┌──────────┐
│  Node 1  │  │  Node 2  │  │  Node 3  │
│FluentBit │  │FluentBit │  │FluentBit │   ← DaemonSet
└────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │             │
     └─────────┬───┴─────────────┘
               ▼
        ┌──────────────┐
        │   Fluentd    │  ← Aggregator (Deployment)
        │  (optional)  │
        └──────┬───────┘
               ▼
        ┌──────────────┐
        │Elasticsearch │  ← StatefulSet (3 replicas)
        └──────┬───────┘
               ▼
        ┌──────────────┐
        │   Kibana     │  ← Deployment
        └──────────────┘
```

---

### 2.6 Distributed Tracing

Distributed tracing tracks the journey of a request as it traverses multiple services.

#### Key Concepts

- **Trace** — The entire journey of a request across services
- **Span** — A single unit of work within a trace (e.g., one HTTP call, one DB query)
- **Trace ID** — Unique identifier that ties all spans of a request together
- **Span ID** — Unique identifier for each span
- **Parent Span ID** — Links child spans to parent spans
- **Context Propagation** — Passing trace context between services via HTTP headers (`traceparent`, `tracestate` in W3C format)

#### OpenTelemetry

OpenTelemetry (OTel) is the CNCF standard for collecting telemetry data (metrics, logs, traces).

**Components:**
- **SDK** — Instrument your application code
- **API** — Vendor-neutral tracing/metrics API
- **Collector** — Receives, processes, and exports telemetry data
- **Exporters** — Send data to backends (Jaeger, Zipkin, Prometheus, OTLP)

```yaml
# otel-collector-config.yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

processors:
  batch:
    timeout: 5s
    send_batch_size: 1024
  memory_limiter:
    check_interval: 1s
    limit_mib: 512
    spike_limit_mib: 128

exporters:
  jaeger:
    endpoint: jaeger-collector:14250
    tls:
      insecure: true
  prometheus:
    endpoint: 0.0.0.0:8889

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [memory_limiter, batch]
      exporters: [jaeger]
    metrics:
      receivers: [otlp]
      processors: [memory_limiter, batch]
      exporters: [prometheus]
```

#### Jaeger vs Zipkin

| Feature | Jaeger | Zipkin |
|---------|--------|--------|
| **Origin** | Uber | Twitter |
| **Language** | Go | Java |
| **Storage** | Cassandra, Elasticsearch, Kafka | Cassandra, Elasticsearch, MySQL |
| **UI** | Rich, dependency graphs | Simple, lightweight |
| **Sampling** | Adaptive, rate-based | Rate-based |
| **CNCF** | Graduated project | Not a CNCF project |

---

### 2.7 Alerting Best Practices

#### Alert Fatigue

Alert fatigue occurs when teams receive too many alerts, leading to desensitization and missed critical issues.

**Prevention strategies:**
- Alert on **symptoms** (user impact), not causes
- Set appropriate thresholds — avoid over-sensitive alerts
- Use `for` clause in Prometheus to avoid transient spikes
- Implement proper severity levels (critical, warning, info)
- Review and prune alerts regularly
- Every alert must be **actionable** — if it doesn't require human action, remove it

#### Alertmanager Configuration

```yaml
# alertmanager.yml
global:
  resolve_timeout: 5m
  slack_api_url: "https://hooks.slack.com/services/T00/B00/XXXX"

route:
  receiver: "default-slack"
  group_by: ["alertname", "namespace"]
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  routes:
    - match:
        severity: critical
      receiver: "pagerduty-critical"
      repeat_interval: 1h
    - match:
        severity: warning
      receiver: "slack-warning"
      repeat_interval: 4h

receivers:
  - name: "default-slack"
    slack_configs:
      - channel: "#alerts"
        title: '{{ .GroupLabels.alertname }}'
        text: '{{ range .Alerts }}{{ .Annotations.summary }}{{ end }}'

  - name: "pagerduty-critical"
    pagerduty_configs:
      - routing_key: "<PAGERDUTY_INTEGRATION_KEY>"
        severity: critical

  - name: "slack-warning"
    slack_configs:
      - channel: "#alerts-warning"

inhibit_rules:
  - source_match:
      severity: "critical"
    target_match:
      severity: "warning"
    equal: ["alertname", "namespace"]
```

#### Runbooks

- Every alert should link to a **runbook** with diagnosis steps and remediation actions
- Runbooks should be version-controlled and updated after each incident
- Include: alert description, impact, diagnosis steps, remediation, escalation path

#### On-Call Practices

- **Rotation schedule** — Distribute on-call evenly
- **Escalation policy** — Primary → Secondary → Team Lead → Management
- **Handoff process** — Document ongoing incidents during handoffs
- **Post-incident review** — Blameless postmortems to improve processes

---

### 2.8 Kubernetes Monitoring

#### Key Components

| Component | Purpose | Deployed As |
|-----------|---------|-------------|
| **kube-state-metrics** | Exposes cluster state (pod status, deployments, node conditions) | Deployment |
| **node-exporter** | Exposes host-level metrics (CPU, memory, disk, network) | DaemonSet |
| **metrics-server** | Provides resource metrics for HPA and `kubectl top` | Deployment |
| **cAdvisor** | Container-level resource usage (built into kubelet) | Built-in |
| **Prometheus Operator** | Manages Prometheus instances declaratively via CRDs | Deployment |

#### Prometheus Operator & ServiceMonitor

```yaml
# ServiceMonitor CRD — tells Prometheus what to scrape
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: app-monitor
  namespace: monitoring
  labels:
    release: prometheus
spec:
  namespaceSelector:
    matchNames:
      - production
  selector:
    matchLabels:
      app: my-app
  endpoints:
    - port: metrics
      interval: 15s
      path: /metrics
```

```yaml
# PrometheusRule CRD — declarative alerting rules
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: app-alerts
  namespace: monitoring
  labels:
    release: prometheus
spec:
  groups:
    - name: app.rules
      rules:
        - alert: AppHighLatency
          expr: histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service)) > 1
          for: 5m
          labels:
            severity: warning
          annotations:
            summary: "High p99 latency for {{ $labels.service }}"
```

#### What to Monitor in Kubernetes

- **Cluster level:** Node readiness, resource capacity, etcd health
- **Workload level:** Pod restarts, OOMKills, deployment rollout status
- **Application level:** Request rate, error rate, latency (RED method)
- **Resource level:** CPU/memory requests vs limits vs actual usage

---

## 3. Practical Examples

### Complete Prometheus + Alertmanager Docker Compose

```yaml
# docker-compose.monitoring.yml
version: "3.8"

services:
  prometheus:
    image: prom/prometheus:v2.50.0
    container_name: prometheus
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - ./prometheus/rules:/etc/prometheus/rules
      - prometheus_data:/prometheus
    command:
      - "--config.file=/etc/prometheus/prometheus.yml"
      - "--storage.tsdb.path=/prometheus"
      - "--storage.tsdb.retention.time=15d"
      - "--web.enable-lifecycle"
    ports:
      - "9090:9090"
    restart: unless-stopped

  alertmanager:
    image: prom/alertmanager:v0.27.0
    container_name: alertmanager
    volumes:
      - ./alertmanager/alertmanager.yml:/etc/alertmanager/alertmanager.yml
    ports:
      - "9093:9093"
    restart: unless-stopped

  grafana:
    image: grafana/grafana:10.4.0
    container_name: grafana
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_USERS_ALLOW_SIGN_UP=false
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning
      - ./grafana/dashboards:/var/lib/grafana/dashboards
    ports:
      - "3000:3000"
    depends_on:
      - prometheus
    restart: unless-stopped

  node-exporter:
    image: prom/node-exporter:v1.7.0
    container_name: node-exporter
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - "--path.procfs=/host/proc"
      - "--path.sysfs=/host/sys"
      - "--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)"
    ports:
      - "9100:9100"
    restart: unless-stopped

volumes:
  prometheus_data:
  grafana_data:
```

### PromQL Queries for Common Scenarios

```promql
# Container CPU usage per pod
sum(rate(container_cpu_usage_seconds_total{container!="", pod!=""}[5m])) by (pod, namespace)

# Container memory usage vs limit
container_memory_usage_bytes{container!=""} / container_spec_memory_limit_bytes{container!=""} * 100

# Pods not in Running state
kube_pod_status_phase{phase!="Running", phase!="Succeeded"} == 1

# Deployment replicas mismatch
kube_deployment_spec_replicas != kube_deployment_status_available_replicas

# Network receive/transmit rate per pod
sum(rate(container_network_receive_bytes_total[5m])) by (pod) / 1024 / 1024

# Persistent volume usage
kubelet_volume_stats_used_bytes / kubelet_volume_stats_capacity_bytes * 100

# API server request latency
histogram_quantile(0.99, sum(rate(apiserver_request_duration_seconds_bucket{verb!="WATCH"}[5m])) by (le, verb))

# etcd leader changes
changes(etcd_server_leader_changes_seen_total[1h])
```

---

## 4. Cheat Sheet — Top 20 PromQL Queries

| # | Description | Query |
|---|------------|-------|
| 1 | CPU usage % per instance | `100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)` |
| 2 | Memory usage % | `(1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100` |
| 3 | Disk usage % | `(1 - node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}) * 100` |
| 4 | HTTP request rate | `sum(rate(http_requests_total[5m])) by (method, status)` |
| 5 | Error rate % | `sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100` |
| 6 | P99 latency | `histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))` |
| 7 | P95 latency | `histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))` |
| 8 | Pod restart rate | `rate(kube_pod_container_status_restarts_total[15m]) * 60 * 15` |
| 9 | Pods in CrashLoopBackOff | `kube_pod_container_status_waiting_reason{reason="CrashLoopBackOff"} == 1` |
| 10 | Container CPU usage | `sum(rate(container_cpu_usage_seconds_total{container!=""}[5m])) by (pod)` |
| 11 | Container memory usage | `sum(container_memory_usage_bytes{container!=""}) by (pod)` |
| 12 | Disk full prediction (hours) | `predict_linear(node_filesystem_avail_bytes{mountpoint="/"}[6h], 3600*24)` |
| 13 | Network receive rate (MB/s) | `sum(rate(container_network_receive_bytes_total[5m])) by (pod) / 1024 / 1024` |
| 14 | Up/down targets | `up == 0` |
| 15 | Deployment replica mismatch | `kube_deployment_spec_replicas != kube_deployment_status_available_replicas` |
| 16 | Top 5 CPU pods | `topk(5, sum(rate(container_cpu_usage_seconds_total{container!=""}[5m])) by (pod))` |
| 17 | OOMKilled containers | `kube_pod_container_status_last_terminated_reason{reason="OOMKilled"} == 1` |
| 18 | API server error rate | `sum(rate(apiserver_request_total{code=~"5.."}[5m])) / sum(rate(apiserver_request_total[5m])) * 100` |
| 19 | PVC usage % | `kubelet_volume_stats_used_bytes / kubelet_volume_stats_capacity_bytes * 100` |
| 20 | Node not ready | `kube_node_status_condition{condition="Ready", status="true"} == 0` |

---

## 5. Hands-on Labs

### Lab 1: Set Up Prometheus + Grafana for a Docker Compose App

**Objective:** Monitor a sample web application with Prometheus and visualize metrics in Grafana.

**Steps:**

1. Create a sample app that exposes `/metrics` endpoint (use `prom-client` for Node.js or `prometheus_client` for Python).

2. Create `docker-compose.yml`:

```yaml
version: "3.8"
services:
  app:
    build: ./app
    ports:
      - "8080:8080"

  prometheus:
    image: prom/prometheus:v2.50.0
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana:10.4.0
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin
    ports:
      - "3000:3000"
```

3. Configure `prometheus.yml`:

```yaml
global:
  scrape_interval: 15s
scrape_configs:
  - job_name: "app"
    static_configs:
      - targets: ["app:8080"]
```

4. Start the stack:

```bash
docker compose up -d
```

5. Access Grafana at `http://localhost:3000`, add Prometheus data source (`http://prometheus:9090`), and create dashboards.

**Verification:**
- Prometheus targets page shows `app` as UP
- Grafana dashboard displays request rate and latency panels

---

### Lab 2: Configure Alerting Rules and Alertmanager

**Objective:** Set up alerts for high CPU and 5xx errors, route to Slack.

**Steps:**

1. Create `alerting_rules.yml`:

```yaml
groups:
  - name: app_alerts
    rules:
      - alert: HighErrorRate
        expr: sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) > 0.01
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Error rate exceeds 1%"
      - alert: HighResponseTime
        expr: histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le)) > 0.5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "P95 latency exceeds 500ms"
```

2. Create `alertmanager.yml`:

```yaml
route:
  receiver: "slack"
  group_by: ["alertname"]
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 1h
receivers:
  - name: "slack"
    slack_configs:
      - channel: "#monitoring-alerts"
        send_resolved: true
        title: "{{ .GroupLabels.alertname }}"
        text: "{{ range .Alerts }}{{ .Annotations.summary }}\n{{ end }}"
```

3. Update `prometheus.yml` to include rule files and Alertmanager target.

4. Test by generating load:

```bash
# Generate 5xx errors
for i in $(seq 1 100); do curl -s http://localhost:8080/error; done

# Verify alert fires in Alertmanager UI: http://localhost:9093
```

---

### Lab 3: Deploy EFK Stack on Kubernetes

**Objective:** Set up centralized logging with Elasticsearch, Fluent Bit, and Kibana on Kubernetes.

**Steps:**

1. Create namespace:

```bash
kubectl create namespace logging
```

2. Deploy Elasticsearch:

```bash
helm repo add elastic https://helm.elastic.co
helm install elasticsearch elastic/elasticsearch \
  --namespace logging \
  --set replicas=3 \
  --set resources.requests.memory=1Gi \
  --set resources.limits.memory=2Gi \
  --set persistence.enabled=true
```

3. Deploy Kibana:

```bash
helm install kibana elastic/kibana \
  --namespace logging \
  --set elasticsearchHosts="http://elasticsearch-master:9200"
```

4. Deploy Fluent Bit:

```bash
helm repo add fluent https://fluent.github.io/helm-charts
helm install fluent-bit fluent/fluent-bit \
  --namespace logging \
  --set config.outputs="[OUTPUT]\n    Name es\n    Match *\n    Host elasticsearch-master\n    Port 9200\n    Logstash_Format On"
```

5. Verify logs appear in Kibana Discover tab under `logstash-*` index pattern.

---

### Lab 4: Instrument an App with OpenTelemetry

**Objective:** Add distributed tracing to a Python Flask app and visualize traces in Jaeger.

**Steps:**

1. Install dependencies:

```bash
pip install flask opentelemetry-api opentelemetry-sdk \
  opentelemetry-instrumentation-flask \
  opentelemetry-exporter-jaeger
```

2. Instrument the app:

```python
from flask import Flask
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.jaeger.thrift import JaegerExporter
from opentelemetry.instrumentation.flask import FlaskInstrumentor

# Configure tracer
trace.set_tracer_provider(TracerProvider())
jaeger_exporter = JaegerExporter(
    agent_host_name="jaeger",
    agent_port=6831,
)
trace.get_tracer_provider().add_span_processor(
    BatchSpanProcessor(jaeger_exporter)
)

app = Flask(__name__)
FlaskInstrumentor().instrument_app(app)

tracer = trace.get_tracer(__name__)

@app.route("/api/users")
def get_users():
    with tracer.start_as_current_span("fetch-users-from-db"):
        # simulate DB call
        users = [{"id": 1, "name": "Alice"}]
    return {"users": users}
```

3. Run Jaeger with Docker:

```bash
docker run -d --name jaeger \
  -p 16686:16686 \
  -p 6831:6831/udp \
  jaegertracing/all-in-one:latest
```

4. Access Jaeger UI at `http://localhost:16686` and view traces.

---

## 6. Real-world Scenarios

### Scenario 1: Set Up Monitoring and Alerting for Production SLOs (99.9% Availability)

**Context:** Your team has an SLO of 99.9% availability for a production API. You need to monitor this and alert before the error budget is exhausted.

**Approach:**

1. **Define SLIs:**
   - Availability SLI = successful requests / total requests
   - Latency SLI = requests served under 300ms / total requests

2. **Calculate Error Budget:**
   - 99.9% SLO → 0.1% error budget → ~43 minutes/month

3. **Create recording rules:**

```yaml
groups:
  - name: slo_recording_rules
    rules:
      - record: slo:availability:ratio_rate5m
        expr: sum(rate(http_requests_total{status!~"5.."}[5m])) / sum(rate(http_requests_total[5m]))

      - record: slo:error_budget:remaining
        expr: 1 - ((1 - slo:availability:ratio_rate5m) / (1 - 0.999))
```

4. **Create alerting rules:**

```yaml
groups:
  - name: slo_alerts
    rules:
      - alert: ErrorBudgetBurnRateHigh
        expr: slo:error_budget:remaining < 0.5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Error budget is more than 50% consumed"

      - alert: ErrorBudgetExhausted
        expr: slo:error_budget:remaining < 0.1
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Error budget is nearly exhausted (<10% remaining)"
```

5. **Grafana dashboard:** Create panels showing current SLI, error budget remaining (%), and burn rate trend.

---

### Scenario 2: Troubleshoot a Memory Leak Using Metrics and Logs

**Symptoms:** Pod memory usage gradually increases, eventually getting OOMKilled.

**Step-by-step troubleshooting:**

1. **Identify the problem with Prometheus:**

```promql
# Memory trend over 24h
container_memory_usage_bytes{pod="my-app-xyz", container="my-app"}[24h]

# Check OOMKills
kube_pod_container_status_last_terminated_reason{reason="OOMKilled"}
```

2. **Correlate with request patterns:**

```promql
# Check if memory correlates with request rate
rate(http_requests_total{service="my-app"}[5m])
```

3. **Check logs in Kibana:** Search for `pod: "my-app-xyz" AND (error OR warning OR "out of memory")` around the OOMKill timestamp.

4. **Remediation:**
   - Increase memory limits (short-term)
   - Profile the application to identify the leak (long-term)
   - Set up alerts for memory growth rate:

```yaml
- alert: MemoryLeakSuspected
  expr: deriv(container_memory_usage_bytes{container="my-app"}[1h]) > 1048576
  for: 30m
  labels:
    severity: warning
  annotations:
    summary: "Possible memory leak in {{ $labels.pod }} — memory growing at >1MB/hour"
```

---

### Scenario 3: Implement Centralized Logging for Microservices

**Context:** 20+ microservices across 3 Kubernetes clusters need centralized logging.

**Architecture:**

```
Cluster 1,2,3 ──→ Fluent Bit (DaemonSet) ──→ Kafka ──→ Logstash ──→ Elasticsearch ──→ Kibana
```

**Implementation:**

1. **Fluent Bit** on each node (DaemonSet) collects container logs
2. **Kafka** as a buffer to handle log spikes and decouple producers/consumers
3. **Logstash** consumes from Kafka, enriches logs (parse JSON, add fields, geoip)
4. **Elasticsearch** stores logs with ILM policies (hot/warm/cold/delete)
5. **Kibana** for search, dashboards, and KQL queries

**Key decisions:**
- Structured logging (JSON) at the application level for easier parsing
- Log levels: ERROR, WARN, INFO (no DEBUG in production)
- Retention: 7 days hot, 30 days warm, 90 days cold, then delete
- Correlation IDs in all requests for cross-service tracing
- Index per service per day: `logs-payment-2026.04.05`

---

## 7. Interview Q&A

### Basic (Q1–Q15)

**Q1: What is the difference between monitoring and observability?**
> Monitoring is the practice of collecting predefined metrics and setting alerts for known failure conditions. Observability is the ability to understand the internal state of a system from its external outputs — it enables you to ask new questions about your system without deploying new code. Monitoring tells you *when* something is broken; observability helps you understand *why*.

**Q2: What are the three pillars of observability?**
> The three pillars are **metrics** (numeric measurements over time, like CPU usage or request rate), **logs** (timestamped records of discrete events), and **traces** (end-to-end journey of a request across distributed services). Together, they provide a complete picture of system behavior.

**Q3: What is Prometheus and why is it popular for cloud-native monitoring?**
> Prometheus is an open-source monitoring and alerting toolkit that is the CNCF graduated standard for cloud-native monitoring. It uses a pull-based model to scrape metrics, stores data as time series, has a powerful query language (PromQL), integrates natively with Kubernetes service discovery, and has a rich ecosystem of exporters and integrations.

**Q4: Explain the difference between a Counter and a Gauge in Prometheus.**
> A **Counter** is a monotonically increasing value that can only go up (or reset to zero). Examples: total requests served, total errors. A **Gauge** can go up or down and represents a current value. Examples: current CPU temperature, number of active connections, memory usage.

**Q5: What is Grafana used for?**
> Grafana is an open-source visualization and analytics platform. It connects to data sources like Prometheus, Elasticsearch, Loki, and CloudWatch to create rich dashboards with graphs, tables, heatmaps, and stat panels. It also supports alerting, annotations, and template variables for dynamic dashboards.

**Q6: What is the ELK Stack?**
> ELK stands for **E**lasticsearch (search and analytics engine for storing logs), **L**ogstash (data processing pipeline for ingesting, transforming, and forwarding logs), and **K**ibana (visualization layer for exploring and dashboarding log data). Together, they form a complete log management solution.

**Q7: What is Filebeat and when would you use it?**
> Filebeat is a lightweight log shipper from Elastic. It reads log files from disk and forwards them to Logstash or Elasticsearch. You'd use Filebeat instead of Logstash on edge/application nodes because it has minimal resource overhead (~10MB memory), supports backpressure, and can enrich logs with Kubernetes metadata.

**Q8: What are SLI, SLO, and SLA?**
> **SLI** (Service Level Indicator) is a metric measuring service quality (e.g., latency, availability). **SLO** (Service Level Objective) is a target value for the SLI (e.g., 99.9% availability). **SLA** (Service Level Agreement) is a contract with business consequences if the SLO is not met (e.g., customer refunds).

**Q9: What is an error budget?**
> An error budget is the maximum allowed unreliability over a period, calculated as `1 - SLO`. For a 99.9% SLO, the error budget is 0.1%, which means ~43 minutes of downtime per month. Teams can "spend" this budget on risky deployments or experiments. When the budget is exhausted, the focus shifts to reliability over features.

**Q10: What are the Golden Signals?**
> The four Golden Signals from Google's SRE book are: **Latency** (time to respond), **Traffic** (request volume), **Errors** (failure rate), and **Saturation** (how close resources are to capacity). These are the most important metrics for any user-facing service.

**Q11: What is a time-series database?**
> A time-series database (TSDB) is optimized for storing and querying timestamped data points. Prometheus uses its built-in TSDB, which stores samples as (timestamp, value) pairs indexed by metric name and labels. It supports efficient compression and fast range queries.

**Q12: What is `rate()` in PromQL?**
> `rate()` calculates the per-second average rate of increase of a counter over a time range. For example, `rate(http_requests_total[5m])` gives the average requests per second over the last 5 minutes. It handles counter resets automatically. Always use `rate()` with counters, never with gauges.

**Q13: What is the difference between `rate()` and `irate()`?**
> `rate()` calculates the average rate over the entire range vector window, giving a smooth result. `irate()` calculates the instantaneous rate using only the last two data points, making it more responsive to spikes. Use `rate()` for alerts and dashboards; use `irate()` when you need to see volatile changes.

**Q14: How does Prometheus collect metrics?**
> Prometheus uses a **pull model** — it periodically scrapes HTTP endpoints (usually `/metrics`) on configured targets. Targets expose metrics in Prometheus exposition format. Prometheus discovers targets through static configuration or dynamic service discovery (Kubernetes, Consul, EC2, DNS).

**Q15: What is a Prometheus exporter?**
> An exporter is a component that collects metrics from a third-party system and exposes them in Prometheus format. Examples: `node_exporter` (OS metrics), `mysqld_exporter` (MySQL), `blackbox_exporter` (HTTP probe), `redis_exporter` (Redis). Exporters bridge systems that don't natively expose Prometheus metrics.

---

### Intermediate (Q16–Q35)

**Q16: Explain Prometheus architecture with its main components.**
> Prometheus architecture consists of: (1) **Prometheus Server** that scrapes targets and stores time-series in its TSDB, (2) **Service Discovery** for dynamically finding targets, (3) **Pushgateway** for short-lived jobs to push metrics, (4) **Alertmanager** for routing, grouping, and silencing alerts, and (5) **Exporters** for third-party integrations. Clients query data via PromQL through the HTTP API or Grafana.

**Q17: What is the Pushgateway and when should you use it?**
> The Pushgateway allows short-lived or batch jobs to push metrics to Prometheus, since they may not live long enough to be scraped. Use it **only** for short-lived jobs (cron, CI pipelines). Do **not** use it for long-running services — it introduces a single point of failure, loses the `up` metric, and means Prometheus can't detect if the job is dead.

**Q18: How does Alertmanager handle alert routing?**
> Alertmanager receives alerts from Prometheus and routes them based on a tree of routes matching alert labels. It supports **grouping** (combining related alerts into one notification), **inhibition** (suppressing alerts when a related higher-severity alert is firing), **silencing** (muting alerts during maintenance), and multiple receivers (Slack, PagerDuty, email, webhooks).

**Q19: What is `histogram_quantile()` and how do you use it?**
> `histogram_quantile()` calculates quantiles (percentiles) from histogram bucket data. Usage: `histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))` returns the p99 latency. The `le` label (less-than-or-equal) defines bucket boundaries. It interpolates between buckets, so bucket boundaries should be chosen to match expected latency ranges.

**Q20: How do you set up Prometheus service discovery in Kubernetes?**
> You configure `kubernetes_sd_configs` in `prometheus.yml` with a role of `pod`, `service`, `endpoints`, `node`, or `ingress`. Prometheus queries the Kubernetes API to discover targets. Use `relabel_configs` to filter targets (e.g., keep pods with annotation `prometheus.io/scrape: "true"`) and set the scrape port and path. The Prometheus Operator simplifies this with the ServiceMonitor CRD.

**Q21: What is Prometheus federation?**
> Federation allows a Prometheus server to scrape aggregated metrics from other Prometheus servers. In a hierarchical setup, local Prometheus instances monitor individual clusters, and a global instance federates pre-aggregated data (recording rules) from all of them. This is useful for cross-cluster dashboards while keeping per-cluster data local.

**Q22: Explain the Logstash pipeline (input/filter/output).**
> Logstash processes data in three stages: **Input** receives data from sources (Beats, Kafka, syslog, file). **Filter** transforms data using plugins like `grok` (parse unstructured text), `mutate` (rename/remove fields), `date` (parse timestamps), `geoip` (add geographic data). **Output** sends processed data to destinations (Elasticsearch, S3, Kafka, stdout).

**Q23: What is the difference between Fluentd and Fluent Bit?**
> Both are log forwarders, but Fluent Bit is written entirely in C with a ~450KB footprint, making it ideal as a node-level DaemonSet in Kubernetes. Fluentd is written in Ruby+C (~40MB), has 1000+ plugins, and is better suited as a central log aggregator. A common pattern is Fluent Bit on nodes forwarding to a Fluentd aggregator.

**Q24: What is distributed tracing and why is it important?**
> Distributed tracing tracks the journey of a single request as it traverses multiple microservices. Each service creates a span with timing data, and spans are linked by a shared trace ID. This is critical for debugging latency issues, understanding service dependencies, and finding bottlenecks in distributed systems where a single request may touch 10+ services.

**Q25: What is OpenTelemetry?**
> OpenTelemetry (OTel) is a CNCF project that provides a unified set of APIs, SDKs, and tools for collecting telemetry data (traces, metrics, logs). It's vendor-neutral — you instrument your code once and export to any backend (Jaeger, Zipkin, Prometheus, Datadog). Components include the API, SDK, Collector (receive/process/export), and auto-instrumentation libraries.

**Q26: How does trace context propagation work?**
> When Service A calls Service B, the trace context (trace ID, span ID, trace flags) is propagated via HTTP headers. The W3C standard uses `traceparent` (e.g., `00-<trace-id>-<span-id>-01`) and `tracestate` headers. Service B extracts this context, creates a child span, and passes the updated context to downstream services. This links all spans into a single trace.

**Q27: What is alert fatigue and how do you prevent it?**
> Alert fatigue occurs when teams are overwhelmed by too many alerts, leading to ignored notifications and missed real incidents. Prevention: alert only on symptoms not causes, ensure every alert is actionable, use appropriate thresholds with `for` durations, implement severity levels, regularly review and prune alerts, use inhibition rules, and provide runbooks for each alert.

**Q28: What is kube-state-metrics?**
> kube-state-metrics is a service that listens to the Kubernetes API and generates metrics about the state of objects — pods, deployments, nodes, PVCs, etc. Unlike cAdvisor or metrics-server (which report resource usage), kube-state-metrics reports on *desired state vs actual state* (e.g., deployment replicas desired vs available, pod phase, restart count).

**Q29: What is the difference between metrics-server and Prometheus?**
> metrics-server provides lightweight, real-time resource metrics (CPU, memory) for Kubernetes HPA and `kubectl top`. It stores only the latest values, not historical data. Prometheus is a full monitoring system with long-term storage, powerful querying (PromQL), alerting, and extensive metric collection. They serve different purposes and are used together.

**Q30: What is the Prometheus Operator?**
> The Prometheus Operator manages Prometheus deployments on Kubernetes using CRDs: **Prometheus** (instance config), **ServiceMonitor** (define scrape targets by label selectors), **PodMonitor** (scrape individual pods), **PrometheusRule** (define recording/alerting rules), and **Alertmanager** (manage alertmanager instances). It simplifies lifecycle management and declarative configuration.

**Q31: How would you monitor a Kubernetes cluster end-to-end?**
> Layer your monitoring: (1) **Infrastructure** — node-exporter for node health, (2) **Kubernetes** — kube-state-metrics for cluster state, metrics-server for HPA, (3) **Container** — cAdvisor for container resource usage, (4) **Application** — custom metrics via instrumentation libraries, (5) **Network** — blackbox-exporter for endpoint probing. Use the kube-prometheus-stack Helm chart which bundles all of this.

**Q32: What is Index Lifecycle Management (ILM) in Elasticsearch?**
> ILM automates the management of indices through phases: **Hot** (actively written and queried, fast storage), **Warm** (read-only, fewer shards), **Cold** (infrequent access, frozen), **Delete** (remove after retention). Policies define transitions based on age, size, or document count. This optimizes storage costs and performance.

**Q33: What are recording rules in Prometheus?**
> Recording rules pre-compute expensive or frequently used PromQL expressions and store the result as a new time series. This reduces query load on dashboards and enables faster rendering. For example, recording `job:http_requests_total:rate5m` avoids recalculating `sum(rate(http_requests_total[5m])) by (job)` for every dashboard load.

**Q34: How do you configure Grafana dashboards as code?**
> Grafana supports provisioning through YAML config files and JSON dashboard definitions. Place datasource configs in `provisioning/datasources/` and dashboard configs in `provisioning/dashboards/`. Dashboards are JSON files referencing the data sources. This enables GitOps workflows where dashboards are version-controlled and automatically deployed.

**Q35: What is the RED method?**
> RED stands for **R**ate (requests per second), **E**rrors (failed requests per second), and **D**uration (latency distribution). It's designed for monitoring request-driven microservices. For every service, dashboard the rate, errors, and duration of requests. RED focuses on user experience, whereas USE (Utilization, Saturation, Errors) focuses on infrastructure resources.

---

### Advanced (Q36–Q50)

**Q36: What is metric cardinality and why does it matter?**
> Cardinality is the number of unique time series in Prometheus, determined by metric name × unique label combinations. High cardinality (e.g., labeling by user_id or request_id) causes excessive memory usage, slow queries, and potential OOM crashes. Best practices: avoid unbounded label values, use recording rules to pre-aggregate, monitor `prometheus_tsdb_head_series` for total active series.

**Q37: How would you scale Prometheus for a large environment?**
> Options: (1) **Sharding** — split scrape targets across multiple Prometheus instances, (2) **Federation** — a global instance scrapes aggregated data from local ones, (3) **Thanos** — adds long-term storage (S3/GCS), global query view, deduplication, and downsampling as a sidecar to Prometheus, (4) **Cortex/Mimir** — horizontally scalable, multi-tenant Prometheus-compatible system using cloud object storage.

**Q38: Compare Thanos and Cortex for long-term Prometheus storage.**
> **Thanos** is a sidecar-based approach — it uploads Prometheus TSDB blocks to object storage and provides a global query layer. Minimal changes to existing setup. **Cortex** (now Grafana Mimir) is a full rewrite — all metrics are pushed via remote_write to a horizontally scalable cluster. Cortex is better for multi-tenancy and very large scale; Thanos is simpler to adopt with existing Prometheus.

**Q39: How does Prometheus handle high availability?**
> Run two identical Prometheus instances scraping the same targets. Both can independently evaluate alerting rules. Alertmanager handles deduplication of alerts from both instances. For query HA, Thanos Query or a load balancer can fan out queries to both. Note: data is not replicated between instances — each has its own TSDB.

**Q40: Explain how you'd implement SLO-based alerting with burn rates.**
> Multi-window, multi-burn-rate alerting (from Google SRE Workbook): define alerts that fire when error budget consumption rate exceeds a threshold over different time windows. For example, alert if 2% of the monthly error budget is consumed in 1 hour (fast burn) OR if 5% is consumed in 6 hours (slow burn). This balances responsiveness with noise reduction.

```promql
# Fast burn: 14.4x burn rate for 1h (consumes 2% budget)
sum(rate(http_requests_total{status=~"5.."}[1h])) / sum(rate(http_requests_total[1h])) > 14.4 * 0.001

# Slow burn: 6x burn rate for 6h
sum(rate(http_requests_total{status=~"5.."}[6h])) / sum(rate(http_requests_total[6h])) > 6 * 0.001
```

**Q41: How do you handle log aggregation at scale (TB/day)?**
> Design patterns for large-scale logging: (1) Use **structured logging** (JSON) in applications, (2) Deploy **Fluent Bit** DaemonSets for lightweight collection, (3) Buffer through **Kafka** to handle write spikes and decouple producers/consumers, (4) Process with **Logstash** for enrichment, (5) Write to **Elasticsearch** with ILM (hot/warm/cold tiers), (6) Implement index-per-service-per-day, (7) Use data streams and composable index templates, (8) Consider retention policies carefully.

**Q42: What is the Prometheus remote_write protocol?**
> `remote_write` allows Prometheus to send samples to a remote endpoint in real-time over HTTP. It's used to push data to long-term storage backends like Thanos Receive, Cortex, Mimir, or any compatible TSDB. The protocol uses Protocol Buffers and Snappy compression. It enables centralized storage while maintaining local Prometheus instances for fast queries.

**Q43: How would you monitor a service mesh (Istio) with Prometheus?**
> Istio's Envoy sidecars natively expose Prometheus metrics. Key metrics: `istio_requests_total` (request count by source, destination, status), `istio_request_duration_milliseconds` (latency histogram), `istio_tcp_connections_opened_total`. Use Istio's built-in Prometheus integration, configure ServiceMonitors, and build dashboards for per-service RED metrics, mTLS status, and circuit breaker state.

**Q44: Explain the concept of exemplars in Prometheus.**
> Exemplars link a metric data point to a specific trace ID. When a histogram bucket is incremented, an exemplar stores the trace ID of the request that triggered it. This allows you to jump from a high-latency spike on a Grafana dashboard directly to the specific trace in Jaeger or Tempo, bridging the gap between metrics and traces.

**Q45: How do you prevent Prometheus from running out of memory?**
> (1) Monitor `prometheus_tsdb_head_series` and set alerts for cardinality growth, (2) Use `metric_relabel_configs` to drop unused metrics at scrape time, (3) Limit `sample_limit` per scrape job, (4) Reduce `scrape_interval` for high-cardinality targets, (5) Use recording rules to pre-aggregate and drop raw series, (6) Set `--storage.tsdb.retention.time` and `--storage.tsdb.retention.size` to limit TSDB size.

**Q46: What is Grafana Loki and how does it compare to Elasticsearch?**
> Loki is a log aggregation system by Grafana Labs. Unlike Elasticsearch which indexes full log text, Loki only indexes **labels** (like Prometheus) and stores compressed log chunks. This makes it much cheaper to operate, especially with object storage backends. Trade-off: log search is slower (grep over chunks), but for Kubernetes environments where labels are natural, it's highly efficient.

**Q47: How do you implement centralized tracing across multiple languages in a microservices architecture?**
> Use **OpenTelemetry**: (1) Add OTel SDK and auto-instrumentation libraries for each language (Java agent, Python instrumentor, Node.js SDK), (2) Configure OTLP exporter pointing to an OTel Collector, (3) Deploy the OTel Collector as a sidecar or DaemonSet to receive, batch, and export spans, (4) Export to a tracing backend (Jaeger, Tempo, Zipkin), (5) Ensure W3C trace context propagation headers are forwarded in all inter-service calls.

**Q48: What are the key metrics to alert on for a Kubernetes cluster?**
> **Critical alerts**: Node not ready, etcd cluster has no leader, PersistentVolume nearing capacity, API server errors >1%, kubelet not running. **Warning alerts**: Pod CrashLoopBackOff, deployment replicas mismatch, CPU/memory >80% sustained, certificate expiry <30 days, PVC approaching capacity, high pod scheduling latency. Use the `kubernetes-mixin` project for community-vetted alerts.

**Q49: How do you handle monitoring in a multi-cluster Kubernetes setup?**
> Options: (1) **Thanos** — run Prometheus + Thanos sidecar per cluster, Thanos Query provides global view with cluster label for differentiation, (2) **Grafana Mimir** — each cluster remote_writes to a central Mimir cluster, (3) **Grafana Cloud** — managed central collection. For logs: each cluster runs Fluent Bit → central Kafka → Elasticsearch. For traces: OTel Collectors forward to a central Jaeger/Tempo. Grafana dashboards use cluster variable for filtering.

**Q50: Design a complete monitoring and observability strategy for a new production microservices platform.**
> **Metrics**: Deploy kube-prometheus-stack (Prometheus Operator + Grafana + node-exporter + kube-state-metrics). Instrument all services with Prometheus client libraries. Define RED dashboards per service and USE dashboards for infrastructure. Define SLOs for each critical service.
> **Logs**: Structured JSON logging in all services. Fluent Bit DaemonSets → Kafka → Logstash → Elasticsearch with ILM. Kibana for log exploration. Correlation IDs in all requests.
> **Traces**: OpenTelemetry auto-instrumentation in all services. OTel Collector as DaemonSet → Jaeger/Tempo. Exemplars linking metrics to traces.
> **Alerting**: Multi-burn-rate SLO alerts via Prometheus → Alertmanager → PagerDuty (critical) / Slack (warning). Every alert has a runbook. Quarterly alert review.
> **Dashboards**: Tier 1 (executive) — overall availability/error budget. Tier 2 (team) — per-service RED metrics. Tier 3 (debug) — detailed resource metrics. All dashboards provisioned as code via GitOps.

---

*End of Monitoring & Observability Notes*
