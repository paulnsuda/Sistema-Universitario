import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

// Módulos Académicos
import { CarrerasModule } from './carreras/carreras.module';
import { MateriaModule } from './materia/materia.module';
import { CiclosModule } from './ciclos/ciclos.module';
import { InscripcionesModule } from './inscripciones/inscripciones.module';
import { ProfesoresModule } from './profesores/profesores.module'; // <--- 1. AGREGAR ESTA IMPORTACIÓN

// Módulos de Usuarios y Seguridad
import { UsuariosModule } from './usuarios/usuarios.module';
import { RolesModule } from './roles/roles.module';
import { PermisosModule } from './permisos/permisos.module';
import { RolPermisoModule } from './rol-permiso/rol-permiso.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env',
    }),

    // Base de datos y Auth
    PrismaModule,
    AuthModule,

    // Seguridad
    UsuariosModule,
    RolesModule,
    PermisosModule,
    RolPermisoModule,

    // Académico
    CarrerasModule,
    MateriaModule,
    CiclosModule,
    InscripcionesModule,
    ProfesoresModule, // <--- 2. AGREGAR EL MÓDULO AQUÍ
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}