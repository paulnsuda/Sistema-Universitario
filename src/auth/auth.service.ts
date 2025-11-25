import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service'; // Asegúrate que la ruta sea correcta
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 1. Buscar usuario en la BD
    const estudiante = await this.prisma.estudiante.findUnique({
      where: { email },
    });

    if (!estudiante) {
      throw new UnauthorizedException('Credenciales inválidas (Email)');
    }

    // 2. Verificar la contraseña encriptada
    const isPasswordValid = await bcrypt.compare(password, estudiante.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas (Password)');
    }

    // 3. Generar el JWT
    const payload = { 
      sub: estudiante.id_estudiante, 
      email: estudiante.email,
      nombre: estudiante.nombres 
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}