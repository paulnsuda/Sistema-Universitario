// prisma/seed_carreras.ts
import { PrismaClient } from '@prisma/client-carreras';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL_CARRERAS;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seed Carreras...');

  // 1. Carrera
  const carrera = await prisma.carrera.create({
    data: {
      nombre_carrera: 'Ingeniería de Software ' + Date.now(), // Random para no repetir unique
      duracion_semestres: 9
    }
  });

  // 2. Materia (ID: 1 idealmente)
  const materia = await prisma.materia.create({
    data: {
      nombre_materia: 'Arquitectura de Software',
      creditos: 4,
      cupos: 30, // <--- Importante para la transacción
      id_carrera: carrera.id_carrera
    }
  });

  // 3. Ciclo (Periodo Académico)
  const ciclo = await prisma.ciclo.create({
    data: {
      nombre_ciclo: '2025-I ' + Date.now(),
      fecha_inicio: new Date(),
      fecha_fin: new Date(new Date().setMonth(new Date().getMonth() + 5))
    }
  });

  console.log(`✅ Datos creados:`);
  console.log(`   - Carrera ID: ${carrera.id_carrera}`);
  console.log(`   - Materia ID: ${materia.id_materia} (Cupos: 30)`);
  console.log(`   - Ciclo ID: ${ciclo.id_ciclo}`);
}

main().catch(e => console.error(e)).finally(async () => { await pool.end(); await prisma.$disconnect(); });