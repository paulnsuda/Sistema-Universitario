import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

// Módulos Académicos
import { CarrerasModule } from './carreras/carreras.module';
import { MateriaModule } from './materia/materia.module';
import { CiclosModule } from './ciclos/ciclos.module';
import { InscripcionesModule } from './inscripciones/inscripciones.module';

// Módulos de Usuarios y Seguridad
import { UsuariosModule } from './usuarios/usuarios.module'; // <--- Verifica que esta ruta sea correcta
import { RolesModule } from './roles/roles.module';
import { PermisosModule } from './permisos/permisos.module';
import { RolPermisoModule } from './rol-permiso/rol-permiso.module';

@Module({
  imports: [
    // Base de datos y Auth
    PrismaModule,
    AuthModule,

    // Usuarios y Roles (Seguridad)
    UsuariosModule,
    RolesModule,
    PermisosModule,
    RolPermisoModule,

    // Académico
    CarrerasModule,
    MateriaModule,
    CiclosModule,
    InscripcionesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}