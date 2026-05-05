# 🧠 Scenario-Based System Design Questions

Use these to practice deep-dive follow-ups after the initial architecture.

---

**Q1: Your cache hit rate drops from 92% to 40% after a deployment. What do you inspect first?**  
Check TTL changes, key format regressions, cache invalidation logic, hot key distribution, and whether the new version changed serialization or namespace prefixes.

**Q2: Your read replicas are lagging and users do not see their recent updates. How do you respond?**  
Route read-after-write traffic to the primary, reduce replica pressure, inspect replication bandwidth, and evaluate whether some queries should move to cache or async read models.

**Q3: A celebrity user causes massive fanout load in a social feed system. What design change helps?**  
Switch that account or segment to fanout-on-read while keeping fanout-on-write for ordinary users.

**Q4: A downstream payment provider becomes slow but not fully unavailable. What should your service do?**  
Use short timeouts, bounded retries, circuit breakers, idempotency keys, and a clear user-facing fallback or retry state.

**Q5: Your queue backlog keeps growing after a product launch. What are the likely causes?**  
Producer traffic exceeded consumer capacity, one message type is expensive, retries are looping, or a poison message pattern is blocking progress.

**Q6: A multi-tenant SaaS customer reports seeing another tenant's data. Where do you look?**  
Check authorization rules, tenant scoping in queries, cache-key prefixes, search-index filtering, and any analytics or export paths bypassing tenant filters.

**Q7: The first page of your homepage is fast, but deeper pages are slow. What likely changed?**  
The hot path may be cached while deep pagination falls back to expensive DB scans, poor indexes, or cursor/offset inefficiencies.

**Q8: You need to roll out a risky new recommendation model safely. What traffic strategy do you use?**  
Canary or weighted rollout with metrics for latency, error rate, and business impact before full promotion.

**Q9: A region goes down in an active-active deployment. What should be true for recovery to feel smooth?**  
Global routing must shift traffic quickly, the surviving region needs spare capacity, and dependent data paths must tolerate the failover mode.

**Q10: Your autocomplete system returns stale trends for 20 minutes. Is that acceptable?**  
Usually yes if core correctness is unaffected; explain freshness goals, acceptable lag, and when stale results become a product problem.

**Q11: Users complain about duplicate notifications. What is the first design principle you revisit?**  
Idempotency and deduplication in the notification pipeline, especially around retries and provider callbacks.

**Q12: Your design depends on a strongly consistent global database, but latency is too high. What trade-off options do you discuss?**  
Regionalize data, relax consistency for non-critical reads, or split strongly consistent and eventually consistent workloads by domain.
