import type { FileItemRepository } from '../../domain/repositories/file-item.repository';
import type { QueryOptions } from '../../domain/dtos/query.dto';
import { createResponse } from '../../domain/dtos/response.dto';

export class GetChildrenUseCase {
  constructor(private readonly repository: FileItemRepository) {}

  async execute(parentId: string | null, options?: QueryOptions, keyword?: string) {
    const defaultOptions: QueryOptions = { sortBy: 'name', order: 'asc', limit: 50 };
    const queryOpts = options || defaultOptions;
    const limit = queryOpts.limit;

    const data = keyword
      ? await this.repository.search(keyword, { ...queryOpts, limit: limit + 1 }, parentId)
      : await this.repository.findByParentId(parentId, { ...queryOpts, limit: limit + 1 });

    const hasMore = data.length > limit;
    if (hasMore) data.pop();
    const lastId = data.length > 0 ? data[data.length - 1]?.id : undefined;

    return createResponse(data, { limit, hasMore, lastId });
  }
}
