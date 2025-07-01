/*
  Warnings:

  - You are about to drop the column `action` on the `permission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "permission" DROP COLUMN "action",
ADD COLUMN     "can_create" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "can_delete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "can_read" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "can_update" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "action";
