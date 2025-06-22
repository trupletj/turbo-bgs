import { type_clause_job_position } from "@repo/database/generated/prisma/client/client";

export interface Clause {
  id?: string; // Шинэ бол undefined, хуучин бол string
  referenceNumber: string;
  text: string;
  parentId?: string | null;
  children?: Clause[];
  positions?: { positionId: string; type: type_clause_job_position }[];
}

export interface Section {
  id?: string; // Шинэ бол undefined, хуучин бол string
  referenceNumber: string;
  text: string;
  clauses: Clause[];
}
