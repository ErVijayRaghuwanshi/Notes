# ☸️ Kubernetes – DevOps Notes

---

## 1. Introduction

Kubernetes (K8s) is an open-source container orchestration platform that automates deployment, scaling, and management of containerized applications.

### Why Kubernetes?
- **Self-healing:** Restarts failed containers, replaces and reschedules
- **Horizontal scaling:** Scale based on CPU/memory/custom metrics
- **Service discovery & load balancing:** Built-in DNS and traffic distribution
- **Automated rollouts & rollbacks:** Zero-downtime deployments
- **Secret & config management:** Secure handling of sensitive data

---

## 2. Architecture

```
┌─────────────────── Control Plane ──────────────────────┐
│  ┌──────────────┐  ┌───────────┐  ┌─────────────────┐ │
│  │  API Server   │  │  etcd     │  │ Controller Mgr  │ │
│  │  (kube-api)   │  │ (key-val) │  │ (reconciliation)│ │
│  └───────┬──────┘  └───────────┘  └─────────────────┘ │
│          │         ┌─────────────────┐                  │
│          │         │   Scheduler      │                  │
│          │         │  (pod placement) │                  │
│          │         └─────────────────┘                  │
└──────────┼─────────────────────────────────────────────┘
           │
    ┌──────┴──────── Worker Nodes ────────────────────────┐
    │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
    │  │  kubelet  │  │kube-proxy│  │ Container │         │
    │  │ (agent)   │  │ (network)│  │  Runtime  │         │
    │  └──────────┘  └──────────┘  │(containerd)│         │
    │                               └──────────┘         │
    │  ┌───────┐ ┌───────┐ ┌───────┐                     │
    │  │ Pod 1 │ │ Pod 2 │ │ Pod 3 │                     │
    │  └───────┘ └───────┘ └───────┘                     │
    └────────────────────────────────────────────────────┘

Components:
  API Server       → Front-end to the control plane, handles all REST API requests
  etcd             → Distributed key-value store for all cluster data
  Scheduler        → Assigns pods to nodes based on resources and constraints
  Controller Mgr   → Runs controllers (ReplicaSet, Deployment, Node, Job)
  kubelet          → Agent on each node that manages pods and containers
  kube-proxy       → Manages network rules and service routing on each node
  Container Runtime→ Runs containers (containerd, CRI-O)
```

---

## 3. Core Resources

### Pods
```yaml
# pod.yaml - Smallest deployable unit
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  labels:
    app: nginx
    tier: frontend
spec:
  containers:
    - name: nginx
      image: nginx:1.25-alpine
      ports:
        - containerPort: 80
      resources:
        requests:
          cpu: "100m"
          memory: "128Mi"
        limits:
          cpu: "250m"
          memory: "256Mi"
      livenessProbe:
        httpGet:
          path: /healthz
          port: 80
        initialDelaySeconds: 10
        periodSeconds: 15
      readinessProbe:
        httpGet:
          path: /ready
          port: 80
        initialDelaySeconds: 5
        periodSeconds: 10
```

### Deployments
```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
  labels:
    app: web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-app
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
        - name: web
          image: myapp:v2.0
          ports:
            - containerPort: 8080
          env:
            - name: DB_HOST
              valueFrom:
                configMapKeyRef:
                  name: app-config
                  key: db-host
            - name: DB_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: app-secrets
                  key: db-password
          resources:
            requests:
              cpu: "200m"
              memory: "256Mi"
            limits:
              cpu: "500m"
              memory: "512Mi"
```

### Services
```yaml
# ClusterIP (internal only – default)
apiVersion: v1
kind: Service
metadata:
  name: web-service
spec:
  type: ClusterIP
  selector:
    app: web-app
  ports:
    - port: 80
      targetPort: 8080

---
# NodePort (expose on each node's IP)
apiVersion: v1
kind: Service
metadata:
  name: web-nodeport
spec:
  type: NodePort
  selector:
    app: web-app
  ports:
    - port: 80
      targetPort: 8080
      nodePort: 30080     # 30000-32767

---
# LoadBalancer (cloud provider LB)
apiVersion: v1
kind: Service
metadata:
  name: web-lb
spec:
  type: LoadBalancer
  selector:
    app: web-app
  ports:
    - port: 80
      targetPort: 8080
```

### ConfigMaps & Secrets
```yaml
# ConfigMap
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  db-host: "postgres.default.svc.cluster.local"
  db-port: "5432"
  log-level: "info"
  nginx.conf: |
    server {
        listen 80;
        location / {
            proxy_pass http://backend:8080;
        }
    }

---
# Secret (base64 encoded)
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  db-password: cGFzc3dvcmQxMjM=     # echo -n "password123" | base64
  api-key: bXlzZWNyZXRrZXk=
```

### Ingress
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - app.example.com
      secretName: app-tls
  rules:
    - host: app.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend
                port:
                  number: 80
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: backend-api
                port:
                  number: 8080
```

---

## 4. Storage

```yaml
# PersistentVolume (PV)
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-data
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: standard
  hostPath:
    path: /data/pv

---
# PersistentVolumeClaim (PVC)
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: app-data-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
  storageClassName: standard

---
# Using PVC in a Pod
apiVersion: v1
kind: Pod
metadata:
  name: app-with-storage
spec:
  containers:
    - name: app
      image: myapp:latest
      volumeMounts:
        - name: data-volume
          mountPath: /app/data
  volumes:
    - name: data-volume
      persistentVolumeClaim:
        claimName: app-data-pvc
```

---

## 5. Advanced Resources

### StatefulSet
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
spec:
  serviceName: postgres
  replicas: 3
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:16
          ports:
            - containerPort: 5432
          volumeMounts:
            - name: pgdata
              mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
    - metadata:
        name: pgdata
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 10Gi
```

### DaemonSet, Job, CronJob
```yaml
# DaemonSet (runs one pod per node)
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluentd
spec:
  selector:
    matchLabels:
      app: fluentd
  template:
    metadata:
      labels:
        app: fluentd
    spec:
      containers:
        - name: fluentd
          image: fluentd:v1.16

---
# Job (run to completion)
apiVersion: batch/v1
kind: Job
metadata:
  name: db-migrate
spec:
  backoffLimit: 3
  template:
    spec:
      restartPolicy: Never
      containers:
        - name: migrate
          image: myapp:latest
          command: ["python", "manage.py", "migrate"]

---
# CronJob
apiVersion: batch/v1
kind: CronJob
metadata:
  name: daily-backup
spec:
  schedule: "0 2 * * *"
  jobTemplate:
    spec:
      template:
        spec:
          restartPolicy: OnFailure
          containers:
            - name: backup
              image: myapp:latest
              command: ["/scripts/backup.sh"]
```

### RBAC
```yaml
# Role (namespace-scoped)
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: production
  name: pod-reader
rules:
  - apiGroups: [""]
    resources: ["pods", "pods/log"]
    verbs: ["get", "list", "watch"]

---
# RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
  namespace: production
subjects:
  - kind: User
    name: developer@example.com
    apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io

---
# ClusterRole (cluster-wide)
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: node-viewer
rules:
  - apiGroups: [""]
    resources: ["nodes"]
    verbs: ["get", "list", "watch"]
```

### HPA (Horizontal Pod Autoscaler)
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
```

---

## 6. Helm

```bash
# Helm = Kubernetes package manager

# Add repository
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Search charts
helm search repo nginx

# Install
helm install my-nginx bitnami/nginx
helm install my-app ./my-chart -f values-prod.yaml -n production

# List releases
helm list -A

# Upgrade
helm upgrade my-app ./my-chart -f values-prod.yaml

# Rollback
helm rollback my-app 1      # Rollback to revision 1

# Uninstall
helm uninstall my-app

# Template (dry-run)
helm template my-app ./my-chart -f values.yaml
```

### Helm Chart Structure
```
my-chart/
├── Chart.yaml          # Chart metadata
├── values.yaml         # Default configuration values
├── templates/
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   ├── configmap.yaml
│   ├── _helpers.tpl    # Template helpers
│   └── NOTES.txt       # Post-install instructions
└── charts/             # Sub-charts (dependencies)
```

---

## 7. kubectl Cheat Sheet

| Command | Purpose |
|---------|---------|
| `kubectl get pods -A` | List all pods in all namespaces |
| `kubectl get pods -o wide` | Pods with node and IP info |
| `kubectl get deploy,svc,ing` | Multiple resource types |
| `kubectl describe pod <name>` | Detailed pod info |
| `kubectl logs <pod> -f` | Follow pod logs |
| `kubectl logs <pod> -c <container>` | Specific container logs |
| `kubectl exec -it <pod> -- bash` | Shell into pod |
| `kubectl apply -f manifest.yaml` | Apply configuration |
| `kubectl delete -f manifest.yaml` | Delete resources |
| `kubectl scale deploy <name> --replicas=5` | Scale deployment |
| `kubectl rollout status deploy <name>` | Watch rollout progress |
| `kubectl rollout undo deploy <name>` | Rollback deployment |
| `kubectl rollout history deploy <name>` | View revision history |
| `kubectl top pods` | Pod resource usage |
| `kubectl top nodes` | Node resource usage |
| `kubectl get events --sort-by=.lastTimestamp` | Recent events |
| `kubectl port-forward svc/<name> 8080:80` | Port forward |
| `kubectl create secret generic <name> --from-literal=key=val` | Create secret |
| `kubectl config get-contexts` | List contexts |
| `kubectl config use-context <name>` | Switch cluster context |
| `kubectl drain <node> --ignore-daemonsets` | Drain node for maintenance |
| `kubectl cordon <node>` | Mark node unschedulable |
| `kubectl taint nodes <node> key=val:NoSchedule` | Taint a node |
| `kubectl get ns` | List namespaces |
| `kubectl api-resources` | List all resource types |

---

## 8. Hands-on Labs

### Lab 1: Deploy Application with Deployment + Service + Ingress
```bash
# Step 1: Create namespace
kubectl create namespace lab

# Step 2: Create deployment
kubectl apply -n lab -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: hello
  template:
    metadata:
      labels:
        app: hello
    spec:
      containers:
        - name: hello
          image: hashicorp/http-echo:0.2.3
          args: ["-text=Hello from Kubernetes!"]
          ports:
            - containerPort: 5678
          resources:
            requests:
              cpu: 50m
              memory: 64Mi
            limits:
              cpu: 100m
              memory: 128Mi
EOF

# Step 3: Create service
kubectl apply -n lab -f - <<EOF
apiVersion: v1
kind: Service
metadata:
  name: hello-svc
spec:
  selector:
    app: hello
  ports:
    - port: 80
      targetPort: 5678
EOF

# Step 4: Create ingress
kubectl apply -n lab -f - <<EOF
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: hello-ingress
spec:
  ingressClassName: nginx
  rules:
    - host: hello.local
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: hello-svc
                port:
                  number: 80
EOF

# Step 5: Verify
kubectl get all -n lab
kubectl describe ingress hello-ingress -n lab
```

### Lab 2: Rolling Update and Rollback
```bash
# Step 1: Apply v1
kubectl set image deployment/hello-app hello=hashicorp/http-echo:0.2.3 -n lab

# Step 2: Watch rollout
kubectl rollout status deployment/hello-app -n lab

# Step 3: Update to v2
kubectl set image deployment/hello-app hello=nginx:1.25-alpine -n lab

# Step 4: Check history
kubectl rollout history deployment/hello-app -n lab

# Step 5: Rollback to previous version
kubectl rollout undo deployment/hello-app -n lab

# Step 6: Verify
kubectl rollout status deployment/hello-app -n lab
kubectl get pods -n lab
```

### Lab 3: ConfigMap and Secret Usage
```bash
# Step 1: Create ConfigMap
kubectl create configmap app-config -n lab \
  --from-literal=APP_ENV=production \
  --from-literal=LOG_LEVEL=info

# Step 2: Create Secret
kubectl create secret generic app-secrets -n lab \
  --from-literal=DB_PASSWORD=mysecretpass

# Step 3: Use in deployment
kubectl apply -n lab -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: config-demo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: config-demo
  template:
    metadata:
      labels:
        app: config-demo
    spec:
      containers:
        - name: app
          image: busybox
          command: ["sh", "-c", "env && sleep 3600"]
          envFrom:
            - configMapRef:
                name: app-config
          env:
            - name: DB_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: app-secrets
                  key: DB_PASSWORD
EOF

# Step 4: Verify
kubectl exec -n lab deploy/config-demo -- env | grep -E "APP_ENV|LOG_LEVEL|DB_PASSWORD"
```

### Lab 4: HPA Auto-scaling
```bash
# Step 1: Ensure metrics-server is running
kubectl get pods -n kube-system | grep metrics-server

# Step 2: Create deployment with resource requests
kubectl apply -n lab -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: php-apache
spec:
  replicas: 1
  selector:
    matchLabels:
      app: php-apache
  template:
    metadata:
      labels:
        app: php-apache
    spec:
      containers:
        - name: php-apache
          image: registry.k8s.io/hpa-example
          ports:
            - containerPort: 80
          resources:
            requests:
              cpu: 200m
EOF

kubectl expose deployment php-apache -n lab --port=80

# Step 3: Create HPA
kubectl autoscale deployment php-apache -n lab --cpu-percent=50 --min=1 --max=10

# Step 4: Generate load
kubectl run -n lab load-generator --image=busybox --rm -it -- \
  /bin/sh -c "while true; do wget -q -O- http://php-apache; done"

# Step 5: Watch scaling (in another terminal)
kubectl get hpa -n lab -w
kubectl get pods -n lab -w
```

---

## 9. Real-world Scenarios

### Scenario 1: Zero-Downtime Deployment

**Situation:** Deploy a new version without any downtime.

```yaml
# Strategy in Deployment
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # 1 extra pod during update
      maxUnavailable: 0  # All existing pods stay running

  template:
    spec:
      containers:
        - name: app
          # Readiness probe ensures traffic only goes to ready pods
          readinessProbe:
            httpGet:
              path: /health
              port: 8080
            initialDelaySeconds: 10
            periodSeconds: 5
            failureThreshold: 3
          # Lifecycle hook for graceful shutdown
          lifecycle:
            preStop:
              exec:
                command: ["/bin/sh", "-c", "sleep 10"]
      terminationGracePeriodSeconds: 30
```

```bash
# Deploy
kubectl apply -f deployment.yaml
kubectl rollout status deployment/web-app

# If something goes wrong
kubectl rollout undo deployment/web-app
```

### Scenario 2: Pod Stuck in CrashLoopBackOff

**Situation:** Pods are continuously restarting.

```bash
# 1. Check pod status and events
kubectl describe pod <pod-name>

# 2. Check logs (current and previous)
kubectl logs <pod-name>
kubectl logs <pod-name> --previous   # Logs from crashed container

# 3. Common causes and fixes:
# Exit code 1: Application error → check app logs, config
# Exit code 137: OOM Killed → increase memory limits
# Exit code 0: Container completes → ensure CMD runs a long process
# ImagePullBackOff: Wrong image name/tag or registry auth issues

# 4. Debug with ephemeral container
kubectl debug <pod-name> -it --image=busybox

# 5. Override command for debugging
kubectl run debug --image=myapp:latest --rm -it --command -- sh
```

### Scenario 3: Node Maintenance

**Situation:** Need to patch and restart a worker node without service disruption.

```bash
# 1. Cordon the node (prevent new pods)
kubectl cordon node-03

# 2. Drain the node (evict existing pods)
kubectl drain node-03 --ignore-daemonsets --delete-emptydir-data

# 3. Verify pods moved to other nodes
kubectl get pods -A -o wide | grep node-03

# 4. Perform maintenance (OS updates, reboot)

# 5. Uncordon the node
kubectl uncordon node-03

# 6. Verify node is ready
kubectl get nodes
```

---

## 10. Interview Q&A (50 Questions)

### Basic (1–15)

**Q1: What is Kubernetes?**
> An open-source container orchestration platform that automates deployment, scaling, and management of containerized applications across clusters of machines.

**Q2: What is a Pod?**
> The smallest deployable unit in Kubernetes. A pod encapsulates one or more containers that share networking (same IP) and storage. Usually one container per pod.

**Q3: What is a Deployment?**
> A resource that manages ReplicaSets and provides declarative updates to pods. Supports rolling updates, rollbacks, and scaling.

**Q4: What are the types of Kubernetes Services?**
> **ClusterIP** (internal only, default), **NodePort** (exposes on each node's IP:port), **LoadBalancer** (cloud provider LB), **ExternalName** (DNS CNAME mapping).

**Q5: What is a namespace?**
> A virtual cluster within a physical cluster for resource isolation and organization. Default namespaces: `default`, `kube-system`, `kube-public`, `kube-node-lease`.

**Q6: What is kubectl?**
> The command-line tool for interacting with Kubernetes clusters. It communicates with the API server to manage resources.

**Q7: What is a ReplicaSet?**
> Ensures a specified number of pod replicas are running at all times. Deployments manage ReplicaSets—you rarely create them directly.

**Q8: What is a ConfigMap?**
> A resource for storing non-sensitive configuration data as key-value pairs. Injected into pods as environment variables or mounted as files.

**Q9: What is a Secret?**
> A resource for storing sensitive data (passwords, tokens, keys) in base64-encoded format. Mounted as files or environment variables. Use with encryption at rest.

**Q10: What is an Ingress?**
> An API resource that manages external HTTP/HTTPS access to services. Provides URL routing, SSL termination, and name-based virtual hosting. Requires an Ingress controller.

**Q11: What is the difference between a Deployment and a StatefulSet?**
> **Deployment:** Stateless apps, pods are interchangeable, random names. **StatefulSet:** Stateful apps, stable pod identities (pod-0, pod-1), ordered deployment, persistent storage per pod.

**Q12: What is a DaemonSet?**
> Ensures a pod runs on every node (or selected nodes). Used for: log collectors (Fluentd), monitoring agents (Prometheus node exporter), network plugins.

**Q13: What is a liveness probe vs a readiness probe?**
> **Liveness:** Checks if the container is alive—restarts on failure. **Readiness:** Checks if the container can serve traffic—removes from service endpoints on failure.

**Q14: How do you scale a deployment?**
> `kubectl scale deployment web-app --replicas=5` or update YAML and `kubectl apply`. For auto-scaling, use HPA.

**Q15: What is a Kubernetes node?**
> A worker machine (VM or physical) that runs pods. Each node has kubelet, kube-proxy, and a container runtime. The control plane manages nodes.

### Intermediate (16–35)

**Q16: Explain the Kubernetes deployment process.**
> 1) `kubectl apply` sends manifest to API server 2) API server validates and stores in etcd 3) Scheduler assigns pods to nodes 4) kubelet pulls images and starts containers 5) Controllers ensure desired state.

**Q17: What is a rolling update?**
> Incrementally replaces old pods with new ones. Controlled by `maxSurge` (extra pods) and `maxUnavailable` (pods that can be down). Ensures zero downtime.

**Q18: How do you rollback a deployment?**
> `kubectl rollout undo deployment/web-app` (last revision) or `kubectl rollout undo deployment/web-app --to-revision=2` (specific revision). Check history with `kubectl rollout history`.

**Q19: What is a PersistentVolume (PV) and PersistentVolumeClaim (PVC)?**
> **PV:** A piece of storage in the cluster provisioned by admin or dynamically. **PVC:** A user's request for storage. PVC binds to a PV. Pods use PVCs to mount volumes.

**Q20: What is a StorageClass?**
> Defines different tiers of storage (SSD, HDD, etc.). Enables dynamic PV provisioning—when a PVC is created, the StorageClass automatically provisions a PV.

**Q21: What is Helm?**
> The Kubernetes package manager. Packages applications as "charts" (templated YAML). Supports versioning, dependencies, and value overrides. `helm install`, `helm upgrade`, `helm rollback`.

**Q22: What is a Network Policy?**
> A resource that controls pod-to-pod traffic at L3/L4. By default, all traffic is allowed. Network policies are additive (whitelist). Requires a CNI that supports them (Calico, Cilium).

**Q23: What is a taint and toleration?**
> **Taint** on a node: Repels pods that don't tolerate it. **Toleration** on a pod: Allows scheduling on tainted nodes. Use case: Dedicated nodes for specific workloads.

**Q24: What is a node affinity?**
> Rules that constrain which nodes a pod can be scheduled on based on node labels. Types: `requiredDuringScheduling` (hard rule), `preferredDuringScheduling` (soft preference).

**Q25: What is the difference between `kubectl apply` and `kubectl create`?**
> `create` is imperative—fails if resource exists. `apply` is declarative—creates if missing, updates if exists. Use `apply` for production (tracks changes in annotations).

**Q26: What is CRI, CNI, CSI?**
> **CRI** (Container Runtime Interface): Standard for container runtimes (containerd, CRI-O). **CNI** (Container Network Interface): Standard for networking plugins (Calico, Flannel). **CSI** (Container Storage Interface): Standard for storage plugins.

**Q27: What is an Init Container?**
> A container that runs and completes before the main containers start. Used for setup tasks: database migrations, config file generation, waiting for dependencies. Runs sequentially.

**Q28: What is a sidecar container?**
> A container that runs alongside the main container in the same pod. Use cases: log shipping (Fluentd), service mesh proxy (Envoy/Istio), monitoring agents.

**Q29: What is HPA (Horizontal Pod Autoscaler)?**
> Automatically scales the number of pod replicas based on CPU/memory utilization or custom metrics. Requires metrics-server. Defined with min/max replicas and target utilization.

**Q30: What is VPA (Vertical Pod Autoscaler)?**
> Automatically adjusts CPU/memory requests and limits for pods. Recommends or auto-applies optimal resource values based on historical usage. Doesn't change replica count.

**Q31: What is a headless service?**
> A service with `clusterIP: None`. Returns the individual pod IPs instead of a single virtual IP. Used with StatefulSets for direct pod communication (e.g., database clustering).

**Q32: What is Pod Disruption Budget (PDB)?**
> Limits how many pods can be voluntarily disrupted (during drains, updates). `minAvailable: 2` ensures at least 2 pods are running. Protects availability during maintenance.

**Q33: How does DNS work in Kubernetes?**
> CoreDNS provides cluster DNS. Services: `<service>.<namespace>.svc.cluster.local`. Pods: `<pod-ip-dashed>.<namespace>.pod.cluster.local`. Headless services resolve to individual pod IPs.

**Q34: What is the difference between ClusterIP, NodePort, and LoadBalancer?**
> **ClusterIP:** Internal only (default). **NodePort:** Extends ClusterIP, exposes on each node's IP (30000-32767). **LoadBalancer:** Extends NodePort, provisions a cloud LB with external IP.

**Q35: What is kube-proxy and how does it work?**
> A network proxy on each node that maintains network rules for service communication. Modes: **iptables** (default—uses iptables rules), **IPVS** (higher performance, more algorithms).

### Advanced (36–50)

**Q36: How would you troubleshoot a pod in Pending state?**
> 1) `kubectl describe pod` → check Events 2) Common causes: Insufficient resources (CPU/memory), no matching nodes (affinity/taints), PVC not bound, no available nodes 3) `kubectl get events`

**Q37: What is etcd and why is it critical?**
> A distributed key-value store that holds all cluster state—configurations, secrets, service endpoints, etc. Loss of etcd = loss of cluster state. Must be backed up regularly.

**Q38: How do you secure a Kubernetes cluster?**
> 1) RBAC for authorization 2) Network policies 3) Pod security standards 4) Secret encryption at rest 5) Image scanning 6) Audit logging 7) Limit API server access 8) Use service accounts with minimal permissions

**Q39: What is a service mesh and why use it?**
> A dedicated infrastructure layer for service-to-service communication. Features: mTLS (encryption), traffic management (retries, circuit breaking), observability (distributed tracing). Examples: Istio, Linkerd.

**Q40: What is the difference between Ingress and Gateway API?**
> **Ingress:** First-gen L7 routing, limited to HTTP. **Gateway API:** Successor to Ingress, more expressive, supports TCP/UDP/gRPC, role-oriented design (infra vs app team), better extensibility.

**Q41: How do you implement multi-tenancy in Kubernetes?**
> 1) Namespace isolation 2) RBAC per namespace 3) Network policies 4) Resource quotas and limit ranges 5) Pod security standards 6) Separate node pools (hard tenancy) 7) Virtual clusters (vcluster).

**Q42: What is the Kubernetes Operator pattern?**
> Custom controllers that extend K8s API to manage complex stateful applications. Uses Custom Resource Definitions (CRDs). Examples: Prometheus Operator, PostgreSQL Operator, Cert-Manager.

**Q43: What is Pod Security Admission (PSA)?**
> Replaced PodSecurityPolicy. Enforces pod security standards at namespace level. Three levels: **Privileged** (unrestricted), **Baseline** (minimal restrictions), **Restricted** (hardened).

**Q44: How does the Kubernetes scheduler work?**
> 1) Filtering: Removes nodes that can't run the pod (resources, taints, affinity) 2) Scoring: Ranks remaining nodes by preferences 3) Binding: Assigns pod to highest-scoring node. Extensible with custom schedulers.

**Q45: What is a Custom Resource Definition (CRD)?**
> Extends the Kubernetes API with custom resource types. Define a CRD → create instances of it → build controllers to act on them. Foundation of operators and GitOps tools.

**Q46: How do you handle cluster upgrades?**
> 1) Upgrade control plane first (API server, controller manager, scheduler) 2) Upgrade nodes (drain → upgrade → uncordon) one at a time 3) Use managed K8s (EKS, AKS, GKE) for easier upgrades. Always backup etcd.

**Q47: What is Kustomize?**
> A template-free customization tool built into kubectl. Uses overlays to patch base manifests for different environments. `kubectl apply -k overlays/production/`. No Helm-style templating needed.

**Q48: How do you implement disaster recovery for Kubernetes?**
> 1) etcd backups 2) Velero for cluster backup/restore 3) GitOps—manifests in Git = source of truth 4) Multi-region/multi-cluster setup 5) PV snapshots 6) Test recovery regularly.

**Q49: What is the difference between Calico, Flannel, and Cilium?**
> **Flannel:** Simple overlay network (VXLAN), no network policies. **Calico:** L3 networking with network policies, BGP routing. **Cilium:** eBPF-based, advanced networking + security + observability. Cilium is the most feature-rich.

**Q50: How do resource requests and limits affect scheduling and QoS?**
> **Requests:** Guaranteed resources, used by scheduler for placement. **Limits:** Maximum resources; exceeding memory = OOM killed; exceeding CPU = throttled. QoS classes: **Guaranteed** (requests=limits), **Burstable** (requests<limits), **BestEffort** (no requests/limits).

---

*Last updated: April 2026*
