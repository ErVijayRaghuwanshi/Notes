# ⚡ Caching - System Design Notes

---

## 1. Introduction

Caching reduces latency, protects databases, and makes popular reads cheap. It also introduces staleness, invalidation complexity, and consistency questions, so a strong interview answer covers both speed and correctness.

### Why it matters
- Most read-heavy systems need caching long before they need database sharding.
- Hot keys and stale data are common production failure points.
- Multiple cache layers often work together: browser, CDN, application, and data cache.

---

## 2. Core Concepts

- **Cache hit**: Requested data found in cache.
- **Cache miss**: Data must be fetched from origin.
- **TTL**: Time-to-live before an entry expires.
- **Eviction policy**: Rule for removing entries.
- **Hot key**: One key receiving disproportionate traffic.
- **Write-through**: Cache updated together with database write.
- **Write-behind**: Cache accepts write before async persistence.
- **Cache-aside**: Application reads DB on miss and populates cache.

---

## 3. Multi-layer Cache View

```text
Browser Cache
    |
CDN / Edge Cache
    |
API Gateway
    |
Application Cache (Redis / Memcached)
    |
Database / Search / Object Storage
```

---

## 4. Comparison Tables and Trade-offs

| Pattern | Best For | Benefits | Trade-offs |
|---------|----------|----------|-----------|
| Cache-aside | Read-heavy services | Simple and common | Miss penalty on first read |
| Write-through | Stronger consistency for cached reads | Fresh cache entries | Higher write latency |
| Write-behind | High write throughput | Fast writes | Data loss or inconsistency risk |
| Refresh-ahead | Predictable hot reads | Lower miss rate | Background refresh cost |

| Policy | Behavior | Good For |
|--------|----------|----------|
| LRU | Evict least recently used | General-purpose workloads |
| LFU | Evict least frequently used | Stable hot-key patterns |
| TTL-only | Time-based expiration | Simple freshness control |

---

## 5. Practical Examples

### Cache-aside flow
```text
1. Read key from Redis
2. If hit -> return
3. If miss -> read DB
4. Store in cache with TTL
5. Return response
```

### Redis key design
```text
user:123:profile
feed:home:456:page:1
product:987:inventory
```

### Stampede protection
```text
- Add random TTL jitter
- Use single-flight lock per key
- Serve stale while revalidating
```

---

## 6. Cheat Sheet

- Cache data that is read often and changed relatively less.
- TTLs are freshness contracts, not random numbers.
- Add jitter to avoid synchronized expirations.
- Plan for cache warmup and cold starts.
- Protect against hot keys and cache stampedes.
- Never treat cache as the only source of truth unless explicitly designed that way.

---

## 7. Hands-on Design Drills

1. Add caching to a product detail service with 95% reads.
2. Design a homepage cache for a news website with breaking updates.
3. Prevent a cache stampede on a celebrity profile page.

---

## 8. Real-world Scenarios and Failure Modes

- **Cache outage**: Fall back to DB with rate limiting and degraded features.
- **Stale inventory data**: Short TTL, write-through updates, or per-item invalidation.
- **Hot key meltdown**: Replicate hot data, shard by suffix, or serve stale responses.
- **Cache stampede after TTL expiry**: Jitter, request coalescing, background refresh.

---

## 9. Interview Q&A

**Q1: What is cache-aside?**  
The app checks cache first, reads origin on miss, then populates cache.

**Q2: Why use TTL?**  
To control staleness and avoid keeping invalid data forever.

**Q3: What is cache invalidation?**  
Removing or updating stale entries when source data changes.

**Q4: What is a hot key?**  
A single cache entry receiving unusually high traffic.

**Q5: CDN vs Redis cache?**  
CDN caches edge-friendly content close to users; Redis usually caches application data inside the backend.

**Q6: What causes a cache stampede?**  
Many requests miss at once and all hit the origin simultaneously.

**Q7: When use write-through caching?**  
When you want cached reads to stay closely aligned with writes.

**Q8: Why add TTL jitter?**  
To avoid many keys expiring at the same second.

**Q9: When should you not cache?**  
Highly sensitive, rapidly changing, or rarely requested data may not benefit.

**Q10: What happens if cache becomes source of truth accidentally?**  
You risk inconsistency or data loss when cache entries expire or nodes restart.
