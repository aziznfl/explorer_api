import { cors } from '@elysiajs/cors';

export const corsMiddleware = cors({
  origin: true, // Will mirror the origin
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400,
});
