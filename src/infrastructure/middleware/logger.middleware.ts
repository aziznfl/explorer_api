import { Elysia } from 'elysia';

export const loggerMiddleware = new Elysia()
  .derive({ as: 'global' }, ({ request }) => {
    return {
      start: Date.now(),
      ip: request.headers.get('x-forwarded-for') ?? 'unknown'
    };
  })
  .onAfterHandle({ as: 'global' }, ({ request, start, ip, query, params, set }) => {
    const ms = Date.now() - start;
    const time = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    // In Elysia, set.status is where the response status is kept or it defaults to 200
    const status = set.status || 200;
    
    const combinedParams = { ...(query || {}), ...(params || {}) };
    const paramObject = Object.keys(combinedParams).length > 0 
      ? ` ${JSON.stringify(combinedParams)}` 
      : '';

    console.log(
      `${time} | ${status} | ${ms}ms | ${ip} | ${request.method.padEnd(8)} "${new URL(request.url).pathname}"${paramObject}`
    );
  });
