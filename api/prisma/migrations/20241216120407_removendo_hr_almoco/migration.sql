/*
  Warnings:

  - You are about to drop the column `almocoSaida` on the `Presenca` table. All the data in the column will be lost.
  - You are about to drop the column `almocoVolta` on the `Presenca` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Presenca" DROP COLUMN "almocoSaida",
DROP COLUMN "almocoVolta";
