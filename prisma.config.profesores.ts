import { defineConfig } from '@prisma/config';
import "dotenv/config"; // Carga las variables del archivo .env

export default defineConfig({
  // Apuntamos al archivo schema específico
  schema: 'prisma/schema_profesores.prisma',
  
  // Definimos dónde se guardarán las migraciones
  migrations: {
    path: 'prisma/migrations_profesores',
  },

  // Aquí inyectamos la conexión
  datasource: {
    url: process.env.DATABASE_URL_PROFESORES, 
  },
});