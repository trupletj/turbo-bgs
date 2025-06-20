/*
  Warnings:

  - You are about to drop the column `clause_position_id` on the `rating` table. All the data in the column will be lost.
  - You are about to drop the `Gazar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clause_position` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `position` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `clause_job_position_id` to the `rating` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "type_clause_job_position" AS ENUM ('IMPLEMENTATION', 'MONITORING', 'VERIFICATION', 'DEPLOYMENT');

-- DropForeignKey
ALTER TABLE "Gazar" DROP CONSTRAINT "Gazar_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "clause_position" DROP CONSTRAINT "clause_position_clauseId_fkey";

-- DropForeignKey
ALTER TABLE "clause_position" DROP CONSTRAINT "clause_position_positionId_fkey";

-- DropForeignKey
ALTER TABLE "position" DROP CONSTRAINT "position_divisionId_fkey";

-- DropForeignKey
ALTER TABLE "rating" DROP CONSTRAINT "rating_clause_position_id_fkey";

-- AlterTable
ALTER TABLE "rating" DROP COLUMN "clause_position_id",
ADD COLUMN     "clause_job_position_id" UUID NOT NULL;

-- DropTable
DROP TABLE "Gazar";

-- DropTable
DROP TABLE "Organization";

-- DropTable
DROP TABLE "clause_position";

-- DropTable
DROP TABLE "position";

-- DropEnum
DROP TYPE "type_clause_position";

-- CreateTable
CREATE TABLE "organization" (
    "id" UUID NOT NULL,
    "bteg_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sub_title" TEXT,
    "is_hr" BOOLEAN NOT NULL,
    "is_active" BOOLEAN,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "bteg_id" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "idcard_number" TEXT,
    "is_active" BOOLEAN,
    "address" TEXT,
    "register_number" TEXT,
    "gazar_id" TEXT,
    "alba_id" TEXT,
    "heltes_id" TEXT,
    "job_position_name" TEXT,
    "nice_name" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "first_name" TEXT,
    "last_name" TEXT,
    "organization_id" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alba" (
    "id" UUID NOT NULL,
    "bteg_id" TEXT NOT NULL,
    "darga_id" TEXT,
    "sub_title" TEXT,
    "organization_id" TEXT,
    "name" TEXT,
    "description" TEXT,
    "gazar_id" TEXT,
    "heltes_id" TEXT,
    "is_active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "alba_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "heltes" (
    "id" UUID NOT NULL,
    "bteg_id" TEXT NOT NULL,
    "sub_title" TEXT,
    "darga_id" TEXT,
    "organization_id" TEXT,
    "gazar_id" TEXT,
    "description" TEXT,
    "name" TEXT,
    "is_active" BOOLEAN NOT NULL,
    "updated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3),

    CONSTRAINT "heltes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gazar" (
    "id" UUID NOT NULL,
    "bteg_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3),
    "darga_id" TEXT,
    "is_active" BOOLEAN NOT NULL,
    "organization_id" TEXT NOT NULL,

    CONSTRAINT "gazar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clause_job_position" (
    "id" UUID NOT NULL,
    "clauseId" UUID NOT NULL,
    "job_positionId" UUID NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "type" "type_clause_job_position",

    CONSTRAINT "clause_job_position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_position" (
    "id" UUID NOT NULL,
    "bteg_id" TEXT,
    "gazar_id" TEXT,
    "alba_id" TEXT,
    "heltes_id" TEXT,
    "organization_id" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "divisionId" UUID NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "job_position_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organization_bteg_id_key" ON "organization"("bteg_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_bteg_id_key" ON "user"("bteg_id");

-- CreateIndex
CREATE UNIQUE INDEX "alba_bteg_id_key" ON "alba"("bteg_id");

-- CreateIndex
CREATE UNIQUE INDEX "alba_darga_id_key" ON "alba"("darga_id");

-- CreateIndex
CREATE UNIQUE INDEX "heltes_bteg_id_key" ON "heltes"("bteg_id");

-- CreateIndex
CREATE UNIQUE INDEX "heltes_darga_id_key" ON "heltes"("darga_id");

-- CreateIndex
CREATE UNIQUE INDEX "gazar_bteg_id_key" ON "gazar"("bteg_id");

-- CreateIndex
CREATE UNIQUE INDEX "gazar_darga_id_key" ON "gazar"("darga_id");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_gazar_id_fkey" FOREIGN KEY ("gazar_id") REFERENCES "gazar"("bteg_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_heltes_id_fkey" FOREIGN KEY ("heltes_id") REFERENCES "heltes"("bteg_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_alba_id_fkey" FOREIGN KEY ("alba_id") REFERENCES "alba"("bteg_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alba" ADD CONSTRAINT "alba_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("bteg_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alba" ADD CONSTRAINT "alba_darga_id_fkey" FOREIGN KEY ("darga_id") REFERENCES "user"("bteg_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alba" ADD CONSTRAINT "alba_gazar_id_fkey" FOREIGN KEY ("gazar_id") REFERENCES "gazar"("bteg_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alba" ADD CONSTRAINT "alba_heltes_id_fkey" FOREIGN KEY ("heltes_id") REFERENCES "heltes"("bteg_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "heltes" ADD CONSTRAINT "heltes_darga_id_fkey" FOREIGN KEY ("darga_id") REFERENCES "user"("bteg_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "heltes" ADD CONSTRAINT "heltes_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("bteg_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "heltes" ADD CONSTRAINT "heltes_gazar_id_fkey" FOREIGN KEY ("gazar_id") REFERENCES "gazar"("bteg_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gazar" ADD CONSTRAINT "gazar_darga_id_fkey" FOREIGN KEY ("darga_id") REFERENCES "user"("bteg_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gazar" ADD CONSTRAINT "gazar_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("bteg_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clause_job_position" ADD CONSTRAINT "clause_job_position_clauseId_fkey" FOREIGN KEY ("clauseId") REFERENCES "clause"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "clause_job_position" ADD CONSTRAINT "clause_job_position_job_positionId_fkey" FOREIGN KEY ("job_positionId") REFERENCES "job_position"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "job_position" ADD CONSTRAINT "job_position_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "division"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "job_position" ADD CONSTRAINT "job_position_gazar_id_fkey" FOREIGN KEY ("gazar_id") REFERENCES "gazar"("bteg_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_position" ADD CONSTRAINT "job_position_alba_id_fkey" FOREIGN KEY ("alba_id") REFERENCES "alba"("bteg_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_position" ADD CONSTRAINT "job_position_heltes_id_fkey" FOREIGN KEY ("heltes_id") REFERENCES "heltes"("bteg_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_position" ADD CONSTRAINT "job_position_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("bteg_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rating" ADD CONSTRAINT "rating_clause_job_position_id_fkey" FOREIGN KEY ("clause_job_position_id") REFERENCES "clause_job_position"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
