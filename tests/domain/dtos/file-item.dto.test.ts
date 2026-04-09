import { describe, expect, it } from 'bun:test';
import { CreateItemSchema, UpdateItemSchema } from '../../../src/domain/dtos/file-item.dto';

describe('FileItem DTOs', () => {
  describe('CreateItemSchema', () => {
    it('should validate valid folder input', () => {
      const input = {
        name: 'New Folder',
        type: 'folder',
      };
      const result = CreateItemSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should validate valid file input with parentId', () => {
      const input = {
        name: 'test.txt',
        type: 'file',
        parentId: '550e8400-e29b-41d4-a716-446655440000',
      };
      const result = CreateItemSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should fail if name is empty', () => {
      const input = {
        name: '',
        type: 'file',
      };
      const result = CreateItemSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should fail if type is invalid', () => {
      const input = {
        name: 'test',
        type: 'invalid-type',
      };
      const result = CreateItemSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should fail if parentId is not a UUID', () => {
      const input = {
        name: 'test',
        type: 'file',
        parentId: 'not-a-uuid',
      };
      const result = CreateItemSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe('UpdateItemSchema', () => {
    it('should validate valid update input', () => {
      const input = {
        name: 'Updated Name',
      };
      const result = UpdateItemSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should validate moving to another folder', () => {
      const input = {
        parentId: '550e8400-e29b-41d4-a716-446655440000',
      };
      const result = UpdateItemSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should allow setting parentId to null', () => {
      const input = {
        parentId: null,
      };
      const result = UpdateItemSchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });
});
