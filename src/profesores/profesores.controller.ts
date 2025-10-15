import {Controller,Get,Post,Body,Patch,Param,Delete,ParseIntPipe} from '@nestjs/common';
import { ProfesoresService } from './profesores.service';
import { CreateProfesorDto } from './dto/create-profesore.dto';
import { UpdateProfesoreDto } from './dto/update-profesore.dto';

@Controller('profesores')
export class ProfesoresController {
  constructor(private readonly profesoresService: ProfesoresService) {}

  @Post()
  create(@Body() createProfesorDto: CreateProfesorDto) {
    return this.profesoresService.create(createProfesorDto);
  }

  @Get()
  findAll() {
    return this.profesoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.profesoresService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProfesorDto: UpdateProfesoreDto,
  ) {
    return this.profesoresService.update(id, updateProfesorDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.profesoresService.remove(id);
  }
}