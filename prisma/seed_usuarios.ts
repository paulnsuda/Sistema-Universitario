// prisma/seed_usuarios.ts
import { PrismaClient } from '@prisma/client-usuarios'; // Tu cliente específico
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

// 1. Cargar variables de entorno
dotenv.config();

const connectionString = process.env.DATABASE_URL_USUARIOS;

if (!connectionString) {
  console.error('❌ ERROR FATAL: No existe DATABASE_URL_USUARIOS en el .env');
  process.exit(1);
}

// 2. Configurar el Adaptador (La forma correcta en Prisma 7 + Config)
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// 3. Inicializar Prisma usando el 'adapter'
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando Seed de Usuarios (Vía Adapter)...');

  // --- CREAR ROLES ---
  const rolAdmin = await prisma.rol.upsert({
    where: { nombre_rol: 'Admin' },
    update: {},
    create: { nombre_rol: 'Admin' },
  });

  await prisma.rol.upsert({
    where: { nombre_rol: 'Estudiante' },
    update: {},
    create: { nombre_rol: 'Estudiante' },
  });

  await prisma.rol.upsert({
    where: { nombre_rol: 'Profesor' },
    update: {},
    create: { nombre_rol: 'Profesor' },
  });

  console.log('✅ Roles verificados');

  // --- CREAR USUARIO ADMIN ---
  const passwordHash = await bcrypt.hash('admin123', 10);

  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@universidad.edu.ec' },
    update: {},
    create: {
      nombres: 'Super',
      apellidos: 'Administrador',
      cedula: '0101010101',
      email: 'admin@universidad.edu.ec',
      password: passwordHash,
      id_rol: rolAdmin.id_rol,
      fecha_nacimiento: new Date(),
    },
  });

  console.log(`✅ Usuario Admin creado: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error('❌ Error ejecutando el Seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Cerramos el pool de conexiones al terminar
    await pool.end(); 
    await prisma.$disconnect();
  });