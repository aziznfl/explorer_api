import { z } from 'zod';

export const CreateItemSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['folder', 'file']),
  parentId: z.string().uuid().nullable().optional(),
});

export type CreateItemDto = z.infer<typeof CreateItemSchema>;

export const UpdateItemSchema = z.object({
  name: z.string().min(1).optional(),
  parentId: z.string().uuid().nullable().optional(),
});

export type UpdateItemDto = z.infer<typeof UpdateItemSchema>;
