-- AlterTable
ALTER TABLE "profesores" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "tipo_contrato" TEXT NOT NULL DEFAULT 'TIEMPO_COMPLETO';
