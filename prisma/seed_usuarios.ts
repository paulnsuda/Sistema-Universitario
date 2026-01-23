// prisma/seed_usuarios.ts
import { PrismaClient } from '@prisma/client-usuarios';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL_USUARIOS;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seed Usuarios...');

  // 1. Roles
  const rolEstudiante = await prisma.rol.upsert({
    where: { nombre_rol: 'Estudiante' },
    update: {},
    create: { nombre_rol: 'Estudiante' },
  });

  // 2. Estudiante de Prueba (ID: 1)
  const passwordHash = await bcrypt.hash('123456', 10);
  
  const estudiante = await prisma.usuario.upsert({
    where: { email: 'estudiante@test.com' },
    update: { estado: true }, // Aseguramos que esté activo
    create: {
      nombres: 'Pepito',
      apellidos: 'Pérez',
      cedula: '1111111111',
      email: 'estudiante@test.com',
      password: passwordHash,
      id_rol: rolEstudiante.id_rol,
      estado: true, // <--- Importante para tu tarea
      fecha_nacimiento: new Date('2000-01-01'),
    },
  });

  console.log(`✅ Usuario creado: ${estudiante.nombres} (ID: ${estudiante.id_usuario})`);
}

main().catch(e => console.error(e)).finally(async () => { await pool.end(); await prisma.$disconnect(); });