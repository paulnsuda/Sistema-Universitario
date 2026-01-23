// prisma/seed_profesores.ts
import { PrismaClient } from '@prisma/client-profesores';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL_PROFESORES;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seed Profesores...');

  // 1. Profesor ACTIVO y TIEMPO COMPLETO (Debe salir en el filtro)
  const profe1 = await prisma.profesor.create({
    data: {
      nombres: 'Juan',
      apellidos: 'Docente',
      cedula: '2222222222' + Math.floor(Math.random() * 1000),
      email: 'juan.docente@test.com' + Math.floor(Math.random() * 1000),
      tipo_contrato: 'TIEMPO_COMPLETO',
      activo: true,
      // Le asignamos 2 materias (ID 1 y 2 simuladas) para probar "Multimateria"
      materias_asignadas: {
        create: [
          { id_materia: 1 },
          { id_materia: 2 }
        ]
      }
    }
  });

  // 2. Profesor MEDIO TIEMPO (Solo para control)
  await prisma.profesor.create({
    data: {
      nombres: 'Maria',
      apellidos: 'Auxiliar',
      cedula: '3333333333' + Math.floor(Math.random() * 1000),
      email: 'maria.aux@test.com' + Math.floor(Math.random() * 1000),
      tipo_contrato: 'MEDIO_TIEMPO',
      activo: true
    }
  });

  console.log(`✅ Profesor creado: ${profe1.nombres} (Tiempo Completo, 2 Materias)`);
}

main().catch(e => console.error(e)).finally(async () => { await pool.end(); await prisma.$disconnect(); });