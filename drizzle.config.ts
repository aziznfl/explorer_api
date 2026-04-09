import type { Config } from 'drizzle-kit';

export default {
  schema: './src/infrastructure/database/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || 'aziznurfalah',
    password: process.env.DB_PASSWORD || undefined,
    database: process.env.DB_NAME || 'web_explorer',
  },
} satisfies Config;
