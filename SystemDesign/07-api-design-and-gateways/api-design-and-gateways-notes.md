# 🔌 API Design and Gateways - System Design Notes

---

## 1. Introduction

APIs are the contract between systems and teams. Great system design answers treat APIs as product interfaces with stability, versioning, and operational concerns, not just URLs.

### Why it matters
- Good contracts reduce coupling between services and clients.
- API mistakes create long-lived compatibility issues.
- Gateways enforce policy, auth, routing, and rate limits at scale.

---

## 2. Core Concepts

- **REST**: Resource-oriented HTTP APIs.
- **GraphQL**: Client-driven query shape for flexible reads.
- **gRPC**: RPC with schema-first contracts.
- **Idempotency**: Same request can be retried safely.
- **Pagination**: Controlled partial result retrieval.
- **Versioning**: Compatibility management across clients.
- **API Gateway**: Central entry point for routing and policy enforcement.
- **Rate limiting**: Controlling request volume to protect systems.

---

## 3. Request Path

```text
Client
  |
API Gateway
  |-- AuthN/AuthZ
  |-- Rate limiting
  |-- Request validation
  |-- Routing / Canary split
  |
Backend Services
  |
DB / Cache / Queue / External APIs
```

---

## 4. Comparison Tables and Trade-offs

| Style | Best For | Benefits | Trade-offs |
|-------|----------|----------|-----------|
| REST | Public APIs, CRUD | Familiar, cacheable, simple | Over/under-fetching possible |
| GraphQL | Aggregated read-heavy clients | Flexible payloads | Query complexity and caching harder |
| gRPC | Internal service calls | Strong typing, high efficiency | Less browser-friendly |

| Gateway Responsibility | Benefit | Risk |
|------------------------|---------|------|
| Auth and token validation | Centralized security | Extra gateway dependency |
| Rate limiting | Protects backend | Incorrect limits can block users |
| Request aggregation | Simpler clients | Gateway becomes heavy |
| Routing and canary | Safer releases | More config complexity |

---

## 5. Practical Examples

### REST endpoint
```http
GET /v1/users/123/orders?limit=20&cursor=eyJpZCI6...
```

### Create with idempotency
```http
POST /v1/payments
Idempotency-Key: 2048-4a1f-9d22
```

### Cursor-based pagination response
```json
{
  "items": [{"id": 101}, {"id": 99}],
  "next_cursor": "eyJpZCI6OTl9"
}
```

---

## 6. Cheat Sheet

- Design APIs around stable contracts and common access patterns.
- Prefer cursor pagination for large, changing datasets.
- Use idempotency for create/payment/order style endpoints.
- Put auth, rate limiting, and request validation close to the edge.
- Version deliberately; avoid breaking clients casually.
- Document error codes and retryable responses.

---

## 7. Hands-on Design Drills

1. Design order APIs for web and mobile checkout.
2. Add idempotent create semantics to a booking API.
3. Compare REST and GraphQL for a dashboard with many widgets.

---

## 8. Real-world Scenarios and Failure Modes

- **Large mobile payloads**: Add sparse fields, pagination, or GraphQL aggregation.
- **Duplicate order creation on retry**: Idempotency key and dedup store.
- **Gateway overload**: Keep business logic in services, not just the edge.
- **Breaking API change**: Versioning, compatibility window, and telemetry-driven migration.

---

## 9. Interview Q&A

**Q1: Offset vs cursor pagination?**  
Cursor pagination is more stable and efficient for large changing datasets.

**Q2: Why use an API gateway?**  
To centralize routing, auth, rate limiting, observability, and traffic policies.

**Q3: REST vs GraphQL?**  
REST is simpler and cache-friendly; GraphQL is flexible for complex read aggregation.

**Q4: What is idempotency in APIs?**  
Repeating the same request produces the same result without duplicate side effects.

**Q5: Why version APIs?**  
To evolve contracts without breaking old clients immediately.

**Q6: What belongs in the gateway?**  
Cross-cutting concerns, not heavy domain logic.

**Q7: Why use structured error responses?**  
They make clients easier to build and operate.

**Q8: When prefer gRPC?**  
For strongly typed internal service communication at scale.

**Q9: Why rate limit at the edge?**  
It protects backend capacity before expensive processing happens.

**Q10: What makes an API interview answer strong?**  
Clear contract shape, failure behavior, pagination, auth, and compatibility strategy.
