/*
  Warnings:

  - Added the required column `profile_role_id` to the `profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "profile" ADD COLUMN     "profile_role_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "permission" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "can_create" BOOLEAN NOT NULL DEFAULT false,
    "can_read" BOOLEAN NOT NULL DEFAULT false,
    "can_update" BOOLEAN NOT NULL DEFAULT false,
    "can_delete" BOOLEAN NOT NULL DEFAULT false,
    "resource" TEXT,
    "path" TEXT[],

    CONSTRAINT "permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "profile_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_permissionToprofile_role" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_permissionToprofile_role_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_permissionToprofile_role_B_index" ON "_permissionToprofile_role"("B");

-- AddForeignKey
ALTER TABLE "profile" ADD CONSTRAINT "profile_profile_role_id_fkey" FOREIGN KEY ("profile_role_id") REFERENCES "profile_role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_permissionToprofile_role" ADD CONSTRAINT "_permissionToprofile_role_A_fkey" FOREIGN KEY ("A") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_permissionToprofile_role" ADD CONSTRAINT "_permissionToprofile_role_B_fkey" FOREIGN KEY ("B") REFERENCES "profile_role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
