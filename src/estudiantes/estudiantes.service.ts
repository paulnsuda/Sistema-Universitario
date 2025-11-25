import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import * as bcrypt from 'bcrypt'; // <--- Importante: Importar bcrypt

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
      // <--- Lógica agregada: Encriptar la contraseña antes de guardar --->
      const hashedPassword = await bcrypt.hash(dto.password, 10);

      return await this.prisma.estudiante.create({
        data: {
          nombres: dto.nombres,
          apellidos: dto.apellidos,
          cedula: dto.cedula,
          email: dto.email,
          password: hashedPassword, // Guardamos la contraseña encriptada
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

  async update(id: number, dto: CreateEstudianteDto) {
    await this.findOne(id); // Reutilizamos findOne para verificar si existe
    
    // Opcional: Si permites actualizar la contraseña aquí, deberías hashearla también.
    // Por ahora, se guarda tal cual viene en el DTO.
    
    return this.prisma.estudiante.update({
      where: { id_estudiante: id },
      data: {
        ...dto,
        fecha_nacimiento: dto.fecha_nacimiento
            ? new Date(dto.fecha_nacimiento)
            : undefined, // Aseguramos que la fecha se transforme si viene en el update
      } 
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.estudiante.delete({
      where: { id_estudiante: id },
    });
  }
}