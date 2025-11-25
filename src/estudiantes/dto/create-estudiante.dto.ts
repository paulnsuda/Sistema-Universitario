import { IsString, IsEmail, Length, IsOptional, IsDateString, IsNotEmpty } from 'class-validator';

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

  // 👇 AGREGA ESTE BLOQUE PARA SOLUCIONAR EL ERROR
  @IsString()
  @IsNotEmpty()
  @Length(6, 50, { message: 'La contraseña debe tener entre 6 y 50 caracteres' })
  password: string;
  // 👆 --------------------------------------------

  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: string;
}