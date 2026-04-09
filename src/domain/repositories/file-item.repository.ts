import { FileItem } from '../entities/file-item.entity';
import type { CreateItemDto, UpdateItemDto } from '../dtos/file-item.dto';
import type { QueryOptions } from '../dtos/query.dto';

export interface FileItemRepository {
  findAll(options?: QueryOptions): Promise<FileItem[]>;
  findById(id: string): Promise<FileItem | null>;
  findByParentId(parentId: string | null, options?: QueryOptions): Promise<FileItem[]>;
  search(query: string, options?: QueryOptions, parentId?: string | null): Promise<FileItem[]>;
  create(data: CreateItemDto): Promise<FileItem>;
  update(id: string, data: UpdateItemDto): Promise<FileItem | null>;
  delete(id: string): Promise<boolean>;
}
