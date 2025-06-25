/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `clause_job_position` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "clause_job_position" DROP COLUMN "isDeleted",
ADD COLUMN     "is_checked" BOOLEAN NOT NULL DEFAULT false;
