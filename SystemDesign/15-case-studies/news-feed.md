# 📰 Design News Feed

---

## Problem Statement and Assumptions

Design a personalized news feed for a social network showing posts from followed users, ordered by recency and relevance.

Assume:
- 20 million DAU
- Users follow hundreds of accounts on average
- Read traffic is high, but celebrity accounts create extreme fanout

## Requirements

### Functional
- Users create posts
- Users follow others
- Home timeline shows relevant recent posts
- Support likes and comments counts

### Non-functional
- Fast feed reads
- Eventual consistency is acceptable
- High write fanout tolerance

## Back-of-the-Envelope Estimates

```text
20 million DAU
10 sessions/day -> 200 million feed reads/day
~2,300 average feed RPS, much higher at peak
Post fanout can be billions of feed-entry writes/day
```

## High-level Architecture

```text
Post Service -> Fanout Service -> Home Timeline Store
       |             |                 |
       |             +--> Queue ------> Workers
       |
       +--> Object Storage for media

Feed API -> Cache -> Timeline Store -> Ranking Service
```

## Data Model and APIs

```text
posts(post_id, author_id, content, created_at)
follows(user_id, followee_id)
home_feed(user_id, post_id, score, created_at)
```

```http
POST /v1/posts
GET /v1/feed?cursor=...
POST /v1/users/{id}/follow
```

## Bottlenecks and Deep Dives

- **Fanout-on-write** is fast for reads but expensive for celebrities.
- **Fanout-on-read** reduces write work but makes reads heavier.
- **Hybrid model**: regular users fan out on write; celebrity accounts fan out on read.
- **Ranking** can run async and update scores out of band.

## Scaling, Failure Handling and Trade-offs

- Cache first page of home feed aggressively.
- Use append-friendly timeline storage.
- If ranking is degraded, fall back to reverse chronological order.
- Keep counts eventually consistent through async updates.

## Interview Summary

Explain the read/write trade-off clearly: hybrid fanout, cached first page, async ranking, and eventual consistency for engagement counters.
