import { IsInt, IsNotEmpty, IsPositive, IsString, IsOptional, IsDecimal } from 'class-validator';
import { Decimal } from '@prisma/client/runtime/library';

export class CreateInscripcioneDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty({ message: 'El ID del estudiante es obligatorio' })
  id_estudiante: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty({ message: 'El ID de la materia es obligatorio' })
  id_materia: number;
  
  @IsString()
  @IsOptional()
  semestre?: string;
  
 
}

