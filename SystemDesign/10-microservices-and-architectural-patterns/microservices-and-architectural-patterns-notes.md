# 🧩 Microservices and Architectural Patterns - System Design Notes

---

## 1. Introduction

Architecture patterns describe how teams organize code, data, and change over time. Strong interview answers do not default to microservices; they choose the simplest structure that satisfies scale, reliability, and team autonomy.

### Why it matters
- Architecture impacts deployment speed, ownership, and failure blast radius.
- Interviewers look for trade-offs, not pattern name-dropping.
- Patterns like CQRS and saga help justify complex workflows.

---

## 2. Core Concepts

- **Monolith**: One deployable unit containing many domains.
- **Microservices**: Independently deployable services with bounded responsibility.
- **Service discovery**: Mechanism to find current service instances.
- **CQRS**: Separate command and query models.
- **Event-driven architecture**: Systems react to published events.
- **Saga**: Multi-step distributed workflow with compensating actions.
- **Strangler pattern**: Incrementally replacing a legacy monolith.

---

## 3. Architecture Sketch

```text
Clients
  |
API Gateway
  |
+--------------------+
| Core Services      |
| user | order | pay |
+--------------------+
  |         |
  |         +--> Event Bus --> notification / analytics
  |
  +--> Shared platform capabilities:
      auth, config, observability, service discovery
```

---

## 4. Comparison Tables and Trade-offs

| Approach | Best For | Benefits | Trade-offs |
|----------|----------|----------|-----------|
| Monolith | Early product, small teams | Simple deploy/debug | Large blast radius as complexity grows |
| Modular monolith | Growing product with one team | Good boundaries, simpler ops | Less independent scaling |
| Microservices | Large domains, many teams | Team autonomy, isolated scaling | Network, data, and observability complexity |

| Pattern | Use When | Cost |
|---------|----------|------|
| CQRS | Reads and writes differ greatly | More moving parts |
| Saga | Distributed transactions are impractical | Compensation logic is complex |
| Event-driven | Loose coupling and fan-out matter | Harder debugging and consistency |
| Strangler | Legacy migration | Long transition period |

---

## 5. Practical Examples

### Bounded context split
```text
Order service       -> order lifecycle and status
Payment service     -> authorization, capture, refund
Inventory service   -> stock reservation
Notification service-> email, SMS, push
```

### Saga sketch
```text
1. Create order
2. Reserve inventory
3. Authorize payment
4. Confirm order
If payment fails -> release inventory, cancel order
```

### CQRS example
```text
Write model: create/edit products in relational DB
Read model: denormalized catalog view in search index
```

---

## 6. Cheat Sheet

- Do not start with microservices unless team and domain complexity justify it.
- Modular monolith is a strong interview answer for many products.
- Each service should own its data and core business logic.
- Use events for decoupling, not for hiding unclear ownership.
- Sagas replace distributed transactions with compensation.
- Talk about observability, deployment, and debugging costs.

---

## 7. Hands-on Design Drills

1. Split a marketplace backend into bounded contexts.
2. Design a saga for hotel booking and payment.
3. Migrate a legacy monolith to services using the strangler pattern.

---

## 8. Real-world Scenarios and Failure Modes

- **Too many small services**: Operational overhead outweighs scaling benefits.
- **Shared database across services**: Tight coupling and blocked team autonomy.
- **Event-driven flow hides failures**: Add tracing, DLQ handling, and replay tools.
- **Service boundaries are wrong**: Frequent cross-service joins and chatty APIs emerge.

---

## 9. Interview Q&A

**Q1: Monolith vs microservices?**  
Monoliths are simpler to build and run; microservices help when domains and teams need independent scaling and deployment.

**Q2: What is a modular monolith?**  
A monolith with strong internal domain boundaries and explicit interfaces.

**Q3: Why avoid shared databases between services?**  
They create hidden coupling and unclear ownership.

**Q4: What is CQRS?**  
Separating write and read models to optimize each independently.

**Q5: What is a saga?**  
A multi-step workflow using local transactions plus compensating actions.

**Q6: Why use event-driven architecture?**  
To decouple producers and consumers and support fan-out workflows.

**Q7: What is the strangler pattern?**  
Gradually routing functionality from a legacy system to new services.

**Q8: When is a monolith the right answer?**  
For smaller teams, evolving products, and when operational simplicity matters.

**Q9: What makes a good service boundary?**  
Clear ownership, limited cross-service chatter, and aligned business capability.

**Q10: What is the main downside of microservices?**  
They trade code-level complexity for distributed systems complexity.
