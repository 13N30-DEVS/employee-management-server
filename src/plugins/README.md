# Fastify Plugins

This directory contains all the Fastify plugins used in the EMS Backend application. Plugins are loaded in a specific order to ensure proper initialization and dependencies.

## 🏗️ **Plugin Architecture**

Plugins are organized into three main categories:

1. **Core Plugins** - Essential functionality (helmet, cors, sensible, etc.)
2. **Authentication & Security** - JWT, rate limiting, security middleware
3. **Feature Plugins** - Business logic (cache, health, Redis, etc.)

## 📋 **Plugin Loading Order**

The plugin loading order is managed in `src/plugins/index.ts`:

```typescript
// 1. Core plugins (helmet, cors, etc.)
await fastify.register(import('./helmet'));
await fastify.register(import('./cors'));
await fastify.register(import('./sensible'));
await fastify.register(import('./multipart'));

// 2. JWT plugin (provides authentication)
await fastify.register(import('./jwt'));

// 3. Redis plugin (provides caching)
await fastify.register(import('./redis'));

// 4. Feature plugins (rate limiting, database, etc.)
await fastify.register(import('./ratelimit'));
await fastify.register(import('./sequelize'));
await fastify.register(import('./swagger'));

// 5. Feature plugins that may depend on JWT
await fastify.register(import('./cache'));
await fastify.register(import('./health'));
await fastify.register(import('./security'));
```

## 🔌 **Available Plugins**

### **Core Security & Middleware**

#### **Helmet Plugin** (`helmet.ts`)

- **Purpose**: Security headers and protection
- **Features**:
  - Content Security Policy (CSP)
  - HTTP Strict Transport Security (HSTS)
  - XSS Protection
  - Frame options
  - Content type sniffing protection
- **Configuration**: Environment-based security policies
- **Endpoints**: N/A (middleware only)

#### **CORS Plugin** (`cors.ts`)

- **Purpose**: Cross-Origin Resource Sharing configuration
- **Features**:
  - Environment-specific CORS policies
  - Configurable origins, methods, and headers
  - Credentials support
- **Configuration**:
  ```typescript
  CORS_ORIGIN=*                    // Development
  CORS_ORIGIN=https://yourdomain.com // Production
  CORS_CREDENTIALS=true
  ```

#### **Sensible Plugin** (`sensible.ts`)

- **Purpose**: Sensible defaults for Fastify
- **Features**:
  - Request logging
  - Error handling
  - Response formatting
- **Configuration**: Uses Fastify defaults

#### **Multipart Plugin** (`multipart.ts`)

- **Purpose**: File upload handling
- **Features**:
  - File parsing
  - Size limits
  - Type validation
- **Configuration**: Configurable file size limits

### **Authentication & Security**

#### **JWT Plugin** (`jwt.ts`)

- **Purpose**: JSON Web Token authentication
- **Features**:
  - Token generation and validation
  - Refresh token support
  - Configurable expiration times
  - Issuer and audience validation
- **Configuration**:
  ```typescript
  JWT_SECRET=your_secret_key_here
  JWT_EXPIRES_IN=1h
  JWT_REFRESH_EXPIRES_IN=7d
  ```
- **Decorators**:
  - `fastify.authenticate` - Authentication middleware
  - `fastify.generateAccessToken` - Generate access token
  - `fastify.generateRefreshToken` - Generate refresh token

#### **Rate Limiting Plugin** (`ratelimit.ts`)

- **Purpose**: API rate limiting
- **Features**:
  - Configurable request limits
  - Time window settings
  - IP-based limiting
  - Allowlist for localhost
- **Configuration**:
  ```typescript
  RATE_LIMIT_MAX=100
  RATE_LIMIT_TIME_WINDOW=1 minute
  ```

#### **Security Plugin** (`security.ts`)

- **Purpose**: Additional security middleware
- **Features**:
  - Security headers
  - Request size limiting
  - SQL injection protection
  - User-based rate limiting
  - Security event logging
- **Configuration**: Configurable security policies

### **Data & Caching**

#### **Sequelize Plugin** (`sequelize.ts`)

- **Purpose**: Database ORM integration
- **Features**:
  - Database connection management
  - Connection pooling
  - SSL support for production
  - Graceful shutdown
- **Configuration**:
  ```typescript
  DB_NAME=your_database
  DB_USERNAME=your_username
  DB_PASSWORD=your_password
  DB_HOST=localhost
  DB_PORT=5432
  DB_DIALECT=postgres
  DB_SSL=true  # Production only
  ```

#### **Redis Plugin** (`redis.ts`)

- **Purpose**: Redis cache service integration
- **Features**:
  - Cache operations (get, set, delete)
  - Tag-based invalidation
  - Health monitoring
  - Admin endpoints
- **Configuration**:
  ```typescript
  REDIS_HOST=localhost
  REDIS_PORT=6379
  REDIS_PASSWORD=  # Optional for local
  REDIS_DB=0
  ```
- **Endpoints**:
  - `GET /admin/redis/stats` - Redis statistics
  - `POST /admin/redis/ping` - Test connectivity
  - `POST /admin/redis/clear` - Clear cache

#### **Cache Plugin** (`cache.ts`)

- **Purpose**: In-memory caching layer
- **Features**:
  - Automatic response caching
  - Tag-based invalidation
  - TTL management
  - Cache statistics
- **Endpoints**:
  - `GET /admin/cache/stats` - Cache statistics
  - `POST /admin/cache/clear` - Clear cache

### **Monitoring & Health**

#### **Health Plugin** (`health.ts`)

- **Purpose**: Application health monitoring
- **Features**:
  - Database health checks
  - Redis health checks
  - Memory usage monitoring
  - Kubernetes readiness/liveness probes
- **Endpoints**:
  - `GET /health` - Comprehensive health check
  - `GET /ready` - Readiness probe
  - `GET /live` - Liveness probe
  - `GET /metrics` - Application metrics

#### **Swagger Plugin** (`swagger.ts`)

- **Purpose**: API documentation
- **Features**:
  - OpenAPI 3.0 specification
  - Interactive API documentation
  - Schema validation
- **Configuration**: Auto-generated from route schemas

## ⚙️ **Configuration**

### **Environment Variables**

All plugins use environment variables for configuration. See `.env.example` for the complete list.

### **Plugin Options**

Plugins can be configured by modifying their respective files or by passing options during registration.

## 🔧 **Customization**

### **Adding New Plugins**

1. Create a new plugin file in `src/plugins/`
2. Use the `fastify-plugin` wrapper:

   ```typescript
   import fp from 'fastify-plugin';

   export default fp(async (fastify: FastifyInstance) => {
     // Plugin logic here
   });
   ```

3. Register it in `src/plugins/index.ts`
4. Add any necessary environment variables

### **Modifying Existing Plugins**

- **Configuration**: Update environment variables
- **Behavior**: Modify the plugin file directly
- **Endpoints**: Add new routes within the plugin

## 🧪 **Testing**

### **Plugin Testing**

Each plugin can be tested independently:

```typescript
import { build } from '../app';

describe('Plugin Tests', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = await build();
  });

  it('should register plugin correctly', () => {
    expect(app.hasPlugin('plugin-name')).toBe(true);
  });
});
```

### **Integration Testing**

Test plugins together:

```typescript
describe('Plugin Integration', () => {
  it('should work with authentication', async () => {
    // Test authenticated endpoints
  });
});
```

## 🚀 **Production Considerations**

### **Security**

- Enable SSL/TLS for all external connections
- Use strong passwords and secrets
- Configure proper CORS policies
- Enable rate limiting

### **Performance**

- Configure connection pools appropriately
- Set reasonable cache TTLs
- Monitor memory usage
- Use Redis clustering for high availability

### **Monitoring**

- Enable health checks
- Set up metrics collection
- Monitor plugin performance
- Log security events

## 🐛 **Troubleshooting**

### **Common Issues**

1. **Plugin Order**: Ensure plugins are loaded in the correct order
2. **Dependencies**: Check that required services are running
3. **Configuration**: Verify environment variables are set correctly
4. **Port Conflicts**: Ensure ports are available

### **Debug Commands**

```bash
# Check plugin status
curl http://localhost:3333/health

# Check Redis status
curl http://localhost:3333/admin/redis/stats

# Check cache status
curl http://localhost:3333/admin/cache/stats
```

### **Logs**

Check application logs for plugin-specific errors:

```bash
npm run dev:local
# Look for plugin initialization messages
```

## 📚 **Additional Resources**

- [Fastify Plugin Documentation](https://www.fastify.io/docs/latest/Reference/Plugins/)
- [Fastify Plugin Development](https://www.fastify.io/docs/latest/Guides/Getting-Started/#your-first-plugin)
- [Plugin Best Practices](https://www.fastify.io/docs/latest/Guides/Best-Practices/)

## 🤝 **Contributing**

When adding or modifying plugins:

1. Follow the existing plugin structure
2. Add proper TypeScript types
3. Include error handling
4. Add health checks where appropriate
5. Update this README
6. Add tests for new functionality
