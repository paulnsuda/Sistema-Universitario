import { Injectable, ConflictException, NotFoundException,BadRequestException } from '@nestjs/common';
import { CreateInscripcioneDto } from './dto/create-inscripcione.dto';
import { UpdateInscripcioneDto } from './dto/update-inscripcione.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client'; // <--- CAMBIO 1: Importar 'Prisma' namespace

@Injectable()
export class InscripcionesService {
  constructor(private prisma: PrismaService) {}

async create(createInscripcioneDto: CreateInscripcioneDto) {
    try {
      // 1. Mapeo de datos (usamos 'any' para evitar conflictos temporales de tipos)
      const { id_estudiante, semestre, ...rest } = createInscripcioneDto as any;

      // 2. VALIDACIÓN OBLIGATORIA:
      // El ciclo es obligatorio en la BD. Si no viene, lanzamos error.
      if (!rest.id_ciclo) {
        throw new BadRequestException('El ID del ciclo es obligatorio.');
      }

      return await this.prisma.inscripcion.create({
        data: {
          // Asignamos id_estudiante (del DTO) al campo id_usuario (de la BD)
          id_usuario: id_estudiante, 
          id_materia: rest.id_materia,
          calificacion_final: rest.calificacion_final,
          
          // Como ya validamos arriba, aquí es seguro convertirlo
          id_ciclo: Number(rest.id_ciclo),
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('El usuario ya está inscrito en esta materia y ciclo.');
        }
        if (error.code === 'P2003') {
          throw new NotFoundException('Usuario, Materia o Ciclo no encontrados.');
        }
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.inscripcion.findMany({
      include: {
        usuario: { select: { id_usuario: true, nombres: true, apellidos: true } },
        materia: { select: { id_materia: true, nombre_materia: true } },
        ciclo: true,
      },
    });
  }

  async findOne(id: number) {
    const inscripcion = await this.prisma.inscripcion.findUnique({
      where: { id_inscripcion: id },
      include: {
        usuario: { select: { id_usuario: true, nombres: true, apellidos: true } },
        materia: { select: { id_materia: true, nombre_materia: true } },
        ciclo: true,
      },
    });

    if (!inscripcion) throw new NotFoundException('Inscripción no encontrada');
    return inscripcion;
  }

  async update(id: number, updateInscripcioneDto: UpdateInscripcioneDto) {
    await this.findOne(id);
    
    // Mapeo para update
    const { id_estudiante, ...rest } = updateInscripcioneDto as any;
    const dataToUpdate: any = { ...rest };
    
    if (id_estudiante) {
        dataToUpdate.id_usuario = id_estudiante;
    }

    return this.prisma.inscripcion.update({
      where: { id_inscripcion: id },
      data: dataToUpdate,
    });
  }

  async remove(id: number) {
    await this.findOne(id); 
    return this.prisma.inscripcion.delete({
      where: { id_inscripcion: id },
    });
  }
}