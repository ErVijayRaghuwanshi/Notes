# 🔎 Design Search Autocomplete

---

## Problem Statement and Assumptions

Design autocomplete that returns likely query completions as the user types.

Assume:
- Queries arrive globally with strong prefix locality
- Suggestions should feel realtime
- Trending terms change throughout the day

## Requirements

### Functional
- Return top suggestions by prefix
- Include popularity and freshness
- Support typo tolerance optionally

### Non-functional
- Low latency, often under 100 ms
- High read throughput
- Frequent index refresh

## Back-of-the-Envelope Estimates

```text
10 million search sessions/day
Average 6 keystrokes/query
Autocomplete QPS can exceed final search QPS by 5-10x
```

## High-level Architecture

```text
Client -> Edge -> Autocomplete API -> Prefix Index / Trie
                                 |
                                 +--> Popularity signals
                                 +--> Trending updates stream
```

## Data Model and APIs

```http
GET /v1/autocomplete?q=appl&limit=10
```

```text
prefix_index(prefix, suggestion, score, language, updated_at)
```

## Bottlenecks and Deep Dives

- Trie is intuitive for prefix lookup, but search indexes can support ranking and typo tolerance better.
- Caching top prefixes dramatically reduces backend load.
- Regionalization matters because popular queries differ by geography and language.

## Scaling, Failure Handling and Trade-offs

- Precompute top suggestions for common prefixes.
- Use edge caching for top terms.
- If freshness pipeline lags, continue serving slightly stale suggestions.
- Typo tolerance improves UX but raises query complexity and cost.

## Interview Summary

A strong answer covers high read QPS, prefix-friendly indexes, ranking signals, caching, and tolerance for slightly stale trending data.
