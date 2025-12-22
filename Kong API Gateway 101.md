
---

# 📘 Kong API Gateway 101 Guide

### *FastAPI Microservices + JWT Auth + Role-Based Access*

---

## 1. What is Kong?

Kong is a **production-grade, NGINX-based API Gateway** that sits between **clients** and **microservices**.

### Responsibilities:

* Routing & Load Balancing
* Authentication (JWT, OAuth2, Key-Auth)
* Authorization (RBAC / ACL)
* Rate Limiting
* Logging & Observability
* Traffic Control (canary, versioning)

---

## 2. Architecture (Local Setup)

```
Client
   |
   | Authorization: Bearer JWT
   |
Kong API Gateway
   |
--------------------------
|                        |
FastAPI Service A        FastAPI Service B
(Domain A)               (Domain B)
```

---

## 3. Tech Stack

| Component     | Technology     |
| ------------- | -------------- |
| Gateway       | Kong OSS       |
| Services      | FastAPI        |
| Auth          | JWT (HS256)    |
| Orchestration | Docker Compose |

---

## 4. Project Structure

```
kong-101/
│
├── docker-compose.yml
│
├── kong/
│   └── kong.yml
│
├── services/
│   ├── service-a/
│   │   ├── Dockerfile
│   │   └── main.py
│   └── service-b/
│       ├── Dockerfile
│       └── main.py
│
└── auth/
    └── generate_jwt.py
```

---

## 5. FastAPI Microservices

### 5.1 Service A

#### `services/service-a/main.py`

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/data")
def data():
    return {"service": "A", "message": "Hello from Service A"}
```

#### `services/service-a/Dockerfile`

```dockerfile
FROM python:3.11-slim
WORKDIR /app
RUN pip install fastapi uvicorn
COPY main.py .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

### 5.2 Service B

#### `services/service-b/main.py`

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/data")
def data():
    return {"service": "B", "message": "Hello from Service B"}
```

#### `services/service-b/Dockerfile`

```dockerfile
FROM python:3.11-slim
WORKDIR /app
RUN pip install fastapi uvicorn
COPY main.py .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 6. Kong Configuration (Declarative Mode)

### 6.1 Why Declarative Mode?

* No database
* Git-friendly
* Perfect for local & learning

---

### 6.2 `kong/kong.yml`

```yaml
_format_version: "3.0"

services:
  - name: service-a
    url: http://service-a:8000
    routes:
      - name: route-a
        paths:
          - /domain-a
    plugins:
      - name: jwt
      - name: acl
        config:
          allow:
            - admin
            - user

  - name: service-b
    url: http://service-b:8000
    routes:
      - name: route-b
        paths:
          - /domain-b
    plugins:
      - name: jwt
      - name: acl
        config:
          allow:
            - admin
```

---

## 7. Docker Compose

### `docker-compose.yml`

```yaml
version: "3.9"

services:
  kong:
    image: kong:3.6
    container_name: kong
    environment:
      KONG_DATABASE: "off"
      KONG_DECLARATIVE_CONFIG: /kong/kong.yml
    volumes:
      - ./kong/kong.yml:/kong/kong.yml
    ports:
      - "8000:8000"
      - "8001:8001"

  service-a:
    build: ./services/service-a

  service-b:
    build: ./services/service-b
```

---

## 8. Run the System

```bash
docker-compose up --build
```

---

## 9. Kong Admin Concepts (Critical)

| Concept        | Meaning                   |
| -------------- | ------------------------- |
| Consumer       | User / client             |
| JWT Credential | Secret used to sign token |
| ACL Group      | Role                      |

---

## 10. Create Consumers

### Admin User

```bash
curl -X POST http://localhost:8001/consumers \
     --data "username=admin-user"
```

### Normal User

```bash
curl -X POST http://localhost:8001/consumers \
     --data "username=normal-user"
```

---

## 11. Create JWT Credentials

```bash
curl -X POST http://localhost:8001/consumers/admin-user/jwt \
     --data "key=admin-key" \
     --data "secret=admin-secret"
```

```bash
curl -X POST http://localhost:8001/consumers/normal-user/jwt \
     --data "key=user-key" \
     --data "secret=user-secret"
```

---

## 12. Assign Roles (ACL Groups)

```bash
curl -X POST http://localhost:8001/consumers/admin-user/acls \
     --data "group=admin"
```

```bash
curl -X POST http://localhost:8001/consumers/normal-user/acls \
     --data "group=user"
```

---

## 13. Generate JWT Tokens

### `auth/generate_jwt.py`

```python
import jwt, time

def create_token(key, secret, role):
    payload = {
        "iss": key,
        "role": role,
        "exp": int(time.time()) + 3600
    }
    return jwt.encode(payload, secret, algorithm="HS256")

print("ADMIN TOKEN:", create_token("admin-key", "admin-secret", "admin"))
print("USER TOKEN:", create_token("user-key", "user-secret", "user"))
```

Run:

```bash
python auth/generate_jwt.py
```

---

## 14. Test API Access

### Service A (Both Roles Allowed)

```bash
curl http://localhost:8000/domain-a/data \
     -H "Authorization: Bearer <TOKEN>"
```

### Service B (Admin Only)

```bash
curl http://localhost:8000/domain-b/data \
     -H "Authorization: Bearer <ADMIN_TOKEN>"
```

User token:

```json
{"message":"You cannot consume this service"}
```

---

## 15. Request Flow (Very Important)

1. Client sends request + JWT
2. Kong validates JWT signature
3. Maps `iss` → consumer
4. ACL plugin checks role
5. Request forwarded to FastAPI
6. Response returned

---

## 16. Common Errors & Fixes

| Error            | Cause               |
| ---------------- | ------------------- |
| 401 Unauthorized | Missing/invalid JWT |
| 403 Forbidden    | Role not allowed    |
| No route         | Path mismatch       |

---

## 17. Production Best Practices

✔ RS256 (public/private keys)
✔ Short token expiry
✔ Central auth service
✔ Scope-based access
✔ Rate limiting at gateway
✔ Observability plugins

---

## 18. Interview-Ready Summary

> “Kong acts as an API Gateway performing authentication via JWT plugin and authorization using ACL groups. FastAPI services remain stateless and security-agnostic.”

---

## 19. Next Advanced Chapters

If you want, I can extend this guide with:

1️⃣ OAuth2 / OpenID Connect
2️⃣ Rate limiting + quotas
3️⃣ API versioning
4️⃣ Kong + Kubernetes
5️⃣ AWS API Gateway equivalence

Just say **“Continue Kong 201”** 🚀
