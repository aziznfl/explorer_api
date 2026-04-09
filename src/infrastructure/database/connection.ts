import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const client = postgres({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || 'aziznurfalah',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'web_explorer',
});

export const db = drizzle(client);
export { client };