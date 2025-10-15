import { PartialType } from '@nestjs/mapped-types';
import { CreateProfesorMateriaDto } from './create-profesor-materia.dto';

export class UpdateProfesorMateriaDto extends PartialType(CreateProfesorMateriaDto) {}
