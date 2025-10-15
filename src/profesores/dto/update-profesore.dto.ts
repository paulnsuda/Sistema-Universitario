import { PartialType } from '@nestjs/mapped-types';
import { CreateProfesorDto } from './create-profesore.dto';


export class UpdateProfesoreDto extends PartialType(CreateProfesorDto) {}