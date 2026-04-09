import { eq, isNull, ilike, asc, desc, sql, or, and, gt, lt } from 'drizzle-orm';
import { db } from '../database/connection';
import { fileSystemItems } from '../database/schema';
import { FileItem } from '../../domain/entities/file-item.entity';
import type { FileItemRepository } from '../../domain/repositories/file-item.repository';
import type { CreateItemDto, UpdateItemDto } from '../../domain/dtos/file-item.dto';
import type { QueryOptions } from '../../domain/dtos/query.dto';

type UpdateData = Partial<{
  name: string;
  parentId: string | null;
  extension: string | null;
  updatedAt: Date;
}>;

export class DrizzleFileItemRepository implements FileItemRepository {
  private mapRowToEntity(row: typeof fileSystemItems.$inferSelect): FileItem {
    return FileItem.create(
      row.id,
      row.name,
      row.type,
      row.extension,
      row.parentId,
      row.createdAt,
      row.updatedAt
    );
  }

  private getOrderBy(options: QueryOptions) {
    const { sortBy, order } = options;
    const direction = order === 'asc' ? asc : desc;

    switch (sortBy) {
      case 'name':
        return [direction(sql`lower(${fileSystemItems.name})`), direction(fileSystemItems.id)];
      case 'kind':
        return [
          direction(fileSystemItems.type),
          direction(sql`lower(${fileSystemItems.extension})`),
          direction(sql`lower(${fileSystemItems.name})`),
          direction(fileSystemItems.id),
        ];
      case 'createdAt':
        return [direction(fileSystemItems.createdAt), direction(fileSystemItems.id)];
      default:
        return [asc(fileSystemItems.type), asc(sql`lower(${fileSystemItems.name})`), asc(fileSystemItems.id)];
    }
  }

  private getCursorCondition(lastItem: typeof fileSystemItems.$inferSelect, options: QueryOptions) {
    const { sortBy, order } = options;
    const isAsc = order === 'asc';
    const opGt = isAsc ? (a: any, b: any) => gt(a, b) : (a: any, b: any) => lt(a, b);

    switch (sortBy) {
      case 'name': {
        const nameCol = sql`lower(${fileSystemItems.name})`;
        const lastName = lastItem.name.toLowerCase();
        return or(
          opGt(nameCol, lastName),
          and(eq(nameCol, lastName), opGt(fileSystemItems.id, lastItem.id))
        );
      }
      case 'createdAt': {
        return or(
          opGt(fileSystemItems.createdAt, lastItem.createdAt),
          and(eq(fileSystemItems.createdAt, lastItem.createdAt), opGt(fileSystemItems.id, lastItem.id))
        );
      }
      case 'kind': {
        const typeCol = fileSystemItems.type;
        const lastType = lastItem.type;

        const extCol = sql`lower(coalesce(${fileSystemItems.extension}, ''))`;
        const lastExt = (lastItem.extension || '').toLowerCase();

        const nameCol = sql`lower(${fileSystemItems.name})`;
        const lastName = lastItem.name.toLowerCase();

        return or(
          opGt(typeCol, lastType),
          and(eq(typeCol, lastType), opGt(extCol, lastExt)),
          and(eq(typeCol, lastType), eq(extCol, lastExt), opGt(nameCol, lastName)),
          and(eq(typeCol, lastType), eq(extCol, lastExt), eq(nameCol, lastName), opGt(fileSystemItems.id, lastItem.id))
        );
      }
      default: {
        const typeCol = fileSystemItems.type;
        const lastType = lastItem.type;
        const nameCol = sql`lower(${fileSystemItems.name})`;
        const lastName = lastItem.name.toLowerCase();

        return or(
          opGt(typeCol, lastType),
          and(eq(typeCol, lastType), opGt(nameCol, lastName)),
          and(eq(typeCol, lastType), eq(nameCol, lastName), opGt(fileSystemItems.id, lastItem.id))
        );
      }

    }
  }

  async findAll(options: QueryOptions = { sortBy: 'name', order: 'asc', limit: 50 }): Promise<FileItem[]> {
    let cursorClause = undefined;
    if (options.lastId) {
      const [lastItem] = await db.select().from(fileSystemItems).where(eq(fileSystemItems.id, options.lastId));
      if (lastItem) cursorClause = this.getCursorCondition(lastItem, options);
    }

    const results = await db.select()
      .from(fileSystemItems)
      .where(cursorClause)
      .orderBy(...this.getOrderBy(options))
      .limit(options.limit);
    return results.map((row) => this.mapRowToEntity(row));
  }

  async findById(id: string): Promise<FileItem | null> {
    const [result] = await db.select().from(fileSystemItems).where(eq(fileSystemItems.id, id));
    if (!result) return null;
    return this.mapRowToEntity(result);
  }

  async findByParentId(parentId: string | null, options: QueryOptions = { sortBy: 'name', order: 'asc', limit: 50 }): Promise<FileItem[]> {
    let whereClause: any = parentId && parentId !== 'root'
      ? eq(fileSystemItems.parentId, parentId)
      : isNull(fileSystemItems.parentId);

    if (options.lastId) {
      const [lastItem] = await db.select().from(fileSystemItems).where(eq(fileSystemItems.id, options.lastId));
      if (lastItem) {
        whereClause = and(whereClause, this.getCursorCondition(lastItem, options));
      }
    }

    const results = await db.select()
      .from(fileSystemItems)
      .where(whereClause)
      .orderBy(...this.getOrderBy(options))
      .limit(options.limit);

    return results.map((row) => this.mapRowToEntity(row));
  }

  async search(query: string, options: QueryOptions = { sortBy: 'name', order: 'asc', limit: 50 }): Promise<FileItem[]> {
    let whereClause: any = ilike(fileSystemItems.name, `%${query}%`);

    if (options.lastId) {
      const [lastItem] = await db.select().from(fileSystemItems).where(eq(fileSystemItems.id, options.lastId));
      if (lastItem) {
        whereClause = and(whereClause, this.getCursorCondition(lastItem, options));
      }
    }

    const results = await db.select()
      .from(fileSystemItems)
      .where(whereClause)
      .orderBy(...this.getOrderBy(options))
      .limit(options.limit);
    return results.map((row) => this.mapRowToEntity(row));
  }

  async create(data: CreateItemDto): Promise<FileItem> {
    const extension = data.type === 'file' ? data.name.split('.').pop() ?? null : null;
    const [result] = await db.insert(fileSystemItems).values({
      name: data.name,
      type: data.type,
      extension,
      parentId: data.parentId ?? null,
    }).returning();
    if (!result) throw new Error('Failed to create item');
    return this.mapRowToEntity(result);
  }

  async update(id: string, data: UpdateItemDto): Promise<FileItem | null> {
    const updateData: UpdateData = { ...data, updatedAt: new Date() };

    if (data.name) {
      const [item] = await db.select().from(fileSystemItems).where(eq(fileSystemItems.id, id));
      if (item?.type === 'file') {
        updateData.extension = data.name.split('.').pop() ?? null;
      }
    }

    const [result] = await db.update(fileSystemItems)
      .set(updateData)
      .where(eq(fileSystemItems.id, id))
      .returning();

    if (!result) return null;
    return this.mapRowToEntity(result);
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(fileSystemItems).where(eq(fileSystemItems.id, id)).returning();
    return result.length > 0;
  }
}
