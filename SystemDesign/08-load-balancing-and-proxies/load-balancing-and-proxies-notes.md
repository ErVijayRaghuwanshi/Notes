# ⚖️ Load Balancing and Proxies - System Design Notes

---

## 1. Introduction

Load balancers and proxies sit on the hot path for almost every production system. Interviews often use them as a checkpoint for how traffic enters the system, how failures are isolated, and how rollout strategies work.

### Why it matters
- Distributes traffic across healthy instances.
- Enables zero-downtime deployments and regional failover.
- Supports TLS termination, traffic shaping, and DDoS protection.

---

## 2. Core Concepts

- **L4 load balancer**: Routes based on IP and port.
- **L7 load balancer**: Routes using application data like host or path.
- **Reverse proxy**: Accepts client traffic and forwards it to backends.
- **Health check**: Periodic signal that decides whether a target can receive traffic.
- **Sticky session**: Session affinity to the same backend.
- **Canary release**: Small traffic slice to a new version.
- **Blue-green deployment**: Switch traffic between old and new environments.

---

## 3. Traffic Flow

```text
Clients
  |
Global DNS / Geo routing
  |
Regional Load Balancer
  |
Reverse Proxy / Ingress
  |-- /api  -> api-service
  |-- /img  -> image-service
  |-- /chat -> websocket-service
  |
Healthy backend pool
```

---

## 4. Comparison Tables and Trade-offs

| Type | Best For | Benefits | Trade-offs |
|------|----------|----------|-----------|
| L4 LB | Raw TCP/UDP, high throughput | Fast and simple | Less application awareness |
| L7 LB | HTTP routing, auth, canary | Smart routing and observability | More processing overhead |

| Strategy | Benefit | Risk |
|----------|---------|------|
| Round robin | Simple distribution | Ignores node capacity |
| Least connections | Better for variable requests | More state tracking |
| Weighted routing | Canary and heterogeneous capacity | Misconfiguration risk |
| Sticky sessions | Session affinity | Uneven load and poor failover |

---

## 5. Practical Examples

### Health check policy
```text
GET /healthz
interval: 10s
timeout: 2s
unhealthy after: 3 failures
healthy after: 2 passes
```

### Canary rollout
```text
v1 -> 95% traffic
v2 -> 5% traffic
Watch error rate, p95 latency, saturation
Promote gradually to 25%, 50%, 100%
```

### Proxy responsibilities
```text
- TLS termination
- Compression
- Header normalization
- Request logging
- Basic bot / abuse filtering
```

---

## 6. Cheat Sheet

- Use L4 for simple, high-throughput transport routing.
- Use L7 when you need host/path/header-aware decisions.
- Always describe health checks and failure removal.
- Mention weighted routing for canaries.
- Avoid sticky sessions unless required.
- Global routing plus regional balancing is a common pattern.

---

## 7. Hands-on Design Drills

1. Route traffic between two API versions safely.
2. Design multi-region entry for a global read-heavy app.
3. Explain how to balance long-lived WebSocket connections.

---

## 8. Real-world Scenarios and Failure Modes

- **One instance is slow, not dead**: Use latency-aware or active health checks.
- **Sticky sessions overload a few nodes**: Externalize session state.
- **Canary has silent latency regression**: Watch latency and saturation, not just error rate.
- **Regional failure**: Shift traffic with DNS or global load balancing.

---

## 9. Interview Q&A

**Q1: L4 vs L7 load balancing?**  
L4 routes by transport metadata; L7 routes by application content like URL or headers.

**Q2: Why are health checks important?**  
They keep broken or degraded instances out of the serving pool.

**Q3: What is a reverse proxy?**  
A frontend server that forwards requests to backend services.

**Q4: What is sticky session?**  
Routing a user repeatedly to the same backend instance.

**Q5: Why use weighted routing?**  
To control traffic percentages during canaries or mixed-capacity fleets.

**Q6: Blue-green vs canary?**  
Blue-green swaps whole environments; canary gradually shifts a traffic slice.

**Q7: Why terminate TLS at the proxy?**  
It centralizes certificate handling and reduces backend complexity.

**Q8: When is L4 better than L7?**  
When you need simpler, lower-overhead routing for transport traffic.

**Q9: What is active-active regional routing?**  
Serving traffic from multiple regions simultaneously.

**Q10: Why avoid sticky sessions when possible?**  
They hurt elasticity and make failover harder.
