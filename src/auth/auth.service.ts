import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
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

    // 1. Buscar en la tabla USUARIO (antes era estudiante)
    const usuario = await this.prisma.usuario.findUnique({
      where: { email },
      include: { rol: true } // Traemos el rol para usarlo en el token si quieres
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas (Email)');
    }

    // 2. Verificar password
    const isPasswordValid = await bcrypt.compare(password, usuario.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas (Password)');
    }

    // 3. Generar JWT (Incluimos el rol en el payload)
    const payload = { 
      sub: usuario.id_usuario, 
      email: usuario.email, 
      rol: usuario.rol.nombre_rol 
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}