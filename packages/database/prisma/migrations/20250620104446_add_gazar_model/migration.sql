-- CreateTable
CREATE TABLE "Gazar" (
    "id" UUID NOT NULL,
    "bteg_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3),
    "darga_id" TEXT,
    "is_active" BOOLEAN NOT NULL,
    "organization_id" TEXT NOT NULL,
    "heltes_id" TEXT NOT NULL,

    CONSTRAINT "Gazar_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Gazar" ADD CONSTRAINT "Gazar_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("bteg_id") ON DELETE RESTRICT ON UPDATE CASCADE;
