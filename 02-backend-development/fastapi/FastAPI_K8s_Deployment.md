Below is a clean, production-ready FastAPI + Kubernetes repo structure that scales well as your project grows.


---

📁 Repository Structure

fastapi-k8s/
├── app/
│   ├── api/
│   │   ├── v1/
│   │   │   ├── endpoints/
│   │   │   │   └── health.py
│   │   │   └── router.py
│   │   └── __init__.py
│   ├── core/
│   │   ├── config.py
│   │   └── logging.py
│   ├── models/
│   │   └── __init__.py
│   ├── services/
│   │   └── __init__.py
│   ├── main.py
│   └── __init__.py
│
├── k8s/
│   ├── base/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── ingress.yaml
│   └── overlays/
│       ├── dev/
│       │   └── kustomization.yaml
│       └── prod/
│           └── kustomization.yaml
│
├── docker/
│   └── Dockerfile
│
├── scripts/
│   ├── build.sh
│   └── deploy.sh
│
├── tests/
│   └── test_health.py
│
├── .env.example
├── .dockerignore
├── .gitignore
├── requirements.txt
├── pyproject.toml
└── README.md


---

🧠 Key Files Explained


---

🔹 app/main.py

from fastapi import FastAPI
from app.api.v1.router import api_router

app = FastAPI(title="FastAPI Kubernetes App")

app.include_router(api_router, prefix="/api/v1")


---

🔹 API Routing

app/api/v1/router.py

from fastapi import APIRouter
from app.api.v1.endpoints import health

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])

app/api/v1/endpoints/health.py

from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
def health_check():
    return {"status": "healthy"}


---

🔹 Config Management

app/core/config.py

from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "fastapi-k8s"
    environment: str = "dev"

    class Config:
        env_file = ".env"

settings = Settings()


---

🔹 Dockerfile

docker/Dockerfile

FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "-w", "4", "app.main:app", "-b", "0.0.0.0:8000"]


---

🔹 Kubernetes Deployment

k8s/base/deployment.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: fastapi
spec:
  replicas: 2
  selector:
    matchLabels:
      app: fastapi
  template:
    metadata:
      labels:
        app: fastapi
    spec:
      containers:
      - name: fastapi
        image: your-dockerhub/fastapi:latest
        ports:
        - containerPort: 8000
        livenessProbe:
          httpGet:
            path: /api/v1/health
            port: 8000
        readinessProbe:
          httpGet:
            path: /api/v1/health
            port: 8000


---

🔹 Kustomize

k8s/overlays/dev/kustomization.yaml

resources:
  - ../../base

images:
  - name: your-dockerhub/fastapi
    newTag: dev


---

🔹 Tests

tests/test_health.py

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/api/v1/health")
    assert response.status_code == 200


---

🔹 Scripts

scripts/build.sh

docker build -f docker/Dockerfile -t your-dockerhub/fastapi:latest .

scripts/deploy.sh

kubectl apply -k k8s/overlays/dev


---

🚀 Optional Enhancements

Helm chart instead of Kustomize

CI/CD (GitHub Actions)

PostgreSQL + Alembic

Redis + Celery

Prometheus + Grafana

HPA + metrics-server



---

If you want, I can:

Convert this to Helm

Add CI/CD pipeline

Add database migrations

Make it 12-factor compliant

Deploy to AWS EKS / GCP GKE


Just say the word 🔧
