import { Elysia } from 'elysia';
import { FileItemController } from '../controllers/file-item.controller';
import { DrizzleFileItemRepository } from '../../infrastructure/repositories/drizzle-file-item.repository';
import { QueryOptionsSchema } from '../../domain/dtos/query.dto';

const controller = new FileItemController(new DrizzleFileItemRepository());

export const fileItemRoutes = new Elysia({ prefix: '/items' })
  .get('/', async ({ query }) => {
    const options = QueryOptionsSchema.parse(query);
    return controller.getChildren(
      query.parentId ?? null,
      options,
      query.keyword ?? undefined
    );
  })
  .post('/', async ({ body, set }) => {
    set.status = 201;
    return controller.create(body);
  })
  .patch('/:id', async ({ params: { id }, body }) => {
    return controller.update(id, body);
  })
  .delete('/:id', async ({ params: { id } }) => {
    return controller.delete(id);
  });
