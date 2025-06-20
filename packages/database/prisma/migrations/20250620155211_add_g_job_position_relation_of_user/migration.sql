/*
  Warnings:

  - You are about to drop the column `job_position_name` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `company` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `department` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `division` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[bteg_id]` on the table `job_position` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "department" DROP CONSTRAINT "department_companyId_fkey";

-- DropForeignKey
ALTER TABLE "division" DROP CONSTRAINT "division_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "job_position" DROP CONSTRAINT "job_position_divisionId_fkey";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "job_position_name",
ADD COLUMN     "job_position_id" TEXT;

-- DropTable
DROP TABLE "company";

-- DropTable
DROP TABLE "department";

-- DropTable
DROP TABLE "division";

-- CreateIndex
CREATE UNIQUE INDEX "job_position_bteg_id_key" ON "job_position"("bteg_id");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_job_position_id_fkey" FOREIGN KEY ("job_position_id") REFERENCES "job_position"("bteg_id") ON DELETE SET NULL ON UPDATE CASCADE;
