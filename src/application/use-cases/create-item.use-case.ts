import type { FileItemRepository } from '../../domain/repositories/file-item.repository';
import { CreateItemSchema } from '../../domain/dtos/file-item.dto';
import { createResponse } from '../../domain/dtos/response.dto';

export class CreateItemUseCase {
  constructor(private readonly repository: FileItemRepository) {}

  async execute(body: unknown) {
    const validated = CreateItemSchema.parse(body);
    const data = await this.repository.create(validated);
    return createResponse(data, { message: 'Item created successfully' });
  }
}
