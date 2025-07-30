/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `profile_role` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "profile_role" ADD COLUMN     "token_version" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "profile_role_name_key" ON "profile_role"("name");
