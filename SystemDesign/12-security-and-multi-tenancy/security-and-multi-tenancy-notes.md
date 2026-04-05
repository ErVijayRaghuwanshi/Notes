# 🔐 Security and Multi-Tenancy - System Design Notes

---

## 1. Introduction

Security is part of system design, not a final checklist item. Interviewers look for safe defaults around identity, secrets, data protection, abuse prevention, and tenant isolation.

### Why it matters
- Security failures are trust failures.
- Multi-tenant systems can fail through noisy neighbors or data leaks.
- A simple mention of auth is not enough; boundaries and isolation matter.

---

## 2. Core Concepts

- **Authentication**: Verifying identity.
- **Authorization**: Deciding what an identity can do.
- **Encryption in transit**: Protecting network traffic, typically with TLS.
- **Encryption at rest**: Protecting stored data.
- **Least privilege**: Grant the minimum permissions needed.
- **Tenant isolation**: Prevent one customer from seeing or affecting another.
- **Secret management**: Secure storage and rotation of credentials.
- **Rate limiting**: Abuse and bot protection at the API boundary.

---

## 3. Security Boundary Sketch

```text
Client
  |
WAF / CDN / Gateway
  |-- TLS termination
  |-- Auth token validation
  |-- Rate limiting
  |
App Services
  |-- RBAC / ABAC checks
  |-- Tenant scoping
  |
Encrypted DB / Object Storage / Audit Logs
```

---

## 4. Comparison Tables and Trade-offs

| Isolation Model | Best For | Benefits | Trade-offs |
|-----------------|----------|----------|-----------|
| Shared DB, shared schema | Small tenants, low cost | Simple operations | Strong app-layer isolation required |
| Shared DB, separate schema | Medium isolation | Easier per-tenant separation | More schema management overhead |
| Separate DB per tenant | High-value enterprise | Strong isolation | Highest operational cost |

| Security Control | Benefit | Risk if Missing |
|------------------|---------|-----------------|
| TLS everywhere | Protects traffic | Credential/session leakage |
| Short-lived tokens | Limits blast radius | Long token misuse |
| Secret rotation | Reduces credential exposure window | Persistent compromise |
| Audit logs | Forensics and compliance | Low visibility into misuse |

---

## 5. Practical Examples

### Authorization flow
```text
1. Validate JWT / session
2. Load tenant context
3. Enforce RBAC or ABAC policy
4. Apply row/filter scoping
5. Log sensitive access
```

### Tenant keying
```text
tenant_id + resource_id
Examples:
- invoice:tenant_21:inv_9001
- cache:tenant_21:dashboard
```

### Security checklist
```text
- TLS in transit
- encryption at rest
- secret manager, not plain env files in git
- audit logging
- rate limits and abuse detection
```

---

## 6. Cheat Sheet

- AuthN and AuthZ are different; say both.
- Tenant isolation belongs in API, data, and observability layers.
- Use least privilege for services and operators.
- Rotate secrets and prefer managed secret stores.
- Log sensitive access, config changes, and privileged actions.
- Rate limiting is a security and reliability control.

---

## 7. Hands-on Design Drills

1. Design a multi-tenant SaaS billing platform.
2. Prevent data leakage across tenants in search results.
3. Secure file uploads for an enterprise document portal.

---

## 8. Real-world Scenarios and Failure Modes

- **Tenant data leak via cache key bug**: Prefix cache keys and tests for tenant scope.
- **Stolen API token**: Short TTL, rotation, anomaly detection, revoke path.
- **One tenant overloads shared DB**: Quotas, workload isolation, or separate tenancy tier.
- **Sensitive fields exposed in logs**: Redaction and secure audit pipelines.

---

## 9. Interview Q&A

**Q1: Authentication vs authorization?**  
Authentication proves identity; authorization determines allowed actions.

**Q2: Why enforce tenant isolation in multiple layers?**  
Defense in depth reduces the chance of one bug exposing cross-tenant data.

**Q3: When choose separate DB per tenant?**  
For strong enterprise isolation, compliance, or custom backup/restore needs.

**Q4: Why is TLS important internally too?**  
Internal traffic can still be intercepted or misrouted in distributed environments.

**Q5: What is least privilege?**  
Granting only the minimum required permissions.

**Q6: Why rotate secrets?**  
To reduce the time window of compromise.

**Q7: What are audit logs for?**  
Tracing sensitive actions for investigations and compliance.

**Q8: How does rate limiting improve security?**  
It reduces brute force, scraping, and abusive traffic.

**Q9: What is row-level tenant isolation?**  
Restricting data access so each query only returns rows for the requesting tenant.

**Q10: Why avoid storing secrets in code or git?**  
They are hard to rotate and easy to leak permanently.
