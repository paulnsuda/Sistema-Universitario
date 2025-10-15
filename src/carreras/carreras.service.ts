import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCarreraDto } from './dto/create-carrera.dto';
import { UpdateCarreraDto } from './dto/update-carrera.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CarrerasService {
  constructor(private prisma: PrismaService) {}

  create(createCarreraDto: CreateCarreraDto) {
    return this.prisma.carrera.create({
      data: createCarreraDto,
    });
  }

  findAll() {
    return this.prisma.carrera.findMany();
  }

  async findOne(id: number) {
    const carrera = await this.prisma.carrera.findUnique({
      where: { id_carrera: id },
    });

    if (!carrera) {
      throw new NotFoundException(`Carrera con ID #${id} no encontrada`);
    }
    return carrera;
  }

  update(id: number, updateCarreraDto: UpdateCarreraDto) {
    return this.prisma.carrera.update({
      where: { id_carrera: id },
      data: updateCarreraDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Reutilizamos findOne para verificar si existe
    return this.prisma.carrera.delete({
      where: { id_carrera: id },
    });
  }
}