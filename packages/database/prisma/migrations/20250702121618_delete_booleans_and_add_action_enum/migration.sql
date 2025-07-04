/*
  Warnings:

  - You are about to drop the column `can_create` on the `permission` table. All the data in the column will be lost.
  - You are about to drop the column `can_delete` on the `permission` table. All the data in the column will be lost.
  - You are about to drop the column `can_read` on the `permission` table. All the data in the column will be lost.
  - You are about to drop the column `can_update` on the `permission` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "action" AS ENUM ('CREATE', 'READ', 'UPDATE', 'DELETE');

-- AlterTable
ALTER TABLE "permission" DROP COLUMN "can_create",
DROP COLUMN "can_delete",
DROP COLUMN "can_read",
DROP COLUMN "can_update",
ADD COLUMN     "action" "action" NOT NULL DEFAULT 'READ';
