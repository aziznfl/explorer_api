import type { FileItemRepository } from '../../domain/repositories/file-item.repository';
import type { QueryOptions } from '../../domain/dtos/query.dto';
import { GetAllItemsUseCase } from '../../application/use-cases/get-all-items.use-case';
import { GetChildrenUseCase } from '../../application/use-cases/get-children.use-case';
import { SearchItemsUseCase } from '../../application/use-cases/search-items.use-case';
import { CreateItemUseCase } from '../../application/use-cases/create-item.use-case';
import { UpdateItemUseCase } from '../../application/use-cases/update-item.use-case';
import { DeleteItemUseCase } from '../../application/use-cases/delete-item.use-case';

export class FileItemController {
  private readonly getAllItems: GetAllItemsUseCase;
  private readonly getChildren: GetChildrenUseCase;
  private readonly searchItems: SearchItemsUseCase;
  private readonly createItem: CreateItemUseCase;
  private readonly updateItem: UpdateItemUseCase;
  private readonly deleteItem: DeleteItemUseCase;

  constructor(repository: FileItemRepository) {
    this.getAllItems = new GetAllItemsUseCase(repository);
    this.getChildren = new GetChildrenUseCase(repository);
    this.searchItems = new SearchItemsUseCase(repository);
    this.createItem = new CreateItemUseCase(repository);
    this.updateItem = new UpdateItemUseCase(repository);
    this.deleteItem = new DeleteItemUseCase(repository);
  }

  async getAll(options?: QueryOptions) {
    return this.getAllItems.execute(options);
  }

  async getRootItems(options?: QueryOptions) {
    return this.getChildren.execute(null, options);
  }

  async getChildrenOf(id: string, options?: QueryOptions) {
    return this.getChildren.execute(id, options);
  }

  async search(query: string, options?: QueryOptions) {
    return this.searchItems.execute(query, options);
  }

  async create(body: unknown) {
    return this.createItem.execute(body);
  }

  async update(id: string, body: unknown) {
    return this.updateItem.execute(id, body);
  }

  async delete(id: string) {
    return this.deleteItem.execute(id);
  }
}
