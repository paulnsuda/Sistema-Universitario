-- CreateTable
CREATE TABLE "Estudiante" (
    "id_estudiante" SERIAL NOT NULL,
    "nombres" VARCHAR(100) NOT NULL,
    "apellidos" VARCHAR(100) NOT NULL,
    "cedula" VARCHAR(10) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "fecha_nacimiento" TIMESTAMP(3),

    CONSTRAINT "Estudiante_pkey" PRIMARY KEY ("id_estudiante")
);

-- CreateTable
CREATE TABLE "Carrera" (
    "id_carrera" SERIAL NOT NULL,
    "nombre_carrera" VARCHAR(255) NOT NULL,
    "descripcion" TEXT,
    "duracion_semestres" INTEGER,

    CONSTRAINT "Carrera_pkey" PRIMARY KEY ("id_carrera")
);

-- CreateTable
CREATE TABLE "Profesor" (
    "id_profesor" SERIAL NOT NULL,
    "nombres" VARCHAR(100) NOT NULL,
    "apellidos" VARCHAR(100) NOT NULL,
    "cedula" VARCHAR(10) NOT NULL,
    "email" VARCHAR(255) NOT NULL,

    CONSTRAINT "Profesor_pkey" PRIMARY KEY ("id_profesor")
);

-- CreateTable
CREATE TABLE "Titulo" (
    "id_titulo" SERIAL NOT NULL,
    "id_profesor" INTEGER NOT NULL,
    "nombre_titulo" VARCHAR(255) NOT NULL,
    "universidad_emisora" VARCHAR(255),
    "fecha_obtencion" TIMESTAMP(3),

    CONSTRAINT "Titulo_pkey" PRIMARY KEY ("id_titulo")
);

-- CreateTable
CREATE TABLE "Aula" (
    "id_aula" SERIAL NOT NULL,
    "numero_aula" VARCHAR(50) NOT NULL,
    "edificio" VARCHAR(100),
    "capacidad" INTEGER,

    CONSTRAINT "Aula_pkey" PRIMARY KEY ("id_aula")
);

-- CreateTable
CREATE TABLE "Materia" (
    "id_materia" SERIAL NOT NULL,
    "id_carrera" INTEGER NOT NULL,
    "id_aula" INTEGER NOT NULL,
    "nombre_materia" VARCHAR(255) NOT NULL,
    "creditos" INTEGER NOT NULL,

    CONSTRAINT "Materia_pkey" PRIMARY KEY ("id_materia")
);

-- CreateTable
CREATE TABLE "Inscripcion" (
    "id_inscripcion" SERIAL NOT NULL,
    "id_estudiante" INTEGER NOT NULL,
    "id_materia" INTEGER NOT NULL,
    "fecha_inscripcion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "semestre" VARCHAR(50),
    "calificacion_final" DECIMAL(4,2),

    CONSTRAINT "Inscripcion_pkey" PRIMARY KEY ("id_inscripcion")
);

-- CreateTable
CREATE TABLE "Profesor_Materia" (
    "id_profesor" INTEGER NOT NULL,
    "id_materia" INTEGER NOT NULL,

    CONSTRAINT "Profesor_Materia_pkey" PRIMARY KEY ("id_profesor","id_materia")
);

-- CreateIndex
CREATE UNIQUE INDEX "Estudiante_cedula_key" ON "Estudiante"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "Estudiante_email_key" ON "Estudiante"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Carrera_nombre_carrera_key" ON "Carrera"("nombre_carrera");

-- CreateIndex
CREATE UNIQUE INDEX "Profesor_cedula_key" ON "Profesor"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "Profesor_email_key" ON "Profesor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Materia_id_aula_key" ON "Materia"("id_aula");

-- CreateIndex
CREATE UNIQUE INDEX "Inscripcion_id_estudiante_id_materia_key" ON "Inscripcion"("id_estudiante", "id_materia");

-- AddForeignKey
ALTER TABLE "Titulo" ADD CONSTRAINT "Titulo_id_profesor_fkey" FOREIGN KEY ("id_profesor") REFERENCES "Profesor"("id_profesor") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materia" ADD CONSTRAINT "Materia_id_carrera_fkey" FOREIGN KEY ("id_carrera") REFERENCES "Carrera"("id_carrera") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materia" ADD CONSTRAINT "Materia_id_aula_fkey" FOREIGN KEY ("id_aula") REFERENCES "Aula"("id_aula") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "Estudiante"("id_estudiante") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_id_materia_fkey" FOREIGN KEY ("id_materia") REFERENCES "Materia"("id_materia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profesor_Materia" ADD CONSTRAINT "Profesor_Materia_id_profesor_fkey" FOREIGN KEY ("id_profesor") REFERENCES "Profesor"("id_profesor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profesor_Materia" ADD CONSTRAINT "Profesor_Materia_id_materia_fkey" FOREIGN KEY ("id_materia") REFERENCES "Materia"("id_materia") ON DELETE RESTRICT ON UPDATE CASCADE;
