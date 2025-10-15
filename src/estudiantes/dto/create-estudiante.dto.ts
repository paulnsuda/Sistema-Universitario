import { IsString, IsEmail, Length, IsOptional, IsDateString } from 'class-validator';

export class CreateEstudianteDto {
  @IsString()
  @Length(2, 100)
  nombres: string;

  @IsString()
  @Length(2, 100)
  apellidos: string;

  @IsString()
  @Length(6, 10)
  cedula: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: string;
}
