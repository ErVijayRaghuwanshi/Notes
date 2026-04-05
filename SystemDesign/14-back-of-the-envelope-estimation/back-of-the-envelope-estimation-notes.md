# 🧮 Back-of-the-Envelope Estimation - System Design Notes

---

## 1. Introduction

Estimation is how you turn a vague design prompt into sizing assumptions and credible trade-offs. Interviewers usually care more about your reasoning than perfect arithmetic.

### Why it matters
- Helps justify storage, compute, and bandwidth choices.
- Forces clarity on read/write ratio, peaks, and retention.
- Prevents architecture decisions from floating without numbers.

---

## 2. Core Concepts

- **DAU/MAU**: Daily and monthly active users.
- **QPS/RPS**: Queries or requests per second.
- **Peak factor**: Multiplier from average to peak traffic.
- **Read/write ratio**: Relative volume of reads vs writes.
- **Retention**: How long data is stored.
- **Compression factor**: Size reduction after encoding or compression.
- **Headroom**: Extra capacity reserved beyond current need.

---

## 3. Estimation Flow

```text
Users -> requests/day -> average RPS -> peak RPS
     -> data per request -> bandwidth
     -> writes/day -> storage/day -> retention storage
     -> per-node capacity -> instance count
```

---

## 4. Comparison Tables and Trade-offs

| Assumption | Conservative | Aggressive |
|------------|-------------|-----------|
| Peak factor | 10x average | 3x average |
| Headroom | 30-50% | 10-15% |
| Cache hit rate | 60-70% | 85-95% |
| Compression | Minimal | Strong |

| Design Outcome | If Estimate Too Low | If Estimate Too High |
|----------------|---------------------|----------------------|
| Storage | Outages and emergency scaling | Overspend |
| Compute | Latency spikes | Idle resources |
| Queue throughput | Backlog growth | Unused capacity |

---

## 5. Practical Examples

### RPS estimate
```text
50 million requests/day
/ 86,400 seconds
= ~579 RPS average
At 8x peak -> ~4,632 RPS peak
```

### Storage estimate
```text
5 million uploads/day
Average image size: 2 MB
= 10 TB/day raw
30-day retention -> 300 TB raw
With 40% compression -> 180 TB stored
```

### Feed fanout example
```text
2 million DAU
20 posts/user/day
= 40 million posts/day
If each post triggers 200 follower fanout on average
= 8 billion fanout writes/day
```

---

## 6. Cheat Sheet

- Show your assumptions first.
- Convert daily traffic to average and then to peak.
- Estimate storage, bandwidth, and node count separately.
- Add headroom for failures and launches.
- Round numbers to keep math fast and explainable.
- State what assumptions would change the design.

---

## 7. Hands-on Design Drills

1. Estimate storage for a 30-day photo-sharing app.
2. Estimate peak bandwidth for video uploads.
3. Estimate queue throughput for an email campaign system.

---

## 8. Real-world Scenarios and Failure Modes

- **Average-based design fails on spike**: Always include peak factor.
- **Retention forgotten**: Storage cost multiplies silently over time.
- **One tenant dominates write volume**: Estimate per-tenant extremes, not only global totals.
- **Cache hit rate assumed too high**: Backend load becomes much larger than planned.

---

## 9. Interview Q&A

**Q1: Why do estimation in interviews?**  
It grounds the architecture in concrete traffic and storage assumptions.

**Q2: What is peak factor?**  
The multiplier between average and peak traffic.

**Q3: Why add headroom?**  
To survive spikes, failover, and growth without instant overload.

**Q4: What matters more, exact math or reasoning?**  
Reasoning and clarity usually matter more than exact numbers.

**Q5: How estimate RPS from requests/day?**  
Divide by 86,400 and then apply a peak multiplier.

**Q6: Why estimate read/write ratio?**  
It influences caching, replication, and storage design.

**Q7: What is retention?**  
How long the system keeps the data.

**Q8: Why separate metadata and blob size in estimates?**  
They often live in different systems with different cost profiles.

**Q9: What happens if your estimate is off?**  
Explain the sensitivity and how the design can evolve.

**Q10: When can rough estimates change the architecture?**  
When scale crosses thresholds like single-node DB limits or huge media bandwidth.
