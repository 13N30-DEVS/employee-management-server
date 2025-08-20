import { FastifyReply } from 'fastify';

/**
 * Cache Control Helper Functions
 * Use these in your API handlers to control caching behavior
 */

export class CacheControl {
  /**
   * Disable caching completely for this response
   * Use for sensitive data, user-specific data, or frequently changing data
   */
  static noCache(reply: FastifyReply): void {
    reply.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    reply.header('Pragma', 'no-cache');
    reply.header('Expires', '0');
  }

  /**
   * Set short cache duration (e.g., 30 seconds)
   * Use for data that changes occasionally
   */
  static shortCache(reply: FastifyReply, seconds: number = 30): void {
    reply.header('Cache-Control', `public, max-age=${seconds}`);
  }

  /**
   * Set medium cache duration (e.g., 5 minutes)
   * Use for data that changes infrequently
   */
  static mediumCache(reply: FastifyReply, seconds: number = 300): void {
    reply.header('Cache-Control', `public, max-age=${seconds}`);
  }

  /**
   * Set long cache duration (e.g., 1 hour)
   * Use for static data that rarely changes
   */
  static longCache(reply: FastifyReply, seconds: number = 3600): void {
    reply.header('Cache-Control', `public, max-age=${seconds}`);
  }

  /**
   * Private cache (only for authenticated users)
   * Use for user-specific data that can be cached per user
   */
  static privateCache(reply: FastifyReply, seconds: number = 300): void {
    reply.header('Cache-Control', `private, max-age=${seconds}`);
  }

  /**
   * Force revalidation (check with server before using cache)
   * Use when you want to use cache but ensure it's still valid
   */
  static mustRevalidate(reply: FastifyReply, seconds: number = 300): void {
    reply.header('Cache-Control', `public, max-age=${seconds}, must-revalidate`);
  }

  /**
   * No cache but allow storing (for POST requests)
   * Use when you don't want to cache but want to allow proxy caching
   */
  static noStore(reply: FastifyReply): void {
    reply.header('Cache-Control', 'no-store');
  }
}

/**
 * Common cache control presets for different types of data
 */
export const CachePresets = {
  // Authentication and user data
  auth: (reply: FastifyReply) => CacheControl.noCache(reply),
  userProfile: (reply: FastifyReply) => CacheControl.privateCache(reply, 60), // 1 minute
  userPermissions: (reply: FastifyReply) => CacheControl.privateCache(reply, 300), // 5 minutes

  // Static reference data
  departments: (reply: FastifyReply) => CacheControl.longCache(reply, 1800), // 30 minutes
  designations: (reply: FastifyReply) => CacheControl.longCache(reply, 1800), // 30 minutes
  masterData: (reply: FastifyReply) => CacheControl.longCache(reply, 3600), // 1 hour

  // Dynamic business data
  employees: (reply: FastifyReply) => CacheControl.shortCache(reply, 60), // 1 minute
  reports: (reply: FastifyReply) => CacheControl.shortCache(reply, 300), // 5 minutes
  analytics: (reply: FastifyReply) => CacheControl.shortCache(reply, 60), // 1 minute

  // Real-time data
  liveData: (reply: FastifyReply) => CacheControl.noCache(reply),
  notifications: (reply: FastifyReply) => CacheControl.noCache(reply),
  status: (reply: FastifyReply) => CacheControl.shortCache(reply, 30), // 30 seconds
};

export default CacheControl;
