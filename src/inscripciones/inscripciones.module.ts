import { Module } from '@nestjs/common';
import { InscripcionesService } from './inscripciones.service';
import { InscripcionesController } from './inscripciones.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Importante para acceder a las DBs

@Module({
  imports: [PrismaModule], 
  controllers: [InscripcionesController],
  providers: [InscripcionesService],
})
export class InscripcionesModule {}