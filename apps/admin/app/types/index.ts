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
