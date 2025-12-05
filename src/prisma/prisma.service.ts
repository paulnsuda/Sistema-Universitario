import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // En Prisma 5 no necesitamos constructor manual, él ya sabe leer el .env
  async onModuleInit() {
    await this.$connect();
  }
}