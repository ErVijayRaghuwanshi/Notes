# System Design

Distributed systems fundamentals, architectural patterns, and real-world system design case studies for SDE2 interviews.

## 📚 Contents

### Fundamentals (Coming Soon)
- CAP Theorem
- Consistency Models
- Horizontal vs Vertical Scaling
- Load Balancing
- Caching Strategies
- Database Sharding
- Message Queues
- API Design

### Patterns (Coming Soon)
- Microservices Architecture
- Event-Driven Architecture
- CQRS (Command Query Responsibility Segregation)
- Saga Pattern
- Circuit Breaker
- Rate Limiting
- Service Discovery
- API Gateway Pattern

### Case Studies (Coming Soon)
- Design URL Shortener (like bit.ly)
- Design Twitter/Social Media Feed
- Design Rate Limiter
- Design Notification System
- Design Distributed Cache
- Design Search Autocomplete
- Design Video Streaming Platform

## 🎯 Learning Path

### Foundation (Week 1-2)
1. **Scalability Basics** → Vertical vs horizontal scaling
2. **Load Balancing** → Algorithms and strategies
3. **Caching** → Cache-aside, write-through, write-behind
4. **Databases** → SQL vs NoSQL, sharding, replication

### Intermediate (Week 3-4)
1. **Microservices** → Service boundaries, communication
2. **Message Queues** → Kafka, RabbitMQ, SQS
3. **API Gateway** → Kong, rate limiting, authentication
4. **Monitoring** → Metrics, logging, tracing

### Advanced (Week 5-6)
1. **Distributed Transactions** → 2PC, Saga pattern
2. **Consistency** → Eventual vs strong consistency
3. **CAP Theorem** → Trade-offs in distributed systems
4. **Case Studies** → Practice designing complete systems

## 💡 Interview Approach

### Framework: RADIO
1. **Requirements** - Clarify functional and non-functional requirements
2. **Architecture** - High-level design with major components
3. **Data Model** - Database schema and data flow
4. **Interface** - API design and contracts
5. **Optimization** - Bottlenecks, scaling, trade-offs

### Key Questions to Ask
- What is the scale? (users, requests/sec, data volume)
- What are the latency requirements?
- Consistency vs availability trade-offs?
- Read-heavy or write-heavy?
- What can fail and how to handle it?

### Common Pitfalls to Avoid
- ❌ Jumping to solution without clarifying requirements
- ❌ Over-engineering for small scale
- ❌ Ignoring trade-offs and bottlenecks
- ❌ Not discussing failure scenarios
- ❌ Forgetting about monitoring and observability

## 🏗️ Core Concepts

### Scalability
- **Vertical Scaling**: Add more resources to single machine
- **Horizontal Scaling**: Add more machines
- **Load Balancing**: Distribute traffic across servers
- **Caching**: Reduce database load

### Reliability
- **Replication**: Data redundancy
- **Failover**: Automatic recovery
- **Circuit Breaker**: Prevent cascade failures
- **Retry Logic**: Handle transient failures

### Performance
- **CDN**: Serve static content from edge locations
- **Database Indexing**: Speed up queries
- **Connection Pooling**: Reuse database connections
- **Async Processing**: Background jobs for heavy tasks

### Maintainability
- **Monitoring**: Metrics, logs, alerts
- **Documentation**: API specs, architecture diagrams
- **Testing**: Unit, integration, load tests
- **Deployment**: CI/CD, blue-green, canary

## 📊 Estimation Numbers (Back-of-envelope)

### Storage
- 1 char = 1 byte
- 1 KB = 1,000 bytes
- 1 MB = 1,000 KB
- 1 GB = 1,000 MB
- 1 TB = 1,000 GB

### Latency
- L1 cache: 0.5 ns
- L2 cache: 7 ns
- RAM: 100 ns
- SSD: 150 μs
- HDD: 10 ms
- Network (same datacenter): 0.5 ms
- Network (cross-region): 150 ms

### Throughput
- 1 GB/sec = 86.4 TB/day
- 1 million requests/day = ~12 requests/sec
- 1 billion requests/day = ~12K requests/sec

## 🔗 Related Topics

- [Backend Development](../02-backend-development/) - API and microservices implementation
- [Big Data Engineering](../03-big-data-engineering/) - Distributed data processing
- [Cloud & DevOps](../05-cloud-and-devops/) - Infrastructure and deployment
