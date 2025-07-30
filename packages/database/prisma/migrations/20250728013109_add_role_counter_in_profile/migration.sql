/*
  Warnings:

  - You are about to drop the column `token_version` on the `profile_role` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "profile" ADD COLUMN     "role_version" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "profile_role" DROP COLUMN "token_version";
