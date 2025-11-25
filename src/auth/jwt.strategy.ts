import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secreto_super_seguro', // Usa la misma clave que en el módulo
    });
  }

  async validate(payload: any) {
    // Lo que retornes aquí se inyecta en `req.user`
    return { id_estudiante: payload.sub, email: payload.email };
  }
}