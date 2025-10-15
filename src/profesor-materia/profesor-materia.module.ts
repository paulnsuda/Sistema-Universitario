import { Module } from '@nestjs/common';
import { ProfesorMateriaService } from './profesor-materia.service';
import { ProfesorMateriaController } from './profesor-materia.controller';
import { PrismaModule } from 'src/prisma/prisma.module'; // <-- IMPORTANTE

@Module({
  imports: [PrismaModule], // <-- IMPORTANTE
  controllers: [ProfesorMateriaController],
  providers: [ProfesorMateriaService],
})
export class ProfesorMateriaModule {}