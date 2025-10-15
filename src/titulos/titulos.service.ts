import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTituloDto } from './dto/create-titulo.dto';
import { UpdateTituloDto } from './dto/update-titulo.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TitulosService {
  constructor(private prisma: PrismaService) {}

  create(createTituloDto: CreateTituloDto) {
    // Prisma verifica que id_profesor exista.
    return this.prisma.titulo.create({
      data: createTituloDto,
    });
  }

  findAll() {
    // Incluimos la relación con Profesor en la búsqueda general
    return this.prisma.titulo.findMany({
      include: { profesor: true },
    });
  }

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

  update(id: number, updateTituloDto: UpdateTituloDto) {
    return this.prisma.titulo.update({
      where: { id_titulo: id },
      data: updateTituloDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.titulo.delete({
      where: { id_titulo: id },
    });
  }
}