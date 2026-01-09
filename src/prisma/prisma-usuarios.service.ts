import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // <--- 1. Importa ConfigService
import { PrismaClient } from '@prisma/client-usuarios'; // <--- 2. Asegúrate que este sea el nombre correcto que definiste en el 'output' de tu schema

@Injectable()
export class PrismaUsuariosService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  
  // 3. Agrega este constructor para pasar la URL explícitamente
  constructor(config: ConfigService) {
    super({
      datasourceUrl: config.get<string>('DATABASE_URL_USUARIOS'), // <--- Nombre exacto de tu variable en el .env
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}