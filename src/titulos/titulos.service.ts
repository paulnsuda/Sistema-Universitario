import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateTituloDto } from './dto/create-titulo.dto';
import { UpdateTituloDto } from './dto/update-titulo.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TitulosService {
  constructor(private prisma: PrismaService) {}

  
  async create(createTituloDto: CreateTituloDto) {
    const { id_profesor, nombre_titulo, universidad_emisora, fecha_obtencion } = createTituloDto;

    // 1) Asegura que exista el profesor (evita P2003 con mensaje claro)
    const profesor = await this.prisma.profesor.findUnique({
      where: { id_profesor },
      select: { id_profesor: true },
    });
    if (!profesor) {
      throw new NotFoundException(`Profesor ${id_profesor} no existe`);
    }

    // 2) Crea usando connect (no pases la FK cruda)
    try {
      return await this.prisma.titulo.create({
        data: {
          nombre_titulo,
          universidad_emisora,
          fecha_obtencion,
          profesor: { connect: { id_profesor } },
        },
        include: { profesor: true },
      });
    } catch (e: any) {
      if (e?.code === 'P2003') {
        throw new BadRequestException('FK inválida (id_profesor): verifica que el profesor exista.');
      }
      throw e;
    }
  }

  // READ ALL
  async findAll() {
    return this.prisma.titulo.findMany({
      include: { profesor: true },
    });
  }

  // READ ONE
  async findOne(id: number) {
    const titulo = await this.prisma.titulo.findUnique({
      where: { id_titulo: id },
      include: { profesor: true },
    });
    if (!titulo) {
      throw new NotFoundException(`Título con ID #${id} no encontrado`);
    }
    return titulo;
  }

  // UPDATE: verifica que el título exista; si envían id_profesor nuevo, valida y usa connect
  async update(id: number, updateTituloDto: UpdateTituloDto) {
    // 1) Asegura que exista el título (evita P2025)
    const exists = await this.prisma.titulo.findUnique({
      where: { id_titulo: id },
      select: { id_titulo: true },
    });
    if (!exists) {
      throw new NotFoundException(`Título con ID #${id} no encontrado`);
    }

    const { id_profesor, nombre_titulo, universidad_emisora, fecha_obtencion } = updateTituloDto ?? {};

    // 2) Si quieren cambiar/definir profesor, valida existencia
    if (typeof id_profesor === 'number') {
      const prof = await this.prisma.profesor.findUnique({
        where: { id_profesor },
        select: { id_profesor: true },
      });
      if (!prof) {
        throw new NotFoundException(`Profesor ${id_profesor} no existe`);
      }
    }

    // 3) Arma el payload cuidando la relación
    const data: any = {
      ...(typeof nombre_titulo !== 'undefined' && { nombre_titulo }),
      ...(typeof universidad_emisora !== 'undefined' && { universidad_emisora }),
      ...(typeof fecha_obtencion !== 'undefined' && { fecha_obtencion }),
      ...(typeof id_profesor === 'number' && { profesor: { connect: { id_profesor } } }),
    };

    try {
      return await this.prisma.titulo.update({
        where: { id_titulo: id },
        data,
        include: { profesor: true },
      });
    } catch (e: any) {
      if (e?.code === 'P2003') {
        throw new BadRequestException('FK inválida (id_profesor) al actualizar: verifica que el profesor exista.');
      }
      if (e?.code === 'P2025') {
        throw new NotFoundException(`Título con ID #${id} no encontrado para actualizar`);
      }
      throw e;
    }
  }

  // DELETE: reusa findOne para 404 claro
  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.titulo.delete({
      where: { id_titulo: id },
    });
  }
}
