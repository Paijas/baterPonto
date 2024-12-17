/*
  Warnings:

  - The `horasTrabalhadasDia` column on the `Presenca` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Presenca" DROP COLUMN "horasTrabalhadasDia",
ADD COLUMN     "horasTrabalhadasDia" DOUBLE PRECISION NOT NULL DEFAULT 0;
