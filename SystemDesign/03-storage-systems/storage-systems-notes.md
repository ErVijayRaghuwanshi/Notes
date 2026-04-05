# 💾 Storage Systems - System Design Notes

---

## 1. Introduction

Storage design is about choosing the right durability, access pattern, and cost profile for each kind of data. Interviews often test whether you can separate transactional data, user uploads, logs, backups, and analytics storage instead of forcing everything into one database.

### Why it matters
- Storage type drives cost, latency, and operational burden.
- Durability and retention requirements differ by workload.
- A good design keeps hot, warm, and cold data in the right layer.

---

## 2. Core Concepts

- **Block storage**: Raw disk volumes attached to compute.
- **File storage**: Shared hierarchical filesystem.
- **Object storage**: Durable blobs accessed via key-based APIs.
- **Durability**: Probability data is not lost.
- **Availability**: Probability data can be accessed now.
- **Backup**: Point-in-time copy for recovery.
- **Archive**: Low-cost long-retention storage.
- **CDN**: Edge cache for static content close to users.

---

## 3. Storage Landscape

```text
Hot path:
App --> DB / Cache --> Search

User generated content:
App --> Object Storage --> CDN

Operations:
DB --> Backup Storage --> Archive
Logs --> Stream --> Data Lake / Cold Storage
```

---

## 4. Comparison Tables and Trade-offs

| Storage Type | Best For | Benefits | Trade-offs |
|--------------|----------|----------|-----------|
| Block | Databases, VM disks | Low latency, predictable | Attached lifecycle, less shareable |
| File | Shared media, legacy apps | Familiar hierarchy | Weaker global scale |
| Object | Media, backups, logs | Cheap, durable, elastic | Higher latency, no in-place update |

| Data Tier | Example | Goal |
|-----------|---------|------|
| Hot | Active rows, recent sessions | Fast reads/writes |
| Warm | Recent analytics, recent files | Balanced cost and speed |
| Cold | Archives, compliance backups | Lowest cost |

---

## 5. Practical Examples

### Media upload flow
```text
1. Client requests pre-signed upload URL
2. Client uploads directly to object storage
3. Event triggers thumbnail generation
4. Metadata stored in relational DB
5. CDN serves final asset globally
```

### Backup policy
```text
RPO: 15 minutes
RTO: 2 hours
Daily snapshot retention: 7 days
Weekly backup retention: 8 weeks
Monthly archive retention: 12 months
```

### Storage class policy
```text
< 30 days old      -> standard object storage
30-180 days old    -> infrequent access
> 180 days old     -> archive tier
```

---

## 6. Cheat Sheet

- Use object storage for uploads, backups, and logs.
- Use block storage for low-latency databases.
- Put CDN in front of large static assets.
- Separate metadata from large binary content.
- Always define backup frequency, restore time, and retention.
- Mention lifecycle policies for storage cost control.

---

## 7. Hands-on Design Drills

1. Design photo storage for a social app with global reads.
2. Design backup and restore for an orders database.
3. Move old log data to cheaper storage without losing searchability.

---

## 8. Real-world Scenarios and Failure Modes

- **Hot media bucket becomes expensive**: Add lifecycle rules and CDN caching.
- **Accidental data deletion**: Versioning, soft delete, backups, recovery drills.
- **Large file uploads overload app servers**: Use direct-to-object-storage uploads.
- **Shared file storage becomes bottleneck**: Move immutable assets to object storage.

---

## 9. Interview Q&A

**Q1: Block vs object storage?**  
Block is low-latency disk-like storage; object is API-based blob storage optimized for durability and scale.

**Q2: Why keep file metadata separate from file content?**  
Metadata needs transactional querying while blobs need cheap scalable storage.

**Q3: What is RPO?**  
Maximum acceptable data loss measured in time.

**Q4: What is RTO?**  
Maximum acceptable recovery time after an outage.

**Q5: Why use a CDN?**  
To reduce latency and origin load for static or cacheable content.

**Q6: What is object versioning?**  
Storing multiple versions of the same object key for recovery and audit.

**Q7: Why archive cold data?**  
It cuts storage cost while preserving compliance and recovery needs.

**Q8: When use file storage?**  
For shared hierarchical filesystem access, especially with legacy apps.

**Q9: What is a pre-signed URL?**  
A time-limited authorized URL that lets a client upload or download directly.

**Q10: Why test restore procedures?**  
Backups are only useful if recovery is reliable and timely.
