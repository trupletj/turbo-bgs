export type Policy = {
  id: string;
  name: string | null;
  approvedDate: string | null;
  referenceCode: string;
  isDeleted: boolean;
};

export type Section = {
  id: string;
  policyId: string;
  text: string;
  referenceNumber: string | null;
  isDeleted: boolean;
};

export type Clause = {
  id: string;
  text: string;
  referenceNumber: string;
  sectionId: string;
  parentId: string | null;
  isDeleted: boolean;
  children?: Clause[];
};

export interface Permission {
  id: string;
  name?: string | null;
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
  resource?: string | null;
  path: string[];
}

export interface ProfileRole {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface UserWithJobAndOrg {
  id: string;
  first_name: string | null;
  last_name: string | null;
  job_position_id: string | null;
  job_position?: {
    name: string | null;
    organization?: {
      name: string;
    } | null;
  } | null;
}
