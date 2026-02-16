# Backend Development

Production-ready backend development patterns, frameworks, and best practices for building scalable APIs and microservices.

## 📚 Contents

### FastAPI
- **[FastAPI Middleware](fastapi/FastAPI_Middleware.md)** - Middleware patterns and implementation
- **[FastAPI RBAC](fastapi/FastAPI_RBAC.md)** - Role-Based Access Control with JWT authentication
- **[FastAPI K8s Deployment](fastapi/FastAPI_K8s_Deployment.md)** - Deploying FastAPI applications on Kubernetes

### API Gateway
- **[Kong API Gateway 101](api-gateway/Kong_API_Gateway_101.md)** - Kong setup with JWT auth and RBAC

### Databases
- **[Database Design](databases/Database_Design.md)** - Normalization, relationships, and optimization

## 🎯 Learning Path

### For Backend Engineer Role
1. **FastAPI Basics** → Start with middleware and RBAC patterns
2. **Database Design** → Master normalization and query optimization
3. **API Gateway** → Learn Kong for microservices architecture
4. **Deployment** → Understand K8s deployment strategies

### For Full-Stack Role
1. **FastAPI RBAC** → Authentication and authorization
2. **Database Design** → Schema design and relationships
3. **Middleware** → Request/response processing
4. **K8s Deployment** → Production deployment

## 💡 Interview Topics

### Common Questions
- **FastAPI vs Flask/Django**: When to use each framework
- **JWT Authentication**: Token generation, validation, refresh strategies
- **Middleware**: Request lifecycle, custom middleware patterns
- **Database Design**: Normalization forms, indexing strategies
- **API Gateway**: Benefits, when to use, Kong vs alternatives

### Coding Challenges
- Implement JWT authentication from scratch
- Design a rate-limiting middleware
- Optimize slow database queries
- Design RESTful API for complex domain

## 🏗️ Architecture Patterns

- **Layered Architecture**: Router → Service → Repository
- **Dependency Injection**: Using FastAPI's Depends
- **SOLID Principles**: Applied to API design
- **12-Factor App**: Configuration, logging, statelessness

## 🔗 Related Topics

- [Computer Science Fundamentals](../01-computer-science-fundamentals/) - SOLID principles
- [System Design](../04-system-design/) - Microservices patterns
- [Cloud & DevOps](../05-cloud-and-devops/) - Kubernetes deployment
