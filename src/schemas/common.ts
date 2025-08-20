import { z } from 'zod';

// Pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive('Page must be a positive integer').default(1),
  limit: z.coerce
    .number()
    .int()
    .positive('Limit must be a positive integer')
    .max(100, 'Limit cannot exceed 100')
    .default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

// Search schema
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100, 'Search query too long').trim(),
  fields: z.array(z.string()).optional(),
});

export type SearchInput = z.infer<typeof searchSchema>;

// Filter schema
export const filterSchema = z.object({
  startDate: z.string().datetime('Invalid start date format').optional(),
  endDate: z.string().datetime('Invalid end date format').optional(),
  status: z.enum(['active', 'inactive', 'deleted']).optional(),
  isActive: z.coerce.boolean().optional(),
});

export type FilterInput = z.infer<typeof filterSchema>;

// ID parameter schema
export const idParamSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});

export type IdParamInput = z.infer<typeof idParamSchema>;

// Workspace ID header schema
export const workspaceHeaderSchema = z.object({
  'x-workspace-id': z.string().uuid('Invalid workspace ID format'),
});

export type WorkspaceHeaderInput = z.infer<typeof workspaceHeaderSchema>;

// File upload schema
export const fileUploadSchema = z.object({
  file: z.any(), // Fastify multipart file
  allowedTypes: z.array(z.string()).optional(),
  maxSize: z.number().optional(),
});

export type FileUploadInput = z.infer<typeof fileUploadSchema>;

// Date range schema
export const dateRangeSchema = z
  .object({
    from: z.string().datetime('Invalid from date format'),
    to: z.string().datetime('Invalid to date format'),
  })
  .refine(data => new Date(data.from) <= new Date(data.to), {
    message: 'From date must be before or equal to to date',
    path: ['to'],
  });

export type DateRangeInput = z.infer<typeof dateRangeSchema>;

// Bulk operation schema
export const bulkOperationSchema = z.object({
  ids: z.array(z.string().uuid('Invalid ID format')).min(1, 'At least one ID is required'),
  action: z.enum(['activate', 'deactivate', 'delete', 'restore']),
});

export type BulkOperationInput = z.infer<typeof bulkOperationSchema>;

// Export schema
export const exportSchema = z.object({
  format: z.enum(['csv', 'excel', 'pdf']).default('csv'),
  fields: z.array(z.string()).optional(),
  filters: filterSchema.optional(),
});

export type ExportInput = z.infer<typeof exportSchema>;
