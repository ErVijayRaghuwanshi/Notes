---
title: Technical Questions
layout: default
render_with_liquid: false
---
# ⚡ Rapid-Fire Technical DevOps Questions

Cross-topic technical questions testing breadth of DevOps knowledge. Keep answers concise — interviewers want to see you can cover many topics quickly.

---

## ⚡ Quick-Fire Round 1 (Q1–Q25)

### Linux (Q1–Q5)

**Q1: What is the Linux kernel and what does it do?**
> The kernel is the core of the OS that manages hardware resources, memory, processes, and system calls. It acts as a bridge between applications and physical hardware, handling CPU scheduling, device drivers, and filesystem access.

**Q2: What's the difference between a process and a thread?**
> A process is an independent execution unit with its own memory space. A thread is a lightweight unit within a process that shares the same memory. Threads are faster to create and context-switch, but a crash in one thread can affect the entire process.

**Q3: Explain Linux file permissions — what does `chmod 755` mean?**
> `755` means owner gets read/write/execute (7), group gets read/execute (5), others get read/execute (5). Each digit is a sum of r=4, w=2, x=1. So 7=rwx, 5=r-x.

**Q4: What is systemd and how does it differ from init?**
> systemd is a system and service manager that replaces SysVinit. It uses unit files instead of shell scripts, supports parallel service startup, handles dependencies declaratively, and provides tools like `systemctl` and `journalctl` for management and logging.

**Q5: How do you troubleshoot a Linux server running out of memory?**
> Check memory usage with `free -h` and `top`/`htop`. Identify memory-hungry processes with `ps aux --sort=-%mem`. Check for OOM killer activity in `dmesg`. Review `/proc/meminfo` for detailed breakdown and consider adjusting swappiness or adding swap space.

---

### Networking (Q6–Q10)

**Q6: How does DNS resolution work step by step?**
> Browser checks local cache → queries recursive resolver → resolver checks root nameserver → TLD nameserver → authoritative nameserver → returns IP. Results are cached at each level based on TTL values.

**Q7: What's the difference between TCP and UDP?**
> TCP is connection-oriented, guarantees delivery with ordering and retransmission (used for HTTP, SSH). UDP is connectionless, faster but unreliable — no handshake, no delivery guarantee (used for DNS, streaming, gaming).

**Q8: What is a reverse proxy and how does it differ from a forward proxy?**
> A forward proxy sits in front of clients and hides their identity from servers. A reverse proxy sits in front of servers and distributes traffic, handles SSL termination, caching, and load balancing. Nginx and HAProxy are common reverse proxies.

**Q9: Explain the difference between L4 and L7 load balancing.**
> L4 load balancing operates at the transport layer — routing based on IP and port without inspecting content. L7 operates at the application layer — can route based on HTTP headers, URLs, cookies, enabling smarter routing like path-based or host-based rules.

**Q10: What is a firewall rule, and what's the difference between iptables and firewalld?**
> A firewall rule controls network traffic by allowing or denying packets based on source/destination IP, port, and protocol. `iptables` uses static rule chains and is low-level. `firewalld` provides dynamic management with zones and is the default on RHEL/CentOS 7+.

---

### Git (Q11–Q13)

**Q11: What's the difference between `git rebase` and `git merge`?**
> `merge` creates a new merge commit preserving full branch history — safe for shared branches. `rebase` replays commits on top of another branch creating a linear history — cleaner but rewrites history. Never rebase public/shared branches.

**Q12: What is `git cherry-pick` and when would you use it?**
> `cherry-pick` applies a specific commit from one branch onto another without merging the entire branch. Use it for hotfixes — pick the fix commit from develop and apply it to main/release without bringing unrelated changes.

**Q13: How do you resolve a merge conflict in Git?**
> Git marks conflicts with `<<<<<<<`, `=======`, `>>>>>>>` markers. Open the conflicted files, choose the correct code (or combine both), remove markers, then `git add` the resolved files and `git commit`. Use `git mergetool` for a GUI-assisted workflow.

---

### Docker (Q14–Q18)

**Q14: What are Docker image layers and why do they matter?**
> Each instruction in a Dockerfile creates a read-only layer. Layers are cached and shared between images, making builds faster and images smaller. Ordering instructions from least to most frequently changing maximizes cache hits.

**Q15: What is a multi-stage Docker build?**
> Multi-stage builds use multiple `FROM` statements. Build dependencies stay in early stages; only the final artifact is copied to a minimal runtime image. This dramatically reduces image size — e.g., build with Maven/Node, run with just JRE/nginx.

**Q16: Explain Docker networking modes.**
> `bridge` — default, containers on a private network with NAT. `host` — container shares host's network stack directly. `none` — no networking. `overlay` — spans multiple Docker hosts for Swarm. Custom bridge networks allow DNS-based container discovery.

**Q17: What's the difference between a Docker volume and a bind mount?**
> Volumes are managed by Docker, stored in `/var/lib/docker/volumes/`, portable and recommended for production. Bind mounts map a host directory directly into the container — useful for development but tightly coupled to host filesystem structure.

**Q18: How do you secure a Docker container?**
> Run as non-root user, use minimal base images (alpine/distroless), scan images for CVEs, don't store secrets in images, use read-only filesystem, drop Linux capabilities, limit resources with cgroups, and keep Docker daemon updated.

---

### Kubernetes (Q19–Q23)

**Q19: Describe the pod lifecycle in Kubernetes.**
> Pending (waiting for scheduling) → Running (at least one container running) → Succeeded/Failed (all containers terminated). Pods can also be in Unknown state if the node is unreachable. Init containers run first, then app containers with readiness/liveness probes.

**Q20: What's the difference between ClusterIP, NodePort, and LoadBalancer services?**
> `ClusterIP` — internal-only, accessible within the cluster. `NodePort` — exposes on each node's IP at a static port (30000-32767). `LoadBalancer` — provisions a cloud load balancer that routes to NodePort. Each type builds on the previous.

**Q21: What is a Kubernetes Ingress and why use it?**
> Ingress is an API object that manages external HTTP/HTTPS access to services. It provides host-based and path-based routing, SSL termination, and name-based virtual hosting — all through a single load balancer instead of one per service.

**Q22: How does Horizontal Pod Autoscaler (HPA) work?**
> HPA automatically scales pod replicas based on observed CPU/memory utilization or custom metrics. It queries the metrics server every 15 seconds (default), compares current vs target utilization, and adjusts replica count. Configured with `minReplicas`, `maxReplicas`, and target thresholds.

**Q23: Explain Kubernetes RBAC.**
> RBAC controls who can do what in a cluster. It uses `Roles` (namespace-scoped) and `ClusterRoles` (cluster-scoped) to define permissions, and `RoleBindings`/`ClusterRoleBindings` to assign them to users, groups, or service accounts. Follow the principle of least privilege.

---

### CI/CD (Q24–Q26)

**Q24: What are the typical stages in a CI/CD pipeline?**
> Source (code checkout) → Build (compile/package) → Test (unit, integration, security scans) → Artifact storage → Deploy to staging → Approval gate → Deploy to production. Optionally includes linting, SAST/DAST scans, and smoke tests after deployment.

**Q25: What is blue-green deployment?**
> Two identical environments run simultaneously — blue (current production) and green (new version). Traffic is switched from blue to green once validated. Instant rollback by switching back to blue. Downside: requires double infrastructure during deployment.

---

## ⚡ Quick-Fire Round 2 (Q26–Q50)

### CI/CD continued (Q26)

**Q26: What is an artifact repository and why is it important?**
> An artifact repository (JFrog Artifactory, Nexus, AWS ECR) stores versioned build outputs like JARs, Docker images, and Helm charts. It ensures reproducible deployments — you deploy the exact tested artifact, not a rebuild. Also acts as a cache for dependencies.

---

### Jenkins (Q27–Q29)

**Q27: What's the difference between Declarative and Scripted Jenkins pipelines?**
> Declarative uses a structured `pipeline {}` block with predefined sections (`stages`, `steps`, `post`) — easier to read and maintain. Scripted uses Groovy code in a `node {}` block — more flexible but complex. Declarative is recommended for most use cases.

**Q28: What are Jenkins Shared Libraries?**
> Shared Libraries are reusable Groovy code stored in a separate Git repo that multiple pipelines can import. They contain `vars/` (custom pipeline steps) and `src/` (helper classes). This avoids copy-pasting pipeline logic and enforces organizational standards.

**Q29: How do Jenkins agents work?**
> The Jenkins controller orchestrates builds but delegates execution to agents (formerly slaves). Agents can be static (always-on VMs) or dynamic (spun up on demand via Kubernetes/Docker/cloud plugins). Labels route specific jobs to appropriate agents based on capabilities.

---

### Terraform (Q30–Q32)

**Q30: What is Terraform state and why is remote state important?**
> Terraform state (`terraform.tfstate`) maps real infrastructure to your config. It tracks resource metadata, dependencies, and attributes. Remote state (S3 + DynamoDB, Azure Blob) enables team collaboration, state locking to prevent concurrent modifications, and versioning for rollbacks.

**Q31: How do Terraform modules work?**
> Modules are reusable, self-contained packages of Terraform config with their own variables, resources, and outputs. They promote DRY principles — define a VPC module once, reuse it across environments. Source can be local paths, Git repos, or the Terraform Registry.

**Q32: What are Terraform workspaces?**
> Workspaces allow managing multiple state files within a single configuration — e.g., dev, staging, prod. Each workspace has an isolated state. However, many teams prefer separate directories or Terragrunt for environment separation as workspaces share the same backend config.

---

### Ansible (Q33–Q35)

**Q33: What is idempotency in Ansible?**
> Idempotency means running a playbook multiple times produces the same result without side effects. Ansible modules check current state before acting — if a package is already installed or a file already has the correct content, no action is taken. This makes Ansible safe to re-run.

**Q34: What are Ansible roles and why use them?**
> Roles are a structured way to organize playbooks into reusable components with a defined directory layout: `tasks/`, `handlers/`, `templates/`, `vars/`, `defaults/`, `files/`. They make playbooks modular, testable, and shareable via Ansible Galaxy.

**Q35: What is Ansible Vault?**
> Ansible Vault encrypts sensitive data (passwords, API keys, certificates) within playbooks or variable files using AES256. Files are encrypted/decrypted with `ansible-vault encrypt/decrypt`. Use `--ask-vault-pass` or a vault password file at runtime. Never commit plaintext secrets.

---

### AWS (Q36–Q39)

**Q36: What are EC2 instance types and how do you choose one?**
> Instance types are grouped by family: General Purpose (t3, m5), Compute Optimized (c5), Memory Optimized (r5), Storage Optimized (i3), GPU (p3, g4). Choose based on workload — t3 for burstable web servers, c5 for CPU-heavy processing, r5 for in-memory databases. Use right-sizing tools to optimize cost.

**Q37: What are S3 storage classes?**
> S3 Standard (frequent access), S3 Intelligent-Tiering (auto-tiering), S3 Standard-IA (infrequent access, lower cost), S3 One Zone-IA (single AZ, cheaper), S3 Glacier Instant Retrieval, S3 Glacier Flexible Retrieval (minutes-hours), S3 Glacier Deep Archive (12-48 hours, cheapest). Use lifecycle policies to transition objects automatically.

**Q38: How does a VPC work in AWS?**
> A VPC is an isolated virtual network in AWS. You define CIDR blocks, create public subnets (with Internet Gateway) and private subnets (with NAT Gateway for outbound). Security Groups (stateful, instance-level) and NACLs (stateless, subnet-level) control traffic. Route tables determine where traffic is directed.

**Q39: What is AWS Lambda and what are its limitations?**
> Lambda runs code without managing servers — you pay per invocation and execution time. Supports Node.js, Python, Java, Go, .NET. Limitations: 15-minute max timeout, 10 GB max memory, 250 MB deployment package (500 MB unzipped), cold start latency for first invocation, no persistent local storage.

---

### Azure (Q40–Q42)

**Q40: What is AKS and how does it differ from self-managed Kubernetes?**
> Azure Kubernetes Service (AKS) is a managed K8s service where Azure handles the control plane (API server, etcd, scheduler, controller manager). You only manage worker nodes. Benefits: automated upgrades, built-in monitoring with Azure Monitor, integration with Entra ID for RBAC, and Azure CNI networking. You don't pay for the control plane.

**Q41: What is Microsoft Entra ID (Azure AD) and how does it differ from on-prem Active Directory?**
> Entra ID is a cloud-based identity platform using REST APIs and OAuth/OIDC/SAML protocols. On-prem AD uses LDAP and Kerberos. Entra ID provides SSO for cloud apps, Conditional Access policies, MFA, and B2B/B2C identity services. It's not a cloud version of AD DS — they serve different purposes and can be synced with Azure AD Connect.

**Q42: What is Bicep and how does it compare to ARM templates?**
> Bicep is a domain-specific language (DSL) that compiles to ARM JSON templates. It offers cleaner syntax, type safety, modularity, and better tooling compared to verbose ARM JSON. Bicep supports modules for reusable components, has IntelliSense in VS Code, and automatically handles resource dependencies. It's the recommended IaC tool for Azure.

---

### Monitoring (Q43–Q45)

**Q43: What is Prometheus and how does it collect metrics?**
> Prometheus is an open-source monitoring system that uses a pull model — it scrapes HTTP endpoints (exporters) at configured intervals. It stores time-series data locally with a custom TSDB. Key components: Prometheus server, Alertmanager, exporters (node_exporter, kube-state-metrics), and Pushgateway for short-lived jobs.

**Q44: Write a PromQL query to calculate the HTTP error rate.**
> `sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100` — this calculates the percentage of 5xx responses over the last 5 minutes. Use `rate()` for per-second rate of counter metrics over a time window. Group by service with `by(service)` for per-service error rates.

**Q45: What is the ELK stack and when would you use it?**
> Elasticsearch (search and analytics engine), Logstash (log processing pipeline), Kibana (visualization). Use ELK for centralized log aggregation across microservices, searching through application logs, creating dashboards for log analytics, and setting up log-based alerts. Filebeat/Fluentd typically replaces Logstash for log shipping.

---

### Shell Scripting (Q46–Q48)

**Q46: What are exit codes in Bash and how do you use them?**
> Exit code 0 means success, non-zero means failure. Check with `$?` after a command. Use `set -e` to exit on first error, `set -o pipefail` to catch errors in pipelines. In scripts, use `exit 1` for custom error exits. Trap errors with `trap 'handler' ERR` for cleanup on failure.

**Q47: How do you handle errors in a Bash script?**
> Use `set -euo pipefail` at the top: `-e` exits on error, `-u` treats unset variables as errors, `-o pipefail` catches pipe failures. Implement error traps: `trap 'echo "Error on line $LINENO"; cleanup; exit 1' ERR`. Use conditional checks for critical commands: `command || { echo "Failed"; exit 1; }`. Log errors to stderr with `>&2`.

**Q48: How do you pass and parse arguments in a Bash script?**
> Positional args: `$1`, `$2`, `$@` (all), `$#` (count). For named args, use `getopts` for short options: `while getopts "f:o:v" opt; do case $opt in f) file=$OPTARG;; esac; done`. For long options, use `getopt` or manual parsing with a while-shift loop: `while [[ $# -gt 0 ]]; do case $1 in --file) file=$2; shift 2;; esac; done`.

---

### GitOps (Q49–Q50)

**Q49: What is ArgoCD and how does it implement GitOps?**
> ArgoCD is a declarative GitOps controller for Kubernetes. It continuously monitors a Git repository containing K8s manifests and compares the desired state (Git) with the live state (cluster). When drift is detected, it can auto-sync or alert for manual approval. It provides a web UI showing sync status, health, and diff views.

**Q50: What's the difference between push-based and pull-based deployment models?**
> Push-based: CI pipeline pushes changes to the cluster (e.g., `kubectl apply` in Jenkins) — requires cluster credentials in CI, less secure. Pull-based (GitOps): an agent inside the cluster pulls changes from Git (ArgoCD, Flux) — cluster credentials stay inside the cluster, more secure. Pull-based is the GitOps standard.

---

## 📋 Quick Reference Table

| Topic | Key Tool/Concept | One-Liner |
|-------|-----------------|-----------|
| Linux | systemd | Init system managing services with unit files |
| Networking | DNS | Translates domain names to IP addresses |
| Git | rebase | Replays commits for linear history |
| Docker | multi-stage | Separate build and runtime for smaller images |
| Kubernetes | HPA | Auto-scales pods based on metrics |
| CI/CD | blue-green | Two identical envs for zero-downtime deploys |
| Jenkins | Shared Libraries | Reusable pipeline code across projects |
| Terraform | state | Maps real infra to config |
| Ansible | idempotency | Same result regardless of run count |
| AWS | VPC | Isolated virtual network in AWS |
| Azure | Entra ID | Cloud identity and access management |
| Monitoring | PromQL | Query language for Prometheus metrics |
| Shell | set -euo pipefail | Strict error handling in Bash |
| GitOps | ArgoCD | Pull-based K8s deployment from Git |

---

*Good luck with your DevOps interview! 🚀*

### AWS (Q36–Q39)

**Q36: What's the difference between EC2 instance types and when do you choose each?**
> `t3/t4g` — burstable, for variable workloads. `m5/m6i` — general purpose, balanced compute/memory. `c5/c6i` — compute-optimized, for CPU-intensive tasks. `r5/r6i` — memory-optimized, for databases/caching. Choose based on workload profile: CPU, memory, storage, or network.

**Q37: Explain S3 storage classes.**
> `Standard` — frequently accessed, low latency. `Intelligent-Tiering` — auto-moves between tiers. `Standard-IA` — infrequent access, lower cost. `Glacier Instant/Flexible/Deep Archive` — archival storage with increasing retrieval time and decreasing cost. Lifecycle policies automate transitions.

**Q38: How does an AWS VPC work?**
> A VPC is a logically isolated virtual network. You define CIDR blocks, create subnets (public with internet gateway, private with NAT gateway), configure route tables, security groups (stateful), and NACLs (stateless). VPC peering or Transit Gateway connects multiple VPCs.

**Q39: What is AWS Lambda and what are its limitations?**
> Lambda is serverless compute that runs code in response to events (API Gateway, S3, SQS) without managing servers. Limitations: 15-minute max execution time, 10 GB memory, cold starts add latency, 250 MB deployment package (unzipped), and 1000 default concurrent executions per region.

---

### Azure (Q40–Q42)

**Q40: What is AKS and how does it differ from self-managed Kubernetes?**
> AKS (Azure Kubernetes Service) is a managed Kubernetes offering where Azure manages the control plane (API server, etcd, scheduler). You only manage worker nodes. It integrates with Entra ID, Azure Monitor, Azure CNI, and supports auto-scaling, reducing operational overhead versus self-managed clusters.

**Q41: What is Microsoft Entra ID (formerly Azure AD)?**
> Entra ID is Microsoft's cloud identity and access management service. It provides SSO, MFA, conditional access, and RBAC for Azure resources and SaaS apps. Service principals and managed identities allow applications to authenticate without storing credentials.

**Q42: What is Azure Bicep?**
> Bicep is a domain-specific language (DSL) for deploying Azure resources declaratively. It compiles to ARM templates but with cleaner syntax — no JSON nesting, supports modules, and has first-class VS Code tooling. It's the recommended IaC for Azure-native deployments.

---

### Monitoring (Q43–Q45)

**Q43: How does Prometheus work?**
> Prometheus follows a pull model — it scrapes metrics from configured targets at regular intervals. Targets expose metrics on an HTTP endpoint (usually `/metrics`). Data is stored in a time-series database. Alertmanager handles alerts based on rules. It's the standard for Kubernetes monitoring.

**Q44: Write a basic PromQL query to get CPU usage.**
> `rate(node_cpu_seconds_total{mode!="idle"}[5m])` gives per-core CPU usage rate. For overall usage: `1 - avg(rate(node_cpu_seconds_total{mode="idle"}[5m]))`. `rate()` calculates per-second increase over the time window, essential for counter-type metrics.

**Q45: What is the ELK Stack and what does each component do?**
> **Elasticsearch** — distributed search and analytics engine, stores and indexes logs. **Logstash** — ingests, transforms, and ships logs from multiple sources. **Kibana** — visualization dashboard for querying and exploring data. Often Filebeat replaces Logstash for lightweight log shipping.

---

### Shell Scripting (Q46–Q48)

**Q46: What's the difference between `$VAR`, `"$VAR"`, and `'$VAR'` in Bash?**
> `$VAR` — expands the variable, subject to word splitting and globbing. `"$VAR"` — expands the variable but preserves spaces and special characters (always prefer this). `'$VAR'` — literal string, no expansion. Use double quotes by default to avoid unexpected behavior.

**Q47: How do you handle errors in a shell script?**
> Use `set -euo pipefail` at the top. `-e` exits on any error, `-u` treats unset variables as errors, `-o pipefail` catches failures in piped commands. Add `trap` for cleanup on exit: `trap 'rm -f /tmp/lockfile' EXIT`. Check `$?` for specific command exit codes when needed.

**Q48: What do exit codes mean in Linux?**
> `0` means success, non-zero means failure. `1` — general error, `2` — misuse of builtin, `126` — command not executable, `127` — command not found, `128+N` — killed by signal N (e.g., `137` = SIGKILL, `143` = SIGTERM). Scripts should return meaningful exit codes.

---

### GitOps (Q49–Q50)

**Q49: What is ArgoCD and how does it implement GitOps?**
> ArgoCD is a declarative GitOps continuous delivery tool for Kubernetes. It monitors a Git repository containing Kubernetes manifests and automatically syncs the cluster state to match. It detects drift, provides a UI for visualization, supports rollbacks, and integrates with Helm, Kustomize, and plain YAML.

**Q50: What's the difference between push-based and pull-based GitOps?**
> **Push-based** — CI pipeline pushes changes directly to the cluster (e.g., `kubectl apply` from Jenkins). Requires cluster credentials in CI. **Pull-based** — an agent inside the cluster (ArgoCD, Flux) pulls desired state from Git and applies it. More secure — no external access to the cluster, and the agent continuously reconciles drift.

---

## 📋 Quick Reference: Topic Coverage

| Topic           | Questions | Key Concepts                              |
|-----------------|-----------|-------------------------------------------|
| Linux           | Q1–Q5     | Kernel, processes, permissions, systemd   |
| Networking      | Q6–Q10    | DNS, TCP/UDP, proxy, load balancing       |
| Git             | Q11–Q13   | Rebase, cherry-pick, conflicts            |
| Docker          | Q14–Q18   | Layers, multi-stage, networking, security |
| Kubernetes      | Q19–Q23   | Pods, services, ingress, HPA, RBAC       |
| CI/CD           | Q24–Q26   | Pipeline stages, blue-green, artifacts    |
| Jenkins         | Q27–Q29   | Declarative, shared libs, agents          |
| Terraform       | Q30–Q32   | State, modules, workspaces                |
| Ansible         | Q33–Q35   | Idempotency, roles, vault                 |
| AWS             | Q36–Q39   | EC2, S3, VPC, Lambda                      |
| Azure           | Q40–Q42   | AKS, Entra ID, Bicep                      |
| Monitoring      | Q43–Q45   | Prometheus, PromQL, ELK                   |
| Shell Scripting | Q46–Q48   | Variables, error handling, exit codes     |
| GitOps          | Q49–Q50   | ArgoCD, push vs pull model                |

---

> **Interview Tip:** In rapid-fire rounds, lead with the "what" (definition), then the "why" (purpose), and finish with a concrete example if time allows. Don't ramble — silence after a crisp answer is better than padding.
