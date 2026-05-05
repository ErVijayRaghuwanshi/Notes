# 🌐 Networking and Communication - System Design Notes

---

## 1. Introduction

Distributed systems are only as reliable as the network connecting them. Interviewers expect you to understand how requests move across clients, proxies, services, and data stores, and what happens when the network is slow or unreliable.

### Why it matters
- Shapes API choice, timeout strategy, and retry behavior.
- Explains partial failures in otherwise healthy systems.
- Helps justify load balancers, reverse proxies, and service meshes.

---

## 2. Core Concepts

- **DNS**: Maps domain names to IP addresses.
- **TCP**: Reliable, ordered byte stream.
- **UDP**: Lightweight, connectionless transport.
- **HTTP/HTTPS**: Request-response protocol for web APIs.
- **gRPC**: Contract-first RPC over HTTP/2 using Protocol Buffers.
- **WebSocket**: Full-duplex persistent connection.
- **Timeout**: Upper bound on waiting for a dependency.
- **Retry**: Second attempt after transient failure.
- **Idempotency**: Repeating a request does not create duplicate side effects.

---

## 3. Communication Flow

```text
Client
  |
  +--> DNS lookup
  |
  +--> CDN / Edge
  |
  +--> Reverse Proxy / API Gateway
  |
  +--> Service A --(HTTP/gRPC)--> Service B
  |                     |
  |                     +--> Cache
  |                     +--> DB
  |
  +--> WebSocket / Push channel for realtime updates
```

---

## 4. Comparison Tables and Trade-offs

| Protocol | Best For | Benefits | Trade-offs |
|---------|----------|----------|-----------|
| HTTP/1.1 | Public APIs | Simple and universal | More connection overhead |
| HTTP/2 | Internal APIs, browsers | Multiplexing, header compression | Harder debugging |
| gRPC | Service-to-service | Strong contracts, efficient binary format | Less browser-native |
| WebSocket | Chat, live dashboards | Realtime bi-directional flow | Connection management complexity |
| Polling | Simple periodic updates | Easy to implement | Wasteful under scale |

| Strategy | Use When | Risk |
|----------|----------|------|
| Retry with backoff | Transient failures | Retry storms without limits |
| Circuit breaker | Dependency is flapping | Temporary rejection of recoverable traffic |
| Hedged requests | Tail latency matters | Higher load on dependencies |
| Sticky sessions | Connection affinity needed | Uneven load and failover difficulty |

---

## 5. Practical Examples

### Timeout budget
```text
Client SLA: 800 ms
Gateway budget: 50 ms
Service A budget: 200 ms
Service B budget: 150 ms
DB budget: 100 ms
Remaining time kept for retries and network variance
```

### Idempotent payment request
```http
POST /payments
Idempotency-Key: 8f34-72ba-1ab1
```

Server stores the key with final outcome so client retries do not charge twice.

### Retry policy
```text
max retries: 2
backoff: 100 ms, 300 ms
jitter: random 0-50 ms
retry on: 429, 502, 503, 504
do not retry on: 400, 401, 403
```

---

## 6. Cheat Sheet

- Use timeouts everywhere.
- Retries need backoff, jitter, and idempotency.
- Prefer gRPC for high-volume internal contracts.
- Prefer WebSockets only when true realtime is needed.
- DNS, proxies, and TLS termination are part of the design.
- Network calls can fail partially even when both services are healthy.

---

## 7. Hands-on Design Drills

1. Design a notification delivery path for mobile and web clients.
2. Compare polling vs WebSocket for a live stock dashboard.
3. Add retry safety to a payment creation API.

---

## 8. Real-world Scenarios and Failure Modes

- **DNS outage**: Use low-risk failover plans, TTL awareness, and regional redundancy.
- **Retry storm**: Add exponential backoff, jitter, rate limiting, and circuit breakers.
- **Chat service over mobile networks**: Use persistent connection fallback and offline sync.
- **Cross-region latency spike**: Route traffic regionally and keep data close to users.

---

## 9. Interview Q&A

**Q1: TCP vs UDP?**  
TCP guarantees ordered delivery; UDP is faster but offers no delivery guarantee.

**Q2: When choose gRPC over REST?**  
For strongly typed, high-throughput internal service communication.

**Q3: Why is idempotency important?**  
It makes retries safe for write operations.

**Q4: Polling vs WebSocket?**  
Polling is simpler; WebSocket is better for frequent low-latency updates.

**Q5: What is a reverse proxy?**  
A server in front of backend services handling routing, TLS, caching, and protection.

**Q6: Why add jitter to retries?**  
It prevents synchronized retry bursts.

**Q7: What is connection pooling?**  
Reusing existing connections to reduce setup overhead.

**Q8: What is head-of-line blocking?**  
One slow operation delays others sharing the same path or queue.

**Q9: Why set timeouts per dependency?**  
So one slow downstream does not consume the entire end-to-end SLA.

**Q10: When use sticky sessions?**  
Only when session affinity is required and externalizing state is not practical.
