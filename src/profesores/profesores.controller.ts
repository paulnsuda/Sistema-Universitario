import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ProfesoresService } from './profesores.service';
import { CreateProfesorDto } from './dto/create-profesore.dto';
import { UpdateProfesoreDto } from './dto/update-profesore.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 

@Controller('profesores')
export class ProfesoresController {
  constructor(private readonly profesoresService: ProfesoresService) {}

  @Post()
  create(@Body() createProfesorDto: CreateProfesorDto) {
    return this.profesoresService.create(createProfesorDto);
  }

  // =========================================================
  // ✅ IMPORTANTE: Estos endpoints deben ir PRIMERO
  // =========================================================

  @Get('multimateria') 
  getMultimateria() {
    return this.profesoresService.docentesMultimateria();
  }

  @Get('filtro-logico')
  getFiltroLogico() {
    return this.profesoresService.filtrosLogicos();
  }

  // =========================================================
  // Endpoints Dinámicos (Van AL FINAL)
  // =========================================================

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.profesoresService.findAll();
  }

  @Get(':id') // <--- Este captura todo, por eso debe ir abajo
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.profesoresService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProfesorDto: UpdateProfesoreDto) {
    return this.profesoresService.update(id, updateProfesorDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.profesoresService.remove(id);
  }
}