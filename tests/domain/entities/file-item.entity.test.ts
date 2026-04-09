import { describe, expect, it } from 'bun:test';
import { FileItem } from '../../../src/domain/entities/file-item.entity';

describe('FileItem Entity', () => {
  it('should create a FileItem instance correctly', () => {
    const now = new Date();
    const item = new FileItem(
      '1',
      'test-file.txt',
      'file',
      null,
      now,
      now
    );

    expect(item.id).toBe('1');
    expect(item.name).toBe('test-file.txt');
    expect(item.type).toBe('file');
    expect(item.parentId).toBeNull();
    expect(item.createdAt).toBe(now);
    expect(item.updatedAt).toBe(now);
  });

  it('should create a FileItem using static create method', () => {
    const now = new Date();
    const item = FileItem.create(
      '2',
      'test-folder',
      'folder',
      '1',
      now,
      now
    );

    expect(item).toBeInstanceOf(FileItem);
    expect(item.id).toBe('2');
    expect(item.name).toBe('test-folder');
    expect(item.type).toBe('folder');
    expect(item.parentId).toBe('1');
    expect(item.createdAt).toBe(now);
    expect(item.updatedAt).toBe(now);
  });
});
