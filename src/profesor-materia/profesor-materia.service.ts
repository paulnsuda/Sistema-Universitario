import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateProfesorMateriaDto } from './dto/create-profesor-materia.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UpdateProfesorMateriaDto } from './dto/update-profesor-materia.dto'; // <-- Importa el nuevo DTO

@Injectable()
export class ProfesorMateriaService {
  constructor(private prisma: PrismaService) {}

  async create(createProfesorMateriaDto: CreateProfesorMateriaDto) {
    try {
      return await this.prisma.profesorMateria.create({
        data: createProfesorMateriaDto,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('El profesor ya está asignado a esta materia.');
      }
      throw error;
    }
  }

  findAll() {
    return this.prisma.profesorMateria.findMany({
      include: {
        profesor: true,
        materia: true,
      },
    });
  }

  async findOne(id: number) {
    const asignacion = await this.prisma.profesorMateria.findUnique({
      where: {
        id: id, // <-- CORREGIDO
      },
      include: {
        profesor: true,
        materia: true,
      },
    });

    if (!asignacion) {
      throw new NotFoundException(`Asignación con ID #${id} no encontrada.`);
    }
    return asignacion;
  }

  async update(id: number, updateProfesorMateriaDto: UpdateProfesorMateriaDto) { // <-- Usa el DTO de Update
    await this.findOne(id);
    return this.prisma.profesorMateria.update({
      where: { id: id },
      data: updateProfesorMateriaDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.profesorMateria.delete({
      where: { id: id },
    });
  }
}