/*
  Warnings:

  - You are about to drop the `Aula` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Carrera` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Estudiante` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Inscripcion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Materia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profesor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profesor_Materia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Titulo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Inscripcion" DROP CONSTRAINT "Inscripcion_id_estudiante_fkey";

-- DropForeignKey
ALTER TABLE "public"."Inscripcion" DROP CONSTRAINT "Inscripcion_id_materia_fkey";

-- DropForeignKey
ALTER TABLE "public"."Materia" DROP CONSTRAINT "Materia_id_aula_fkey";

-- DropForeignKey
ALTER TABLE "public"."Materia" DROP CONSTRAINT "Materia_id_carrera_fkey";

-- DropForeignKey
ALTER TABLE "public"."Profesor_Materia" DROP CONSTRAINT "Profesor_Materia_id_materia_fkey";

-- DropForeignKey
ALTER TABLE "public"."Profesor_Materia" DROP CONSTRAINT "Profesor_Materia_id_profesor_fkey";

-- DropForeignKey
ALTER TABLE "public"."Titulo" DROP CONSTRAINT "Titulo_id_profesor_fkey";

-- DropTable
DROP TABLE "public"."Aula";

-- DropTable
DROP TABLE "public"."Carrera";

-- DropTable
DROP TABLE "public"."Estudiante";

-- DropTable
DROP TABLE "public"."Inscripcion";

-- DropTable
DROP TABLE "public"."Materia";

-- DropTable
DROP TABLE "public"."Profesor";

-- DropTable
DROP TABLE "public"."Profesor_Materia";

-- DropTable
DROP TABLE "public"."Titulo";

-- CreateTable
CREATE TABLE "estudiantes" (
    "id_estudiante" SERIAL NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fecha_nacimiento" DATE,

    CONSTRAINT "estudiantes_pkey" PRIMARY KEY ("id_estudiante")
);

-- CreateTable
CREATE TABLE "carreras" (
    "id_carrera" SERIAL NOT NULL,
    "nombre_carrera" TEXT NOT NULL,
    "descripcion" TEXT,
    "duracion_semestres" INTEGER,

    CONSTRAINT "carreras_pkey" PRIMARY KEY ("id_carrera")
);

-- CreateTable
CREATE TABLE "profesores" (
    "id_profesor" SERIAL NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "profesores_pkey" PRIMARY KEY ("id_profesor")
);

-- CreateTable
CREATE TABLE "titulos" (
    "id_titulo" SERIAL NOT NULL,
    "nombre_titulo" TEXT NOT NULL,
    "universidad_emisora" TEXT,
    "fecha_obtencion" DATE,
    "id_profesor" INTEGER NOT NULL,

    CONSTRAINT "titulos_pkey" PRIMARY KEY ("id_titulo")
);

-- CreateTable
CREATE TABLE "aulas" (
    "id_aula" SERIAL NOT NULL,
    "numero_aula" TEXT NOT NULL,
    "edificio" TEXT,
    "capacidad" INTEGER,

    CONSTRAINT "aulas_pkey" PRIMARY KEY ("id_aula")
);

-- CreateTable
CREATE TABLE "materias" (
    "id_materia" SERIAL NOT NULL,
    "nombre_materia" TEXT NOT NULL,
    "creditos" INTEGER NOT NULL,
    "id_carrera" INTEGER NOT NULL,
    "id_aula" INTEGER NOT NULL,

    CONSTRAINT "materias_pkey" PRIMARY KEY ("id_materia")
);

-- CreateTable
CREATE TABLE "inscripciones" (
    "id_inscripcion" SERIAL NOT NULL,
    "fecha_inscripcion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "semestre" TEXT,
    "calificacion_final" DECIMAL(4,2),
    "id_estudiante" INTEGER NOT NULL,
    "id_materia" INTEGER NOT NULL,

    CONSTRAINT "inscripciones_pkey" PRIMARY KEY ("id_inscripcion")
);

-- CreateTable
CREATE TABLE "profesor_materia" (
    "id" SERIAL NOT NULL,
    "id_profesor" INTEGER NOT NULL,
    "id_materia" INTEGER NOT NULL,

    CONSTRAINT "profesor_materia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "estudiantes_cedula_key" ON "estudiantes"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "estudiantes_email_key" ON "estudiantes"("email");

-- CreateIndex
CREATE UNIQUE INDEX "carreras_nombre_carrera_key" ON "carreras"("nombre_carrera");

-- CreateIndex
CREATE UNIQUE INDEX "profesores_cedula_key" ON "profesores"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "profesores_email_key" ON "profesores"("email");

-- CreateIndex
CREATE UNIQUE INDEX "materias_id_aula_key" ON "materias"("id_aula");

-- CreateIndex
CREATE UNIQUE INDEX "inscripciones_id_estudiante_id_materia_key" ON "inscripciones"("id_estudiante", "id_materia");

-- AddForeignKey
ALTER TABLE "titulos" ADD CONSTRAINT "titulos_id_profesor_fkey" FOREIGN KEY ("id_profesor") REFERENCES "profesores"("id_profesor") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materias" ADD CONSTRAINT "materias_id_carrera_fkey" FOREIGN KEY ("id_carrera") REFERENCES "carreras"("id_carrera") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materias" ADD CONSTRAINT "materias_id_aula_fkey" FOREIGN KEY ("id_aula") REFERENCES "aulas"("id_aula") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripciones" ADD CONSTRAINT "inscripciones_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "estudiantes"("id_estudiante") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripciones" ADD CONSTRAINT "inscripciones_id_materia_fkey" FOREIGN KEY ("id_materia") REFERENCES "materias"("id_materia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profesor_materia" ADD CONSTRAINT "profesor_materia_id_profesor_fkey" FOREIGN KEY ("id_profesor") REFERENCES "profesores"("id_profesor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profesor_materia" ADD CONSTRAINT "profesor_materia_id_materia_fkey" FOREIGN KEY ("id_materia") REFERENCES "materias"("id_materia") ON DELETE RESTRICT ON UPDATE CASCADE;
