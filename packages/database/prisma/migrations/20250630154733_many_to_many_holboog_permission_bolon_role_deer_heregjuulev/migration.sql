/*
  Warnings:

  - You are about to drop the column `role_id` on the `permission` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "permission" DROP CONSTRAINT "permission_role_id_fkey";

-- AlterTable
ALTER TABLE "permission" DROP COLUMN "role_id";

-- CreateTable
CREATE TABLE "_permissionToprofile_role" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_permissionToprofile_role_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_permissionToprofile_role_B_index" ON "_permissionToprofile_role"("B");

-- AddForeignKey
ALTER TABLE "_permissionToprofile_role" ADD CONSTRAINT "_permissionToprofile_role_A_fkey" FOREIGN KEY ("A") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_permissionToprofile_role" ADD CONSTRAINT "_permissionToprofile_role_B_fkey" FOREIGN KEY ("B") REFERENCES "profile_role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
