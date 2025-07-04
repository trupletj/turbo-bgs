/*
  Warnings:

  - You are about to drop the `_profileToprofile_role` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_profileToprofile_role" DROP CONSTRAINT "_profileToprofile_role_A_fkey";

-- DropForeignKey
ALTER TABLE "_profileToprofile_role" DROP CONSTRAINT "_profileToprofile_role_B_fkey";

-- DropTable
DROP TABLE "_profileToprofile_role";

-- CreateTable
CREATE TABLE "_ProfileToRoles" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProfileToRoles_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProfileToRoles_B_index" ON "_ProfileToRoles"("B");

-- AddForeignKey
ALTER TABLE "_ProfileToRoles" ADD CONSTRAINT "_ProfileToRoles_A_fkey" FOREIGN KEY ("A") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileToRoles" ADD CONSTRAINT "_ProfileToRoles_B_fkey" FOREIGN KEY ("B") REFERENCES "profile_role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
