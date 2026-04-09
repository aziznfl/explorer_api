import { Hono } from 'hono';
import { FileItemController } from '../controllers/file-item.controller';
import { DrizzleFileItemRepository } from '../../infrastructure/repositories/drizzle-file-item.repository';
import { QueryOptionsSchema } from '../../domain/dtos/query.dto';

const repository = new DrizzleFileItemRepository();
const controller = new FileItemController(repository);

export const fileItemRoutes = new Hono();

fileItemRoutes.get('/', async (c) => {
  const options = QueryOptionsSchema.parse(c.req.query());
  return c.json(await controller.getAll(options));
});

fileItemRoutes.post('/', async (c) => {
  const body = await c.req.json();
  const result = await controller.create(body);
  return c.json(result, 201);
});

fileItemRoutes.get('/root/children', async (c) => {
  const options = QueryOptionsSchema.parse(c.req.query());
  return c.json(await controller.getRootItems(options));
});

fileItemRoutes.get('/search', async (c) => {
  const query = c.req.query('q') || '';
  const options = QueryOptionsSchema.parse(c.req.query());
  return c.json(await controller.search(query, options));
});

fileItemRoutes.get('/:id/children', async (c) => {
  const id = c.req.param('id');
  const options = QueryOptionsSchema.parse(c.req.query());
  return c.json(await controller.getChildrenOf(id, options));
});

fileItemRoutes.patch('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  return c.json(await controller.update(id, body));
});

fileItemRoutes.delete('/:id', async (c) => {
  const id = c.req.param('id');
  return c.json(await controller.delete(id));
});
