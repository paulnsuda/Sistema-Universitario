import { defineConfig } from '@prisma/config';

export default defineConfig({
  schema: 'schema.prisma',
  datasource: {
    provider: 'postgresql',
    url: process.env.DATABASE_URL_USUARIOS,
  },
});