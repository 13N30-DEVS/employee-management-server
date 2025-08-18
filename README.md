# EMS Backend Development

A scalable, secure, and optimized Employee Management System backend built with Fastify, TypeScript, and Sequelize.

## 🚀 **Recent Improvements**

### **Security Enhancements**

- ✅ **JWT Security**: Improved token management with refresh tokens and better validation
- ✅ **CORS Protection**: Environment-based CORS configuration with production restrictions
- ✅ **Security Headers**: Comprehensive security headers via Helmet.js
- ✅ **Rate Limiting**: Advanced rate limiting with IP-based and user-based protection
- ✅ **Input Validation**: SQL injection protection and request sanitization
- ✅ **File Upload Security**: Secure file validation and S3 configuration

### **Performance Optimizations**

- ✅ **Connection Pooling**: Database connection pooling for better scalability
- ✅ **Caching Layer**: In-memory caching with tag-based invalidation
- ✅ **Request Optimization**: Request size limiting and response optimization
- ✅ **Health Monitoring**: Comprehensive health checks and metrics

### **Scalability Features**

- ✅ **Environment Configuration**: Robust environment variable validation
- ✅ **Error Handling**: Centralized error handling and logging
- ✅ **Monitoring**: Health checks, metrics, and performance logging
- ✅ **Graceful Shutdown**: Proper cleanup and shutdown handling

## 🏗️ **Architecture**

```
src/
├── api/                    # API routes and handlers
├── config/                 # Configuration management
├── helpers/                # Utility functions and helpers
├── interactors/            # Business logic layer
├── middlewares/            # Custom middleware
├── models/                 # Database models
├── plugins/                # Fastify plugins
├── services/               # Service layer
└── utils/                  # Utility functions
```

## 🔧 **Installation**

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run database migrations
npm run migrate

# Seed the database
npm run seed

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🌍 **Environment Variables**

Create a `.env` file with the following variables:

```env
# Application
NODE_ENV=development
PORT=3030

# Database
DB_NAME=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_DIALECT=postgres
DB_SSL=false
DB_POOL_MAX=10
DB_POOL_MIN=0
DB_POOL_ACQUIRE=30000
DB_POOL_IDLE=10000

# JWT
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000
CORS_CREDENTIALS=false

# AWS S3
S3_URL=https://your-s3-endpoint
AWS_ACCESS_KEY=your-access-key
AWS_SECRET=your-secret-key
AWS_BUCKET_NAME=your-bucket
AWS_REGION=us-east-1

# Email (Brevo)
BREVO_SMTP_SERVER=your-smtp-server
BREVO_PORT=587
BREVO_LOGIN=your-login
BREVO_USER=your-user
BREVO_PASSWORD=your-password

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_TIME_WINDOW=1 minute

# Security
BCRYPT_ROUNDS=12
SESSION_SECRET=your-super-secret-session-key-at-least-32-characters
```

## 🔒 **Security Features**

### **Authentication & Authorization**

- JWT-based authentication with refresh tokens
- Role-based access control
- Secure password hashing with bcrypt
- Token expiration and validation

### **Request Security**

- CORS protection with environment-based configuration
- Rate limiting (IP-based and user-based)
- Request size limiting
- SQL injection protection
- XSS protection via security headers

### **File Upload Security**

- File type validation
- File size limits
- Secure filename generation
- S3 bucket security configuration

## 📊 **Performance Features**

### **Caching**

- In-memory caching with TTL
- Tag-based cache invalidation
- Automatic response caching
- Cache statistics and management

### **Database Optimization**

- Connection pooling
- Query timeout configuration
- Retry mechanisms
- SSL support for production

### **Monitoring**

- Health check endpoints
- Performance metrics
- Memory usage monitoring
- Response time tracking

## 🚀 **API Endpoints**

### **Public Endpoints**

- `POST /api/v1/public/auth/login` - User login
- `POST /api/v1/public/auth/signup` - User registration
- `GET /health` - Health check
- `GET /ready` - Readiness probe
- `GET /live` - Liveness probe

### **Protected Endpoints**

- `GET /api/v1/private/user/*` - User management
- `GET /api/v1/private/department/*` - Department management
- `GET /api/v1/private/designation/*` - Designation management
- `POST /api/v1/private/uploadFile/*` - File upload

### **Admin Endpoints**

- `GET /admin/cache/stats` - Cache statistics
- `POST /admin/cache/clear` - Cache management
- `GET /metrics` - Application metrics

## 🐳 **Docker Support**

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in production mode
docker-compose -f compose.yaml up --build
```

## 🧪 **Testing**

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- test/routes/example.test.ts
```

## 📝 **Code Quality**

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Security audit
npm run security:audit

# Fix security issues
npm run security:fix
```

## 🔍 **Monitoring & Logging**

### **Health Checks**

- Database connectivity
- Memory usage
- Disk usage
- Application uptime

### **Logging**

- Structured logging in production
- Colored console output in development
- Request/response logging
- Security event logging
- Performance logging

### **Metrics**

- Response times
- Memory usage
- Process information
- Cache statistics

## 🚨 **Security Best Practices**

1. **Environment Variables**: Never commit sensitive data to version control
2. **JWT Secrets**: Use strong, unique secrets (minimum 32 characters)
3. **Database**: Use SSL in production, implement proper connection pooling
4. **File Uploads**: Validate file types and sizes, use secure storage
5. **Rate Limiting**: Implement appropriate limits for your use case
6. **CORS**: Restrict origins in production
7. **Headers**: Use security headers via Helmet.js
8. **Logging**: Log security events and monitor for suspicious activity

## 📈 **Scaling Considerations**

1. **Database**: Implement read replicas, connection pooling, and query optimization
2. **Caching**: Use Redis for distributed caching in production
3. **Load Balancing**: Implement proper load balancing for multiple instances
4. **Monitoring**: Use external monitoring services (Prometheus, Grafana)
5. **Logging**: Implement centralized logging (ELK stack, CloudWatch)
6. **File Storage**: Use CDN for static assets, implement proper S3 policies

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 **License**

This project is licensed under the ISC License.

## 🆘 **Support**

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ using Fastify, TypeScript, and Sequelize**
