/*
  Warnings:

  - The primary key for the `Profesor_Materia` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Profesor_Materia" DROP CONSTRAINT "Profesor_Materia_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Profesor_Materia_pkey" PRIMARY KEY ("id");
