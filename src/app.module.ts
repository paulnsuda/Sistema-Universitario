import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { EstudiantesModule } from './estudiantes/estudiantes.module';

import { ProfesoresModule } from './profesores/profesores.module';
import { CarrerasModule } from './carreras/carreras.module';
import { AulasModule } from './aula/aula.module';
import { MateriaModule } from './materia/materia.module';
import { TitulosModule } from './titulos/titulos.module';
import { ProfesorMateriaModule } from './profesor-materia/profesor-materia.module';
import { InscripcionesModule } from './inscripciones/inscripciones.module';

@Module({
  imports: [PrismaModule, EstudiantesModule, ProfesoresModule, CarrerasModule, AulasModule, MateriaModule, TitulosModule, ProfesorMateriaModule, InscripcionesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
