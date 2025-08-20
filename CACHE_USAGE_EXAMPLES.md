# Cache Control Usage Examples

This document shows how to use the new smart caching system in your API handlers.

## 🎯 **How the New System Works**

### **Smart Caching Features**

1. **Respects HTTP Headers** - Checks `Cache-Control` and `Pragma` headers
2. **Endpoint-Aware TTL** - Different cache times for different types of data
3. **Flexible Control** - Easy to disable cache for specific responses
4. **Performance Optimized** - Balances performance with data freshness

## 🛠️ **Usage Examples**

### **Example 1: Disable Cache for User-Specific Data**

```typescript
// src/api/v1/public/auth/handlers/login.ts
import { CacheControl } from '@helpers';

export const signIn = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    // Your login logic here
    const result = await authService.signIn(credentials);

    // Disable cache for authentication responses
    CacheControl.noCache(reply);

    return reply.send({
      success: true,
      data: result,
    });
  } catch (error) {
    // Error handling
  }
};
```

### **Example 2: Short Cache for Dynamic Data**

```typescript
// src/api/v1/public/employees/handlers/get.ts
import { CachePresets } from '@helpers';

export const getEmployees = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const employees = await employeeService.getEmployees(filters);

    // Short cache for employee data (1 minute)
    CachePresets.employees(reply);

    return reply.send({
      success: true,
      data: employees,
    });
  } catch (error) {
    // Error handling
  }
};
```

### **Example 3: Long Cache for Static Data**

```typescript
// src/api/v1/public/department/handlers/get.ts
import { CachePresets } from '@helpers';

export const getDepartments = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const departments = await departmentService.getDepartments();

    // Long cache for static data (30 minutes)
    CachePresets.departments(reply);

    return reply.send({
      success: true,
      data: departments,
    });
  } catch (error) {
    // Error handling
  }
};
```

### **Example 4: Custom Cache Duration**

```typescript
// src/api/v1/public/reports/handlers/get.ts
import { CacheControl } from '@helpers';

export const getReport = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const report = await reportService.generateReport(params);

    // Custom cache duration (10 minutes)
    CacheControl.mediumCache(reply, 600);

    return reply.send({
      success: true,
      data: report,
    });
  } catch (error) {
    // Error handling
  }
};
```

### **Example 5: Force Fresh Data (Client-Side)**

```typescript
// Frontend JavaScript
// Force fresh data by adding cache control header
fetch('/api/departments', {
  headers: {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
  },
});

// Or add timestamp to URL
fetch(`/api/departments?t=${Date.now()}`);
```

## 📋 **Cache Control Presets**

### **Authentication & User Data**

```typescript
CachePresets.auth(reply); // No cache
CachePresets.userProfile(reply); // 1 minute private cache
CachePresets.userPermissions(reply); // 5 minutes private cache
```

### **Static Reference Data**

```typescript
CachePresets.departments(reply); // 30 minutes
CachePresets.designations(reply); // 30 minutes
CachePresets.masterData(reply); // 1 hour
```

### **Dynamic Business Data**

```typescript
CachePresets.employees(reply); // 1 minute
CachePresets.reports(reply); // 5 minutes
CachePresets.analytics(reply); // 1 minute
```

### **Real-Time Data**

```typescript
CachePresets.liveData(reply); // No cache
CachePresets.notifications(reply); // No cache
CachePresets.status(reply); // 30 seconds
```

## 🔧 **Manual Cache Control**

### **No Cache**

```typescript
CacheControl.noCache(reply);
```

### **Custom Duration**

```typescript
CacheControl.shortCache(reply, 45); // 45 seconds
CacheControl.mediumCache(reply, 600); // 10 minutes
CacheControl.longCache(reply, 7200); // 2 hours
```

### **Private Cache (User-Specific)**

```typescript
CacheControl.privateCache(reply, 300); // 5 minutes
```

### **Force Revalidation**

```typescript
CacheControl.mustRevalidate(reply, 300); // 5 minutes + revalidate
```

## 🚀 **Best Practices**

### **When to Use Each Cache Type**

1. **No Cache (`CacheControl.noCache`)**
   - Authentication responses
   - User-specific data
   - Real-time data
   - Frequently changing data

2. **Short Cache (30 seconds - 5 minutes)**
   - User data
   - Reports
   - Analytics
   - Status information

3. **Medium Cache (5-30 minutes)**
   - Business data
   - Configuration
   - User preferences

4. **Long Cache (30+ minutes)**
   - Master data
   - Reference data
   - Static content
   - Documentation

### **Performance Tips**

1. **Use appropriate cache duration** for each data type
2. **Disable cache** for sensitive or frequently changing data
3. **Enable cache** for static reference data
4. **Monitor cache hit rates** using `/admin/cache/stats`
5. **Clear cache** when data changes using `/admin/cache/clear`

## 📊 **Monitoring Cache Performance**

### **Check Cache Stats**

```bash
GET /admin/cache/stats
```

### **Clear Specific Cache**

```bash
POST /admin/cache/clear
{
  "tag": "api"
}
```

### **Clear All Cache**

```bash
POST /admin/cache/clear
{}
```

## 🎉 **Benefits of This System**

1. **Automatic Performance** - Static data is cached longer
2. **Data Freshness** - Dynamic data has shorter cache times
3. **Flexible Control** - Easy to override cache behavior
4. **HTTP Standards** - Respects standard cache control headers
5. **Monitoring** - Built-in cache statistics and management

Your API will now automatically balance performance with data freshness! 🚀
