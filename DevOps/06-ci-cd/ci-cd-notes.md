# CI/CD – DevOps Interview Preparation Notes

---

## 1. Introduction

### What is CI/CD?

**CI/CD** stands for **Continuous Integration / Continuous Delivery (or Deployment)**. It is a set of practices and principles that enable development teams to deliver code changes more frequently, reliably, and with higher quality.

- **Continuous Integration (CI):** Developers frequently merge their code changes into a shared repository (multiple times a day). Each merge triggers an automated build and test process, catching integration issues early.
- **Continuous Delivery (CD):** Extends CI by automatically preparing code changes for release to production. Every change that passes the automated pipeline is ready to be deployed at the push of a button.
- **Continuous Deployment (CD):** Goes one step further — every change that passes all stages of the pipeline is automatically deployed to production without manual intervention.

### Why CI/CD Matters for DevOps

| Benefit | Description |
|---|---|
| **Faster Time to Market** | Automated pipelines reduce manual steps, enabling rapid releases |
| **Early Bug Detection** | Automated testing catches defects before they reach production |
| **Reduced Risk** | Small, frequent releases are easier to troubleshoot than large releases |
| **Improved Collaboration** | Shared pipeline encourages team alignment and transparency |
| **Consistent Deployments** | Automation removes human error from repetitive processes |
| **Feedback Loops** | Developers receive quick feedback on code quality and test results |
| **Auditability** | Pipeline logs provide a clear trail of what was built, tested, and deployed |

---

## 2. Core Concepts

### CI vs CD (Delivery) vs CD (Deployment)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        CI/CD Spectrum                                   │
│                                                                          │
│  [Code] → [Build] → [Unit Test] → [Integration Test] → [Deploy to Stg] │
│     └── Continuous Integration ──┘                                       │
│     └────────── Continuous Delivery ─────────────────┘  (manual release) │
│     └────────── Continuous Deployment ───────────────────── (auto prod)  │
└──────────────────────────────────────────────────────────────────────────┘
```

| Aspect | Continuous Integration | Continuous Delivery | Continuous Deployment |
|---|---|---|---|
| **Goal** | Merge & validate code frequently | Keep code always release-ready | Auto-deploy every passing change |
| **Manual Gate** | N/A | Yes – manual approval to prod | No – fully automated |
| **Scope** | Build + Test | Build + Test + Staging | Build + Test + Staging + Prod |
| **Risk Level** | Low | Medium | Requires mature testing |

### Pipeline Stages

A typical CI/CD pipeline consists of:

1. **Source** – Code is committed/pushed to a version control system (Git).
2. **Build** – Application is compiled, dependencies are resolved, and artifacts are created.
3. **Test** – Automated tests are executed (unit, integration, e2e, security, performance).
4. **Static Analysis** – Code quality checks, linting, SAST scanning.
5. **Package** – Artifacts are packaged (Docker image, JAR, ZIP, etc.).
6. **Deploy to Staging** – Artifact is deployed to a staging/pre-production environment.
7. **Acceptance Testing** – Smoke tests, UAT, or manual approval.
8. **Deploy to Production** – Artifact is released to production.
9. **Monitor** – Post-deployment health checks and observability.

### Build, Test, Deploy

**Build:**
- Compile source code
- Resolve dependencies (npm install, pip install, mvn package)
- Run linters, formatters
- Generate build artifacts

**Test:**
- **Unit Tests** – Test individual functions/methods in isolation
- **Integration Tests** – Test interactions between components
- **End-to-End (E2E) Tests** – Simulate user workflows
- **Security Tests (SAST/DAST)** – Scan for vulnerabilities
- **Performance Tests** – Load and stress testing

**Deploy:**
- Push artifacts to a registry (Docker Hub, ECR, Artifactory)
- Deploy to target environment (Kubernetes, VMs, serverless)
- Run smoke tests post-deployment
- Rollback if health checks fail

### Artifact Management

Artifacts are the outputs of a build process — compiled binaries, Docker images, packages, etc.

- **Artifact Repositories:** JFrog Artifactory, Nexus Repository, GitHub Packages, AWS ECR, Docker Hub
- **Versioning:** Use semantic versioning (v1.2.3) or commit SHA-based tags
- **Immutability:** Once published, an artifact should never be overwritten
- **Retention Policies:** Automatically clean up old/unused artifacts
- **Promotion:** Artifacts are promoted through environments (dev → staging → prod) rather than rebuilt

### Pipeline as Code

Pipeline as Code means defining CI/CD pipelines in version-controlled configuration files rather than through a UI.

**Benefits:**
- Versioned alongside application code
- Peer-reviewed through pull requests
- Reproducible and auditable
- Portable across environments

**Examples:**
- GitHub Actions → `.github/workflows/*.yml`
- GitLab CI → `.gitlab-ci.yml`
- Jenkins → `Jenkinsfile`
- Azure DevOps → `azure-pipelines.yml`
- CircleCI → `.circleci/config.yml`

---

## 3. Practical Examples

### GitHub Actions Workflow (Build + Test + Deploy)

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  IMAGE_NAME: myapp
  REGISTRY: ghcr.io

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run unit tests
        run: npm test -- --coverage

      - name: Upload coverage report
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/

  security-scan:
    runs-on: ubuntu-latest
    needs: build-and-test
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          severity: 'CRITICAL,HIGH'

  deploy-staging:
    runs-on: ubuntu-latest
    needs: [build-and-test, security-scan]
    if: github.ref == 'refs/heads/main'
    environment: staging
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          push: true
          tags: ${{ env.REGISTRY }}/${{ github.repository }}/${{ env.IMAGE_NAME }}:${{ github.sha }}

      - name: Deploy to Staging
        run: |
          echo "Deploying to staging environment..."
          # kubectl set image deployment/myapp myapp=$IMAGE:$TAG

  deploy-production:
    runs-on: ubuntu-latest
    needs: deploy-staging
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://myapp.example.com
    steps:
      - name: Deploy to Production
        run: |
          echo "Deploying to production..."
          # kubectl set image deployment/myapp myapp=$IMAGE:$TAG --namespace=production

      - name: Smoke Test
        run: |
          curl -f https://myapp.example.com/health || exit 1
```

### GitLab CI Pipeline (.gitlab-ci.yml)

```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - security
  - deploy-staging
  - deploy-production

variables:
  IMAGE_TAG: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

# ---------- BUILD ----------
build:
  stage: build
  image: node:20-alpine
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour
  cache:
    key: ${CI_COMMIT_REF_SLUG}
    paths:
      - node_modules/

# ---------- TEST ----------
unit-tests:
  stage: test
  image: node:20-alpine
  script:
    - npm ci
    - npm run test:unit -- --coverage
  coverage: '/All files\s+\|\s+(\d+\.?\d*)\s+/'
  artifacts:
    reports:
      junit: junit-report.xml
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

integration-tests:
  stage: test
  image: node:20-alpine
  services:
    - postgres:15
  variables:
    POSTGRES_DB: testdb
    POSTGRES_USER: testuser
    POSTGRES_PASSWORD: testpass
  script:
    - npm ci
    - npm run test:integration

# ---------- SECURITY ----------
sast:
  stage: security
  image: returntocorp/semgrep
  script:
    - semgrep --config auto --json -o semgrep-results.json .
  artifacts:
    paths:
      - semgrep-results.json
  allow_failure: true

# ---------- DEPLOY STAGING ----------
deploy-staging:
  stage: deploy-staging
  image: bitnami/kubectl:latest
  environment:
    name: staging
    url: https://staging.myapp.example.com
  script:
    - kubectl set image deployment/myapp myapp=$IMAGE_TAG --namespace=staging
    - kubectl rollout status deployment/myapp --namespace=staging --timeout=300s
  only:
    - main

# ---------- DEPLOY PRODUCTION ----------
deploy-production:
  stage: deploy-production
  image: bitnami/kubectl:latest
  environment:
    name: production
    url: https://myapp.example.com
  script:
    - kubectl set image deployment/myapp myapp=$IMAGE_TAG --namespace=production
    - kubectl rollout status deployment/myapp --namespace=production --timeout=300s
  when: manual
  only:
    - main
```

### Blue-Green Deployment Strategy

**Concept:** Maintain two identical production environments — **Blue** (current live) and **Green** (new version). Deploy the new version to Green, test it, then switch traffic from Blue to Green.

```
                    ┌──────────────┐
   Traffic ────────►│ Load Balancer │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              ▼                         ▼
      ┌──────────────┐         ┌──────────────┐
      │  Blue (v1.0)  │         │ Green (v1.1)  │
      │  ◄── LIVE     │         │  ◄── IDLE     │
      └──────────────┘         └──────────────┘

   After switch:

      ┌──────────────┐         ┌──────────────┐
      │  Blue (v1.0)  │         │ Green (v1.1)  │
      │  ◄── IDLE     │         │  ◄── LIVE     │
      └──────────────┘         └──────────────┘
```

**Kubernetes Blue-Green Example:**

```yaml
# green-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-green
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
      version: green
  template:
    metadata:
      labels:
        app: myapp
        version: green
    spec:
      containers:
        - name: myapp
          image: myapp:v1.1
          ports:
            - containerPort: 8080
          readinessProbe:
            httpGet:
              path: /health
              port: 8080
            initialDelaySeconds: 10
            periodSeconds: 5
---
# Switch traffic to green
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  selector:
    app: myapp
    version: green    # ← Change from "blue" to "green"
  ports:
    - port: 80
      targetPort: 8080
  type: LoadBalancer
```

**Blue-Green Deployment Script:**

```bash
#!/bin/bash
set -e

CURRENT=$(kubectl get svc myapp-service -o jsonpath='{.spec.selector.version}')
if [ "$CURRENT" = "blue" ]; then
  TARGET="green"
else
  TARGET="blue"
fi

echo "Current: $CURRENT → Deploying to: $TARGET"

# Deploy new version to target
kubectl apply -f ${TARGET}-deployment.yaml
kubectl rollout status deployment/myapp-${TARGET} --timeout=120s

# Run smoke tests against target
kubectl run smoke-test --rm -i --image=curlimages/curl -- \
  curl -f http://myapp-${TARGET}:8080/health

# Switch traffic
kubectl patch svc myapp-service -p "{\"spec\":{\"selector\":{\"version\":\"$TARGET\"}}}"

echo "Traffic switched to $TARGET"
echo "To rollback: kubectl patch svc myapp-service -p '{\"spec\":{\"selector\":{\"version\":\"$CURRENT\"}}}'"
```

### Canary Deployment Strategy

**Concept:** Gradually roll out a new version to a small subset of users/traffic before rolling it out to the entire infrastructure. This reduces risk by allowing you to monitor error rates and performance with a small blast radius.

```
  Traffic Distribution:
  
  Step 1:   ██████████████████████████████░░  (95% v1 / 5% v2)
  Step 2:   ████████████████████████░░░░░░░░  (75% v1 / 25% v2)
  Step 3:   ████████████████░░░░░░░░░░░░░░░░  (50% v1 / 50% v2)
  Step 4:   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  (0% v1 / 100% v2)
  
  █ = v1 (stable)    ░ = v2 (canary)
```

**Nginx Ingress Canary Example:**

```yaml
# canary-ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-canary
  annotations:
    nginx.ingress.kubernetes.io/canary: "true"
    nginx.ingress.kubernetes.io/canary-weight: "10"  # 10% traffic
spec:
  rules:
    - host: myapp.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: myapp-canary
                port:
                  number: 80
---
# canary-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-canary
spec:
  replicas: 1
  selector:
    matchLabels:
      app: myapp
      track: canary
  template:
    metadata:
      labels:
        app: myapp
        track: canary
    spec:
      containers:
        - name: myapp
          image: myapp:v2.0-canary
          ports:
            - containerPort: 8080
```

**Progressive Canary Rollout Script:**

```bash
#!/bin/bash
set -e

WEIGHTS=(10 25 50 75 100)

for weight in "${WEIGHTS[@]}"; do
  echo "Setting canary weight to ${weight}%..."
  kubectl annotate ingress myapp-canary \
    nginx.ingress.kubernetes.io/canary-weight="$weight" --overwrite

  echo "Waiting 5 minutes and checking error rates..."
  sleep 300

  ERROR_RATE=$(curl -s "http://prometheus:9090/api/v1/query?query=rate(http_requests_total{status=~'5..', app='myapp-canary'}[5m])" | jq '.data.result[0].value[1]' -r)

  if (( $(echo "$ERROR_RATE > 0.05" | bc -l) )); then
    echo "ERROR: Error rate ${ERROR_RATE} exceeds threshold. Rolling back!"
    kubectl annotate ingress myapp-canary \
      nginx.ingress.kubernetes.io/canary-weight="0" --overwrite
    exit 1
  fi

  echo "Error rate ${ERROR_RATE} is acceptable. Proceeding..."
done

echo "Canary rollout complete. Promoting to stable."
```

### Feature Flags

**Concept:** Feature flags (or feature toggles) decouple deployment from release. Code is deployed to production with new features hidden behind flags that can be toggled on/off without redeploying.

**Types of Feature Flags:**

| Type | Purpose | Lifetime |
|---|---|---|
| **Release Flags** | Hide incomplete features | Short (days/weeks) |
| **Experiment Flags** | A/B testing | Medium (weeks) |
| **Ops Flags** | Kill switches, circuit breakers | Long (permanent) |
| **Permission Flags** | User-specific access | Long (permanent) |

**Example (JavaScript):**

```javascript
// Simple feature flag implementation
const featureFlags = {
  newCheckout: process.env.FF_NEW_CHECKOUT === 'true',
  darkMode: process.env.FF_DARK_MODE === 'true',
  betaAPI: process.env.FF_BETA_API === 'true',
};

app.get('/checkout', (req, res) => {
  if (featureFlags.newCheckout) {
    return res.render('checkout-v2');
  }
  return res.render('checkout-v1');
});
```

**Popular Feature Flag Tools:** LaunchDarkly, Unleash, Flagsmith, AWS AppConfig, Split.io

---

## 4. Cheat Sheet

### CI/CD Tools Comparison

| Tool | Platform | Pipeline File | Key Strength |
|---|---|---|---|
| **GitHub Actions** | GitHub | `.github/workflows/*.yml` | Tight GitHub integration, marketplace |
| **GitLab CI** | GitLab | `.gitlab-ci.yml` | Built-in, auto DevOps |
| **Jenkins** | Self-hosted | `Jenkinsfile` | Highly extensible, mature ecosystem |
| **Azure DevOps** | Azure | `azure-pipelines.yml` | Enterprise, Azure integration |
| **CircleCI** | Cloud/Self | `.circleci/config.yml` | Fast builds, Docker-first |
| **Travis CI** | Cloud | `.travis.yml` | Simple YAML config |
| **ArgoCD** | Kubernetes | Git repo (GitOps) | GitOps-native CD for K8s |
| **Tekton** | Kubernetes | K8s CRDs | Cloud-native pipelines |
| **Spinnaker** | Cloud | UI/API | Multi-cloud deployment |
| **Drone CI** | Cloud/Self | `.drone.yml` | Container-native |

### Key CI/CD Terms

| Term | Definition |
|---|---|
| **Pipeline** | Automated sequence of stages that code goes through from commit to production |
| **Stage** | A logical grouping of jobs (e.g., build, test, deploy) |
| **Job** | A set of steps that run on the same runner/agent |
| **Step** | A single command or action within a job |
| **Runner/Agent** | A machine that executes pipeline jobs |
| **Artifact** | Build output (binary, container image, package) |
| **Trigger** | Event that starts a pipeline (push, PR, schedule, webhook) |
| **Environment** | Target deployment destination (dev, staging, prod) |
| **Gate/Approval** | Manual checkpoint before proceeding to next stage |
| **Rollback** | Reverting to a previously known-good version |
| **Pipeline as Code** | Defining pipeline configuration in a version-controlled file |
| **GitOps** | Using Git as the single source of truth for infrastructure and deployments |
| **Shift Left** | Moving testing and security earlier in the pipeline |
| **DORA Metrics** | Deployment Frequency, Lead Time, Change Failure Rate, MTTR |

### Deployment Strategies Quick Reference

| Strategy | Downtime | Risk | Rollback Speed | Complexity |
|---|---|---|---|---|
| **Recreate** | Yes | High | Slow | Low |
| **Rolling Update** | No | Medium | Medium | Low |
| **Blue-Green** | No | Low | Instant | Medium |
| **Canary** | No | Very Low | Fast | High |
| **A/B Testing** | No | Very Low | Fast | High |
| **Shadow/Dark** | No | None | N/A | Very High |

---

## 5. Hands-on Labs

### Lab 1: Create a Complete GitHub Actions CI/CD Workflow

**Objective:** Build a full CI/CD pipeline for a Node.js application with build, test, security scan, and multi-environment deployment.

**Prerequisites:** GitHub account, a Node.js project with tests, Docker Hub or GHCR account.

**Steps:**

1. **Create the project structure:**

```bash
mkdir my-node-app && cd my-node-app
npm init -y
npm install express
npm install --save-dev jest supertest
```

2. **Create `app.js`:**

```javascript
const express = require('express');
const app = express();

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.get('/', (req, res) => res.json({ message: 'Hello CI/CD!' }));

module.exports = app;
```

3. **Create `app.test.js`:**

```javascript
const request = require('supertest');
const app = require('./app');

describe('GET /health', () => {
  it('should return status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
```

4. **Create `.github/workflows/ci-cd.yml`:**

```yaml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci
      - run: npm test

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v5
        with:
          push: true
          tags: ghcr.io/${{ github.repository }}:${{ github.sha }}

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    environment: production
    steps:
      - run: echo "Deploying ghcr.io/${{ github.repository }}:${{ github.sha }}"
```

5. **Create `Dockerfile`:**

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3000
USER node
CMD ["node", "server.js"]
```

6. Push to GitHub and observe the pipeline execution in the Actions tab.

**Validation:** Confirm all jobs pass — tests run on both Node versions, image is built and pushed, deploy job executes for `main` branch.

---

### Lab 2: GitLab CI Pipeline with Stages

**Objective:** Create a multi-stage GitLab CI pipeline with caching, artifacts, and environment-based deployments.

**Steps:**

1. **Create `.gitlab-ci.yml`:**

```yaml
stages:
  - install
  - test
  - build
  - deploy

variables:
  NODE_ENV: test

cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/
  policy: pull

install:
  stage: install
  image: node:20-alpine
  script:
    - npm ci
  cache:
    key: ${CI_COMMIT_REF_SLUG}
    paths:
      - node_modules/
    policy: push

lint:
  stage: test
  image: node:20-alpine
  script:
    - npm run lint
  allow_failure: true

test:
  stage: test
  image: node:20-alpine
  script:
    - npm test -- --coverage
  artifacts:
    reports:
      junit: junit.xml
    paths:
      - coverage/
    expire_in: 7 days

build:
  stage: build
  image: docker:24
  services:
    - docker:24-dind
  variables:
    DOCKER_TLS_CERTDIR: "/certs"
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  only:
    - main

deploy-staging:
  stage: deploy
  environment:
    name: staging
    url: https://staging.example.com
  script:
    - echo "Deploying $CI_COMMIT_SHA to staging"
  only:
    - main

deploy-production:
  stage: deploy
  environment:
    name: production
    url: https://example.com
  script:
    - echo "Deploying $CI_COMMIT_SHA to production"
  when: manual
  only:
    - main
```

2. Push to GitLab and verify: install → test (parallel) → build → deploy stages execute in order.

3. Check the pipeline graph in GitLab CI/CD → Pipelines.

**Validation:** Confirm stages run sequentially, caching speeds up test jobs, and production deploy requires manual approval.

---

### Lab 3: Blue-Green Deployment Simulation

**Objective:** Simulate a blue-green deployment locally using Docker Compose and Nginx.

**Steps:**

1. **Create `docker-compose.yml`:**

```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - app-blue
      - app-green

  app-blue:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      - VERSION=blue-v1.0
      - PORT=3000

  app-green:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      - VERSION=green-v1.1
      - PORT=3000
```

2. **Create `nginx.conf` (pointing to blue):**

```nginx
events { worker_connections 1024; }

http {
    upstream app {
        server app-blue:3000;    # Active
        # server app-green:3000; # Standby
    }

    server {
        listen 80;
        location / {
            proxy_pass http://app;
        }
    }
}
```

3. **Deploy and test:**

```bash
# Start all services
docker compose up -d

# Verify blue is live
curl http://localhost/

# Switch to green — edit nginx.conf:
#   Comment out app-blue, uncomment app-green

# Reload nginx (zero downtime)
docker compose exec nginx nginx -s reload

# Verify green is live
curl http://localhost/

# Rollback: reverse the nginx.conf change and reload
```

4. **Create a switch script (`switch.sh`):**

```bash
#!/bin/bash
CURRENT=$1  # "blue" or "green"

if [ "$CURRENT" = "blue" ]; then
  sed -i 's/server app-blue/# server app-blue/' nginx.conf
  sed -i 's/# server app-green/server app-green/' nginx.conf
  echo "Switched to GREEN"
else
  sed -i 's/server app-green/# server app-green/' nginx.conf
  sed -i 's/# server app-blue/server app-blue/' nginx.conf
  echo "Switched to BLUE"
fi

docker compose exec nginx nginx -s reload
```

**Validation:** Confirm you can switch traffic between blue and green with zero downtime by reloading Nginx configuration.

---

## 6. Real-World Scenarios

### Scenario 1: Implement CI/CD for a Microservice

**Situation:** Your team is building a new order-processing microservice in Python (FastAPI). It connects to PostgreSQL and RabbitMQ. You need to set up a CI/CD pipeline that builds, tests, and deploys to a Kubernetes cluster.

**Approach:**

1. **Repository Structure:**
```
order-service/
├── src/
│   ├── main.py
│   ├── routes/
│   ├── models/
│   └── services/
├── tests/
│   ├── unit/
│   └── integration/
├── Dockerfile
├── requirements.txt
├── k8s/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── configmap.yaml
└── .github/workflows/ci-cd.yml
```

2. **Pipeline Design:**
   - **PR Pipeline:** Lint → Unit Tests → Integration Tests (with test containers for Postgres/RabbitMQ) → Security Scan
   - **Main Pipeline:** All PR steps + Build Docker Image → Push to ECR → Deploy to Staging → Run smoke tests → Manual approval → Deploy to Production

3. **Key Decisions:**
   - Use **test containers** for integration tests — spin up Postgres and RabbitMQ in CI
   - Use **Helm charts** for Kubernetes deployments with environment-specific values
   - Implement **health check endpoints** (`/health`, `/ready`) for Kubernetes probes
   - Use **semantic versioning** for Docker image tags
   - Store secrets in **Kubernetes Secrets** or a vault (e.g., HashiCorp Vault)

4. **Rollback Strategy:**
   - Kubernetes rolling update with `maxUnavailable: 0` and `maxSurge: 1`
   - Automated rollback if readiness probes fail for 3 consecutive checks
   - Manual rollback: `kubectl rollout undo deployment/order-service`

5. **Monitoring Post-Deploy:**
   - Track error rates, latency (p95/p99), and throughput
   - Set up alerts for anomalous behavior within the first 15 minutes after deployment

---

### Scenario 2: Pipeline Failing Intermittently (Flaky Tests)

**Situation:** Your CI pipeline fails 20-30% of the time. The failures are inconsistent — different tests fail each time. The team has started ignoring pipeline failures and merging code despite red builds.

**Diagnosis:**

1. **Identify Flaky Tests:**
   - Analyze CI logs for the past 2 weeks — find tests that fail intermittently
   - Use test retry plugins to detect flakiness:
     ```yaml
     # pytest example
     pip install pytest-rerunfailures
     pytest --reruns 3 --reruns-delay 2
     ```
   - Track flaky test metrics: which tests, how often, what errors

2. **Common Root Causes:**
   - **Timing issues:** Tests depend on `sleep()` or hardcoded delays instead of polling/waiting
   - **Shared state:** Tests depend on execution order or modify shared database/file state
   - **External dependencies:** Tests call real APIs, databases, or services that are unreliable
   - **Resource contention:** Parallel tests compete for ports, files, or database rows
   - **Non-deterministic data:** Tests use random data, current timestamps, or UUIDs in assertions

3. **Solution:**

   **Immediate (stop the bleeding):**
   - Quarantine known flaky tests — move to a separate job that's allowed to fail
   - **Do NOT** just add automatic retries as a permanent fix

   **Short-term:**
   - Fix timing issues: replace `sleep(5)` with polling (`wait_for(condition, timeout=30)`)
   - Isolate test state: each test creates/destroys its own data
   - Mock external services: use WireMock, responses library, or test containers

   **Long-term:**
   - Add a flaky test dashboard to track and prioritize fixes
   - Set a policy: no new flaky tests allowed — if a new test flakes in CI, it must be fixed before merge
   - Run tests in random order to catch hidden dependencies:
     ```bash
     pytest -p randomly
     ```
   - Implement test ownership — each team is responsible for their flaky tests

4. **Pipeline Improvements:**
   - Separate fast unit tests from slow integration tests
   - Run integration tests in isolated containers with dedicated resources
   - Set a maximum pipeline duration — if tests take too long, optimize or parallelize

---

### Scenario 3: Zero-Downtime Database Migration in CI/CD

**Situation:** Your application requires a database schema change (adding a column, renaming a table) as part of a new feature release. You need to deploy this with zero downtime.

**Approach — Expand and Contract Pattern:**

1. **Phase 1: Expand (Backward-compatible change)**
   - Add new column (nullable or with default value)
   - Deploy new schema migration via CI/CD
   - Application code continues using old columns — no code change yet

2. **Phase 2: Migrate**
   - Deploy code that writes to both old and new columns
   - Backfill existing data into the new column
   - Both old and new application versions can run simultaneously

3. **Phase 3: Contract**
   - Deploy code that reads/writes only from the new column
   - Remove old column in a subsequent migration
   - Clean up old code paths

**Pipeline Integration:**
```yaml
deploy:
  steps:
    - name: Run database migrations
      run: npx prisma migrate deploy   # or flyway, liquibase, alembic
    - name: Deploy application
      run: kubectl apply -f k8s/
    - name: Verify migration
      run: npm run db:verify
```

**Key Rules:**
- Never run destructive migrations (DROP COLUMN, DROP TABLE) in the same deploy as code changes
- Always make migrations backward-compatible
- Test migrations against a copy of production data in staging
- Include migration rollback scripts

---

## 7. Interview Q&A

### Basic (Q1–Q15)

**Q1. What is CI/CD?**
> CI/CD stands for Continuous Integration and Continuous Delivery/Deployment. **Continuous Integration** is the practice of frequently merging code changes into a shared repository, with each change automatically built and tested. **Continuous Delivery** ensures code is always in a deployable state and can be released at any time with a manual trigger. **Continuous Deployment** takes it further by automatically deploying every change that passes all pipeline stages to production without manual intervention.

**Q2. What is the difference between Continuous Delivery and Continuous Deployment?**
> **Continuous Delivery** means every code change is built, tested, and prepared for release, but a manual approval gate exists before production deployment. **Continuous Deployment** eliminates the manual gate — every change that passes the automated pipeline is automatically deployed to production. Continuous Deployment requires more mature testing and monitoring practices since there is no human checkpoint.

**Q3. What is a CI/CD pipeline?**
> A CI/CD pipeline is an automated sequence of stages that code goes through from the moment a developer commits to when it reaches production. Typical stages include: source (code checkout), build (compile/package), test (unit/integration/e2e), security scan, deploy to staging, acceptance testing, and deploy to production. Each stage must pass before the next one begins.

**Q4. Name five popular CI/CD tools.**
> 1. **Jenkins** — Open-source, self-hosted, plugin-based automation server
> 2. **GitHub Actions** — Native CI/CD integrated into GitHub with workflow YAML files
> 3. **GitLab CI/CD** — Built-in CI/CD for GitLab with `.gitlab-ci.yml` configuration
> 4. **Azure DevOps Pipelines** — Microsoft's CI/CD solution with YAML or visual pipelines
> 5. **CircleCI** — Cloud-based CI/CD with Docker-first approach and parallelism

**Q5. What is a build artifact?**
> A build artifact is the output produced by the build stage of a CI/CD pipeline. Examples include compiled binaries, Docker images, JAR/WAR files, ZIP archives, npm packages, or any deployable unit. Artifacts are stored in repositories (e.g., Artifactory, Nexus, Docker Hub) and promoted through environments rather than rebuilt, ensuring the same tested artifact reaches production.

**Q6. What is Pipeline as Code?**
> Pipeline as Code is the practice of defining CI/CD pipeline configurations in version-controlled files (e.g., Jenkinsfile, `.github/workflows/*.yml`, `.gitlab-ci.yml`) rather than through a GUI. This allows pipelines to be versioned, peer-reviewed, branched, and treated the same as application code. It ensures reproducibility and auditability.

**Q7. What are the benefits of CI/CD?**
> Key benefits include: (1) **Faster feedback** — developers know within minutes if their change broke something. (2) **Reduced risk** — small, frequent deployments are easier to debug than large releases. (3) **Higher quality** — automated testing catches bugs early. (4) **Consistency** — automated deployments eliminate manual errors. (5) **Faster time to market** — features reach users quicker. (6) **Improved team confidence** — teams can deploy at any time without fear.

**Q8. What is a runner or agent in CI/CD?**
> A runner (or agent) is a machine or container that executes the jobs defined in a CI/CD pipeline. Runners can be **hosted** (provided by the CI/CD platform, e.g., GitHub-hosted runners) or **self-hosted** (maintained by the team on their own infrastructure). Self-hosted runners are used when you need specific hardware, software, or network access not available on hosted runners.

**Q9. What is a webhook in the context of CI/CD?**
> A webhook is an HTTP callback mechanism that triggers a CI/CD pipeline automatically when an event occurs in a source code repository. For example, when a developer pushes code to GitHub, GitHub sends a POST request to the CI/CD server (e.g., Jenkins), which then starts the pipeline. Webhooks enable event-driven automation without polling.

**Q10. What is the purpose of automated testing in CI/CD?**
> Automated testing in CI/CD serves as a safety net — it validates that every code change works correctly before it reaches production. It includes unit tests (individual functions), integration tests (component interactions), end-to-end tests (full workflows), and security tests (vulnerability scanning). Without automated testing, CI/CD would just be continuous deployment of potentially broken code.

**Q11. What is a Jenkinsfile?**
> A Jenkinsfile is a text file that defines a Jenkins pipeline using either **Declarative** or **Scripted** syntax (both based on Groovy). It is stored in the project's repository root and describes the entire build, test, and deploy process. Declarative syntax uses a structured `pipeline {}` block, while Scripted syntax uses a more flexible `node {}` block with full Groovy programming capabilities.

**Q12. What is the difference between a job and a stage in CI/CD?**
> A **stage** is a logical phase in the pipeline (e.g., Build, Test, Deploy) that groups related work together. A **job** is a unit of work within a stage that runs on a single runner/agent. A stage can contain multiple jobs that may run in parallel. For example, a "Test" stage might contain jobs for unit tests, integration tests, and linting, all running simultaneously on different runners.

**Q13. What are environment variables in CI/CD?**
> Environment variables are key-value pairs used to configure pipeline behavior without hardcoding values. They can store non-sensitive configuration (build modes, target environments) or sensitive data (API keys, passwords) via the CI/CD platform's secrets management. Examples: `NODE_ENV=production`, `DATABASE_URL`, `AWS_ACCESS_KEY_ID`. Secrets are encrypted and masked in logs.

**Q14. What is a build trigger?**
> A build trigger is an event that starts a CI/CD pipeline. Common triggers include: **Push** (code pushed to a branch), **Pull request** (PR opened/updated), **Schedule** (cron-based, e.g., nightly builds), **Manual** (user clicks a button), **Tag** (new version tag created), **API/Webhook** (external system triggers the build), and **Upstream pipeline** (another pipeline completes).

**Q15. What is the "shift left" approach in CI/CD?**
> "Shift left" means moving testing, security scanning, and quality checks earlier in the software development lifecycle — closer to the developer. Instead of finding bugs in production or late-stage QA, issues are caught during the build or even at commit time. Examples include running SAST (static analysis) in CI, pre-commit hooks for linting, and IDE-integrated security scanning.

---

### Intermediate (Q16–Q35)

**Q16. Explain the blue-green deployment strategy.**
> Blue-green deployment maintains two identical production environments: **Blue** (current live version) and **Green** (new version). The new version is deployed to Green, tested, and validated. Once verified, traffic is switched from Blue to Green (typically via load balancer or DNS). If issues are found, traffic is instantly switched back to Blue. This provides zero-downtime deployments and instant rollback capability. The tradeoff is requiring double the infrastructure resources.

**Q17. Explain the canary deployment strategy.**
> Canary deployment gradually rolls out a new version to a small percentage of users (e.g., 5%) while the majority still use the old version. Key metrics (error rates, latency, resource usage) are monitored. If metrics are healthy, traffic is incrementally increased (5% → 25% → 50% → 100%). If anomalies are detected, the canary is rolled back immediately. This limits the blast radius of a bad release to a small subset of users.

**Q18. What is GitOps?**
> GitOps is an operational framework where Git is the single source of truth for both application code and infrastructure configuration. Changes to infrastructure or deployments are made through Git commits and pull requests, and an automated agent (e.g., ArgoCD, Flux) continuously reconciles the desired state in Git with the actual state of the cluster. Key principles: declarative configuration, version-controlled, automatically applied, and continuously reconciled.

**Q19. What are DORA metrics?**
> DORA (DevOps Research and Assessment) metrics are four key measures of software delivery performance:
> 1. **Deployment Frequency** — How often code is deployed to production
> 2. **Lead Time for Changes** — Time from commit to production deployment
> 3. **Change Failure Rate** — Percentage of deployments causing a failure
> 4. **Mean Time to Recovery (MTTR)** — Time to recover from a production failure
>
> Elite performers deploy multiple times per day with <1 hour lead time, <5% failure rate, and <1 hour MTTR.

**Q20. How do you handle secrets in CI/CD pipelines?**
> Secrets should **never** be hardcoded in pipeline files or source code. Best practices include: (1) Use the CI/CD platform's built-in secrets management (GitHub Secrets, GitLab CI Variables marked as "masked/protected"). (2) Integrate with external vaults (HashiCorp Vault, AWS Secrets Manager, Azure Key Vault). (3) Use short-lived credentials via OIDC federation instead of long-lived API keys. (4) Mask secrets in pipeline logs. (5) Rotate secrets regularly. (6) Limit secret scope to specific branches or environments.

**Q21. What is a multi-stage Docker build and how does it help CI/CD?**
> A multi-stage Docker build uses multiple `FROM` statements in a single Dockerfile. Earlier stages handle building and compiling, while the final stage contains only the runtime artifacts. This produces smaller, more secure images by excluding build tools, source code, and dev dependencies from the final image. In CI/CD, this means faster image pushes/pulls, smaller attack surface, and consistent build environments.

**Q22. How do you implement rollback in a CI/CD pipeline?**
> Rollback strategies include: (1) **Kubernetes rollback:** `kubectl rollout undo deployment/myapp` reverts to the previous ReplicaSet. (2) **Re-deploy previous artifact:** Trigger a deployment of the last known-good image tag from the artifact registry. (3) **Blue-green switch:** Redirect traffic to the previous environment. (4) **Feature flags:** Disable the problematic feature without redeploying. (5) **Database rollback:** Apply reverse migration scripts. The key is to use **immutable, versioned artifacts** so any previous version can be re-deployed reliably.

**Q23. What is a monorepo CI/CD strategy?**
> In a monorepo (single repository containing multiple services/packages), CI/CD must be optimized to avoid building everything on every change. Strategies include: (1) **Path-based triggers** — only trigger pipelines for changed paths (e.g., `paths: ['services/auth/**']`). (2) **Dependency graph analysis** — build only affected services and their dependents. (3) **Caching** — heavily cache dependencies per service. (4) **Parallel jobs** — run independent service pipelines concurrently. Tools like Nx, Turborepo, and Bazel provide built-in monorepo CI optimization.

**Q24. What is infrastructure as code (IaC) and how does it relate to CI/CD?**
> Infrastructure as Code (IaC) means managing infrastructure (servers, networks, databases) through version-controlled configuration files instead of manual processes. Tools include Terraform, Pulumi, AWS CDK, and Bicep. In CI/CD, IaC enables: (1) Automated environment provisioning as a pipeline stage. (2) Consistent environments across dev/staging/prod. (3) Infrastructure changes reviewed via pull requests. (4) Ephemeral environments spun up for PR testing and torn down afterward.

**Q25. How do you handle database migrations in a CI/CD pipeline?**
> Database migrations should be: (1) **Version-controlled** — stored as numbered migration files alongside application code. (2) **Backward-compatible** — use the expand-and-contract pattern (add new → migrate data → remove old). (3) **Automated** — run as a pipeline stage before application deployment. (4) **Tested** — validate against a copy of production data in staging. (5) **Idempotent** — safe to run multiple times. Tools: Flyway, Liquibase, Alembic, Prisma Migrate, Rails ActiveRecord Migrations.

**Q26. What is a CI/CD matrix build?**
> A matrix build runs the same pipeline against multiple combinations of parameters (e.g., OS, language version, database version). This ensures compatibility across different environments. Example in GitHub Actions:
> ```yaml
> strategy:
>   matrix:
>     node: [18, 20, 22]
>     os: [ubuntu-latest, windows-latest]
> ```
> This creates 6 parallel jobs (3 Node versions × 2 OS). Matrix builds are essential for libraries supporting multiple runtime versions.

**Q27. What is the difference between declarative and scripted Jenkins pipelines?**
> **Declarative Pipeline** uses a structured `pipeline {}` block with predefined sections (`stages`, `steps`, `post`). It's opinionated, easier to read, and sufficient for most use cases. **Scripted Pipeline** uses a `node {}` block with full Groovy programming capabilities — loops, conditionals, exception handling. It's more flexible but harder to maintain. Best practice: start with Declarative and only use Scripted for complex logic that Declarative can't express.

**Q28. How do you speed up CI/CD pipelines?**
> Key optimization strategies: (1) **Caching** — cache dependencies (`node_modules`, `.m2`, pip cache). (2) **Parallelization** — run independent jobs/tests concurrently. (3) **Incremental builds** — only rebuild changed components. (4) **Docker layer caching** — reuse unchanged Docker layers. (5) **Test splitting** — distribute tests across parallel runners. (6) **Smaller images** — use alpine-based images for faster pull times. (7) **Skip unnecessary stages** — use path filters to skip irrelevant builds. (8) **Self-hosted runners** — faster hardware with pre-warmed caches.

**Q29. What is an ephemeral/preview environment?**
> An ephemeral (or preview/review) environment is a temporary, isolated environment automatically created for each pull request and destroyed when the PR is merged or closed. It allows reviewers to test changes in a production-like setting before merging. Tools like Vercel, Netlify, and ArgoCD support preview environments natively. For Kubernetes, tools like `vcluster` or namespace-per-PR strategies are used.

**Q30. What is the role of code quality gates in CI/CD?**
> Quality gates are automated checkpoints that enforce minimum standards before code progresses through the pipeline. Examples: (1) **Test coverage threshold** — fail if coverage drops below 80%. (2) **Static analysis** — no new critical/high severity issues (SonarQube). (3) **Security scan** — no known critical CVEs in dependencies. (4) **Code review** — minimum number of approvals required. (5) **Performance** — response times must not degrade beyond a threshold. Quality gates prevent technical debt from accumulating.

**Q31. Explain the concept of trunk-based development in CI/CD.**
> Trunk-based development is a branching strategy where all developers commit to a single branch (trunk/main) frequently — at least once per day. Feature branches, if used, are very short-lived (< 1 day). This approach aligns with CI principles by reducing merge conflicts and integration issues. Long-lived branches are avoided. Feature flags are used to hide incomplete features. This contrasts with GitFlow, which uses multiple long-lived branches.

**Q32. What is artifact promotion?**
> Artifact promotion is the practice of moving the same build artifact through environments (dev → staging → prod) rather than rebuilding for each environment. The artifact is built once, tested in lower environments, and promoted to production if it passes all gates. This ensures that the exact binary/image tested in staging is the one deployed to production. Environment-specific configuration is injected at deployment time via environment variables or config maps.

**Q33. How do you secure a CI/CD pipeline?**
> Pipeline security best practices: (1) **Least privilege** — runners should have minimal permissions. (2) **Secret management** — use vaults, not environment variables in code. (3) **Signed artifacts** — sign Docker images and verify signatures before deployment. (4) **SBOM generation** — track software bill of materials. (5) **Dependency scanning** — check for known CVEs (Dependabot, Snyk, Trivy). (6) **Branch protection** — require PR reviews and passing CI before merge. (7) **Immutable runners** — use ephemeral, clean runners for each job. (8) **Audit logs** — track who changed what and when.

**Q34. What is a self-hosted runner vs. a cloud-hosted runner?**
> **Cloud-hosted runners** are provided and managed by the CI/CD platform (e.g., GitHub-hosted runners, GitLab SaaS runners). They are pre-configured, maintenance-free, and ephemeral. **Self-hosted runners** are machines managed by the team, running in their own infrastructure. Self-hosted runners are used when: (1) Jobs need access to internal networks/resources. (2) Specific hardware (GPU, ARM) is required. (3) Compliance requires data to stay on-premises. (4) Cost optimization for high-volume pipelines.

**Q35. What is a deployment manifest in Kubernetes CI/CD?**
> A deployment manifest is a YAML file that declares the desired state of an application in Kubernetes — including container image, replicas, resource limits, health checks, environment variables, and update strategy. In CI/CD, the pipeline updates the image tag in the manifest (or uses Helm/Kustomize to override values) and applies it to the cluster. Tools like ArgoCD can automatically detect manifest changes in Git and deploy them (GitOps).

---

### Advanced (Q36–Q50)

**Q36. How would you design a CI/CD pipeline for a microservices architecture?**
> Key design decisions: (1) **Per-service pipelines** — each microservice has its own independent pipeline triggered by changes to its directory. (2) **Shared pipeline templates** — common stages (build, test, scan, deploy) defined in a shared library/template. (3) **Contract testing** — use Pact or similar tools to verify inter-service API contracts in CI. (4) **Service mesh integration** — canary deployments per service via Istio/Linkerd. (5) **Dependency management** — pipeline should detect and test downstream service impacts. (6) **Environment parity** — use Docker Compose or Kubernetes namespaces to spin up dependent services during integration testing.

**Q37. Explain progressive delivery and how it extends CI/CD.**
> Progressive delivery extends continuous delivery by adding fine-grained control over who sees new features and when. It combines deployment strategies (canary, blue-green) with feature flags and observability to gradually expose changes. Key components: (1) **Feature flags** for user-level targeting. (2) **Canary releases** for traffic-level control. (3) **Automated rollback** based on SLO (Service Level Objective) breaches. (4) **Observability integration** — metrics, logs, traces inform rollout decisions. Tools: Flagger, Argo Rollouts, LaunchDarkly, Flagsmith.

**Q38. How do you implement CI/CD for infrastructure changes (IaC pipelines)?**
> IaC pipelines follow a specific pattern: (1) **Lint** — validate syntax (terraform validate, bicep lint). (2) **Plan** — generate an execution plan showing what will change (`terraform plan`). (3) **Security scan** — check for misconfigurations (Checkov, tfsec, Bridgecrew). (4) **Cost estimation** — estimate the cost impact (Infracost). (5) **Manual approval** — review the plan before applying. (6) **Apply** — execute the changes (`terraform apply`). (7) **Drift detection** — scheduled pipelines to detect configuration drift. State files should be stored remotely with locking (S3 + DynamoDB, Azure Blob + lease).

**Q39. What is the expand-and-contract pattern for zero-downtime database changes?**
> The expand-and-contract (or parallel change) pattern enables zero-downtime schema migrations: **Expand phase:** Add new schema elements (columns, tables) without removing old ones. Both old and new application versions work. **Migrate phase:** Deploy code that writes to both old and new locations. Backfill existing data. **Contract phase:** Deploy code using only new schema. Remove old columns in a subsequent release. This ensures backward compatibility throughout the migration and allows safe rollback at any point.

**Q40. How do you handle CI/CD for a multi-cloud or hybrid deployment?**
> Strategies: (1) **Abstraction layer** — use Terraform or Pulumi to define infrastructure across clouds with provider-specific modules. (2) **Container-based deployments** — Docker + Kubernetes provides a consistent deployment target regardless of cloud. (3) **Cloud-agnostic CI** — use a CI tool that isn't tied to one cloud (GitHub Actions, GitLab CI). (4) **Separate deployment stages** — deploy to each cloud/region as parallel pipeline stages. (5) **Unified observability** — aggregate metrics/logs from all environments into a single platform (Datadog, Grafana).

**Q41. Explain the concept of pipeline orchestration vs. choreography.**
> **Orchestration** uses a central controller (e.g., Jenkins, Argo Workflows) to coordinate pipeline execution across services — it knows the order, dependencies, and handles failures centrally. **Choreography** uses event-driven triggers — each service's pipeline reacts to events (artifact published, deployment succeeded) independently. Orchestration is simpler for small systems; choreography scales better for large microservice architectures. Most real-world systems use a hybrid: orchestration within a service pipeline, choreography between services.

**Q42. What are Argo Rollouts and how do they enhance Kubernetes CI/CD?**
> Argo Rollouts is a Kubernetes controller that provides advanced deployment strategies beyond the native rolling update. Features: (1) **Canary deployments** with configurable traffic splitting and analysis. (2) **Blue-green deployments** with preview services and automated promotion. (3) **Experiment CRDs** for running A/B tests. (4) **Integration with metrics providers** (Prometheus, Datadog, New Relic) for automated analysis. (5) **Automated rollback** when analysis fails. It replaces the standard Kubernetes Deployment resource with a Rollout CRD that provides fine-grained control over the rollout lifecycle.

**Q43. How do you implement CI/CD compliance and governance at scale?**
> Enterprise CI/CD governance: (1) **Shared pipeline templates** — enforce standards via reusable pipeline libraries that all teams must use. (2) **Policy as code** — use OPA/Gatekeeper or Kyverno to enforce deployment policies. (3) **SBOM and provenance** — generate software bill of materials and build provenance (SLSA framework). (4) **Signed artifacts** — require cryptographic signing of images (cosign/Notary). (5) **Audit trails** — centralized logging of all pipeline executions. (6) **Automated compliance checks** — SOC 2, HIPAA, PCI controls enforced in the pipeline. (7) **Separation of duties** — different teams manage pipeline templates vs. application code.

**Q44. What is the SLSA (Supply chain Levels for Software Artifacts) framework?**
> SLSA (pronounced "salsa") is a security framework for ensuring the integrity of software artifacts throughout the supply chain. It defines four levels of increasing rigor: **Level 1:** Documentation of the build process. **Level 2:** Tamper-resistant build service with authenticated provenance. **Level 3:** Hardened build platform with non-falsifiable provenance. **Level 4:** Hermetic, reproducible builds with two-person review. In CI/CD, this means signed provenance attestations, build isolation, and verifying that the artifact deployed is exactly what was built and reviewed.

**Q45. How do you design CI/CD for serverless applications?**
> Serverless CI/CD has unique considerations: (1) **Framework-specific tooling** — use SAM CLI, Serverless Framework, or CDK for packaging and deployment. (2) **Local testing** — emulate cloud services locally (LocalStack, SAM local invoke). (3) **Per-function builds** — only rebuild and deploy changed functions. (4) **Integration testing** — test against real cloud resources in a test account/stage. (5) **Deployment strategies** — use Lambda aliases and weighted traffic shifting for canary releases. (6) **Infrastructure coupling** — functions often depend on API Gateway, DynamoDB, SQS — IaC must manage these together. (7) **Cold start monitoring** — track post-deployment performance.

**Q46. Explain the concept of deployment rings.**
> Deployment rings are a progressive rollout strategy used primarily by large organizations (Microsoft uses this extensively). Changes are rolled out in concentric rings, each encompassing more users: **Ring 0:** Internal team (developers). **Ring 1:** Early adopters / canary users. **Ring 2:** Broader internal users. **Ring 3:** Small percentage of external users. **Ring 4:** All users. Each ring acts as a validation gate — issues are caught in inner rings before affecting the broader user base. Rings combine infrastructure-level deployments with feature flags for user-level targeting.

**Q47. How do you handle CI/CD for machine learning models (MLOps)?**
> MLOps extends CI/CD with ML-specific concerns: (1) **Data versioning** — track training data alongside code (DVC, LakeFS). (2) **Model training pipeline** — automated training triggered by data or code changes. (3) **Model validation** — automated accuracy, bias, and performance checks against a holdout dataset. (4) **Model registry** — store versioned models with metadata (MLflow, Weights & Biases). (5) **A/B testing** — serve multiple model versions and compare real-world performance. (6) **Monitoring** — detect model drift and data drift in production. (7) **Reproducibility** — containerized training environments with pinned dependencies.

**Q48. What is chaos engineering and how does it integrate with CI/CD?**
> Chaos engineering is the practice of deliberately injecting failures into a system to test its resilience. Integration with CI/CD: (1) **Post-deployment chaos tests** — after deploying to staging, run chaos experiments (e.g., kill a pod, inject network latency). (2) **Automated game days** — scheduled chaos pipelines that run in production during low-traffic periods. (3) **Validation gates** — pipeline fails if the system doesn't recover from injected failures within SLO thresholds. Tools: Chaos Monkey, Litmus, Gremlin, Chaos Mesh. This ensures that each release maintains or improves system resilience.

**Q49. How do you implement multi-tenancy in CI/CD pipelines?**
> Multi-tenancy in CI/CD serves organizations with multiple teams or customers sharing infrastructure: (1) **Namespace isolation** — each team/tenant gets a dedicated Kubernetes namespace with resource quotas. (2) **Pipeline isolation** — use separate runner pools or container-based runners to prevent cross-tenant access. (3) **Secret scoping** — secrets are scoped to specific projects/environments, never shared across tenants. (4) **Shared templates with overrides** — common pipeline templates with tenant-specific configuration. (5) **Resource tagging** — tag all resources with tenant identifiers for cost tracking and access control. (6) **Network policies** — enforce network segmentation between tenant workloads.

**Q50. Design a CI/CD pipeline that achieves sub-5-minute deployment lead time for a large-scale application.**
> Architecture for fast pipelines: (1) **Incremental builds** — only build changed services (Nx, Bazel, Turborepo for monorepos). (2) **Parallel test execution** — split tests across 10+ runners using test splitting tools (Jest sharding, pytest-split). (3) **Docker layer caching** — use registry-backed caching (BuildKit `--cache-from`). (4) **Pre-built base images** — nightly-built base images with dependencies pre-installed. (5) **Rolling deployments with readiness gates** — Kubernetes deploys new pods while serving traffic from old ones. (6) **Skip redundant stages** — if only docs changed, skip build/test/deploy. (7) **Self-hosted runners** — fast machines with SSD, warm caches, and local Docker cache. (8) **Trunk-based development** — small, frequent commits avoid long merge/build cycles. (9) **Feature flags over branches** — deploy code immediately, enable features independently. (10) **Metrics:** Track and alert on pipeline duration — treat slow pipelines as bugs.

---

*Last updated: April 2026*
