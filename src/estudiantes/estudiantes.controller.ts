import { Controller, Get, Post, Query, Param, Body, ParseIntPipe } from '@nestjs/common';
import { EstudiantesService } from './estudiantes.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';

@Controller('estudiantes')
export class EstudiantesController {
  constructor(private readonly estudiantesService: EstudiantesService) {}

  @Get()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.estudiantesService.findAll(Number(page) || 1, Number(limit) || 10);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.estudiantesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateEstudianteDto) {
    return this.estudiantesService.create(dto);
  }
}

