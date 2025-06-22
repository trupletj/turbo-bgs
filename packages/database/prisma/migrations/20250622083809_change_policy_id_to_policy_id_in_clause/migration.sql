/*
  Warnings:

  - You are about to drop the column `policy_id` on the `clause` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "clause" DROP CONSTRAINT "clause_policy_id_fkey";

-- AlterTable
ALTER TABLE "clause" DROP COLUMN "policy_id",
ADD COLUMN     "policyId" UUID;

-- AddForeignKey
ALTER TABLE "clause" ADD CONSTRAINT "clause_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "policy"("id") ON DELETE SET NULL ON UPDATE CASCADE;
