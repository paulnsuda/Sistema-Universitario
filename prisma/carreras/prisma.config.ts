import { defineConfig } from '@prisma/config';

export default defineConfig({
  schema: 'schema.prisma', // Apunta a tu archivo schema local
  datasource: {
    provider: 'postgresql',
    url: process.env.DATABASE_URL_CARRERAS, // Usa la variable de entorno correcta
  },
});