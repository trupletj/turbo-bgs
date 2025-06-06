-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "bteg_id" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "idcard_number" TEXT,
    "is_active" BOOLEAN,
    "address" TEXT,
    "register_number" TEXT,
    "gazar_id" TEXT,
    "alba_id" TEXT,
    "heltes_id" TEXT,
    "position_name" TEXT,
    "nice_name" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "first_name" TEXT,
    "last_name" TEXT,
    "organization_id" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_bteg_id_key" ON "User"("bteg_id");
