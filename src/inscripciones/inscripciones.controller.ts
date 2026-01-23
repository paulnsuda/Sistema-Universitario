import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { InscripcionesService } from './inscripciones.service';
import { CreateInscripcioneDto } from './dto/create-inscripcione.dto';

@Controller('inscripciones')
export class InscripcionesController {
  constructor(private readonly inscripcionesService: InscripcionesService) {}

  @Post('matricular')
  matricular(@Body() dto: CreateInscripcioneDto) {
    return this.inscripcionesService.matricular(dto);
  }

  // Parte 1.1
  @Get('estudiantes-carrera')
  reporte() { return this.inscripcionesService.obtenerEstudiantesConCarrera(); }

  // Parte 1.2
  @Get('materias-carrera/:idCarrera')
  materiasCarrera(@Param('idCarrera') id: string) {
    return this.inscripcionesService.obtenerMateriasPorCarrera(+id);
  }

  // Parte 1.4
  @Get('historial')
  historial(@Query('usuario') u: string, @Query('ciclo') c: string) {
    return this.inscripcionesService.historialPorPeriodo(+u, +c);
  }

  // Parte 2.1 (Lógica Avanzada con Ciclo)
  @Get('filtro-avanzado')
  busquedaAvanzada(@Query('carrera') ca: string, @Query('ciclo') ci: string) {
    return this.inscripcionesService.buscarEstudiantesAvanzado(+ca, +ci);
  }

  // Parte 3 (SQL Nativo)
  @Get('reporte-sql')
  sqlNativo() { return this.inscripcionesService.reporteNativoSQL(); }
}