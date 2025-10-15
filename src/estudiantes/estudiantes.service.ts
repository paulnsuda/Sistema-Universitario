import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';

@Injectable()
export class EstudiantesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

 
    const [data, total] = await Promise.all([
      this.prisma.estudiante.findMany({
        skip,
        take: limit,
        orderBy: { id_estudiante: 'asc' },
      }),
      this.prisma.estudiante.count(),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: number) {
    const estudiante = await this.prisma.estudiante.findUnique({
      where: { id_estudiante: id },
    });

    if (!estudiante) throw new NotFoundException('Estudiante no encontrado');
    return estudiante;
  }

  async create(dto: CreateEstudianteDto) {
    try {
      return await this.prisma.estudiante.create({
        data: {
          nombres: dto.nombres,
          apellidos: dto.apellidos,
          cedula: dto.cedula,
          email: dto.email,
          fecha_nacimiento: dto.fecha_nacimiento
            ? new Date(dto.fecha_nacimiento)
            : null,
        },
      });
    } catch (err) {
      if (err.code === 'P2002')
        throw new BadRequestException('Cédula o email ya registrados');
      throw err;
    }
  }
}
