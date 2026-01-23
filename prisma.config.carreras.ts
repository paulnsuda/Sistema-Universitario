import { defineConfig, env } from '@prisma/config';
import "dotenv/config";

export default defineConfig({
  // Apunta a tu archivo de esquema específico
  schema: 'prisma/schema_carreras.prisma',
  
  // Carpeta de migraciones separada
  migrations: {
    path: "prisma/migrations_carreras",
  },

  // Inyección de la conexión a DB
  datasource: {
    url: env("DATABASE_URL_CARRERAS"), 
  },
});