# 🔔 Design Notification System

---

## Problem Statement and Assumptions

Design a central service that sends email, SMS, push, and in-app notifications triggered by product events.

Assume:
- Multiple producers across the company
- Users can configure preferences
- Delivery provider failures are common

## Requirements

### Functional
- Receive events from upstream services
- Apply user preferences and channel rules
- Send via multiple providers
- Track delivery status

### Non-functional
- High throughput
- Retry safety
- Provider failover

## Back-of-the-Envelope Estimates

```text
50 million notifications/day
Bursts during campaigns and product launches
Need async buffering and provider throttling
```

## High-level Architecture

```text
Event Producers -> Notification API / Event Bus
                               |
                               +--> Preference Service
                               +--> Routing Rules
                               +--> Queue
                               +--> Channel Workers -> Email/SMS/Push providers
```

## Data Model and APIs

```text
preferences(user_id, email_enabled, sms_enabled, push_enabled)
notifications(id, user_id, channel, template_id, status, created_at)
delivery_attempts(notification_id, provider, status, attempt_no)
```

```http
POST /v1/notifications
GET /v1/notifications/{id}
PUT /v1/preferences/{user_id}
```

## Bottlenecks and Deep Dives

- Template rendering should happen before provider submission.
- Rate limits vary by provider, so isolate worker pools.
- Dedup keys prevent duplicate sends on retries.
- Campaign notifications may need scheduled batch fanout.

## Scaling, Failure Handling and Trade-offs

- Queue all outbound work; never depend on synchronous provider calls in user flows.
- Retry transient failures with backoff and DLQ handling.
- If one channel fails, fall back according to policy.
- Provider abstraction adds portability but can hide channel-specific features.

## Interview Summary

Describe a rules-driven async platform with preferences, per-channel workers, retry safety, provider failover, and strong delivery observability.
