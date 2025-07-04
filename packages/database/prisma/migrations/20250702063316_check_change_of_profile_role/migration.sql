/*
  Warnings:

  - You are about to drop the column `profile_role_id` on the `profile` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "profile" DROP CONSTRAINT "profile_profile_role_id_fkey";

-- AlterTable
ALTER TABLE "profile" DROP COLUMN "profile_role_id";

-- CreateTable
CREATE TABLE "_profileToprofile_role" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_profileToprofile_role_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_profileToprofile_role_B_index" ON "_profileToprofile_role"("B");

-- AddForeignKey
ALTER TABLE "_profileToprofile_role" ADD CONSTRAINT "_profileToprofile_role_A_fkey" FOREIGN KEY ("A") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_profileToprofile_role" ADD CONSTRAINT "_profileToprofile_role_B_fkey" FOREIGN KEY ("B") REFERENCES "profile_role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
