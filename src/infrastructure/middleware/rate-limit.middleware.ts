import { rateLimiter } from 'hono-rate-limiter';
import type { Context } from 'hono';
import { getConnInfo } from 'hono/bun';

export const rateLimitMiddleware = rateLimiter({
  windowMs: 5 * 1000, // 5 seconds
  limit: 50, // 20 requests
  standardHeaders: 'draft-6', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  keyGenerator: (c: Context) => {
    const info = getConnInfo(c);
    return c.req.header('x-forwarded-for') || info?.remote?.address || 'global';
  },
  handler: (c: Context) => {
    return c.json({ meta: { message: 'Too Many Requests', status: 429 } }, 429);
  },
});
