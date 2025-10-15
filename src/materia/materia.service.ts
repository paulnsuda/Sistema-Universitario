import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MateriasService {
  constructor(private prisma: PrismaService) {}

  create(createMateriaDto: CreateMateriaDto) {
    // Prisma se encarga de crear la materia y enlazar las claves foráneas.
    return this.prisma.materia.create({
      data: createMateriaDto,
    });
  }

  findAll() {
    // Usamos 'include' para que la respuesta también traiga la información de la carrera y el aula.
    return this.prisma.materia.findMany({
      include: {
        carrera: true,
        aula: true,
      },
    });
  }

  async findOne(id: number) {
    const materia = await this.prisma.materia.findUnique({
      where: { id_materia: id },
      include: {
        carrera: true,
        aula: true,
      },
    });

    if (!materia) {
      throw new NotFoundException(`Materia con ID #${id} no encontrada`);
    }
    return materia;
  }

  update(id: number, updateMateriaDto: UpdateMateriaDto) {
    return this.prisma.materia.update({
      where: { id_materia: id },
      data: updateMateriaDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.materia.delete({
      where: { id_materia: id },
    });
  }
}