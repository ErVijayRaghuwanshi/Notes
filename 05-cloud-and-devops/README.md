# Cloud & DevOps

Container orchestration, CI/CD pipelines, and cloud infrastructure for deploying and managing production applications.

## 📚 Contents

### Kubernetes (Coming Soon)
- Pod, Deployment, Service concepts
- ConfigMaps & Secrets
- Ingress & Load Balancing
- StatefulSets & Persistent Volumes
- Helm Charts
- Kustomize
- Monitoring with Prometheus

### Docker (Coming Soon)
- Dockerfile best practices
- Multi-stage builds
- Docker Compose
- Container networking
- Volume management
- Image optimization

### CI/CD (Coming Soon)
- GitHub Actions
- GitLab CI
- Jenkins pipelines
- Deployment strategies (blue-green, canary)
- Testing in pipelines
- Security scanning

## 🎯 Learning Path

### Beginner
1. **Docker Basics** → Containers, images, Dockerfile
2. **Docker Compose** → Multi-container applications
3. **K8s Fundamentals** → Pods, deployments, services
4. **Basic CI/CD** → Automated testing and deployment

### Intermediate
1. **K8s Networking** → Ingress, service mesh
2. **Configuration Management** → ConfigMaps, secrets
3. **Helm/Kustomize** → Package management
4. **Monitoring** → Prometheus, Grafana

### Advanced
1. **StatefulSets** → Databases on K8s
2. **Operators** → Custom resource management
3. **GitOps** → ArgoCD, FluxCD
4. **Multi-cluster** → Federation, disaster recovery

## 💡 Interview Topics

### Kubernetes
- **Pod vs Deployment**: When to use each
- **Service Types**: ClusterIP, NodePort, LoadBalancer
- **Scaling**: HPA, VPA, cluster autoscaler
- **Storage**: PV, PVC, StorageClass
- **Security**: RBAC, network policies, pod security

### Docker
- **Image Layers**: How they work, optimization
- **Multi-stage Builds**: Reduce image size
- **Networking**: Bridge, host, overlay networks
- **Volumes**: Bind mounts vs volumes
- **Security**: Image scanning, non-root users

### CI/CD
- **Pipeline Stages**: Build, test, deploy
- **Deployment Strategies**: Rolling, blue-green, canary
- **Secrets Management**: Vault, sealed secrets
- **Testing**: Unit, integration, smoke tests
- **Rollback**: Strategies and automation

## 🏗️ Best Practices

### Docker
- Use official base images
- Multi-stage builds for smaller images
- Run as non-root user
- Use .dockerignore
- Pin versions (avoid :latest)
- Scan for vulnerabilities

### Kubernetes
- Set resource requests/limits
- Use health checks (liveness, readiness)
- Implement proper logging
- Use namespaces for isolation
- Apply RBAC policies
- Regular security updates

### CI/CD
- Fail fast (run quick tests first)
- Parallel execution where possible
- Cache dependencies
- Automated rollback on failure
- Environment parity (dev/staging/prod)
- Audit logs for deployments

## 📊 Common Patterns

### Deployment Patterns
- **Rolling Update**: Gradual replacement of pods
- **Blue-Green**: Switch between two environments
- **Canary**: Test with small percentage of traffic
- **A/B Testing**: Compare different versions

### Scaling Patterns
- **Horizontal Pod Autoscaler**: Scale based on CPU/memory
- **Vertical Pod Autoscaler**: Adjust resource requests
- **Cluster Autoscaler**: Add/remove nodes
- **KEDA**: Event-driven autoscaling

## 🔗 Related Topics

- [Backend Development](../02-backend-development/) - FastAPI K8s deployment
- [System Design](../SystemDesign/README.md) - Infrastructure architecture
- [Big Data Engineering](../BigData/README.md) - Spark on K8s and data-platform operations
