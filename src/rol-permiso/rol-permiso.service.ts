import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateRolPermisoDto } from './dto/create-rol-permiso.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RolPermisoService {
  constructor(private prisma: PrismaService) {}

  // ASIGNAR PERMISO A ROL
  async create(dto: CreateRolPermisoDto) {
    try {
      return await this.prisma.rolPermiso.create({
        data: {
          id_rol: dto.id_rol,
          id_permiso: dto.id_permiso,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Este rol ya tiene asignado este permiso.');
        }
        if (error.code === 'P2003') {
          throw new NotFoundException('El Rol o el Permiso no existen.');
        }
      }
      throw error;
    }
  }

  // LISTAR TODOS
  async findAll() {
    return this.prisma.rolPermiso.findMany({
      include: {
        rol: true,     // Ver nombre del rol
        permiso: true, // Ver nombre del permiso
      },
    });
  }

  // ELIMINAR (Necesita ambos IDs)
  async remove(id_rol: number, id_permiso: number) {
    try {
      return await this.prisma.rolPermiso.delete({
        where: {
          // Prisma genera este nombre compuesto automáticamente para la clave primaria @@id([id_rol, id_permiso])
          id_rol_id_permiso: {
            id_rol: id_rol,
            id_permiso: id_permiso,
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('No se encontró esa asignación de permiso para eliminar.');
      }
      throw error;
    }
  }
}