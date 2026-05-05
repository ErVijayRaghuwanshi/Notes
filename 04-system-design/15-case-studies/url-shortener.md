# 🔗 Design URL Shortener

---

## Problem Statement and Assumptions

Design a service like bit.ly that turns long URLs into short aliases and redirects users quickly and reliably.

Assume:
- 100 million new short URLs per month
- Redirect traffic is 100x larger than create traffic
- Custom aliases are supported for paid users

## Requirements

### Functional
- Create short URL for a long URL
- Redirect short URL to original URL
- Optional expiration time and custom alias
- Basic click analytics

### Non-functional
- Very low redirect latency
- High availability
- Global reach
- No duplicate key collisions

## Back-of-the-Envelope Estimates

```text
100 million URLs/month ~= 3.3 million/day ~= 38 writes/sec average
Redirects 100x writes -> ~3,800 reads/sec average
At 10x peak -> ~38k redirect RPS peak
```

## High-level Architecture

```text
Client -> DNS/CDN -> Redirect Service -> Cache -> URL DB
                               |
                               +--> Analytics Queue -> Batch Store
Create API -> App -> Key Generator -> URL DB
```

## Data Model and APIs

```text
short_urls(
  short_code PK,
  long_url,
  user_id,
  created_at,
  expires_at,
  custom_alias_flag
)
```

```http
POST /v1/short-urls
GET /{short_code}
GET /v1/short-urls/{short_code}/analytics
```

## Bottlenecks and Deep Dives

- **Key generation**: Base62 encoded counter, Snowflake-style ID, or random code with collision check.
- **Redirect latency**: Put hot mappings in cache and use CDN edge redirects where possible.
- **Abuse control**: Validate malicious URLs and rate limit creation.
- **Analytics scale**: Send click events asynchronously to avoid slowing redirects.

## Scaling, Failure Handling and Trade-offs

- Cache popular short codes aggressively.
- Use DB replication for reads and durable primary for writes.
- If analytics pipeline is down, continue redirects and buffer events.
- Random short codes are harder to enumerate but add collision handling.

## Interview Summary

Lead with read-heavy design, cache-first redirects, durable mapping storage, async analytics, and a collision-safe short code strategy.
