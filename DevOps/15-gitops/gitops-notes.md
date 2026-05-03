---
title: GitOps Notes
layout: default
render_with_liquid: false
---
{% raw %}
# GitOps – Comprehensive DevOps Interview Preparation Notes

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Core Concepts](#2-core-concepts)
3. [ArgoCD](#3-argocd)
4. [FluxCD](#4-fluxcd)
5. [Secrets Management](#5-secrets-management)
6. [Cheat Sheet](#6-cheat-sheet)
7. [Hands-on Labs](#7-hands-on-labs)
8. [Real-world Scenarios](#8-real-world-scenarios)
9. [Interview Q&A](#9-interview-qa)

---

## 1. Introduction

### What is GitOps?

GitOps is an operational framework that applies DevOps best practices used for application development — such as version control, collaboration, compliance, and CI/CD — to infrastructure automation. It uses **Git as the single source of truth** for declarative infrastructure and applications.

### Origin

GitOps was coined by **Weaveworks** in 2017. Alexis Richardson, CEO of Weaveworks, introduced the term to describe a way of implementing Continuous Deployment for cloud-native applications. The methodology builds upon Infrastructure as Code (IaC), immutable infrastructure, and declarative configuration — ideas that evolved from the Kubernetes ecosystem.

### Why GitOps Matters

- **Auditability**: Every change is tracked in Git with full commit history, authorship, and timestamps.
- **Reproducibility**: The desired state is declared in Git; any environment can be recreated from a repository.
- **Consistency**: Eliminates configuration drift by continuously reconciling the actual state with the desired state.
- **Developer Experience**: Developers use familiar Git workflows (pull requests, code reviews, branches) to manage infrastructure.
- **Security**: Credentials don't need to be shared outside the cluster; the cluster pulls its own configuration.
- **Faster Recovery**: Rollback is as simple as `git revert`.
- **Compliance**: Git provides a built-in audit log for regulatory requirements.

---

## 2. Core Concepts

### 2.1 GitOps Principles

The OpenGitOps project (CNCF Sandbox) defines four core principles:

| Principle | Description |
|---|---|
| **Declarative** | The entire system's desired state must be expressed declaratively (e.g., Kubernetes manifests, Helm charts, Kustomize overlays). |
| **Versioned and Immutable** | The desired state is stored in Git, providing a complete version history. Each state is immutable — changes create new versions. |
| **Pulled Automatically** | Software agents (operators) automatically pull the desired state from Git and apply it. No manual `kubectl apply` needed. |
| **Continuously Reconciled (Self-Healing)** | Agents continuously observe the actual system state and attempt to reconcile it with the desired state. Manual or accidental changes are automatically corrected. |

### 2.2 Push vs Pull Deployment Model

```
┌─────────────────────────────────────────────────────────────────┐
│                    PUSH-BASED DEPLOYMENT                        │
│                                                                 │
│  Developer ──► Git Repo ──► CI Pipeline ──► CD Pipeline ──►    │
│                                  │              │               │
│                              Build/Test    kubectl apply        │
│                                              │                  │
│                                         ┌────▼─────┐           │
│                                         │ K8s      │           │
│                                         │ Cluster  │           │
│                                         └──────────┘           │
│  • CI/CD pipeline pushes changes to the cluster                │
│  • Pipeline needs cluster credentials                          │
│  • No drift detection after deployment                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    PULL-BASED DEPLOYMENT (GitOps)               │
│                                                                 │
│  Developer ──► Git Repo ◄──── GitOps Operator (ArgoCD/Flux)    │
│                   │                    │                        │
│                   │              Polls/Watches                  │
│               Desired State            │                        │
│                              ┌─────────▼────────┐              │
│                              │   K8s Cluster     │              │
│                              │  ┌──────────────┐ │              │
│                              │  │ GitOps Agent │ │              │
│                              │  │ (in-cluster) │ │              │
│                              │  └──────────────┘ │              │
│                              └──────────────────-┘              │
│  • Agent runs inside the cluster, pulls desired state from Git │
│  • No external access to the cluster needed                    │
│  • Continuous drift detection and self-healing                 │
└─────────────────────────────────────────────────────────────────┘
```

| Aspect | Push Model | Pull Model (GitOps) |
|---|---|---|
| Direction | Pipeline pushes to cluster | Agent inside cluster pulls from Git |
| Credentials | Pipeline needs cluster creds | Agent has cluster access natively |
| Drift Detection | None (fire-and-forget) | Continuous reconciliation |
| Security | Cluster creds exposed externally | Creds stay within cluster |
| Scalability | Pipeline must target each cluster | Each cluster runs its own agent |

### 2.3 GitOps vs Traditional CI/CD

| Feature | Traditional CI/CD | GitOps |
|---|---|---|
| Source of Truth | CI/CD pipeline configuration | Git repository |
| Deployment Trigger | Pipeline execution | Git commit/merge |
| Deployment Method | Push (pipeline runs `kubectl apply`) | Pull (agent watches Git) |
| Drift Detection | Manual or none | Automatic and continuous |
| Rollback | Re-run pipeline with old version | `git revert` |
| Audit Trail | Pipeline logs | Git commit history |
| Cluster Access | CI/CD needs cluster credentials | Only the in-cluster agent needs access |
| Multi-cluster | Pipeline targets each cluster | Each cluster has its own agent |
| Observability | Pipeline status | Desired vs actual state comparison |

### 2.4 Repository Strategies

#### Mono-repo vs Multi-repo

```
┌──────────────────────────────────┐    ┌──────────────────────────────────┐
│         MONO-REPO                │    │         MULTI-REPO               │
│                                  │    │                                  │
│  my-project/                     │    │  app-repo/                       │
│  ├── app/                        │    │  ├── src/                        │
│  │   ├── src/                    │    │  ├── Dockerfile                  │
│  │   ├── Dockerfile              │    │  └── README.md                   │
│  │   └── README.md               │    │                                  │
│  ├── k8s/                        │    │  config-repo/                    │
│  │   ├── base/                   │    │  ├── base/                       │
│  │   │   ├── deployment.yaml     │    │  │   ├── deployment.yaml         │
│  │   │   └── service.yaml        │    │  │   └── service.yaml            │
│  │   └── overlays/               │    │  └── overlays/                   │
│  │       ├── dev/                │    │      ├── dev/                    │
│  │       ├── staging/            │    │      ├── staging/                │
│  │       └── prod/               │    │      └── prod/                   │
│  └── README.md                   │    │                                  │
└──────────────────────────────────┘    └──────────────────────────────────┘
```

| Strategy | Pros | Cons |
|---|---|---|
| **Mono-repo** (app + config together) | Simple to manage; atomic commits across app and config; easier for small teams | Harder to enforce access control; CI triggers on all changes; noisy history |
| **Multi-repo** (separate app and config repos) | Clear separation of concerns; fine-grained access control; independent release cycles | More repos to manage; cross-repo coordination needed; harder to track related changes |
| **Recommended** | Use **multi-repo** for production GitOps: one repo for application source code (CI) and a separate repo for Kubernetes manifests/config (CD). This follows the separation of concerns principle. | |

---

## 3. ArgoCD

### 3.1 Architecture

ArgoCD is a declarative, GitOps continuous delivery tool for Kubernetes. It is a CNCF graduated project.

```
┌───────────────────────────────────────────────────────────────┐
│                      ArgoCD Architecture                      │
│                                                               │
│  ┌───────────┐    ┌───────────────┐    ┌──────────────────┐  │
│  │ ArgoCD    │    │ ArgoCD        │    │ ArgoCD           │  │
│  │ API       │◄──►│ Repo          │◄──►│ Application      │  │
│  │ Server    │    │ Server        │    │ Controller       │  │
│  └─────┬─────┘    └───────────────┘    └────────┬─────────┘  │
│        │                                        │            │
│        │          ┌───────────────┐              │            │
│        │          │    Redis      │              │            │
│        └─────────►│   (Cache)     │◄─────────────┘            │
│                   └───────────────┘                           │
│                                                               │
│  ┌──────────────────┐        ┌─────────────────────────┐     │
│  │  Dex / OIDC      │        │  ApplicationSet         │     │
│  │  (SSO Auth)      │        │  Controller             │     │
│  └──────────────────┘        └─────────────────────────┘     │
│                                                               │
│  ┌──────────────────┐        ┌─────────────────────────┐     │
│  │ Notification     │        │  Image Updater          │     │
│  │ Controller       │        │  (optional)             │     │
│  └──────────────────┘        └─────────────────────────┘     │
└───────────────────────────────────────────────────────────────┘
```

| Component | Role |
|---|---|
| **API Server** | Exposes the API consumed by the Web UI, CLI, and CI/CD systems. Handles authentication, RBAC, and Git webhook events. |
| **Repo Server** | Clones Git repos, generates Kubernetes manifests (Helm, Kustomize, plain YAML, Jsonnet). Stateless and cacheable. |
| **Application Controller** | Continuously monitors running applications and compares the actual state against the desired state in Git. Performs sync operations. |
| **Redis** | Used for caching and as a message broker between components. |
| **Dex** | Provides OpenID Connect (OIDC) authentication and SSO integration. |
| **ApplicationSet Controller** | Automates the generation of ArgoCD Applications using templates and generators. |
| **Notifications Controller** | Sends notifications on application state changes to Slack, email, webhooks, etc. |

### 3.2 Application CRD Example

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
  namespace: argocd
  finalizers:
    - resources-finalizer.argocd.argoproj.io
spec:
  project: default

  source:
    repoURL: https://github.com/myorg/my-app-config.git
    targetRevision: main
    path: overlays/dev
    # For Helm charts:
    # helm:
    #   valueFiles:
    #     - values-dev.yaml
    #   parameters:
    #     - name: image.tag
    #       value: "v1.2.3"

  destination:
    server: https://kubernetes.default.svc
    namespace: my-app

  syncPolicy:
    automated:
      prune: true        # Delete resources not in Git
      selfHeal: true      # Revert manual changes
      allowEmpty: false   # Prevent sync if no resources
    syncOptions:
      - CreateNamespace=true
      - PrunePropagationPolicy=foreground
      - PruneLast=true
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
```

### 3.3 Sync Policies

| Policy | Description | Use Case |
|---|---|---|
| **Manual Sync** | User explicitly triggers sync via UI or CLI. | Production environments where changes need approval. |
| **Auto-Sync** | ArgoCD automatically syncs when Git changes are detected. | Dev/staging environments for rapid iteration. |
| **Self-Heal** | Automatically reverts any manual/untracked changes made to the live cluster. | Enforce Git as the sole source of truth. Prevents `kubectl edit` drift. |
| **Prune** | Deletes resources from the cluster that are no longer defined in Git. | Keep environments clean; remove deprecated resources. |
| **Retry** | Automatically retries failed sync operations with configurable backoff. | Handle transient failures (e.g., CRD not yet available). |

```yaml
# Sync policy examples
syncPolicy:
  automated:
    prune: true       # Enable pruning
    selfHeal: true    # Enable self-healing
  syncOptions:
    - Validate=true                          # Validate manifests before applying
    - CreateNamespace=true                   # Create namespace if missing
    - PrunePropagationPolicy=foreground      # Wait for dependents to be deleted
    - ApplyOutOfSyncOnly=true                # Only apply out-of-sync resources
    - ServerSideApply=true                   # Use server-side apply
    - RespectIgnoreDifferences=true          # Respect ignoreDifferences during sync
```

### 3.4 App-of-Apps Pattern

The App-of-Apps pattern uses a **root Application** that manages other ArgoCD Applications. This allows bootstrapping an entire cluster's worth of applications from a single entry point.

```
root-app (Application)
├── app-1 (Application)
│   └── deployment, service, configmap...
├── app-2 (Application)
│   └── deployment, service, ingress...
├── app-3 (Application)
│   └── statefulset, service, pvc...
└── infra (Application)
    ├── cert-manager
    ├── nginx-ingress
    └── monitoring
```

**Root Application:**

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: root-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/myorg/gitops-config.git
    targetRevision: main
    path: apps           # Directory containing child Application manifests
  destination:
    server: https://kubernetes.default.svc
    namespace: argocd
  syncPolicy:
    automated:
      selfHeal: true
      prune: true
```

**Child Application (in `apps/` directory):**

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: frontend
  namespace: argocd
  finalizers:
    - resources-finalizer.argocd.argoproj.io
spec:
  project: default
  source:
    repoURL: https://github.com/myorg/gitops-config.git
    targetRevision: main
    path: services/frontend/overlays/dev
  destination:
    server: https://kubernetes.default.svc
    namespace: frontend
  syncPolicy:
    automated:
      selfHeal: true
      prune: true
    syncOptions:
      - CreateNamespace=true
```

### 3.5 ApplicationSet for Multi-Cluster/Multi-Env

ApplicationSet automates the generation of ArgoCD Applications from templates using generators.

**List Generator (Multi-Environment):**

```yaml
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: my-app
  namespace: argocd
spec:
  generators:
    - list:
        elements:
          - cluster: dev
            url: https://dev-cluster.example.com
            namespace: my-app-dev
          - cluster: staging
            url: https://staging-cluster.example.com
            namespace: my-app-staging
          - cluster: prod
            url: https://prod-cluster.example.com
            namespace: my-app-prod
  template:
    metadata:
      name: 'my-app-{{cluster}}'
    spec:
      project: default
      source:
        repoURL: https://github.com/myorg/gitops-config.git
        targetRevision: main
        path: 'overlays/{{cluster}}'
      destination:
        server: '{{url}}'
        namespace: '{{namespace}}'
      syncPolicy:
        automated:
          selfHeal: true
          prune: true
        syncOptions:
          - CreateNamespace=true
```

**Git Directory Generator:**

```yaml
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: cluster-addons
  namespace: argocd
spec:
  generators:
    - git:
        repoURL: https://github.com/myorg/gitops-config.git
        revision: main
        directories:
          - path: cluster-addons/*
  template:
    metadata:
      name: '{{path.basename}}'
    spec:
      project: default
      source:
        repoURL: https://github.com/myorg/gitops-config.git
        targetRevision: main
        path: '{{path}}'
      destination:
        server: https://kubernetes.default.svc
        namespace: '{{path.basename}}'
```

**Other Generators:**
- **Cluster Generator** — generates apps for each registered ArgoCD cluster
- **Pull Request Generator** — generates apps for open pull requests (preview environments)
- **Matrix Generator** — combines two generators to produce a Cartesian product
- **Merge Generator** — merges the output of multiple generators

---

## 4. FluxCD

### 4.1 Architecture

FluxCD (Flux v2) is a set of continuous delivery solutions for Kubernetes, built with the GitOps Toolkit. It is a CNCF graduated project.

```
┌───────────────────────────────────────────────────────────────────┐
│                       FluxCD Architecture                         │
│                                                                   │
│  ┌─────────────────┐    ┌──────────────────┐                     │
│  │ Source           │    │ Kustomize        │                     │
│  │ Controller       │───►│ Controller       │──► K8s API Server   │
│  │                  │    │                  │                     │
│  │ (GitRepository,  │    └──────────────────┘                     │
│  │  HelmRepository, │                                             │
│  │  Bucket,         │    ┌──────────────────┐                     │
│  │  OCIRepository)  │───►│ Helm             │──► K8s API Server   │
│  └─────────────────┘    │ Controller       │                     │
│                          └──────────────────┘                     │
│                                                                   │
│  ┌─────────────────┐    ┌──────────────────┐                     │
│  │ Notification     │    │ Image            │                     │
│  │ Controller       │    │ Automation       │                     │
│  │                  │    │ Controller       │                     │
│  │ (Alerts,         │    │ (ImageRepository, │                    │
│  │  Providers,      │    │  ImagePolicy,     │                    │
│  │  Receivers)      │    │  ImageUpdateAuto) │                    │
│  └─────────────────┘    └──────────────────┘                     │
└───────────────────────────────────────────────────────────────────┘
```

| Component | Role |
|---|---|
| **Source Controller** | Manages sources of Kubernetes manifests: GitRepository, HelmRepository, Bucket, OCIRepository. Fetches and makes artifacts available. |
| **Kustomize Controller** | Reconciles Kustomization resources. Applies manifests from sources using Kustomize. Handles decryption (SOPS). |
| **Helm Controller** | Reconciles HelmRelease resources. Manages Helm chart installations, upgrades, rollbacks, and tests. |
| **Notification Controller** | Handles inbound (webhooks/receivers) and outbound (alerts/providers) events. Integrates with Slack, Teams, GitHub, etc. |
| **Image Automation Controller** | Scans container registries for new image tags and automatically updates Git repositories with new image references. |

### 4.2 GitRepository and Kustomization Example

**GitRepository:**

```yaml
apiVersion: source.toolkit.fluxcd.io/v1
kind: GitRepository
metadata:
  name: my-app
  namespace: flux-system
spec:
  interval: 1m                    # How often to check for changes
  url: https://github.com/myorg/gitops-config.git
  ref:
    branch: main
  secretRef:
    name: git-credentials          # Secret for private repos
  ignore: |
    # Exclude files from the artifact
    !/*.md
    !/*.txt
```

**Kustomization:**

```yaml
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: my-app
  namespace: flux-system
spec:
  interval: 5m                     # Reconciliation interval
  targetNamespace: my-app
  sourceRef:
    kind: GitRepository
    name: my-app
  path: ./overlays/dev             # Path within the Git repo
  prune: true                      # Delete resources removed from Git
  healthChecks:
    - apiVersion: apps/v1
      kind: Deployment
      name: my-app
      namespace: my-app
  timeout: 2m
  retryInterval: 1m
  force: false
  decryption:
    provider: sops                 # SOPS decryption support
    secretRef:
      name: sops-gpg
  patches:
    - patch: |
        apiVersion: apps/v1
        kind: Deployment
        metadata:
          name: my-app
        spec:
          replicas: 3
      target:
        kind: Deployment
        name: my-app
```

**Dependency ordering:**

```yaml
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: my-app
  namespace: flux-system
spec:
  dependsOn:
    - name: cert-manager           # Wait for cert-manager to be ready
    - name: nginx-ingress          # Wait for ingress controller
  # ... rest of spec
```

### 4.3 HelmRelease Example

```yaml
apiVersion: source.toolkit.fluxcd.io/v1
kind: HelmRepository
metadata:
  name: bitnami
  namespace: flux-system
spec:
  interval: 30m
  url: https://charts.bitnami.com/bitnami
---
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: redis
  namespace: flux-system
spec:
  interval: 10m
  chart:
    spec:
      chart: redis
      version: "18.x"             # Semver range
      sourceRef:
        kind: HelmRepository
        name: bitnami
        namespace: flux-system
      interval: 5m
  targetNamespace: redis
  install:
    createNamespace: true
    remediation:
      retries: 3
  upgrade:
    remediation:
      retries: 3
      remediateLastFailure: true
    cleanupOnFail: true
  rollback:
    timeout: 5m
    cleanupOnFail: true
  values:
    architecture: standalone
    auth:
      enabled: true
      existingSecret: redis-secret
    master:
      resources:
        requests:
          memory: 128Mi
          cpu: 100m
  valuesFrom:
    - kind: ConfigMap
      name: redis-values
      valuesKey: values.yaml
```

---

## 5. Secrets Management

### 5.1 Sealed Secrets

Sealed Secrets by Bitnami allows you to encrypt secrets so they can be safely stored in Git.

**How it works:**

```
Developer                    Kubernetes Cluster
    │                              │
    │  kubeseal encrypt            │
    │  (public key) ──────────►    │
    │                              │
    │  SealedSecret (safe for Git) │
    │  ──────────────────────►     │
    │                              │
    │                    Sealed Secrets Controller
    │                    decrypts ──► Secret
    │                              │
```

```bash
# Install Sealed Secrets controller
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.24.0/controller.yaml

# Install kubeseal CLI
brew install kubeseal

# Create a regular secret
kubectl create secret generic my-secret \
  --from-literal=password=mysecretvalue \
  --dry-run=client -o yaml > secret.yaml

# Encrypt it
kubeseal --format yaml < secret.yaml > sealed-secret.yaml

# Apply the sealed secret (safe to commit to Git)
kubectl apply -f sealed-secret.yaml
```

**SealedSecret resource:**

```yaml
apiVersion: bitnami.com/v1alpha1
kind: SealedSecret
metadata:
  name: my-secret
  namespace: default
spec:
  encryptedData:
    password: AgBy3i4OJSWK+PiTySYZZA9rO43cGDEq...  # Encrypted value
  template:
    metadata:
      name: my-secret
      namespace: default
    type: Opaque
```

### 5.2 SOPS (Mozilla)

SOPS (Secrets OPerationS) encrypts values in YAML/JSON files while keeping keys in plaintext for readability. Integrates natively with FluxCD.

**Supported key management:**
- AWS KMS
- GCP Cloud KMS
- Azure Key Vault
- age
- PGP

```bash
# Install SOPS
brew install sops

# Create .sops.yaml configuration
cat > .sops.yaml <<EOF
creation_rules:
  - path_regex: .*\.enc\.yaml$
    age: age1ql3z7hjy54pw3hyww5ayyfg7zqgvc7w3j2elw8zmrj2kg5sfn9aqmcac8p
    encrypted_regex: "^(data|stringData)$"
EOF

# Encrypt a secret file
sops --encrypt secret.yaml > secret.enc.yaml

# Decrypt for viewing
sops --decrypt secret.enc.yaml

# Edit encrypted file in-place
sops secret.enc.yaml
```

**FluxCD integration:**

```yaml
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: my-app
  namespace: flux-system
spec:
  decryption:
    provider: sops
    secretRef:
      name: sops-age          # Secret containing the age private key
  # ... rest of spec
```

### 5.3 External Secrets Operator (ESO)

ESO syncs secrets from external secret management systems (AWS Secrets Manager, HashiCorp Vault, Azure Key Vault, GCP Secret Manager) into Kubernetes Secrets.

```
┌────────────────┐     ┌──────────────────────┐     ┌──────────────┐
│ ExternalSecret │────►│ External Secrets      │────►│ AWS Secrets   │
│ (CR)           │     │ Operator              │     │ Manager /     │
│                │     │                       │     │ Vault / AKV   │
└────────────────┘     └──────────┬────────────┘     └──────────────┘
                                  │
                           Creates/Updates
                                  │
                          ┌───────▼────────┐
                          │ Kubernetes     │
                          │ Secret         │
                          └────────────────┘
```

**SecretStore:**

```yaml
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: aws-secrets-manager
  namespace: my-app
spec:
  provider:
    aws:
      service: SecretsManager
      region: us-east-1
      auth:
        secretRef:
          accessKeyIDSecretRef:
            name: aws-credentials
            key: access-key-id
          secretAccessKeySecretRef:
            name: aws-credentials
            key: secret-access-key
```

**ExternalSecret:**

```yaml
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: my-app-secrets
  namespace: my-app
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: aws-secrets-manager
    kind: SecretStore
  target:
    name: my-app-secret        # The K8s Secret to create
    creationPolicy: Owner
  data:
    - secretKey: db-password
      remoteRef:
        key: prod/my-app/database
        property: password
    - secretKey: api-key
      remoteRef:
        key: prod/my-app/api
        property: key
```

---

## 6. Cheat Sheet

### ArgoCD Commands

| Command | Description |
|---|---|
| `argocd login <server>` | Log in to ArgoCD server |
| `argocd app create <name> --repo <url> --path <path> --dest-server <server> --dest-namespace <ns>` | Create an application |
| `argocd app list` | List all applications |
| `argocd app get <name>` | Get application details and status |
| `argocd app sync <name>` | Sync (deploy) an application |
| `argocd app sync <name> --prune` | Sync and prune deleted resources |
| `argocd app diff <name>` | Show diff between desired and live state |
| `argocd app history <name>` | Show deployment history |
| `argocd app rollback <name> <id>` | Rollback to a previous version |
| `argocd app delete <name>` | Delete an application |
| `argocd app set <name> --sync-policy automated` | Enable auto-sync |
| `argocd app set <name> --self-heal` | Enable self-healing |
| `argocd app wait <name>` | Wait for app to reach healthy state |
| `argocd repo add <url> --username <user> --password <pass>` | Add a Git repository |
| `argocd cluster add <context>` | Register an external cluster |
| `argocd proj create <name>` | Create a new project |
| `argocd account update-password` | Change current user password |

### FluxCD Commands

| Command | Description |
|---|---|
| `flux bootstrap github --owner=<org> --repository=<repo> --path=clusters/my-cluster` | Bootstrap Flux with GitHub |
| `flux bootstrap gitlab --owner=<org> --repository=<repo> --path=clusters/my-cluster` | Bootstrap Flux with GitLab |
| `flux get all` | Get status of all Flux resources |
| `flux get kustomizations` | List all Kustomizations and their status |
| `flux get sources git` | List all GitRepository sources |
| `flux get helmreleases` | List all HelmReleases |
| `flux reconcile kustomization <name>` | Force reconciliation |
| `flux reconcile source git <name>` | Force source fetch |
| `flux suspend kustomization <name>` | Suspend reconciliation |
| `flux resume kustomization <name>` | Resume reconciliation |
| `flux create source git <name> --url=<url> --branch=<branch>` | Create a GitRepository source |
| `flux create kustomization <name> --source=<git-name> --path=<path>` | Create a Kustomization |
| `flux create helmrelease <name> --chart=<chart> --source=HelmRepository/<name>` | Create a HelmRelease |
| `flux logs` | View Flux controller logs |
| `flux uninstall` | Uninstall Flux from cluster |
| `flux export kustomization <name>` | Export resource as YAML |

### Key Concepts Quick Reference

| Concept | Description |
|---|---|
| **Desired State** | The configuration declared in Git (manifests, charts, overlays) |
| **Live State** | The actual state of resources running in the Kubernetes cluster |
| **Drift** | Difference between desired state and live state |
| **Reconciliation** | The process of bringing live state in line with desired state |
| **Sync** | Applying the desired state from Git to the cluster |
| **Prune** | Deleting resources from the cluster that no longer exist in Git |
| **Self-Heal** | Automatically reverting manual changes to match Git state |
| **Health Check** | Verifying that deployed resources are functioning correctly |
| **Progressive Delivery** | Gradually rolling out changes (canary, blue-green) with GitOps |
| **Image Automation** | Automatically updating image tags in Git when new images are pushed |

---

## 7. Hands-on Labs

### Lab 1: Deploy Application to Kubernetes Using ArgoCD

**Objective:** Install ArgoCD, connect a Git repository, and deploy an application.

**Prerequisites:**
- A running Kubernetes cluster (minikube, kind, or cloud)
- `kubectl` and `argocd` CLI installed
- A Git repository with Kubernetes manifests

**Steps:**

```bash
# Step 1: Create ArgoCD namespace and install
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Step 2: Wait for ArgoCD pods to be ready
kubectl wait --for=condition=Ready pods --all -n argocd --timeout=300s

# Step 3: Get the initial admin password
argocd admin initial-password -n argocd

# Step 4: Port-forward the ArgoCD server
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Step 5: Log in via CLI
argocd login localhost:8080 --username admin --password <initial-password> --insecure

# Step 6: Create a sample Git repo structure
# In your Git repository, create the following:
mkdir -p k8s/base

cat > k8s/base/deployment.yaml <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-demo
  labels:
    app: nginx-demo
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nginx-demo
  template:
    metadata:
      labels:
        app: nginx-demo
    spec:
      containers:
        - name: nginx
          image: nginx:1.25
          ports:
            - containerPort: 80
EOF

cat > k8s/base/service.yaml <<EOF
apiVersion: v1
kind: Service
metadata:
  name: nginx-demo
spec:
  selector:
    app: nginx-demo
  ports:
    - port: 80
      targetPort: 80
  type: ClusterIP
EOF

# Step 7: Create the ArgoCD Application
argocd app create nginx-demo \
  --repo https://github.com/<your-org>/gitops-demo.git \
  --path k8s/base \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace default \
  --sync-policy automated \
  --self-heal \
  --auto-prune

# Step 8: Verify the application
argocd app get nginx-demo
kubectl get pods -l app=nginx-demo

# Step 9: Test self-healing — manually scale and watch ArgoCD revert
kubectl scale deployment nginx-demo --replicas=5
# Wait a few seconds, then check:
kubectl get pods -l app=nginx-demo
# ArgoCD will revert replicas back to 2

# Step 10: Update via Git — change replicas in deployment.yaml to 3, commit, and push
# ArgoCD will automatically detect and sync the change
```

**Verification:**
- ArgoCD UI shows the application as "Synced" and "Healthy"
- Pods match the desired replica count in Git
- Manual changes are reverted by self-healing

---

### Lab 2: Set Up FluxCD with a Git Repository

**Objective:** Bootstrap FluxCD, connect it to a Git repository, and deploy an application using Kustomize.

**Prerequisites:**
- A running Kubernetes cluster
- `flux` CLI installed
- A GitHub personal access token with repo permissions

**Steps:**

```bash
# Step 1: Verify prerequisites
flux check --pre

# Step 2: Bootstrap Flux with GitHub
export GITHUB_TOKEN=<your-github-pat>
export GITHUB_USER=<your-github-username>

flux bootstrap github \
  --owner=$GITHUB_USER \
  --repository=fleet-infra \
  --branch=main \
  --path=clusters/my-cluster \
  --personal

# Step 3: Verify Flux is running
flux get all
kubectl get pods -n flux-system

# Step 4: Create a GitRepository source for your app
flux create source git my-app \
  --url=https://github.com/$GITHUB_USER/my-app-config \
  --branch=main \
  --interval=1m \
  --export > ./clusters/my-cluster/my-app-source.yaml

# Step 5: Create a Kustomization for the app
flux create kustomization my-app \
  --target-namespace=my-app \
  --source=my-app \
  --path="./base" \
  --prune=true \
  --interval=5m \
  --health-check="Deployment/my-app.my-app" \
  --export > ./clusters/my-cluster/my-app-kustomization.yaml

# Step 6: Commit and push to fleet-infra repo
cd fleet-infra
git add -A
git commit -m "Add my-app source and kustomization"
git push

# Step 7: Watch Flux reconcile
flux get kustomizations --watch

# Step 8: Verify the deployment
kubectl get pods -n my-app
flux get kustomization my-app

# Step 9: Force a reconciliation
flux reconcile kustomization my-app --with-source

# Step 10: View Flux logs
flux logs --follow
```

**Verification:**
- `flux get all` shows all resources as "Ready"
- Application pods are running in the target namespace
- Changes to the Git repo are automatically reconciled

---

### Lab 3: Multi-Environment Promotion with ArgoCD

**Objective:** Set up a GitOps workflow for promoting changes through dev → staging → prod using ArgoCD ApplicationSets and Kustomize overlays.

**Prerequisites:**
- ArgoCD installed (from Lab 1)
- A Git repository with Kustomize overlays for each environment

**Steps:**

```bash
# Step 1: Create directory structure in your config repo
mkdir -p apps/my-app/{base,overlays/{dev,staging,prod}}

# Step 2: Create base manifests
cat > apps/my-app/base/kustomization.yaml <<EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - deployment.yaml
  - service.yaml
EOF

cat > apps/my-app/base/deployment.yaml <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: my-app
          image: myregistry/my-app:latest
          ports:
            - containerPort: 8080
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
EOF

cat > apps/my-app/base/service.yaml <<EOF
apiVersion: v1
kind: Service
metadata:
  name: my-app
spec:
  selector:
    app: my-app
  ports:
    - port: 80
      targetPort: 8080
EOF

# Step 3: Create environment overlays
# Dev overlay
cat > apps/my-app/overlays/dev/kustomization.yaml <<EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: my-app-dev
resources:
  - ../../base
patches:
  - target:
      kind: Deployment
      name: my-app
    patch: |
      - op: replace
        path: /spec/replicas
        value: 1
images:
  - name: myregistry/my-app
    newTag: dev-latest
EOF

# Staging overlay
cat > apps/my-app/overlays/staging/kustomization.yaml <<EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: my-app-staging
resources:
  - ../../base
patches:
  - target:
      kind: Deployment
      name: my-app
    patch: |
      - op: replace
        path: /spec/replicas
        value: 2
images:
  - name: myregistry/my-app
    newTag: v1.2.0-rc1
EOF

# Prod overlay
cat > apps/my-app/overlays/prod/kustomization.yaml <<EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: my-app-prod
resources:
  - ../../base
patches:
  - target:
      kind: Deployment
      name: my-app
    patch: |
      - op: replace
        path: /spec/replicas
        value: 3
      - op: add
        path: /spec/template/spec/containers/0/resources/limits
        value:
          cpu: 500m
          memory: 512Mi
images:
  - name: myregistry/my-app
    newTag: v1.2.0
EOF

# Step 4: Create ArgoCD ApplicationSet
cat > applicationset-my-app.yaml <<EOF
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: my-app-environments
  namespace: argocd
spec:
  generators:
    - list:
        elements:
          - env: dev
            autoSync: "true"
          - env: staging
            autoSync: "true"
          - env: prod
            autoSync: "false"
  template:
    metadata:
      name: 'my-app-{{env}}'
    spec:
      project: default
      source:
        repoURL: https://github.com/myorg/gitops-config.git
        targetRevision: main
        path: 'apps/my-app/overlays/{{env}}'
      destination:
        server: https://kubernetes.default.svc
        namespace: 'my-app-{{env}}'
      syncPolicy:
        syncOptions:
          - CreateNamespace=true
EOF

kubectl apply -f applicationset-my-app.yaml

# Step 5: Verify all environments
argocd app list
argocd app get my-app-dev
argocd app get my-app-staging
argocd app get my-app-prod

# Step 6: Promotion workflow
# To promote from dev to staging:
# 1. Update the image tag in overlays/staging/kustomization.yaml
# 2. Create a Pull Request
# 3. After review and merge, ArgoCD auto-syncs staging
#
# To promote from staging to prod:
# 1. Update the image tag in overlays/prod/kustomization.yaml
# 2. Create a Pull Request
# 3. After review and merge, manually sync prod:
argocd app sync my-app-prod
```

**Verification:**
- Three ArgoCD Applications are created (one per environment)
- Dev and staging auto-sync; prod requires manual sync
- Each environment has the correct replica count and image tag

---

## 8. Real-world Scenarios

### Scenario 1: Implement GitOps for Multi-Environment Promotion (Dev/Staging/Prod)

**Context:** Your organization has a microservices application deployed across three environments. Currently, deployments are done manually via `kubectl apply` and there is frequent configuration drift.

**Requirements:**
- Automated deployments for dev and staging
- Manual approval gate for production
- Full audit trail for compliance
- Consistent configurations across environments

**Solution Architecture:**

```
┌─────────────┐     ┌─────────────────────────────────────────────┐
│ App Source   │     │ Config Repository                           │
│ Repository   │     │                                             │
│             │     │  ├── base/                                  │
│ src/        │     │  │   ├── deployment.yaml                    │
│ Dockerfile  │     │  │   ├── service.yaml                      │
│ tests/      │     │  │   └── kustomization.yaml                │
│             │     │  └── overlays/                              │
└──────┬──────┘     │      ├── dev/                               │
       │            │      │   └── kustomization.yaml             │
       │ CI         │      ├── staging/                           │
       ▼            │      │   └── kustomization.yaml             │
┌──────────────┐    │      └── prod/                              │
│ CI Pipeline  │    │          └── kustomization.yaml             │
│ (Build/Test/ │    └──────────────────┬──────────────────────────┘
│  Push Image) │                       │
└──────┬───────┘                       │
       │                               │
       │ Update image tag              │  ArgoCD watches
       ▼                               ▼
┌──────────────┐    ┌─────────────────────────────────────────┐
│ Image        │    │ ArgoCD                                   │
│ Updater /    │───►│ ├── my-app-dev    (auto-sync)           │
│ CI bot       │    │ ├── my-app-staging (auto-sync + approval)│
│              │    │ └── my-app-prod   (manual sync)          │
└──────────────┘    └─────────────────────────────────────────┘
```

**Implementation Steps:**

1. **Separate repositories:** App code in `app-repo`, K8s configs in `config-repo`.
2. **CI pipeline:** On merge to main, build image, push to registry, then update the dev overlay's image tag in `config-repo` via automated commit or PR.
3. **ArgoCD ApplicationSet:** Create one ApplicationSet with environment-specific sync policies.
4. **Promotion flow:**
   - **Dev:** CI bot auto-updates image tag → ArgoCD auto-syncs.
   - **Staging:** Developer creates PR to update staging overlay → Peer review → Merge → ArgoCD auto-syncs.
   - **Prod:** Release manager creates PR → QA approval → Merge → ArgoCD requires manual sync via UI/CLI.
5. **RBAC:** Restrict production sync to the release team using ArgoCD RBAC policies.
6. **Notifications:** ArgoCD Notification Controller sends Slack alerts on sync status changes.

**Key Decisions:**
- Use Kustomize overlays (not Helm `values.yaml` per env) for clarity.
- Separate CI and CD pipelines — CI never touches the cluster.
- Tag images with commit SHA (immutable) rather than `latest`.

---

### Scenario 2: GitOps Drift Detection and Remediation

**Context:** A team has GitOps in place, but engineers occasionally use `kubectl edit` or `kubectl scale` directly, causing drift. The team wants to detect, alert, and automatically remediate drift.

**Problem Analysis:**

```
Desired State (Git)                 Live State (Cluster)
─────────────────                   ────────────────────
replicas: 3                         replicas: 5          ← kubectl scale
image: v1.2.0                       image: v1.2.0
env: DB_HOST=db.prod                env: DB_HOST=db.test ← kubectl edit
resources.limits.cpu: 500m          resources.limits.cpu: 1000m
```

**Solution:**

1. **Enable self-healing in ArgoCD:**
   ```yaml
   syncPolicy:
     automated:
       selfHeal: true   # Automatically revert manual changes
       prune: true       # Remove resources not in Git
   ```

2. **Configure drift detection alerts:**
   ```yaml
   # ArgoCD Notification trigger for OutOfSync
   apiVersion: v1
   kind: ConfigMap
   metadata:
     name: argocd-notifications-cm
     namespace: argocd
   data:
     trigger.on-sync-status-unknown: |
       - when: app.status.sync.status == 'OutOfSync'
         send: [slack-drift-alert]
     template.slack-drift-alert: |
       message: |
         :warning: *Drift detected!*
         Application: {{.app.metadata.name}}
         Sync Status: {{.app.status.sync.status}}
         Health: {{.app.status.health.status}}
         Details: {{.context.argocdUrl}}/applications/{{.app.metadata.name}}
     service.slack: |
       token: $slack-token
   ```

3. **Prevent direct cluster modifications:**
   - Use Kubernetes RBAC to restrict `edit`/`patch` permissions in GitOps-managed namespaces.
   - Deploy OPA Gatekeeper or Kyverno policies to block direct modifications.

   ```yaml
   # Kyverno policy to block direct changes
   apiVersion: kyverno.io/v1
   kind: ClusterPolicy
   metadata:
     name: block-manual-changes
   spec:
     validationFailureAction: Enforce
     rules:
       - name: block-non-gitops-changes
         match:
           resources:
             kinds:
               - Deployment
               - Service
             namespaces:
               - "my-app-*"
         exclude:
           subjects:
             - kind: ServiceAccount
               name: argocd-application-controller
               namespace: argocd
         validate:
           message: "Direct changes are not allowed. Please commit to Git."
           deny: {}
   ```

4. **Establish runbooks:** Document approved workflows for emergency changes — even hotfixes should go through Git with an expedited review process.

**Outcome:**
- Drift is automatically corrected within the reconciliation interval (default 3 minutes for ArgoCD).
- Teams receive immediate Slack notifications when drift is detected.
- RBAC + admission policies prevent unauthorized direct changes.
- Full audit trail in Git for compliance.

---

### Scenario 3: Disaster Recovery with GitOps

**Context:** A critical production cluster fails completely. The team needs to recover all workloads as fast as possible.

**Traditional Recovery:** Manual, error-prone — teams scramble to find configurations, remember versions, and manually apply them.

**GitOps Recovery:**

```
┌──────────────┐    ┌─────────────────────┐    ┌──────────────────┐
│ New Cluster  │◄───│ GitOps Bootstrap    │◄───│ Git Repository   │
│ (blank)      │    │ (ArgoCD/Flux)       │    │ (intact)         │
└──────────────┘    └─────────────────────┘    └──────────────────┘
       │                                              │
       │         Full state reconstructed             │
       ▼         from Git in minutes                  │
┌──────────────┐                                      │
│ Recovered    │◄─────────────────────────────────────┘
│ Cluster      │    All apps, configs, secrets
│ (fully       │    restored from declarative state
│  operational)│
└──────────────┘
```

**Steps:**
1. Provision a new Kubernetes cluster (Terraform / cloud provider CLI).
2. Install ArgoCD or FluxCD.
3. Point the GitOps tool at the same config repository.
4. The App-of-Apps or Flux Kustomization bootstraps every application automatically.
5. External Secrets Operator pulls secrets from the vault (secrets are not lost since they live in an external store).
6. DNS is updated to point to the new cluster.

**Recovery Time:** Minutes instead of hours/days — limited only by the time to provision the cluster and pull container images.

---

## 9. Interview Q&A

### Basic (Q1–Q15)

**Q1: What is GitOps?**

> GitOps is an operational framework that uses Git repositories as the single source of truth for declarative infrastructure and application configurations. Changes are made via Git commits and pull requests, and automated agents ensure the live system matches the desired state defined in Git.

**Q2: Who coined the term GitOps and when?**

> The term GitOps was coined by **Weaveworks** (specifically Alexis Richardson) in **2017**. It emerged from their experience managing Kubernetes clusters and was formalized as a methodology for cloud-native continuous delivery.

**Q3: What are the four core principles of GitOps?**

> 1. **Declarative** — the desired state of the system is expressed declaratively.
> 2. **Versioned and Immutable** — the desired state is stored in a versioned, immutable source (Git).
> 3. **Pulled Automatically** — approved changes are automatically applied to the system.
> 4. **Continuously Reconciled** — software agents continuously observe and reconcile the actual state with the desired state.

**Q4: What is the difference between push-based and pull-based deployment?**

> In a **push-based** model, the CI/CD pipeline pushes changes to the cluster (e.g., `kubectl apply`), meaning the pipeline needs cluster credentials. In a **pull-based** (GitOps) model, an agent running inside the cluster pulls the desired state from Git and applies it locally, so no external system needs cluster access.

**Q5: Why is Git used as the single source of truth in GitOps?**

> Git provides version control, audit trails (who changed what and when), branching and merging workflows, pull request reviews, rollback capability (`git revert`), and collaboration features. These make it ideal for managing infrastructure state with the same rigor as application code.

**Q6: What is "desired state" in GitOps?**

> The desired state is the complete, declarative description of how the system should look — defined in Git through Kubernetes manifests, Helm charts, Kustomize overlays, or other configuration files. The GitOps agent compares this against the live state and reconciles differences.

**Q7: What is "drift" in the context of GitOps?**

> Drift occurs when the actual state of the live cluster diverges from the desired state declared in Git. This can happen due to manual changes (e.g., `kubectl edit`), failed deployments, or external processes modifying cluster resources.

**Q8: How does GitOps handle rollbacks?**

> In GitOps, rollback is simply reverting to a previous Git commit. Since Git is the source of truth, running `git revert` and pushing the change causes the GitOps agent to automatically reconcile the cluster back to the previous known-good state.

**Q9: Name two popular GitOps tools for Kubernetes.**

> **ArgoCD** and **FluxCD**. Both are CNCF graduated projects that implement the GitOps pull-based deployment model for Kubernetes.

**Q10: What is reconciliation in GitOps?**

> Reconciliation is the continuous process where the GitOps agent compares the desired state (in Git) with the actual state (in the cluster) and takes corrective action to bring the live state in line with the desired state. This runs on a configurable interval (e.g., every 3–5 minutes).

**Q11: What does "self-healing" mean in GitOps?**

> Self-healing means the GitOps agent automatically detects and reverts any manual or untracked changes made to the live cluster, ensuring the actual state always matches the desired state in Git. For example, if someone manually scales a deployment, self-healing will revert it.

**Q12: What is the difference between GitOps and Infrastructure as Code (IaC)?**

> IaC is the practice of defining infrastructure in code (Terraform, Ansible, etc.). GitOps builds on IaC by adding operational practices: Git as the source of truth, pull-based deployment, continuous reconciliation, and automated drift detection. IaC is a component of GitOps, not a replacement.

**Q13: Can GitOps be used outside of Kubernetes?**

> Yes, though GitOps originated in the Kubernetes ecosystem. Tools like Terraform with Atlantis, Crossplane, or custom reconcilers can implement GitOps principles for non-Kubernetes infrastructure. However, the strongest tooling support exists for Kubernetes.

**Q14: What is an ArgoCD Application?**

> An ArgoCD Application is a Custom Resource (CRD) that defines a mapping between a Git repository source (containing Kubernetes manifests) and a destination cluster/namespace. It specifies what to deploy (source, path, revision) and where to deploy it (cluster, namespace), along with sync policies.

**Q15: What is a Flux Kustomization?**

> A Flux Kustomization is a Custom Resource that tells the Kustomize Controller which source to use (e.g., a GitRepository), which path within that source contains the manifests, and how to apply them (target namespace, prune settings, health checks, SOPS decryption, etc.).

---

### Intermediate (Q16–Q35)

**Q16: Explain the ArgoCD architecture and its main components.**

> ArgoCD consists of: the **API Server** (handles UI, CLI, webhooks, RBAC), the **Repo Server** (clones Git repos and generates manifests), the **Application Controller** (monitors applications and performs sync/reconciliation), and **Redis** (caching). Optional components include Dex (SSO), Notification Controller, ApplicationSet Controller, and Image Updater.

**Q17: How does ArgoCD detect changes in a Git repository?**

> ArgoCD uses two mechanisms: **polling** (the Application Controller periodically checks Git, default every 3 minutes) and **webhooks** (Git providers send push events to ArgoCD's API server for immediate detection). Webhooks provide near-instant sync; polling is the fallback.

**Q18: What is the App-of-Apps pattern in ArgoCD?**

> The App-of-Apps pattern uses a root ArgoCD Application that manages a directory of child Application manifests. This allows bootstrapping an entire cluster from a single Application. When the root app syncs, it creates/updates all child Applications, which in turn sync their own workloads.

**Q19: What is an ApplicationSet in ArgoCD and when would you use it?**

> ApplicationSet is an ArgoCD CRD that automates the creation of multiple Applications using templates and generators. Common use cases include: deploying to multiple clusters, managing multiple environments (dev/staging/prod), creating preview environments for pull requests, and auto-discovering applications from a Git directory structure.

**Q20: Explain the difference between ArgoCD and FluxCD.**

> **ArgoCD** provides a rich Web UI, Application CRD, app-of-apps pattern, and single-binary architecture. **FluxCD** is a modular toolkit (separate controllers for sources, kustomize, helm, notifications), has no built-in UI, and uses native Kubernetes APIs more extensively. ArgoCD is better for teams that value a UI; FluxCD is better for teams that prefer CLI-first and composable architecture.

**Q21: What is the FluxCD Source Controller and what sources does it support?**

> The Source Controller manages the lifecycle of source artifacts. It supports: **GitRepository** (Git repos), **HelmRepository** (Helm chart repos), **Bucket** (S3-compatible object storage), and **OCIRepository** (OCI container registries for artifacts). It fetches sources on a configurable interval and makes them available to other controllers.

**Q22: How does FluxCD handle Helm chart deployments?**

> FluxCD uses the **Helm Controller** with two CRDs: `HelmRepository` (defines the chart repository) and `HelmRelease` (defines the chart, version, values, target namespace, install/upgrade/rollback settings). The Helm Controller manages the full lifecycle including install, upgrade, rollback, and uninstall with configurable remediation strategies.

**Q23: What is the difference between mono-repo and multi-repo strategies in GitOps?**

> **Mono-repo** stores application code and Kubernetes config in one repository — simpler but mixes concerns. **Multi-repo** separates application code (CI) from configuration (CD) — better separation of concerns, independent access control, and cleaner GitOps workflow. Multi-repo is recommended for production GitOps.

**Q24: How do you handle secrets in a GitOps workflow?**

> Secrets should never be stored in plaintext in Git. Common approaches: **Sealed Secrets** (encrypt with controller's public key), **SOPS** (encrypt values in YAML using KMS/age/PGP), **External Secrets Operator** (sync secrets from external vaults like AWS Secrets Manager, HashiCorp Vault), and **Vault Agent Injector** (inject secrets at runtime).

**Q25: What is Sealed Secrets and how does it work?**

> Sealed Secrets is a Kubernetes controller by Bitnami that decrypts `SealedSecret` resources into regular `Secret` resources. Developers encrypt secrets using the controller's public key via the `kubeseal` CLI, producing a `SealedSecret` resource that can be safely committed to Git. Only the controller (with the private key) can decrypt them.

**Q26: How does SOPS integrate with FluxCD?**

> FluxCD's Kustomize Controller has built-in SOPS support. You configure a `decryption` section in the Kustomization resource specifying the provider (`sops`) and a secret containing the decryption key (age, PGP, or cloud KMS credentials). Encrypted files in the Git repo are automatically decrypted during reconciliation.

**Q27: What is progressive delivery and how does it relate to GitOps?**

> Progressive delivery is the practice of gradually rolling out changes to reduce risk — using canary releases, blue-green deployments, or A/B testing. In GitOps, tools like **Argo Rollouts** or **Flagger** integrate with the GitOps workflow to automate progressive delivery while keeping Git as the source of truth.

**Q28: How do you implement RBAC in ArgoCD?**

> ArgoCD uses a policy-based RBAC model defined in `argocd-rbac-cm` ConfigMap using Casbin syntax. Policies define which users/groups can perform which actions (get, create, update, delete, sync) on which resources (applications, projects, clusters). SSO integration via Dex/OIDC maps external identity providers to ArgoCD roles.

**Q29: What are ArgoCD sync waves and hooks?**

> **Sync waves** control the order in which resources are applied during a sync (using `argocd.argoproj.io/sync-wave` annotation with numeric values — lower waves sync first). **Resource hooks** are resources that run at specific points in the sync lifecycle: `PreSync`, `Sync`, `PostSync`, `SyncFail`. Common use for database migrations (PreSync) or integration tests (PostSync).

**Q30: How do you manage multi-cluster deployments with GitOps?**

> Approaches include: **ArgoCD** — register external clusters and use ApplicationSets with cluster generators to deploy across clusters. **FluxCD** — use a management cluster running Flux, with multi-tenancy features or Cluster API to manage workload clusters. Both support targeting different clusters from a single config repository.

**Q31: What is the External Secrets Operator (ESO)?**

> ESO is a Kubernetes operator that reads information from external secret management systems (AWS Secrets Manager, Azure Key Vault, HashiCorp Vault, GCP Secret Manager) and automatically injects the values as Kubernetes Secrets. It uses `SecretStore`/`ClusterSecretStore` for provider configuration and `ExternalSecret` to define what to sync.

**Q32: How do you handle database schema migrations in a GitOps workflow?**

> Database migrations can be handled using ArgoCD **sync hooks** — deploy a Job annotated with `argocd.argoproj.io/hook: PreSync` that runs the migration before the application deployment. Alternatively, use init containers, Kubernetes Jobs triggered by Flux, or dedicated migration tools like Liquibase/Flyway run as PreSync hooks.

**Q33: What is the ArgoCD Image Updater?**

> ArgoCD Image Updater is a companion tool that monitors container registries for new image tags and automatically updates ArgoCD Applications. It can write image tag updates back to Git (the GitOps-recommended method) or update the Application spec directly. It supports various update strategies: semver, latest, digest, and alphabetical.

**Q34: How does Flux handle dependency ordering between applications?**

> FluxCD Kustomization resources support a `dependsOn` field that specifies other Kustomizations that must be ready before the current one is reconciled. This ensures infrastructure components (e.g., cert-manager, ingress controller) are deployed before applications that depend on them.

**Q35: What happens if the Git repository becomes unavailable in a GitOps setup?**

> The live cluster continues running with its current state — existing workloads are not affected. However, no new changes can be deployed, and self-healing reconciliation may be delayed (the agent uses cached state). Once Git is available again, the agent resumes normal reconciliation. This is why Git hosting reliability is critical in GitOps.

---

### Advanced (Q36–Q50)

**Q36: How would you design a GitOps pipeline for a regulated industry (e.g., finance, healthcare)?**

> Key considerations: (1) **Audit trail** — every change tracked in Git with signed commits (`git commit -S`). (2) **Separation of duties** — different teams own app code vs. config repos; use branch protection rules. (3) **Approval gates** — require PR reviews and manual sync for production. (4) **Compliance** — ArgoCD provides full sync history; combine with OPA/Kyverno for policy enforcement. (5) **Encryption** — all secrets encrypted at rest (Sealed Secrets/SOPS). (6) **RBAC** — role-based access in ArgoCD matching organizational roles. (7) **Signed images** — use Cosign/Notation to verify image signatures before deployment.

**Q37: How do you handle emergency hotfixes in a GitOps workflow?**

> Even emergency changes should go through Git: (1) Create a hotfix branch from the production branch/tag. (2) Make the fix, commit, and open an expedited PR with a smaller review requirement. (3) Merge to trigger sync. (4) If self-heal is enabled and someone applies a fix directly with `kubectl`, document it as tech debt and immediately commit the equivalent change to Git. Never disable self-heal permanently — it defeats GitOps. Some teams create a "break glass" procedure with audit logging.

**Q38: Compare ArgoCD ApplicationSet generators and explain when to use each.**

> **List Generator** — static list of cluster/env info; use for known, fixed environments. **Cluster Generator** — auto-discovers ArgoCD-registered clusters; use for dynamic multi-cluster. **Git Directory Generator** — creates apps from directories in a Git repo; use for monorepo with many services. **Git File Generator** — reads config from JSON/YAML files in Git; use for dynamic config-driven apps. **Pull Request Generator** — creates preview environments for open PRs; use for ephemeral test environments. **Matrix Generator** — Cartesian product of two generators; use for every service × every cluster combinations. **Merge Generator** — combines/overrides parameters from multiple generators.

**Q39: How do you implement GitOps with Terraform for non-Kubernetes infrastructure?**

> Use **Atlantis** or **Terraform Cloud/Enterprise** as the GitOps agent for Terraform. Workflow: (1) Define infrastructure in Terraform code in Git. (2) Changes are made via PRs. (3) Atlantis runs `terraform plan` on PR creation and posts the plan as a comment. (4) On approval and merge, Atlantis runs `terraform apply`. This is push-based GitOps (not pure pull), but follows the Git-as-source-of-truth principle. **Crossplane** provides a more Kubernetes-native approach for managing cloud resources declaratively.

**Q40: How do you prevent configuration drift when multiple teams manage resources in the same cluster?**

> (1) **Namespacing** — each team owns specific namespaces managed by their GitOps application. (2) **ArgoCD Projects** — restrict which repos, clusters, and namespaces each team can deploy to. (3) **RBAC** — enforce least-privilege with Kubernetes RBAC and ArgoCD RBAC. (4) **Admission controllers** — use Kyverno/OPA to block direct changes to GitOps-managed resources (except by the GitOps service account). (5) **Self-heal** — enable on all applications. (6) **Monitoring** — alert on OutOfSync status.

**Q41: Explain how you would implement GitOps-based canary deployments.**

> Use **Argo Rollouts** with ArgoCD or **Flagger** with FluxCD. (1) Define a `Rollout` resource (Argo Rollouts) or annotate a Deployment (Flagger) with the canary strategy — e.g., 10% → 30% → 60% → 100% traffic splitting with analysis at each step. (2) Store the Rollout/Deployment manifest in Git. (3) Update the image tag in Git. (4) The GitOps agent syncs the change, and the progressive delivery controller manages the canary rollout. (5) If metrics (Prometheus, Datadog) show issues, the rollout is automatically aborted and rolled back.

**Q42: How do you handle CRDs and operator lifecycles in GitOps?**

> CRDs must be applied **before** resources that use them. Strategies: (1) **ArgoCD sync waves** — deploy CRDs in wave -1, operator in wave 0, custom resources in wave 1. (2) **Flux dependencies** — use `dependsOn` in Kustomization to ensure operators are ready before CRs. (3) **App-of-apps** — separate CRDs/operators into infrastructure apps that are synced first. (4) **Sync retry** — configure retry with backoff to handle timing issues when CRDs aren't immediately available.

**Q43: What are the security implications of GitOps and how do you mitigate them?**

> **Risks:** (1) Git repo compromise grants cluster access. (2) Secrets in Git (even encrypted) have a risk surface. (3) GitOps agent has high cluster privileges. **Mitigations:** (1) Enable branch protection, signed commits, and required reviews. (2) Use External Secrets Operator instead of storing secrets in Git. (3) Apply least-privilege RBAC to the GitOps agent. (4) Enable SSO with MFA for ArgoCD access. (5) Scan manifests with tools like Checkov/Trivy before merge. (6) Use private Git repos with deploy keys (read-only). (7) Rotate credentials regularly.

**Q44: How would you design a multi-tenancy GitOps architecture?**

> (1) **ArgoCD Projects** — one per tenant, restricting source repos, destination clusters/namespaces, and allowed resource types. (2) **Separate config repos per tenant** — each team owns their repo and ArgoCD Project. (3) **Namespace isolation** — each tenant deploys only to their namespaces. (4) **Network policies** — enforce inter-tenant isolation at the network level. (5) **Resource quotas** — limit CPU/memory per namespace. (6) **Flux multi-tenancy** — use `--watch-namespace` and RBAC to scope Flux controllers per tenant. (7) **Platform team** manages the App-of-Apps root and cluster-wide resources.

**Q45: How do you manage GitOps at scale with hundreds of microservices?**

> (1) **ApplicationSets with Git Directory Generator** — auto-discover services from directory structure. (2) **Standardize directory layout** — use a consistent structure (base + overlays) templated via a cookiecutter/yeoman. (3) **Cluster sharding** — distribute ArgoCD controller load across shards for large clusters. (4) **Repo Server scaling** — scale horizontally; use persistent caching. (5) **Monorepo for config** — reduces repo proliferation but requires good CI filtering. (6) **Self-service onboarding** — teams add a directory + ApplicationSet element to get started. (7) **Metrics** — monitor ArgoCD/Flux reconciliation times and error rates.

**Q46: Explain how GitOps interacts with service mesh configurations (e.g., Istio).**

> Service mesh resources (VirtualService, DestinationRule, AuthorizationPolicy) are Kubernetes CRDs and are naturally managed by GitOps. Store Istio manifests alongside application manifests in Git. **Sync waves** ensure the mesh control plane is deployed before applications. For canary deployments, Argo Rollouts integrates with Istio traffic splitting — the Rollout resource manages VirtualService weights automatically. Flagger similarly integrates with Istio for progressive delivery.

**Q47: How do you handle GitOps for stateful applications (databases, message queues)?**

> (1) Use **Kubernetes Operators** for stateful apps (e.g., CloudNativePG for PostgreSQL, Strimzi for Kafka) — the operator handles replication, backups, and failover. (2) Manage operator CRs (e.g., `PostgresCluster`) in Git. (3) Use **sync hooks** for schema migrations. (4) Be cautious with `prune: true` — accidental deletion of PVCs can cause data loss; use `argocd.argoproj.io/sync-options: Delete=false` annotation on critical resources. (5) Back up data externally (Velero) — GitOps restores configuration, not data.

**Q48: How would you implement GitOps-based disaster recovery with RPO and RTO guarantees?**

> (1) **RPO near zero** — Git repo is the source of truth; all state is in Git (replicated via Git hosting provider). (2) **RTO optimization** — pre-provision standby clusters; use ArgoCD/Flux bootstrap scripts for fast recovery. (3) **Multi-region** — use ApplicationSets to maintain active-passive or active-active across regions. (4) **External secrets** — secrets stored in multi-region vaults (AWS Secrets Manager, Azure Key Vault). (5) **Data** — use database replication (not handled by GitOps) for stateful data. (6) **Test regularly** — run DR drills by bootstrapping a new cluster from Git and measuring recovery time.

**Q49: What are the limitations of GitOps and when should you NOT use it?**

> **Limitations:** (1) Not suitable for imperative workflows (run-once scripts, ad-hoc commands). (2) Secrets management adds complexity. (3) Git repo becomes a single point of failure for deployments. (4) Large-scale manifests can cause repo bloat. (5) Learning curve for teams new to declarative infrastructure. (6) Debugging reconciliation loops can be challenging. **When to avoid:** Simple, non-Kubernetes deployments; environments with frequent imperative operations; teams without Git discipline; scenarios where the overhead of GitOps exceeds its benefits (e.g., a single EC2 instance).

**Q50: Design a complete GitOps architecture for a company migrating from traditional CI/CD to GitOps with 50 microservices across 3 clusters.**

> **Architecture:**
>
> 1. **Repository structure:** One app source repo per microservice (50 repos). One central config repo (or one per team if >5 teams) with Kustomize overlays per environment.
>
> 2. **GitOps tool:** ArgoCD (for UI, RBAC, ApplicationSets). Deploy ArgoCD on a dedicated management cluster.
>
> 3. **Multi-cluster:** Register all 3 clusters (dev, staging, prod) in ArgoCD. Use ApplicationSets with a Matrix generator (services × clusters).
>
> 4. **CI pipeline:** Per-service CI builds, tests, pushes images to a shared container registry tagged with commit SHA. CI updates the image tag in the config repo via an automated PR.
>
> 5. **CD (GitOps):** ArgoCD ApplicationSet generates 150 Applications (50 services × 3 clusters). Dev auto-syncs; staging auto-syncs after PR merge; prod requires manual sync.
>
> 6. **Secrets:** External Secrets Operator on each cluster, syncing from HashiCorp Vault (multi-region).
>
> 7. **Progressive delivery:** Argo Rollouts for critical services (canary with Prometheus analysis).
>
> 8. **Observability:** ArgoCD metrics exported to Prometheus; Grafana dashboards for sync status, reconciliation time, and drift events. Notification Controller sends alerts to Slack.
>
> 9. **Security:** Signed commits required; branch protection on main; image signing with Cosign; Kyverno policies to block direct cluster changes; ArgoCD SSO with corporate IdP.
>
> 10. **Migration plan:** Phase 1 — migrate dev cluster (low risk). Phase 2 — staging with team training. Phase 3 — production service-by-service over 4-8 weeks with rollback plans.

---

*Last updated: April 2026*
{% endraw %}
