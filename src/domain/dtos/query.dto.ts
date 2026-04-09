import { z } from 'zod';

export const SortFieldSchema = z.enum(['name', 'kind', 'createdAt']);
export const SortOrderSchema = z.enum(['asc', 'desc']).default('asc');

const toLower = (val: unknown) => (typeof val === 'string' ? val.toLowerCase() : val);

export const QueryOptionsSchema = z.object({
  sortBy: z.preprocess(toLower, SortFieldSchema.optional().default('name')),
  order: z.preprocess(toLower, SortOrderSchema.optional().default('asc')),
  lastId: z.string().uuid().optional(),
  limit: z.coerce.number().min(1).max(1000).optional().default(50),
});

export type QueryOptions = z.infer<typeof QueryOptionsSchema>;

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    limit: number;
    lastId?: string;
    hasMore?: boolean;
  };
}
