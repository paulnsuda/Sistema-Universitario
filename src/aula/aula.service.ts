import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AulasService {
  constructor(private prisma: PrismaService) {}

  create(createAulaDto: CreateAulaDto) {
    return this.prisma.aula.create({
      data: createAulaDto,
    });
  }

  findAll() {
    return this.prisma.aula.findMany();
  }

  async findOne(id: number) {
    const aula = await this.prisma.aula.findUnique({
      where: { id_aula: id },
    });

    if (!aula) {
      throw new NotFoundException(`Aula con ID #${id} no encontrada`);
    }
    return aula;
  }

  update(id: number, updateAulaDto: UpdateAulaDto) {
    return this.prisma.aula.update({
      where: { id_aula: id },
      data: updateAulaDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Reutilizamos findOne para verificar si existe
    return this.prisma.aula.delete({
      where: { id_aula: id },
    });
  }
}