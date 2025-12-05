import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MateriasService {
  constructor(private prisma: PrismaService) {}

  create(createMateriaDto: CreateMateriaDto) {
    return this.prisma.materia.create({
      data: createMateriaDto, // Ya no lleva id_aula
    });
  }

  findAll() {
    return this.prisma.materia.findMany({
      include: { carrera: true }, // Quitamos 'aula: true'
    });
  }

  async findOne(id: number) {
    const materia = await this.prisma.materia.findUnique({
      where: { id_materia: id },
      include: { carrera: true }, // Quitamos 'aula: true'
    });
    if (!materia) throw new NotFoundException(`Materia ${id} no encontrada`);
    return materia;
  }

  // update y remove suelen funcionar igual si usan el ID
  update(id: number, updateMateriaDto: UpdateMateriaDto) {
    return this.prisma.materia.update({
      where: { id_materia: id },
      data: updateMateriaDto,
    });
  }

  remove(id: number) {
    return this.prisma.materia.delete({ where: { id_materia: id } });
  }
}