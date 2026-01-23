import { IsInt, IsNotEmpty, IsPositive, IsOptional, IsNumber } from 'class-validator';

export class CreateInscripcioneDto {
  // CORRECCIÓN: Cambiamos 'id_estudiante' por 'id_usuario' para coincidir con la DB y el Servicio
  @IsInt()
  @IsPositive()
  @IsNotEmpty({ message: 'El ID del usuario (estudiante) es obligatorio' })
  id_usuario: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty({ message: 'El ID de la materia es obligatorio' })
  id_materia: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty({ message: 'El ID del ciclo es obligatorio' })
  id_ciclo: number;

  @IsOptional()
  @IsNumber({}, { message: 'La calificación debe ser un número' })
  calificacion_final?: number;
}