import type { FileItemRepository } from '../../domain/repositories/file-item.repository';
import type { QueryOptions } from '../../domain/dtos/query.dto';
import { createResponse } from '../../domain/dtos/response.dto';

export class SearchItemsUseCase {
  constructor(private readonly repository: FileItemRepository) {}

  async execute(query: string, options?: QueryOptions) {
    const defaultOptions: QueryOptions = { sortBy: 'name', order: 'asc', limit: 50 };
    const queryOpts = options || defaultOptions;
    const limit = queryOpts.limit;

    const data = await this.repository.search(query, { ...queryOpts, limit: limit + 1 });
    
    const hasMore = data.length > limit;
    if (hasMore) {
      data.pop();
    }
    const lastId = data.length > 0 ? data[data.length - 1]?.id : undefined;

    return createResponse(data, { limit, hasMore, lastId });
  }
}
