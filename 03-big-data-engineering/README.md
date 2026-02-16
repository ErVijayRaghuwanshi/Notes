# Big Data Engineering

Apache Spark fundamentals, optimization techniques, and integration patterns for distributed data processing at scale.

## 📚 Contents

### Spark Core Concepts
- **[Actions vs Transformations](spark/core-concepts/Actions_vs_Transformations.md)** - Lazy evaluation and execution model
- **[Narrow vs Wide Transformations](spark/core-concepts/Narrow_vs_Wide_Transformations.md)** - Shuffle, stages, and performance

### Spark Integrations
- **[Livy Delta Lake](spark/integrations/Livy_Delta_Lake.md)** - Apache Livy with Delta Lake integration
- **[Livy SQL](spark/integrations/Livy_SQL.md)** - SQL operations through Livy REST API

### Optimization (Coming Soon)
- Caching & Persistence strategies
- Partitioning & Bucketing
- Broadcast joins
- Adaptive Query Execution (AQE)
- Memory tuning

## 🎯 Learning Path

### Beginner to Intermediate
1. **Actions vs Transformations** → Understand lazy evaluation
2. **Narrow vs Wide** → Learn about shuffles and stages
3. **RDD/DataFrame/Dataset** → Choose the right abstraction
4. **Basic Optimizations** → Caching and partitioning

### Intermediate to Advanced
1. **Shuffle Optimization** → Minimize data movement
2. **Memory Management** → Tune executor memory
3. **Catalyst Optimizer** → Understand query planning
4. **Advanced Integrations** → Delta Lake, Iceberg, Hudi

## 💡 Interview Topics

### Core Concepts
- **Lazy Evaluation**: Why Spark uses it, benefits
- **DAG**: How Spark builds and optimizes execution plans
- **Shuffle**: What causes it, how to minimize
- **Partitioning**: Impact on performance
- **Caching**: When and what to cache

### Common Questions
- Explain the difference between `map()` and `flatMap()`
- Why is `reduceByKey()` better than `groupByKey()`?
- How does Spark handle fault tolerance?
- What is a broadcast join and when to use it?
- Explain Spark's memory model (storage vs execution)

### Performance Scenarios
- "Your Spark job is running slow, how do you debug?"
- "Explain how you'd optimize a job with multiple joins"
- "How do you handle data skew?"
- "When would you use `repartition()` vs `coalesce()`?"

## 🏗️ Architecture Patterns

### Data Processing Patterns
- **Batch Processing**: Daily/hourly aggregations
- **Incremental Processing**: Delta Lake merge operations
- **Lambda Architecture**: Batch + streaming layers
- **Medallion Architecture**: Bronze → Silver → Gold

### Best Practices
- Use DataFrame API over RDD
- Prefer narrow transformations
- Cache wisely (only reused DataFrames)
- Partition data appropriately
- Use broadcast for small tables
- Monitor with Spark UI

## 📊 Performance Metrics

Key metrics to monitor:
- **Shuffle Read/Write**: Minimize data movement
- **Task Duration**: Identify stragglers
- **GC Time**: Keep under 10% of task time
- **Spill**: Avoid disk spills
- **Data Skew**: Balance partition sizes

## 🔗 Related Topics

- [Backend Development](../02-backend-development/) - API integration with Spark
- [System Design](../04-system-design/) - Distributed systems concepts
- [Cloud & DevOps](../05-cloud-and-devops/) - Spark on Kubernetes
