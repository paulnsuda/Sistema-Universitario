import { Controller, Post, Body, Get } from '@nestjs/common';
import { ProfesorMateriaService } from './profesor-materia.service';
import { CreateProfesorMateriaDto } from './dto/create-profesor-materia.dto';

@Controller('profesor-materia')
export class ProfesorMateriaController {
  constructor(private readonly profesorMateriaService: ProfesorMateriaService) {}

  @Post()
  create(@Body() createProfesorMateriaDto: CreateProfesorMateriaDto) {
    return this.profesorMateriaService.create(createProfesorMateriaDto);
  }

  @Get() // <-- ¡Ruta de lectura AÑADIDA!
  findAll() {
    return this.profesorMateriaService.findAll();
  }
}