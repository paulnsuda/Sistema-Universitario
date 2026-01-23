import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfesorDto } from './dto/create-profesore.dto';
import { UpdateProfesoreDto } from './dto/update-profesore.dto';
import { PrismaProfesoresService } from '../prisma/prisma-profesores.service';

@Injectable()
export class ProfesoresService {
  constructor(private prisma: PrismaProfesoresService) {}

  // --- CRUD BÁSICO ---
  async create(createProfesorDto: CreateProfesorDto) {
    const { titulos, materias_asignadas, ...profesorData } = createProfesorDto;

    return this.prisma.profesor.create({
      data: {
        ...profesorData,
        titulos: { create: titulos },
        // Si quisieras crear materias asignadas al inicio:
        // materias_asignadas: { create: materias_asignadas } 
      },
      include: { titulos: true, materias_asignadas: true },
    });
  }

  async findAll() {
    return this.prisma.profesor.findMany({
      include: { titulos: true, materias_asignadas: true }, 
    });
  }

  async findOne(id: number) {
    const profesor = await this.prisma.profesor.findUnique({
      where: { id_profesor: id },
      include: { titulos: true, materias_asignadas: true }, 
    });
    if (!profesor) throw new NotFoundException(`Profesor #${id} no encontrado`);
    return profesor;
  }

  async update(id: number, updateProfesorDto: UpdateProfesoreDto) {
    const { titulos, materias_asignadas, ...data } = updateProfesorDto;
    await this.findOne(id);
    return this.prisma.profesor.update({
        where: { id_profesor: id },
        data: data
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.profesor.delete({ where: { id_profesor: id } });
  }

  // --- NUEVAS FUNCIONES PARA TU DEBER ---

  // Parte 1.3: Docentes con más de 1 materia
  async docentesMultimateria() {
    const todos = await this.prisma.profesor.findMany({
      include: { materias_asignadas: true }
    });
    return todos.filter(p => p.materias_asignadas.length > 1);
  }

  // Parte 2.2: Filtros Lógicos (AND, OR, NOT)
  async filtrosLogicos() {
    return this.prisma.profesor.findMany({
      where: {
        OR: [
          {
            AND: [
              { tipo_contrato: 'TIEMPO_COMPLETO' },
              { materias_asignadas: { some: {} } }
            ]
          },
          {
            NOT: { activo: false } // Significa: Activo = true
          }
        ]
      },
      include: { materias_asignadas: true }
    });
  }
}