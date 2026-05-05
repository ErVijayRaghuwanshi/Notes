# 🎥 Design Video Streaming Platform

---

## Problem Statement and Assumptions

Design a platform like YouTube or an internal video service for upload, transcoding, storage, and adaptive streaming.

Assume:
- Uploads are large and bursty
- Playback traffic dwarfs upload traffic
- Multiple output resolutions are required

## Requirements

### Functional
- Upload videos
- Transcode into multiple bitrates
- Stream adaptively to many devices
- Track views and engagement

### Non-functional
- High durability
- Global low-latency playback
- Efficient bandwidth usage

## Back-of-the-Envelope Estimates

```text
1 million uploads/day
Average upload size 500 MB
= 500 TB/day ingress before transcoding
Playback egress is often far larger than ingest
```

## High-level Architecture

```text
Uploader -> Upload Service -> Object Storage
                         |
                         +--> Transcoding Queue -> Worker Farm
                                         |
                                         +--> Renditions + manifests

Viewer -> CDN -> Streaming API / manifests -> video segments
```

## Data Model and APIs

```text
videos(video_id, owner_id, status, created_at, duration)
renditions(video_id, bitrate, resolution, manifest_key, segment_prefix)
views(video_id, user_id, watch_time, created_at)
```

```http
POST /v1/videos/upload-url
GET /v1/videos/{id}/manifest
POST /v1/videos/{id}/view-events
```

## Bottlenecks and Deep Dives

- Transcoding is CPU-heavy and must run asynchronously.
- HLS/DASH manifests plus segmented files support adaptive bitrate.
- CDN is essential because playback bandwidth dominates cost.
- Moderation and copyright checks may delay publishing.

## Scaling, Failure Handling and Trade-offs

- Prioritize popular videos for aggressive cache warming.
- Keep original upload plus compressed renditions.
- If one transcoding profile fails, serve available profiles while retrying the missing one.
- DRM can be layered later but affects key delivery and playback flow.

## Interview Summary

Focus on async ingest, durable source storage, transcoding pipeline, adaptive delivery via CDN, and the huge cost difference between upload and playback traffic.
