-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'HR', 'ADMIN', 'DARGA', 'UB');

-- CreateEnum
CREATE TYPE "rating_process" AS ENUM ('ACTIVE', 'END');

-- CreateEnum
CREATE TYPE "type_clause_position" AS ENUM ('IMPLEMENTATION', 'MONITORING', 'VERIFICATION', 'DEPLOYMENT');

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "user_id" BIGINT,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "clause_position" (
    "id" UUID NOT NULL,
    "clauseId" UUID NOT NULL,
    "positionId" UUID NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "type" "type_clause_position",

    CONSTRAINT "clause_position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255),
    "registrationNumber" VARCHAR(255),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255),
    "companyId" UUID,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "division" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255),
    "departmentId" UUID,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "bteg_id" INTEGER,

    CONSTRAINT "division_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "position" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255),
    "divisionId" UUID NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "bteg_id" INTEGER,

    CONSTRAINT "position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rating" (
    "id" UUID NOT NULL,
    "score" INTEGER NOT NULL,
    "description" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "clause_position_id" UUID NOT NULL,
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
CREATE UNIQUE INDEX "policy_referenceCode_key" ON "policy"("referenceCode");

-- AddForeignKey
ALTER TABLE "clause" ADD CONSTRAINT "clause_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "clause"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "clause" ADD CONSTRAINT "clause_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "section"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "clause_position" ADD CONSTRAINT "clause_position_clauseId_fkey" FOREIGN KEY ("clauseId") REFERENCES "clause"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "clause_position" ADD CONSTRAINT "clause_position_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "position"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "division" ADD CONSTRAINT "division_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "position" ADD CONSTRAINT "position_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "division"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rating" ADD CONSTRAINT "rating_clause_position_id_fkey" FOREIGN KEY ("clause_position_id") REFERENCES "clause_position"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rating" ADD CONSTRAINT "rating_rating_session_id_fkey" FOREIGN KEY ("rating_session_id") REFERENCES "rating_session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "section" ADD CONSTRAINT "section_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "policy"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
