import { Controller, Post, Body, Get, Param, Delete, Patch, ParseIntPipe } from '@nestjs/common'; // <-- Importa ParseIntPipe
import { ProfesorMateriaService } from './profesor-materia.service';
import { CreateProfesorMateriaDto } from './dto/create-profesor-materia.dto';
import { UpdateProfesorMateriaDto } from './dto/update-profesor-materia.dto'; // <-- Importa el DTO de Update

@Controller('profesor-materia')
export class ProfesorMateriaController {
  constructor(private readonly profesorMateriaService: ProfesorMateriaService) {}

  @Post()
  create(@Body() createProfesorMateriaDto: CreateProfesorMateriaDto) {
    return this.profesorMateriaService.create(createProfesorMateriaDto);
  }

  @Get()
  findAll() {
    return this.profesorMateriaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) { // <-- AÑADE ParseIntPipe
    return this.profesorMateriaService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) { // <-- AÑADE ParseIntPipe
    return this.profesorMateriaService.remove(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number, // <-- AÑADE ParseIntPipe
    @Body() updateProfesorMateriaDto: UpdateProfesorMateriaDto, // <-- USA el DTO de Update
  ) {
    return this.profesorMateriaService.update(id, updateProfesorMateriaDto);
  }
}