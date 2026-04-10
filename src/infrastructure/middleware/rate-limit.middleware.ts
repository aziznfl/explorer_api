import { rateLimit } from 'elysia-rate-limit';

export const rateLimitMiddleware = rateLimit({
  duration: 5000, // 5 seconds
  max: 50, // 50 requests
  generator: (request) => {
    return request.headers.get('x-forwarded-for') || 'global';
  },
  errorResponse: new Response(
    JSON.stringify({ meta: { message: 'Too Many Requests', status: 429 } }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  ),
});
