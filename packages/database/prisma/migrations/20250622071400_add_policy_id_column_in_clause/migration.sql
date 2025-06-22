-- AlterTable
ALTER TABLE "clause" ADD COLUMN     "policy_id" UUID;

-- AddForeignKey
ALTER TABLE "clause" ADD CONSTRAINT "clause_policy_id_fkey" FOREIGN KEY ("policy_id") REFERENCES "policy"("id") ON DELETE SET NULL ON UPDATE CASCADE;
