import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaUsuariosService } from '../prisma/prisma-usuarios.service';
import { PrismaCarrerasService } from '../prisma/prisma-carreras.service';
import { CreateInscripcioneDto } from './dto/create-inscripcione.dto';

@Injectable()
export class InscripcionesService {
  constructor(
    private prismaUsuarios: PrismaUsuariosService,
    private prismaCarreras: PrismaCarrerasService,
  ) {}

  // =======================================================
  // PARTE 1: CONSULTAS DERIVADAS
  // =======================================================

  // 1.1 Listar estudiantes activos junto con su carrera
  async obtenerEstudiantesConCarrera() {
    const estudiantes = await this.prismaUsuarios.usuario.findMany({
      where: { estado: true },
      include: { inscripciones: true }
    });

    const reporte = await Promise.all(estudiantes.map(async (est) => {
      let carreraNombre = 'Sin Carrera';
      if (est.inscripciones.length > 0) {
        const idMateria = est.inscripciones[0].id_materia;
        const materia = await this.prismaCarreras.materia.findUnique({
          where: { id_materia: idMateria },
          include: { carrera: true }
        });
        if (materia?.carrera) carreraNombre = materia.carrera.nombre_carrera;
      }
      return {
        estudiante: `${est.nombres} ${est.apellidos}`,
        estado: est.estado ? 'Activo' : 'Inactivo',
        carrera: carreraNombre
      };
    }));
    return reporte;
  }

  // 1.2 Obtener materias de una carrera específica (FALTABA ESTE)
  async obtenerMateriasPorCarrera(idCarrera: number) {
    return this.prismaCarreras.materia.findMany({
      where: { id_carrera: idCarrera }
    });
  }

  // 1.3 Mostrar matrículas de un estudiante en un período (FALTABA EL FILTRO DE CICLO)
  async historialPorPeriodo(idUsuario: number, idCiclo: number) {
    return this.prismaUsuarios.inscripcion.findMany({
      where: { 
        id_usuario: idUsuario,
        id_ciclo: idCiclo 
      }
    });
  }

  // =======================================================
  // PARTE 2: OPERACIONES LÓGICAS
  // =======================================================

  // 2.1 Buscar estudiantes: Activos AND (Carrera X) AND (Periodo Y)
  // (CORREGIDO: Se agregó el filtro de ciclo que pedía el PDF)
  async buscarEstudiantesAvanzado(idCarrera: number, idCiclo: number) {
    const materias = await this.prismaCarreras.materia.findMany({
      where: { id_carrera: idCarrera },
      select: { id_materia: true }
    });
    const idsMaterias = materias.map(m => m.id_materia);

    return await this.prismaUsuarios.usuario.findMany({
      where: {
        AND: [
          { estado: true }, // 1. Activo
          {
            inscripciones: {
              some: {
                id_materia: { in: idsMaterias }, // 2. Pertenece a la carrera
                id_ciclo: idCiclo                // 3. Matriculado en el periodo
              }
            }
          }
        ]
      }
    });
  }

  // =======================================================
  // PARTE 3: CONSULTA NATIVA (SQL)
  // =======================================================

  async reporteNativoSQL() {
    return this.prismaUsuarios.$queryRaw`
      SELECT 
        u.nombres, 
        u.apellidos, 
        COUNT(i.id_inscripcion)::int as materias_matriculadas
      FROM usuarios u
      JOIN inscripciones i ON u.id_usuario = i.id_usuario
      GROUP BY u.id_usuario, u.nombres, u.apellidos
      ORDER BY materias_matriculadas DESC;
    `;
  }

  // =======================================================
  // PARTE 4: TRANSACCIÓN ACID (Matriculación)
  // =======================================================

  async matricular(dto: CreateInscripcioneDto) {
    const { id_usuario, id_materia, id_ciclo } = dto;

    const usuario = await this.prismaUsuarios.usuario.findUnique({ where: { id_usuario } });
    if (!usuario?.estado) throw new BadRequestException('Usuario no activo');

    const materia = await this.prismaCarreras.materia.findUnique({ where: { id_materia } });
    if (!materia) throw new BadRequestException('Materia no existe');
    if (materia.cupos <= 0) throw new BadRequestException('Sin cupos');

    try {
      // Paso A: Descontar Cupo (DB Carreras)
      await this.prismaCarreras.materia.update({
        where: { id_materia },
        data: { cupos: { decrement: 1 } }
      });

      // Paso B: Inscribir (DB Usuarios)
      const inscripcion = await this.prismaUsuarios.inscripcion.create({
        data: { id_usuario, id_materia, id_ciclo, calificacion_final: 0 }
      });

      return { mensaje: 'Matrícula Exitosa', inscripcion };

    } catch (error) {
      // Rollback Manual
      await this.prismaCarreras.materia.update({
        where: { id_materia },
        data: { cupos: { increment: 1 } }
      }).catch(e => console.error('Error crítico en rollback', e));

      throw new InternalServerErrorException('Error en matrícula, cambios revertidos');
    }
  }
}