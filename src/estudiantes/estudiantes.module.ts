import { Module } from '@nestjs/common';
import { EstudiantesService } from './estudiantes.service';
import { EstudiantesController } from './estudiantes.controller';
import { PrismaModule } from '../prisma/prisma.module';  // 👈 importa PrismaModule

@Module({
  imports: [PrismaModule], // 👈 agrega esto
  controllers: [EstudiantesController],
  providers: [EstudiantesService],
})
export class EstudiantesModule {}
