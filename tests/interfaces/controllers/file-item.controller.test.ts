import { describe, expect, it, mock } from 'bun:test';
import { FileItemController } from '../../../src/interfaces/controllers/file-item.controller';
import { FileItem } from '../../../src/domain/entities/file-item.entity';

describe('FileItemController', () => {
  const mockRepository: any = {
    findAll: mock(() => Promise.resolve([])),
    findByParentId: mock(() => Promise.resolve([])),
    create: mock(() => Promise.resolve({})),
    update: mock(() => Promise.resolve({})),
    delete: mock(() => Promise.resolve(true)),
  };

  const controller = new FileItemController(mockRepository);

  it('should call repository.findAll when getAll is called', async () => {
    const items = [
      new FileItem('1', 'file1.txt', 'file', null, new Date(), new Date())
    ];
    mockRepository.findAll.mockResolvedValue(items);

    const result = await controller.getAll();
    expect(result.data).toBe(items);
    expect(result.meta.status).toBe(200);
    expect(mockRepository.findAll).toHaveBeenCalled();
  });

  it('should call repository.findByParentId(null) when getRootItems is called', async () => {
    await controller.getRootItems();
    expect(mockRepository.findByParentId).toHaveBeenCalledWith(null);
  });

  it('should call repository.findByParentId(id) when getChildrenOf is called', async () => {
    const id = 'some-uuid';
    await controller.getChildrenOf(id);
    expect(mockRepository.findByParentId).toHaveBeenCalledWith(id);
  });

  it('should call repository.create with validated body', async () => {
    const body = {
      name: 'New Folder',
      type: 'folder',
    };
    const createdItem = new FileItem('1', body.name, body.type as any, null, new Date(), new Date());
    mockRepository.create.mockResolvedValue(createdItem);

    const result = await controller.create(body);
    expect(result.data).toBe(createdItem);
    expect(result.meta.message).toBe('Item created successfully');
    expect(mockRepository.create).toHaveBeenCalled();
  });

  it('should call repository.update with validated body', async () => {
    const id = '1';
    const body = {
      name: 'Updated Name',
    };
    const updatedItem = new FileItem(id, body.name, 'file', null, new Date(), new Date());
    mockRepository.update.mockResolvedValue(updatedItem);

    const result = await controller.update(id, body);
    expect(result.data).toBe(updatedItem);
    expect(result.meta.message).toBe('Item updated successfully');
    expect(mockRepository.update).toHaveBeenCalledWith(id, expect.any(Object));
  });

  it('should call repository.delete and return success', async () => {
    const id = '1';
    mockRepository.delete.mockResolvedValue(true);

    const result = await controller.delete(id);
    expect(result.data).toEqual({ success: true });
    expect(result.meta.message).toBe('Item deleted successfully');
    expect(mockRepository.delete).toHaveBeenCalledWith(id);
  });

  it('should throw error if repository.delete returns false', async () => {
    const id = 'non-existent';
    mockRepository.delete.mockResolvedValue(false);

    expect(controller.delete(id)).rejects.toThrow('Item not found');
  });
});
