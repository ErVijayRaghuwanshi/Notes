Here are **full production-ready middleware templates** for FastAPI, each with clean, reusable code.

Below you get:

# ✅ 1. **JWT Authentication Middleware**

# ✅ 2. **Redis Caching Middleware**

# ✅ 3. **Error Handling Middleware (Global)**

# ✅ 4. **Request ID / Trace ID Middleware**

# ✅ 5. **Rate Limiting Middleware (IP-based)**

---

# 🚀 1. **JWT Authentication Middleware (Production-Ready)**

### ✔️ Features

* Verifies JWT
* Rejects invalid/expired token
* Attaches user info to `request.state.user`

### 👉 Code

```python
from fastapi import FastAPI, Request
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.responses import JSONResponse
import jwt

SECRET_KEY = "mysecret"  # Put in env
ALGORITHM = "HS256"

class JWTAuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Public routes (skip auth)
        public_paths = ["/login", "/health"]
        if request.url.path in public_paths:
            return await call_next(request)

        token = request.headers.get("Authorization")

        if not token or not token.startswith("Bearer "):
            return JSONResponse(status_code=401, content={"error": "Missing Token"})

        token = token.split(" ")[1]

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            request.state.user = payload
        except jwt.ExpiredSignatureError:
            return JSONResponse(status_code=401, content={"error": "Token expired"})
        except jwt.InvalidTokenError:
            return JSONResponse(status_code=401, content={"error": "Invalid token"})

        return await call_next(request)

app = FastAPI()
app.add_middleware(JWTAuthMiddleware)
```

---

# 🚀 2. **Redis Caching Middleware**

### ✔️ Features

* Caches GET requests
* Uses Redis
* Skips POST/PUT/DELETE
* Helps reduce DB load

### 👉 Code

```python
from starlette.middleware.base import BaseHTTPMiddleware
import aioredis
import json

class RedisCacheMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, redis_url="redis://localhost:6379"):
        super().__init__(app)
        self.redis_url = redis_url

    async def dispatch(self, request, call_next):
        if request.method != "GET":
            return await call_next(request)

        redis = await aioredis.from_url(self.redis_url)
        url_key = f"cache:{request.url}"

        cached = await redis.get(url_key)
        if cached:
            print("⚡ Cached Response")
            return JSONResponse(json.loads(cached))

        response = await call_next(request)

        await redis.set(url_key, response.body, ex=60)  # cache 60 sec
        return response

app.add_middleware(RedisCacheMiddleware)
```

---

# 🚀 3. **Error Handling Middleware (Global)**

Handles:

* Validation errors
* Uncaught exceptions
* Auto logs stack trace

### 👉 Code

```python
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.responses import JSONResponse
import traceback

class ErrorHandlerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        try:
            return await call_next(request)
        except Exception as e:
            print("⛔ Error:", str(e))
            print(traceback.format_exc())

            return JSONResponse(
                status_code=500,
                content={
                    "error": "Internal Server Error",
                    "detail": str(e)
                }
            )

app.add_middleware(ErrorHandlerMiddleware)
```

This protects your API from crashing due to unexpected exceptions.

---

# 🚀 4. **Request ID / Trace ID Middleware**

### ✔️ Features

* Assigns unique request ID for each request
* Adds ID to logs
* Returns ID in headers (useful for debugging microservices)

### 👉 Code

```python
import uuid
from starlette.middleware.base import BaseHTTPMiddleware

class RequestIDMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id

        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id

        print(f"🧵 Request ID: {request_id} → {request.url.path}")

        return response

app.add_middleware(RequestIDMiddleware)
```

---

# 🚀 5. **Rate Limiting Middleware (IP-based)**

Simple production-style rate limiting.

### ✔️ Features

* Limits requests per minute
* Uses an in-memory store (replace with Redis for real-scale)

### 👉 Code

```python
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.responses import JSONResponse
import time

rate_limit_store = {}

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, limit=60):  # 60 requests/min
        super().__init__(app)
        self.limit = limit

    async def dispatch(self, request, call_next):
        ip = request.client.host
        current_time = time.time()

        if ip not in rate_limit_store:
            rate_limit_store[ip] = []

        # Remove old timestamps (older than 60 sec)
        rate_limit_store[ip] = [
            t for t in rate_limit_store[ip] 
            if current_time - t < 60
        ]

        if len(rate_limit_store[ip]) >= self.limit:
            return JSONResponse(
                status_code=429,
                content={"error": "Too Many Requests. Try later."}
            )

        rate_limit_store[ip].append(current_time)

        return await call_next(request)

app.add_middleware(RateLimitMiddleware)
```

---

# 🎉 ALL MIDDLEWARE TOGETHER (Order Matters)

You can add all like this:

```python
app.add_middleware(ErrorHandlerMiddleware)
app.add_middleware(RequestIDMiddleware)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(JWTAuthMiddleware)
app.add_middleware(RedisCacheMiddleware)
```

🔹 Top middleware runs first
🔹 Bottom runs last
🔹 After request, order reverses
