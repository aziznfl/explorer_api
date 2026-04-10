import { Elysia } from 'elysia';
import { fileItemRoutes } from './interfaces/routes/file-item.routes';
import { loggerMiddleware } from './infrastructure/middleware/logger.middleware';
import { corsMiddleware } from './infrastructure/middleware/cors.middleware';
import { rateLimitMiddleware } from './infrastructure/middleware/rate-limit.middleware';
import { originGuardMiddleware } from './infrastructure/middleware/origin-guard.middleware';
import { NotFoundError } from './domain/errors/not-found.error';
import { ZodError } from 'zod';

const port = process.env.PORT || 3000;

const app = new Elysia()
  .use(loggerMiddleware)
  .use(corsMiddleware)
  .use(rateLimitMiddleware)
  .use(originGuardMiddleware)
  .onError(({ code, error, set }) => {
    if (error instanceof ZodError) {
      set.status = 400;
      return { meta: { message: 'Validation Error', status: 400, errors: error.issues } };
    }
    if (error instanceof NotFoundError) {
      set.status = 404;
      return { meta: { message: error.message, status: 404 } };
    }
    if (code === 'NOT_FOUND') {
      set.status = 404;
      return { meta: { message: 'Not Found', status: 404 } };
    }
    
    console.error(error);
    set.status = 500;
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { meta: { message: errorMessage || 'Internal Server Error', status: 500 } };
  })
  .group('/v1', (app) => app.use(fileItemRoutes))
  .listen(port);

console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);

export default app;
