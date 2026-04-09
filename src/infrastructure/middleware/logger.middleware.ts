import type { MiddlewareHandler } from 'hono';

export const loggerMiddleware: MiddlewareHandler = async (c, next) => {
  const start = Date.now();
  const ip = c.req.header('x-forwarded-for') ?? 'unknown';
  
  await next();
  
  const ms = Date.now() - start;
  const time = new Date().toISOString().replace('T', ' ').substring(0, 19);
  
  const query = c.req.query();
  const params = c.req.param();
  const combinedParams = { ...query, ...params };
  const paramObject = Object.keys(combinedParams).length > 0 
    ? ` ${JSON.stringify(combinedParams)}` 
    : '';

  console.log(
    `${time} | ${c.res.status} | ${ms}ms | ${ip} | ${c.req.method.padEnd(8)} "${c.req.path}"${paramObject}`
  );
};
