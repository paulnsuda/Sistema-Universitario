import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateInscripcioneDto } from './dto/create-inscripcione.dto';
import { UpdateInscripcioneDto } from './dto/update-inscripcione.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class InscripcionesService {
  constructor(private prisma: PrismaService) {}

  async create(createInscripcioneDto: CreateInscripcioneDto) {
    try {
      return await this.prisma.inscripcion.create({
        data: createInscripcioneDto,
      });
    } catch (error) {
      
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('El estudiante ya se encuentra inscrito en esta materia.');
      }
     
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new NotFoundException('El estudiante o la materia especificados no existen.');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.inscripcion.findMany({
      
      include: {
        estudiante: { select: { id_estudiante: true, nombres: true, apellidos: true } },
        materia: { select: { id_materia: true, nombre_materia: true } },
      },
    });
  }

  async findOne(id: number) {
    const inscripcion = await this.prisma.inscripcion.findUnique({
      where: { id_inscripcion: id },
      include: {
        estudiante: { select: { id_estudiante: true, nombres: true, apellidos: true } },
        materia: { select: { id_materia: true, nombre_materia: true } },
      },
    });

    if (!inscripcion) throw new NotFoundException('Inscripción no encontrada');
    return inscripcion;
  }

  async update(id: number, updateInscripcioneDto: UpdateInscripcioneDto) {
    return this.prisma.inscripcion.update({
      where: { id_inscripcion: id },
      data: updateInscripcioneDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id); 
    return this.prisma.inscripcion.delete({
      where: { id_inscripcion: id },
    });
  }
}