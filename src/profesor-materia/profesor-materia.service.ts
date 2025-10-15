import { Injectable, ConflictException } from '@nestjs/common';
import { CreateProfesorMateriaDto } from './dto/create-profesor-materia.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ProfesorMateriaService {
  constructor(private prisma: PrismaService) {}

  async create(createProfesorMateriaDto: CreateProfesorMateriaDto) {
    try {
      // Intenta crear el registro de unión
      return await this.prisma.profesor_Materia.create({
        data: createProfesorMateriaDto,
      });
    } catch (error) {
      // Manejo de error de Clave Primaria Duplicada (Código P2002)
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('El profesor ya está asignado a esta materia.');
      }
      throw error;
    }
  }

  // --- MÉTODO AÑADIDO: Lectura de Todas las Asignaciones ---
  findAll() {
    // Usamos 'include' para traer los datos completos de las entidades relacionadas.
    return this.prisma.profesor_Materia.findMany({
      include: {
        profesor: {
          select: { id_profesor: true, nombres: true, apellidos: true },
        },
        materia: {
          select: { id_materia: true, nombre_materia: true, creditos: true },
        },
      },
    });
  }

  // Opcional: Podrías añadir un método 'remove' para eliminar la asignación (ruta DELETE).

}