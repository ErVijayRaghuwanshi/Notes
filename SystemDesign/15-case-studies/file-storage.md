# 📁 Design File Storage

---

## Problem Statement and Assumptions

Design a Dropbox or Google Drive style file storage service with uploads, downloads, metadata, and sharing.

Assume:
- Large files and many small files both exist
- Users want durable storage and version history
- Downloads greatly exceed uploads

## Requirements

### Functional
- Upload and download files
- Store metadata and folder hierarchy
- Share files securely
- Maintain versions and deleted-file recovery

### Non-functional
- High durability
- Efficient large-file transfer
- Global download performance

## Back-of-the-Envelope Estimates

```text
5 million uploads/day
Average file size 10 MB
= 50 TB/day raw ingress
Downloads can be several times larger due to sharing
```

## High-level Architecture

```text
Client -> Metadata API -> DB
   |            |
   |            +--> Auth / sharing service
   |
   +--> Direct upload/download -> Object Storage -> CDN
                     |
                     +--> Malware scan / thumbnail / indexing
```

## Data Model and APIs

```text
files(file_id, owner_id, path, latest_version, size, mime_type)
file_versions(file_id, version_id, object_key, created_at)
shares(file_id, shared_with_user, permission)
```

```http
POST /v1/files/upload-url
GET /v1/files/{id}/download-url
POST /v1/files/{id}/share
```

## Bottlenecks and Deep Dives

- Use multipart uploads for large files.
- Keep metadata in relational storage and file bodies in object storage.
- Virus scanning and preview generation should be async.
- Access control checks must happen before issuing download URLs.

## Scaling, Failure Handling and Trade-offs

- CDN reduces repeated download cost and latency.
- Versioning enables recovery but increases storage cost.
- Direct upload avoids routing large binaries through app servers.
- Strong consistency for metadata matters more than instant consistency for derived previews.

## Interview Summary

Lead with metadata/body separation, direct object storage transfer, async post-processing, durable versioning, and permission-aware sharing.
