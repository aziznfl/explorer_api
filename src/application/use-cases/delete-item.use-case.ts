import type { FileItemRepository } from '../../domain/repositories/file-item.repository';
import { createResponse } from '../../domain/dtos/response.dto';
import { NotFoundError } from '../../domain/errors/not-found.error';

export class DeleteItemUseCase {
  constructor(private readonly repository: FileItemRepository) {}

  async execute(id: string) {
    const success = await this.repository.delete(id);
    if (!success) throw new NotFoundError('Item');
    return createResponse({ success: true }, { message: 'Item deleted successfully' });
  }
}
