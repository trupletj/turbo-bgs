import { type_clause_job_position } from "@repo/database/generated/prisma/client/client";

export interface Clause {
  id?: string;
  policyId?: string | null;
  referenceNumber: string;
  text: string;
  parentId?: string | null;
  sectionId?: string;
  children?: Clause[];
  positions?: { positionId: string; type: type_clause_job_position }[];
}

export interface Section {
  id?: string;
  referenceNumber: string;
  policyId?: string;
  text: string;
  clauses: Clause[];
}

export interface Policy {
  id: string;
  name: string | null;
  referenceCode: string | null;
  approvedDate: string | null;
  section?: Section[];
}
