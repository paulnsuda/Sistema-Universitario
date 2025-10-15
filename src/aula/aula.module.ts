import { Module } from '@nestjs/common';
import { AulasService } from './aula.service';
import { AulasController } from './aula.controller';
import { PrismaModule } from 'src/prisma/prisma.module'; // <-- IMPORTANTE

@Module({
  imports: [PrismaModule], // <-- IMPORTANTE
  controllers: [AulasController],
  providers: [AulasService],
})
export class AulasModule {}