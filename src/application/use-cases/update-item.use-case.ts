import type { FileItemRepository } from '../../domain/repositories/file-item.repository';
import { UpdateItemSchema } from '../../domain/dtos/file-item.dto';
import { createResponse } from '../../domain/dtos/response.dto';
import { NotFoundError } from '../../domain/errors/not-found.error';

export class UpdateItemUseCase {
  constructor(private readonly repository: FileItemRepository) {}

  async execute(id: string, body: unknown) {
    const validated = UpdateItemSchema.parse(body);
    const data = await this.repository.update(id, validated);
    if (!data) throw new NotFoundError('Item');
    return createResponse(data, { message: 'Item updated successfully' });
  }
}
