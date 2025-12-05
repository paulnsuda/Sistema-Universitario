import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto'; // Asegúrate de tener este archivo
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  // CREAR USUARIO
  async create(createUsuarioDto: CreateUsuarioDto) {
    try {
      // 1. Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(createUsuarioDto.password, 10);

      // 2. Definir Rol por defecto (si no viene en el DTO).
      // Asumimos que el ID 2 corresponde al rol "Estudiante" en tu tabla de Roles.
      const rolEstudianteId = 2; 

      return await this.prisma.usuario.create({
        data: {
          nombres: createUsuarioDto.nombres,
          apellidos: createUsuarioDto.apellidos,
          cedula: createUsuarioDto.cedula,
          email: createUsuarioDto.email,
          password: hashedPassword,
          // Convertir fecha si viene como string
          fecha_nacimiento: createUsuarioDto.fecha_nacimiento
            ? new Date(createUsuarioDto.fecha_nacimiento)
            : null,
          // Asignar el rol (campo obligatorio en el nuevo esquema)
          // Si el DTO tiene id_rol lo usa, sino usa el por defecto
          id_rol: createUsuarioDto.id_rol || rolEstudianteId, 
        },
      });
    } catch (err) {
      // Manejo de errores de unicidad (P2002: Unique constraint failed)
      if (err.code === 'P2002') {
        throw new BadRequestException('La cédula o el email ya están registrados.');
      }
      throw err;
    }
  }

  // LISTAR TODOS (Paginado)
  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.usuario.findMany({
        skip,
        take: limit,
        orderBy: { id_usuario: 'asc' },
        include: { 
          rol: true // <--- Traemos la información del Rol
        }, 
      }),
      this.prisma.usuario.count(),
    ]);

    return { data, total, page, limit };
  }

  // BUSCAR UNO POR ID
  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id_usuario: id },
      include: { 
        rol: true,           // <--- Ver su rol
        inscripciones: true  // <--- Ver sus inscripciones (definido en schema)
      },
    });

    if (!usuario) throw new NotFoundException(`Usuario con ID #${id} no encontrado`);
    return usuario;
  }

  // ACTUALIZAR
  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    await this.findOne(id); // Verifica si existe antes de intentar actualizar
    
    const dataToUpdate: any = { ...updateUsuarioDto };

    // Si envían una nueva contraseña, hay que encriptarla de nuevo
    if (updateUsuarioDto.password) {
      dataToUpdate.password = await bcrypt.hash(updateUsuarioDto.password, 10);
    }

    // Transformar fecha si viene en la actualización
    if (updateUsuarioDto.fecha_nacimiento) {
      dataToUpdate.fecha_nacimiento = new Date(updateUsuarioDto.fecha_nacimiento);
    }

    return this.prisma.usuario.update({
      where: { id_usuario: id },
      data: dataToUpdate,
      include: { rol: true }, // Retornar el usuario actualizado con su rol
    });
  }

  // ELIMINAR
  async remove(id: number) {
    await this.findOne(id); // Verifica existencia
    return this.prisma.usuario.delete({
      where: { id_usuario: id },
    });
  }
}