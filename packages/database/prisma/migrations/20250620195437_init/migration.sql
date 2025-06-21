-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'HR', 'ADMIN', 'DARGA', 'UB');

-- CreateEnum
CREATE TYPE "rating_process" AS ENUM ('ACTIVE', 'END');

-- CreateEnum
CREATE TYPE "type_clause_job_position" AS ENUM ('IMPLEMENTATION', 'MONITORING', 'VERIFICATION', 'DEPLOYMENT');

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "user_id" BIGINT,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization" (
    "id" UUID NOT NULL,
    "bteg_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sub_title" TEXT,
    "is_hr" BOOLEAN NOT NULL,
    "is_active" BOOLEAN,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
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
    "job_position_id" TEXT,
    "nice_name" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "first_name" TEXT,
    "last_name" TEXT,
    "organization_id" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alba" (
    "id" UUID NOT NULL,
    "bteg_id" TEXT NOT NULL,
    "sub_title" TEXT,
    "organization_id" TEXT,
    "name" TEXT,
    "description" TEXT,
    "gazar_id" TEXT,
    "heltes_id" TEXT,
    "is_active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "alba_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "heltes" (
    "id" UUID NOT NULL,
    "bteg_id" TEXT NOT NULL,
    "sub_title" TEXT,
    "organization_id" TEXT,
    "gazar_id" TEXT,
    "description" TEXT,
    "name" TEXT,
    "is_active" BOOLEAN NOT NULL,
    "updated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3),

    CONSTRAINT "heltes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gazar" (
    "id" UUID NOT NULL,
    "bteg_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL,
    "organization_id" TEXT NOT NULL,

    CONSTRAINT "gazar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clause" (
    "id" UUID NOT NULL,
    "text" TEXT NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "sectionId" UUID NOT NULL,
    "parentId" UUID,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "clause_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clause_job_position" (
    "id" UUID NOT NULL,
    "clauseId" UUID NOT NULL,
    "job_positionId" UUID NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "type" "type_clause_job_position",

    CONSTRAINT "clause_job_position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "policy" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255),
    "approvedDate" DATE,
    "referenceCode" VARCHAR(255) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "policy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_position" (
    "id" UUID NOT NULL,
    "bteg_id" TEXT,
    "gazar_id" TEXT,
    "alba_id" TEXT,
    "heltes_id" TEXT,
    "organization_id" TEXT,
    "name" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rating" (
    "id" UUID NOT NULL,
    "score" INTEGER NOT NULL,
    "description" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "clause_job_position_id" UUID NOT NULL,
    "rating_session_id" UUID NOT NULL,
    "scored_date" DATE NOT NULL,

    CONSTRAINT "rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rating_session" (
    "id" UUID NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "name" TEXT,
    "rating_process" "rating_process" NOT NULL,

    CONSTRAINT "rating_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "section" (
    "id" UUID NOT NULL,
    "policyId" UUID,
    "text" TEXT NOT NULL,
    "referenceNumber" VARCHAR(255),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "section_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_session_token_key" ON "Session"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "organization_bteg_id_key" ON "organization"("bteg_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_bteg_id_key" ON "user"("bteg_id");

-- CreateIndex
CREATE UNIQUE INDEX "alba_bteg_id_key" ON "alba"("bteg_id");

-- CreateIndex
CREATE UNIQUE INDEX "heltes_bteg_id_key" ON "heltes"("bteg_id");

-- CreateIndex
CREATE UNIQUE INDEX "gazar_bteg_id_key" ON "gazar"("bteg_id");

-- CreateIndex
CREATE UNIQUE INDEX "policy_referenceCode_key" ON "policy"("referenceCode");

-- CreateIndex
CREATE UNIQUE INDEX "job_position_bteg_id_key" ON "job_position"("bteg_id");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_gazar_id_fkey" FOREIGN KEY ("gazar_id") REFERENCES "gazar"("bteg_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_heltes_id_fkey" FOREIGN KEY ("heltes_id") REFERENCES "heltes"("bteg_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_alba_id_fkey" FOREIGN KEY ("alba_id") REFERENCES "alba"("bteg_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_job_position_id_fkey" FOREIGN KEY ("job_position_id") REFERENCES "job_position"("bteg_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alba" ADD CONSTRAINT "alba_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("bteg_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alba" ADD CONSTRAINT "alba_gazar_id_fkey" FOREIGN KEY ("gazar_id") REFERENCES "gazar"("bteg_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alba" ADD CONSTRAINT "alba_heltes_id_fkey" FOREIGN KEY ("heltes_id") REFERENCES "heltes"("bteg_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "heltes" ADD CONSTRAINT "heltes_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("bteg_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "heltes" ADD CONSTRAINT "heltes_gazar_id_fkey" FOREIGN KEY ("gazar_id") REFERENCES "gazar"("bteg_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gazar" ADD CONSTRAINT "gazar_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("bteg_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clause" ADD CONSTRAINT "clause_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "clause"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "clause" ADD CONSTRAINT "clause_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "section"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "clause_job_position" ADD CONSTRAINT "clause_job_position_clauseId_fkey" FOREIGN KEY ("clauseId") REFERENCES "clause"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "clause_job_position" ADD CONSTRAINT "clause_job_position_job_positionId_fkey" FOREIGN KEY ("job_positionId") REFERENCES "job_position"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "job_position" ADD CONSTRAINT "job_position_gazar_id_fkey" FOREIGN KEY ("gazar_id") REFERENCES "gazar"("bteg_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_position" ADD CONSTRAINT "job_position_alba_id_fkey" FOREIGN KEY ("alba_id") REFERENCES "alba"("bteg_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_position" ADD CONSTRAINT "job_position_heltes_id_fkey" FOREIGN KEY ("heltes_id") REFERENCES "heltes"("bteg_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_position" ADD CONSTRAINT "job_position_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("bteg_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rating" ADD CONSTRAINT "rating_clause_job_position_id_fkey" FOREIGN KEY ("clause_job_position_id") REFERENCES "clause_job_position"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rating" ADD CONSTRAINT "rating_rating_session_id_fkey" FOREIGN KEY ("rating_session_id") REFERENCES "rating_session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "section" ADD CONSTRAINT "section_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "policy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
