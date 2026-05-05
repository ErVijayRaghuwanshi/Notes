# 🚕 Design Ride-Hailing System

---

## Problem Statement and Assumptions

Design a platform like Uber for rider requests, driver matching, realtime location updates, and trip lifecycle management.

Assume:
- Large metro areas create dense realtime traffic
- Matching latency strongly affects user experience
- Location updates are frequent and ephemeral

## Requirements

### Functional
- Rider requests a trip
- Nearby drivers are found and offered the trip
- Realtime driver location tracking
- Trip state, pricing, and payment integration

### Non-functional
- Low matching latency
- High availability
- Geo-aware scaling

## Back-of-the-Envelope Estimates

```text
1 million trips/day
10 location updates/minute/driver
Geo update traffic can exceed trip-creation traffic by orders of magnitude
```

## High-level Architecture

```text
Rider App ----> Dispatch API ----> Matching Service ----> Driver candidates
Driver App ---> Location Gateway -> Geo Index / Presence Store
                         |
                         +--> Trip Service -> Payment / Notification
```

## Data Model and APIs

```text
drivers(driver_id, status, current_cell, rating)
rides(ride_id, rider_id, driver_id, status, pickup, dropoff, created_at)
location_updates(driver_id, lat, lon, ts)
```

```http
POST /v1/rides
GET /v1/rides/{id}
POST /v1/drivers/{id}/location
```

## Bottlenecks and Deep Dives

- Use geo cells or spatial indexes to find nearby drivers quickly.
- Location updates are ephemeral and fit in fast in-memory stores.
- Matching may consider ETA, surge zone, driver rating, and acceptance behavior.
- Exactly-once trip state transitions matter more than exact delivery of every GPS point.

## Scaling, Failure Handling and Trade-offs

- Partition by city or region for data locality.
- If realtime path lags, fall back to the most recent known driver position.
- Surge pricing and dynamic matching improve utilization but add fairness concerns.
- Payment and trip state need stronger consistency than live map dots.

## Interview Summary

A strong design separates high-rate ephemeral location traffic from durable trip state, uses geo indexing for dispatch, and prioritizes fast matching with consistent trip transitions.
