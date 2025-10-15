import { IsString, IsNotEmpty, IsOptional, IsInt, IsPositive } from 'class-validator';

export class CreateAulaDto {
  @IsString()
  @IsNotEmpty({ message: 'El número o nombre del aula es obligatorio' })
  numero_aula: string;

  @IsString()
  @IsOptional()
  edificio?: string;

  @IsInt({ message: 'La capacidad debe ser un número entero' })
  @IsPositive({ message: 'La capacidad debe ser un número positivo' })
  @IsOptional()
  capacidad?: number;
}