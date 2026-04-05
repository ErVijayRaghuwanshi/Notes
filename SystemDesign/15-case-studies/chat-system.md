# 💬 Design Chat System

---

## Problem Statement and Assumptions

Design one-to-one and group chat with realtime delivery, message history, and offline synchronization.

Assume:
- Millions of concurrent connections
- Mobile clients may disconnect frequently
- Per-conversation ordering matters

## Requirements

### Functional
- Send and receive messages
- Delivery and read status
- Group chat support
- Message history and offline sync

### Non-functional
- Low latency
- High fanout efficiency for groups
- Durable history

## Back-of-the-Envelope Estimates

```text
5 million concurrent users
20 messages/user/day -> 100 million messages/day
Peak is connection-heavy even when message rate is moderate
```

## High-level Architecture

```text
Clients <--> WebSocket Gateway <--> Chat Service
                               |        |
                               |        +--> Message Store
                               |        +--> Presence Store
                               |
                               +--> Queue -> Push notifications for offline users
```

## Data Model and APIs

```text
conversations(id, type, created_at)
conversation_members(conversation_id, user_id)
messages(conversation_id, message_id, sender_id, body, created_at)
```

```text
WebSocket events:
- send_message
- message_delivered
- message_read
- typing_started
```

## Bottlenecks and Deep Dives

- Use `conversation_id` as partition key to preserve ordering.
- Presence can live in fast ephemeral storage like Redis.
- Group chat fanout can be direct for small groups and queue-based for larger rooms.
- Offline sync needs cursors or last-seen sequence numbers.

## Scaling, Failure Handling and Trade-offs

- Sticky connections may be acceptable at the WebSocket layer.
- Persist messages before acknowledging delivery.
- If recipient is offline, queue push notifications and sync later.
- Read receipts can be eventual if scale is extreme.

## Interview Summary

Anchor on persistent connections, ordered per-conversation message flow, durable storage, ephemeral presence, and offline replay using sequence-based sync.
