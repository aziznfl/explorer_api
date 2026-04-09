import { Hono } from 'hono';
import { FileItemController } from '../controllers/file-item.controller';
import { DrizzleFileItemRepository } from '../../infrastructure/repositories/drizzle-file-item.repository';
import { QueryOptionsSchema } from '../../domain/dtos/query.dto';
import type { Context } from 'hono';

const controller = new FileItemController(new DrizzleFileItemRepository());
const parseOptions = (c: Context) => QueryOptionsSchema.parse(c.req.query());

export const fileItemRoutes = new Hono();

// GET /?parentId=<id>&keyword=<q>
fileItemRoutes.get('/', async (c) => c.json(await controller.getChildren(
  c.req.query('parentId') ?? null,
  parseOptions(c),
  c.req.query('keyword'),
)));
fileItemRoutes.post('/', async (c) => c.json(await controller.create(await c.req.json()), 201));
fileItemRoutes.patch('/:id', async (c) => c.json(await controller.update(c.req.param('id'), await c.req.json())));
fileItemRoutes.delete('/:id', (c) => c.json(controller.delete(c.req.param('id'))));
