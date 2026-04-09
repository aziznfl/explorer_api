import { Hono } from 'hono';
import { ZodError } from 'zod';
import { fileItemRoutes } from './interfaces/routes/file-item.routes';
import { loggerMiddleware } from './infrastructure/middleware/logger.middleware';
import { corsMiddleware } from './infrastructure/middleware/cors.middleware';
import { rateLimitMiddleware } from './infrastructure/middleware/rate-limit.middleware';
import { originGuardMiddleware } from './infrastructure/middleware/origin-guard.middleware';
import { NotFoundError } from './domain/errors/not-found.error';

const app = new Hono();

// Global Error Handler
app.onError((err, c) => {
  if (err instanceof ZodError) {
    return c.json({ meta: { message: 'Validation Error', status: 400, errors: err.issues } }, 400);
  }
  if (err instanceof NotFoundError) {
    return c.json({ meta: { message: err.message, status: 404 } }, 404);
  }
  console.error(err);
  return c.json({ meta: { message: err.message || 'Internal Server Error', status: 500 } }, 500);
});

app.use('/*', loggerMiddleware);
app.use('/*', corsMiddleware);
app.use('/*', rateLimitMiddleware);
app.use('/*', originGuardMiddleware);

const api = new Hono();

const v1 = new Hono();
v1.route('/items', fileItemRoutes);

api.route('/v1', v1);

app.route('/', api);

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};

console.log(`🦊 Hono is running at http://localhost:${process.env.PORT || 3000}`);
