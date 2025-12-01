import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfesorDto } from './dto/create-profesore.dto'; // Asumo el nombre correcto del DTO
import { UpdateProfesoreDto } from './dto/update-profesore.dto'; // Asumo el nombre correcto del DTO
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfesoresService {
  constructor(private prisma: PrismaService) {}

  create(createProfesorDto: CreateProfesorDto) {
    const { titulos, materias_asignadas, ...profesorData } = createProfesorDto;

    return this.prisma.profesor.create({
      data: {
        ...profesorData, 
        titulos: {
          create: titulos, 
        },
        
      },
      include: {
        titulos: true, 
      },
    });
  }

  findAll() {
    return this.prisma.profesor.findMany({
      include: { titulos: true, materias_asignadas: true },
    });
  }

  async findOne(id: number) {
    const profesor = await this.prisma.profesor.findUnique({
      where: { id_profesor: id },
      include: { titulos: true, materias_asignadas: true }, 
    });

    if (!profesor) {
      throw new NotFoundException(`Profesor con ID #${id} no encontrado`);
    }
    return profesor;
  }
// profesores.service.ts
async update(id: number, updateProfesorDto: UpdateProfesoreDto) {
  const { titulos = [], ...rest } = updateProfesorDto ?? {}; // <— defaults
  // ...
}


  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.profesor.delete({
      where: { id_profesor: id },
    });
  }
  
}