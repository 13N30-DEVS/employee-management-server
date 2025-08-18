# Redis Cache Service Setup

This document provides comprehensive information about setting up and using Redis cache service in the EMS Backend.

## 🚀 Quick Start

### 1. Start Redis with Docker

```bash
# Start Redis standalone
docker-compose -f docker-compose.redis.yml up -d redis

# Start Redis with web UI (Redis Commander)
docker-compose -f docker-compose.redis.yml up -d redis redis-commander

# Start Redis cluster (for production)
docker-compose -f docker-compose.redis.yml --profile cluster up -d

# Start Redis with Sentinel (for high availability)
docker-compose -f docker-compose.redis.yml --profile sentinel up -d
```

### 2. Access Redis

- **Redis Server**: `localhost:6379`
- **Redis Commander (Web UI)**: `http://localhost:8081` (admin/admin123)

## 📋 Environment Variables

Add these Redis configuration variables to your `.env` file:

```bash
# Redis Basic Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password_here
REDIS_DB=0

# Redis Connection Options
REDIS_CONNECT_TIMEOUT=10000
REDIS_COMMAND_TIMEOUT=5000
REDIS_RETRY_DELAY=1000
REDIS_MAX_RETRIES=3

# Redis Pool Settings
REDIS_MAX_CLIENTS=10
REDIS_MIN_CLIENTS=1

# Redis Cache Settings
REDIS_DEFAULT_TTL=300
REDIS_MAX_TTL=86400
REDIS_KEY_PREFIX=ems:

# Redis Cluster (optional)
REDIS_ENABLE_CLUSTER=false
REDIS_CLUSTER_NODES=localhost:7001,localhost:7002,localhost:7003

# Redis Sentinel (optional)
REDIS_ENABLE_SENTINEL=false
REDIS_SENTINEL_HOSTS=localhost:26379,localhost:26380,localhost:26381
REDIS_SENTINEL_PASSWORD=your_sentinel_password
REDIS_SENTINEL_MASTER_NAME=mymaster

# Redis SSL (optional)
REDIS_ENABLE_SSL=false
REDIS_SSL_CA=/path/to/ca.crt
REDIS_SSL_CERT=/path/to/client.crt
REDIS_SSL_KEY=/path/to/client.key
```

## 🏗️ Architecture

### Redis Service (`src/services/redis.ts`)

The main Redis service that handles:

- Connection management (standalone, cluster, sentinel)
- Cache operations (get, set, delete, expire)
- Tag-based invalidation
- Namespace management
- Health checks and monitoring

### Redis Plugin (`src/plugins/redis.ts`)

Fastify plugin that:

- Integrates Redis service with Fastify
- Provides admin endpoints for Redis management
- Handles graceful shutdown
- Adds Redis health checks

### Redis Cache Helper (`src/helpers/redisCache.ts`)

Utility helper that provides:

- Cache decorators for methods
- Predefined cache patterns
- Cache invalidation utilities
- Cache warmup functionality

## 🔧 Usage Examples

### Basic Caching

```typescript
import { redisService } from "@services/redis";

// Set cache
await redisService.set("user:123", userData, {
  ttl: 3600, // 1 hour
  tags: ["user", "profile"],
  namespace: "users",
});

// Get cache
const userData = await redisService.get("user:123", "users");

// Delete cache
await redisService.delete("user:123", "users");
```

### Using Cache Decorators

```typescript
import { cacheDecorator, cachePatterns } from "@helpers/redisCache";

class UserService {
  @cacheDecorator({
    key: (request) => cachePatterns.user.profile(request.params.userId),
    ttl: 3600,
    tags: ["user", "profile"],
  })
  async getUserProfile(userId: string, request: FastifyRequest) {
    // This method will be automatically cached
    return await this.fetchUserFromDatabase(userId);
  }
}
```

### Cache Patterns

```typescript
import { cachePatterns } from "@helpers/redisCache";

// User cache keys
const userProfileKey = cachePatterns.user.profile("123");
const userPermissionsKey = cachePatterns.user.permissions("123");

// Data cache keys
const departmentsKey = cachePatterns.data.departments();
const employeesKey = cachePatterns.data.employees("active");

// API cache keys
const apiResponseKey = cachePatterns.api.response(
  "/api/users",
  "page=1&limit=10"
);
```

### Cache Invalidation

```typescript
import { invalidateUserCache, invalidateDataCache } from "@helpers/redisCache";

// Invalidate user cache
await invalidateUserCache("123");

// Invalidate specific data cache
await invalidateDataCache("departments");

// Invalidate all data caches
await invalidateDataCache();
```

## 📊 Monitoring & Management

### Health Endpoints

- **Health Check**: `GET /health` - Includes Redis health status
- **Readiness Probe**: `GET /ready` - Checks Redis connectivity
- **Metrics**: `GET /metrics` - Includes Redis statistics

### Admin Endpoints

- **Redis Stats**: `GET /admin/redis/stats` - Redis connection and memory stats
- **Redis Ping**: `POST /admin/redis/ping` - Test Redis connectivity
- **Cache Clear**: `POST /admin/redis/clear` - Clear cache by tag/namespace

### Cache Statistics

```typescript
import { redisService } from "@services/redis";

const stats = await redisService.getStats();
console.log({
  connected: stats.connected,
  totalKeys: stats.totalKeys,
  memoryUsage: stats.memoryUsage,
  lastPing: stats.lastPing,
});
```

## 🚀 Performance Optimization

### 1. Connection Pooling

Redis service automatically manages connection pools:

- Configurable min/max clients
- Automatic reconnection
- Connection health monitoring

### 2. Tag-Based Invalidation

Use tags for efficient cache invalidation:

```typescript
// Set with tags
await redisService.set("user:123", data, {
  tags: ["user", "profile", "department:hr"],
});

// Invalidate by tag
await redisService.invalidateByTag("department:hr");
```

### 3. Namespace Management

Organize cache keys with namespaces:

```typescript
// Set with namespace
await redisService.set("profile", data, { namespace: "users" });
// Results in key: "ems:users:profile"

// Invalidate namespace
await redisService.invalidateByNamespace("users");
```

### 4. TTL Management

- **Default TTL**: 5 minutes (300 seconds)
- **Maximum TTL**: 24 hours (86400 seconds)
- **Per-key TTL**: Override default per operation

## 🔒 Security Considerations

### 1. Authentication

```bash
# Enable Redis password in redis.conf
requirepass your_strong_password_here

# Update environment variable
REDIS_PASSWORD=your_strong_password_here
```

### 2. Network Security

```bash
# Bind to localhost only (development)
bind 127.0.0.1

# Bind to specific network (production)
bind 10.0.0.0/8
```

### 3. Command Renaming

```bash
# Disable dangerous commands in redis.conf
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command DEBUG ""
```

## 📈 Production Deployment

### 1. Redis Cluster

For high availability and scalability:

```bash
# Start cluster nodes
docker-compose -f docker-compose.redis.yml --profile cluster up -d

# Configure cluster
redis-cli --cluster create 127.0.0.1:7001 127.0.0.1:7002 127.0.0.1:7003 --cluster-replicas 0
```

### 2. Redis Sentinel

For automatic failover:

```bash
# Start sentinel nodes
docker-compose -f docker-compose.redis.yml --profile sentinel up -d

# Update environment
REDIS_ENABLE_SENTINEL=true
REDIS_SENTINEL_HOSTS=localhost:26379,localhost:26380,localhost:26381
```

### 3. SSL/TLS

For encrypted connections:

```bash
# Generate certificates
openssl req -x509 -newkey rsa:4096 -keyout redis.key -out redis.crt -days 365 -nodes

# Update environment
REDIS_ENABLE_SSL=true
REDIS_SSL_CERT=/path/to/redis.crt
REDIS_SSL_KEY=/path/to/redis.key
```

## 🧪 Testing

### 1. Unit Tests

```typescript
import { redisService } from "@services/redis";

describe("Redis Service", () => {
  beforeEach(async () => {
    await redisService.clear();
  });

  it("should set and get cache", async () => {
    const data = { test: "value" };
    await redisService.set("test", data);
    const result = await redisService.get("test");
    expect(result).toEqual(data);
  });
});
```

### 2. Integration Tests

```typescript
import { build } from "../app";

describe("Redis Plugin", () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = await build();
  });

  it("should provide Redis service", () => {
    expect(app.redis).toBeDefined();
  });
});
```

## 🐛 Troubleshooting

### Common Issues

1. **Connection Refused**

   - Check if Redis is running
   - Verify host/port configuration
   - Check firewall settings

2. **Authentication Failed**

   - Verify Redis password
   - Check `requirepass` in redis.conf

3. **Memory Issues**

   - Monitor `maxmemory` setting
   - Check memory usage with `INFO memory`
   - Adjust `maxmemory-policy`

4. **Performance Issues**
   - Monitor slow queries with `SLOWLOG GET`
   - Check connection pool size
   - Verify TTL settings

### Debug Commands

```bash
# Connect to Redis CLI
redis-cli -h localhost -p 6379

# Check Redis info
INFO

# Monitor commands in real-time
MONITOR

# Check memory usage
INFO memory

# Check slow queries
SLOWLOG GET 10

# Check connected clients
CLIENT LIST
```

## 📚 Additional Resources

- [Redis Documentation](https://redis.io/documentation)
- [ioredis Documentation](https://github.com/luin/ioredis)
- [Redis Best Practices](https://redis.io/topics/best-practices)
- [Redis Security](https://redis.io/topics/security)

## 🤝 Contributing

When adding new cache patterns or features:

1. Update `CachePatterns` interface
2. Add corresponding methods to `RedisCacheHelper`
3. Update tests
4. Update documentation

## 📝 Changelog

- **v1.0.0**: Initial Redis implementation
- **v1.1.0**: Added cluster and sentinel support
- **v1.2.0**: Added cache decorators and patterns
- **v1.3.0**: Added admin endpoints and monitoring
