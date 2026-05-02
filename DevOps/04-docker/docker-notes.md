---
layout: default
render_with_liquid: false
---
# 🐳 Docker – DevOps Notes

---

## 1. Introduction

Docker is a platform for building, shipping, and running applications in lightweight, isolated containers. Containers package code with all dependencies, ensuring consistency across environments.

### Containers vs VMs
```
Virtual Machine:                    Container:
┌─────────────────┐                ┌─────────────────┐
│    App A │ App B │                │  App A │  App B  │
├─────────┼───────┤                ├────────┼─────────┤
│ Guest OS│Guest OS│                │  Bins/Libs │ Bins │
├─────────┴───────┤                ├──────────────────┤
│   Hypervisor     │                │  Container Engine│
├──────────────────┤                ├──────────────────┤
│   Host OS        │                │   Host OS        │
├──────────────────┤                ├──────────────────┤
│   Hardware       │                │   Hardware       │
└──────────────────┘                └──────────────────┘
Heavyweight, minutes to start       Lightweight, seconds to start
Full OS per VM                      Shared kernel
GBs of disk                         MBs of disk
```

---

## 2. Docker Architecture

```
┌──────────────┐     ┌──────────────────────────────────────┐
│  Docker CLI  │────>│          Docker Daemon (dockerd)      │
│  (client)    │     │                                        │
└──────────────┘     │  ┌────────────┐  ┌──────────────────┐ │
                     │  │ Containers │  │     Images        │ │
                     │  └────────────┘  └──────────────────┘ │
                     │  ┌────────────┐  ┌──────────────────┐ │
                     │  │  Volumes   │  │    Networks       │ │
                     │  └────────────┘  └──────────────────┘ │
                     └──────────────────────────────────────┘
                                │
                     ┌──────────────────┐
                     │  Docker Registry  │
                     │  (Docker Hub, ECR,│
                     │   ACR, Harbor)    │
                     └──────────────────┘

Components:
  Docker Client  → CLI that sends commands to the daemon
  Docker Daemon  → Background service managing containers, images, networks, volumes
  Docker Registry→ Stores and distributes Docker images
  containerd     → Container runtime (manages container lifecycle)
  runc           → Low-level OCI runtime (creates containers)
```

---

## 3. Essential Docker Commands

### Images
```bash
# Pull image
docker pull nginx:1.25
docker pull ubuntu:22.04

# List images
docker images
docker image ls

# Remove image
docker rmi nginx:1.25
docker image prune -a      # Remove all unused images

# Inspect image
docker inspect nginx:1.25
docker history nginx:1.25   # Show layer history

# Tag image
docker tag myapp:latest myregistry.com/myapp:v1.0

# Push image
docker push myregistry.com/myapp:v1.0
```

### Containers
```bash
# Run container
docker run nginx                               # Foreground
docker run -d nginx                            # Detached (background)
docker run -d --name web -p 8080:80 nginx      # Name + port mapping
docker run -d --rm nginx                       # Auto-remove on stop
docker run -it ubuntu bash                     # Interactive terminal
docker run -d -e "DB_HOST=db" -e "DB_PORT=5432" myapp  # Env vars
docker run -d --restart=always nginx           # Restart policy

# List containers
docker ps           # Running
docker ps -a        # All (including stopped)

# Container lifecycle
docker stop web
docker start web
docker restart web
docker kill web      # Force stop (SIGKILL)
docker rm web        # Remove stopped container
docker rm -f web     # Force remove (even if running)

# Logs
docker logs web
docker logs -f web          # Follow
docker logs --tail 100 web  # Last 100 lines
docker logs --since 1h web  # Last hour

# Execute command in running container
docker exec -it web bash
docker exec web cat /etc/nginx/nginx.conf

# Copy files
docker cp web:/etc/nginx/nginx.conf ./nginx.conf
docker cp ./app.conf web:/etc/nginx/conf.d/

# Resource stats
docker stats
docker top web

# Inspect
docker inspect web
docker inspect --format '{{.NetworkSettings.IPAddress}}' web
```

---

## 4. Dockerfile

```dockerfile
# --- Basic Dockerfile ---
FROM node:20-alpine

WORKDIR /app

# Copy dependency files first (better layer caching)
COPY package*.json ./
RUN npm ci --production

# Copy application code
COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
```

### Dockerfile Instructions

| Instruction | Purpose |
|-------------|---------|
| `FROM` | Base image (must be first) |
| `WORKDIR` | Set working directory |
| `COPY` | Copy files from host to image |
| `ADD` | Copy + extract archives + fetch URLs |
| `RUN` | Execute command during build |
| `CMD` | Default command when container starts |
| `ENTRYPOINT` | Main command (CMD becomes arguments) |
| `ENV` | Set environment variable |
| `ARG` | Build-time variable |
| `EXPOSE` | Document listening port |
| `VOLUME` | Create mount point |
| `USER` | Set the user for subsequent commands |
| `HEALTHCHECK` | Container health check |
| `LABEL` | Add metadata |

### Multi-stage Build (Production Optimized)
```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production
WORKDIR /app

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

USER appuser
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
    CMD wget -q --spider http://localhost:3000/health || exit 1

CMD ["node", "dist/server.js"]
```

### Build
```bash
docker build -t myapp:v1.0 .
docker build -t myapp:v1.0 -f Dockerfile.prod .   # Custom Dockerfile
docker build --no-cache -t myapp:v1.0 .            # No cache
docker build --build-arg NODE_ENV=production -t myapp:v1.0 .
```

---

## 5. Docker Compose

```yaml
# docker-compose.yml
version: "3.9"

services:
  web:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - API_URL=http://api:8080
    depends_on:
      api:
        condition: service_healthy
    networks:
      - app-network

  api:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - DB_HOST=db
      - DB_PORT=5432
      - DB_NAME=myapp
      - DB_USER=appuser
      - DB_PASS_FILE=/run/secrets/db_password
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 5s
      retries: 3
    networks:
      - app-network
    secrets:
      - db_password

  db:
    image: postgres:16-alpine
    volumes:
      - db-data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=appuser
      - POSTGRES_PASSWORD_FILE=/run/secrets/db_password
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U appuser -d myapp"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-network
    secrets:
      - db_password

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - app-network

volumes:
  db-data:
  redis-data:

networks:
  app-network:
    driver: bridge

secrets:
  db_password:
    file: ./secrets/db_password.txt
```

### Compose Commands
```bash
docker compose up -d                    # Start all services
docker compose up -d --build            # Rebuild and start
docker compose down                     # Stop and remove
docker compose down -v                  # Also remove volumes
docker compose ps                       # List services
docker compose logs -f api              # Follow API logs
docker compose exec api bash            # Shell into service
docker compose restart api              # Restart a service
docker compose pull                     # Pull latest images
docker compose config                   # Validate compose file
```

---

## 6. Docker Volumes

```bash
# Types of mounts:
# 1. Named volume   → Managed by Docker, persistent
# 2. Bind mount     → Maps host directory to container
# 3. tmpfs mount    → In-memory, temporary

# Named volume
docker volume create mydata
docker run -d -v mydata:/app/data nginx
docker volume ls
docker volume inspect mydata
docker volume rm mydata
docker volume prune           # Remove unused volumes

# Bind mount
docker run -d -v /host/path:/container/path nginx
docker run -d -v $(pwd)/config:/app/config:ro nginx  # Read-only

# tmpfs (Linux only)
docker run -d --tmpfs /app/tmp:rw,size=100m nginx
```

---

## 7. Docker Networking

```bash
# Network types:
# bridge  → Default, isolated network for containers on same host
# host    → Container shares host's network stack
# none    → No networking
# overlay → Multi-host networking (Swarm/K8s)
# macvlan → Assign MAC address, appear as physical device

# List networks
docker network ls

# Create custom network
docker network create --driver bridge app-net
docker network create --subnet 172.20.0.0/16 app-net

# Connect container to network
docker run -d --name web --network app-net nginx
docker network connect app-net existing-container

# Disconnect
docker network disconnect app-net web

# Inspect
docker network inspect app-net

# DNS: Containers on the same custom network can resolve each other by name
docker run -d --name api --network app-net myapi
docker run -d --name web --network app-net nginx
# From web: curl http://api:8080  ← works!

# Remove
docker network rm app-net
docker network prune
```

---

## 8. Docker Security Best Practices

```dockerfile
# 1. Use specific image tags (not :latest)
FROM node:20.12-alpine

# 2. Run as non-root user
RUN addgroup -S app && adduser -S app -G app
USER app

# 3. Use multi-stage builds (smaller attack surface)
# 4. Scan images for vulnerabilities
# docker scout cves myapp:latest

# 5. Use .dockerignore
# .dockerignore
.git
node_modules
*.md
.env
```

```bash
# 6. Read-only filesystem
docker run --read-only --tmpfs /tmp myapp

# 7. Drop capabilities
docker run --cap-drop ALL --cap-add NET_BIND_SERVICE myapp

# 8. Resource limits
docker run --memory=512m --cpus=1.0 myapp

# 9. No new privileges
docker run --security-opt=no-new-privileges myapp

# 10. Scan images
docker scout cves myapp:latest
trivy image myapp:latest
```

---

## 9. Docker Registry

```bash
# Docker Hub
docker login
docker push username/myapp:v1.0
docker pull username/myapp:v1.0

# Private registry
docker run -d -p 5000:5000 --name registry registry:2
docker tag myapp:v1.0 localhost:5000/myapp:v1.0
docker push localhost:5000/myapp:v1.0

# AWS ECR
aws ecr get-login-password | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com
docker tag myapp:v1.0 123456789.dkr.ecr.us-east-1.amazonaws.com/myapp:v1.0
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/myapp:v1.0

# Azure ACR
az acr login --name myregistry
docker tag myapp:v1.0 myregistry.azurecr.io/myapp:v1.0
docker push myregistry.azurecr.io/myapp:v1.0
```

---

## 10. Cheat Sheet

| Command | Purpose |
|---------|---------|
| `docker run -d -p 80:80 nginx` | Run container detached with port mapping |
| `docker ps -a` | List all containers |
| `docker logs -f <name>` | Follow container logs |
| `docker exec -it <name> bash` | Shell into container |
| `docker build -t app:v1 .` | Build image from Dockerfile |
| `docker images` | List images |
| `docker rmi <image>` | Remove image |
| `docker stop <name>` | Stop container |
| `docker rm <name>` | Remove container |
| `docker volume ls` | List volumes |
| `docker network ls` | List networks |
| `docker compose up -d` | Start Compose services |
| `docker compose down -v` | Stop + remove volumes |
| `docker system prune -a` | Remove all unused data |
| `docker inspect <name>` | Detailed info |
| `docker stats` | Live resource usage |
| `docker cp` | Copy files to/from container |
| `docker tag` | Tag an image |
| `docker push` | Push to registry |
| `docker scout cves` | Scan for vulnerabilities |

---

## 11. Hands-on Labs

### Lab 1: Containerize a Node.js Application
```bash
# Step 1: Create the app
mkdir docker-lab && cd docker-lab
cat << 'EOF' > server.js
const http = require('http');
const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({ status: 'ok', host: require('os').hostname() }));
});
server.listen(3000, () => console.log('Server running on port 3000'));
EOF

cat << 'EOF' > package.json
{ "name": "docker-lab", "version": "1.0.0", "main": "server.js" }
EOF

# Step 2: Create Dockerfile
cat << 'EOF' > Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
EOF

# Step 3: Build and run
docker build -t node-lab:v1 .
docker run -d --name node-app -p 3000:3000 node-lab:v1

# Step 4: Test
curl http://localhost:3000

# Step 5: Check logs
docker logs node-app
```

### Lab 2: Multi-container Application with Compose
```bash
# Step 1: Create docker-compose.yml for a web app + Redis
cat << 'EOF' > docker-compose.yml
version: "3.9"
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - REDIS_HOST=redis
    depends_on:
      - redis
  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data
volumes:
  redis-data:
EOF

# Step 2: Start
docker compose up -d --build

# Step 3: Verify
docker compose ps
curl http://localhost:3000

# Step 4: Scale web service
docker compose up -d --scale web=3

# Step 5: Cleanup
docker compose down -v
```

### Lab 3: Multi-stage Build for Production
```bash
# Create a Go app with multi-stage build
cat << 'EOF' > main.go
package main
import (
    "fmt"
    "net/http"
)
func main() {
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "Hello from Go!")
    })
    http.ListenAndServe(":8080", nil)
}
EOF

cat << 'EOF' > go.mod
module docker-lab
go 1.22
EOF

cat << 'EOF' > Dockerfile.multi
# Build stage
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod ./
COPY main.go ./
RUN CGO_ENABLED=0 go build -o server .

# Production stage
FROM alpine:3.19
RUN adduser -D appuser
COPY --from=builder /app/server /server
USER appuser
EXPOSE 8080
CMD ["/server"]
EOF

# Build and compare sizes
docker build -f Dockerfile.multi -t go-multi:v1 .
docker images | grep go

# The multi-stage image should be ~15MB vs ~300MB+ for a single-stage
```

---

## 12. Real-world Scenarios

### Scenario 1: Optimize Docker Image Size for Production

**Situation:** Production image is 1.2GB, causing slow deploys and high registry costs.

**Solution:**
```dockerfile
# BEFORE (1.2GB):
FROM node:20
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "server.js"]

# AFTER (< 150MB):
# 1. Use alpine base
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --production

FROM node:20-alpine
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app

# 2. Copy only production artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# 3. .dockerignore to exclude unnecessary files
# .git, node_modules, *.md, tests/, .env

USER app
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### Scenario 2: Container Keeps Restarting (CrashLoopBackOff equivalent)

**Situation:** A container restarts continuously. Need to debug.

**Solution:**
```bash
# 1. Check logs
docker logs --tail 50 myapp

# 2. Check exit code
docker inspect myapp --format='{{.State.ExitCode}}'
# Exit 137 = OOM killed, 1 = app error, 139 = segfault

# 3. Run interactive to debug
docker run -it --entrypoint sh myapp:latest
# Check if binaries exist, configs are correct, ports aren't conflicting

# 4. Check resource limits
docker stats myapp
# If memory is maxed out → increase limit or optimize app

# 5. Check health check
docker inspect myapp --format='{{json .State.Health}}'

# 6. Override command to keep container running for debugging
docker run -d --name debug myapp:latest tail -f /dev/null
docker exec -it debug sh
```

### Scenario 3: Docker Disk Space Full

**Situation:** Docker host running out of disk due to accumulated images, containers, and volumes.

```bash
# 1. Check Docker disk usage
docker system df
docker system df -v   # Detailed

# 2. Clean up step by step
docker container prune -f   # Remove stopped containers
docker image prune -a -f    # Remove unused images
docker volume prune -f      # Remove unused volumes
docker network prune -f     # Remove unused networks

# 3. Nuclear option (remove everything unused)
docker system prune -a --volumes -f

# 4. Find large images
docker images --format "{{.Repository}}:{{.Tag}}\t{{.Size}}" | sort -k2 -h

# 5. Set up automated cleanup (cron)
# 0 2 * * * docker system prune -af --filter "until=168h"
```

---

## 13. Interview Q&A (50 Questions)

### Basic (1–15)

**Q1: What is Docker?**
> An open-source platform for containerizing applications—packaging code, dependencies, and runtime into portable, lightweight containers that run consistently across environments.

**Q2: What is the difference between a container and a virtual machine?**
> Containers share the host kernel, are lightweight (MBs), start in seconds. VMs run a full guest OS, are heavier (GBs), and start in minutes. Containers use namespaces/cgroups for isolation.

**Q3: What is a Docker image vs a container?**
> An **image** is a read-only template containing the application and dependencies. A **container** is a running instance of an image. Image = class, container = object.

**Q4: What is a Dockerfile?**
> A text file with instructions to build a Docker image. Each instruction creates a layer. Common: `FROM`, `RUN`, `COPY`, `CMD`, `EXPOSE`.

**Q5: What is Docker Hub?**
> Docker's public registry for sharing Docker images. Contains official images (nginx, postgres, node) and community images.

**Q6: What is the difference between `CMD` and `ENTRYPOINT`?**
> `CMD` provides default arguments that can be overridden at runtime. `ENTRYPOINT` sets the main command that always runs—`CMD` becomes arguments to it.

**Q7: What is the difference between `COPY` and `ADD`?**
> `COPY` simply copies files from host to image. `ADD` also supports URL fetching and auto-extracts tar archives. Best practice: Use `COPY` unless you specifically need `ADD` features.

**Q8: How do you expose a port in Docker?**
> `EXPOSE 8080` in Dockerfile documents the port. At runtime: `docker run -p 8080:80` maps host port 8080 to container port 80.

**Q9: What is `docker exec`?**
> Runs a command inside a running container. `docker exec -it myapp bash` opens an interactive shell. Useful for debugging.

**Q10: How do you view container logs?**
> `docker logs <container>`, `docker logs -f <container>` (follow), `docker logs --tail 100 <container>` (last 100 lines).

**Q11: What is `docker compose`?**
> A tool for defining and running multi-container applications using a YAML file (`docker-compose.yml`). `docker compose up -d` starts all defined services.

**Q12: What is a Docker volume?**
> Persistent storage managed by Docker that survives container restarts and removals. Data stored outside the container's writable layer.

**Q13: What is `.dockerignore`?**
> A file that specifies patterns to exclude from the Docker build context. Reduces build time and image size. Similar to `.gitignore`.

**Q14: What is `docker pull` and `docker push`?**
> `pull` downloads an image from a registry. `push` uploads an image to a registry. Requires `docker login` for private registries.

**Q15: What is the default network mode in Docker?**
> `bridge`. Docker creates a virtual bridge network (`docker0`) and assigns containers IPs on this network. Containers on the same bridge can communicate.

### Intermediate (16–35)

**Q16: What is a multi-stage build?**
> A Dockerfile with multiple `FROM` statements. Build artifacts from one stage are copied to the next. Results in smaller production images by excluding build tools and dependencies.

**Q17: What are Docker layers?**
> Each instruction in a Dockerfile creates a read-only layer. Layers are cached and reused. Ordering instructions properly (dependencies before code) optimizes build speed.

**Q18: How does Docker networking work?**
> Docker creates virtual networks. **Bridge** (default): isolated network per host. **Host**: shares host network. **Overlay**: multi-host (Swarm). Containers on custom networks have DNS resolution by name.

**Q19: What is the difference between named volumes and bind mounts?**
> **Named volumes**: Managed by Docker, portable, stored in Docker area. **Bind mounts**: Map specific host paths, give direct host filesystem access, used for development.

**Q20: What is Docker layer caching?**
> Docker caches each layer from a build. If a layer's instruction and context haven't changed, the cached layer is reused. Order instructions from least to most frequently changing.

**Q21: How do you pass environment variables to a container?**
> `docker run -e "KEY=value"` or `-e KEY` (from host env) or `--env-file .env`. In Compose: `environment:` section or `env_file:`.

**Q22: What is `docker system prune`?**
> Removes all unused Docker resources: stopped containers, dangling images, unused networks. Add `-a` for all unused images, `--volumes` for volumes. Frees disk space.

**Q23: What restart policies does Docker support?**
> `no` (default), `on-failure[:max-retries]`, `always` (restarts unless manually stopped), `unless-stopped` (like always but respects manual stops). Set with `--restart=always`.

**Q24: How do you limit container resources?**
> Memory: `--memory=512m`. CPU: `--cpus=1.5` or `--cpu-shares=512`. Combined: `docker run --memory=512m --cpus=1.0 myapp`.

**Q25: What is Docker healthcheck?**
> A mechanism to check if a container's application is healthy. Defined in Dockerfile or Compose. Docker marks containers as `healthy`, `unhealthy`, or `starting`.

**Q26: What is the difference between `docker stop` and `docker kill`?**
> `docker stop` sends SIGTERM (graceful, 10s timeout, then SIGKILL). `docker kill` sends SIGKILL immediately (no cleanup). Use `stop` in production.

**Q27: What is a Docker registry?**
> A service that stores and distributes Docker images. Public: Docker Hub. Private: AWS ECR, Azure ACR, Google GCR, Harbor, GitLab Registry.

**Q28: What is Docker Swarm?**
> Docker's built-in container orchestration. Manages a cluster of Docker hosts. Supports service scaling, rolling updates, load balancing. Simpler than Kubernetes but less feature-rich.

**Q29: How do you secure Docker images?**
> 1) Use official/minimal base images (alpine) 2) Run as non-root 3) Scan for vulnerabilities 4) Use specific tags (not :latest) 5) Multi-stage builds 6) Sign images 7) Use `.dockerignore`

**Q30: What is Docker BuildKit?**
> Docker's next-generation build engine. Faster, supports parallel builds, better caching, build secrets (`--mount=type=secret`). Enable: `DOCKER_BUILDKIT=1 docker build`.

**Q31: How do you share data between containers?**
> 1) Named volumes mounted to multiple containers 2) `--volumes-from` another container 3) Docker network communication 4) Shared bind mount on host.

**Q32: What is the difference between `RUN`, `CMD`, and `ENTRYPOINT`?**
> `RUN` executes during build (creates layers). `CMD` provides default runtime command (overridable). `ENTRYPOINT` provides non-overridable command—CMD becomes arguments to it.

**Q33: What is overlay network in Docker?**
> A multi-host network that enables containers on different Docker hosts to communicate securely. Used in Docker Swarm and Kubernetes. Uses VXLAN for encapsulation.

**Q34: How do you debug a container that won't start?**
> 1) `docker logs <container>` 2) `docker inspect <container>` for config/state 3) Override entrypoint: `docker run -it --entrypoint sh image` 4) Check exit code 5) Run container with `tail -f /dev/null`

**Q35: What is the difference between `docker compose` and `docker-compose`?**
> `docker-compose` (v1): Standalone Python binary. `docker compose` (v2): Integrated Docker CLI plugin, built in Go, faster. V2 is the current standard.

### Advanced (36–50)

**Q36: How do Docker namespaces and cgroups work?**
> **Namespaces** provide isolation: PID (processes), NET (network), MNT (filesystem), UTS (hostname), IPC, USER. **Cgroups** limit resources: CPU, memory, I/O. Together they create a container.

**Q37: What is a rootless Docker installation?**
> Running Docker daemon and containers without root privileges. Improves security—even if a container escapes, the attacker has limited host privileges. Uses user namespaces.

**Q38: What is OCI (Open Container Initiative)?**
> Standards for container formats and runtimes. **Image spec** (how images are built/distributed) and **Runtime spec** (how containers are run). Docker, containerd, Podman all comply with OCI.

**Q39: How do you implement Docker image signing?**
> Docker Content Trust (DCT): `export DOCKER_CONTENT_TRUST=1`. Signs images with Notary. Prevents pulling unsigned images. Also: Cosign (Sigstore) for keyless signing.

**Q40: What is the difference between containerd and Docker?**
> **containerd** is a container runtime (manages container lifecycle, image pulls, storage). **Docker** is a higher-level platform that uses containerd internally but adds CLI, build, compose, networking.

**Q41: How do you handle secrets in Docker?**
> 1) Docker Secrets (Swarm): `docker secret create` 2) Compose secrets from files 3) BuildKit secrets: `RUN --mount=type=secret,id=mysecret` 4) External: Vault, AWS Secrets Manager. Never put secrets in ENV or image layers.

**Q42: What is Docker-in-Docker (DinD)?**
> Running Docker daemon inside a Docker container. Used in CI/CD (Jenkins agents). Requires `--privileged` flag. Alternative: Docker socket mounting (`-v /var/run/docker.sock:/var/run/docker.sock`).

**Q43: How do you optimize Docker builds for CI/CD?**
> 1) Use BuildKit + cache mounts 2) Multi-stage builds 3) Cache dependency layers 4) Use `--cache-from` with registry 5) Parallel builds 6) .dockerignore 7) Use specific base images.

**Q44: What is Podman and how does it differ from Docker?**
> Podman is a daemonless, rootless container engine. Compatible with Docker CLI/images. No central daemon (each container is a child process). Better security. Supports pods (like K8s).

**Q45: How does Docker handle DNS resolution?**
> Docker runs an embedded DNS server (127.0.0.11) on user-defined networks. Containers resolve each other by name. Default bridge network does NOT support DNS—use custom networks.

**Q46: What is a distroless image?**
> An image without a package manager, shell, or OS utilities—contains only the application and its runtime dependencies. Minimal attack surface. By Google: `gcr.io/distroless/java`, `/nodejs`, `/static`.

**Q47: How do you implement blue-green deployment with Docker?**
> Run both versions simultaneously on different ports. Use a reverse proxy (Nginx/Traefik) to route traffic. Switch the proxy config to point to the new version. Roll back by switching back.

**Q48: What is the difference between `docker save` and `docker export`?**
> `docker save` saves an image with all layers and metadata (for moving images between hosts). `docker export` saves a container's filesystem as a flat archive (loses layer info).

**Q49: How do you monitor Docker containers in production?**
> 1) `docker stats` (basic) 2) cAdvisor (container metrics) 3) Prometheus + cAdvisor + Grafana 4) Docker logging drivers (json-file, syslog, fluentd) 5) Datadog/New Relic agents.

**Q50: What is Docker Compose profiles?**
> Allow defining optional services activated by profile name. `profiles: ["debug"]` on a service means it only starts with `docker compose --profile debug up`. Useful for dev/test services.

---

*Last updated: April 2026*
