export interface Clause {
  referenceNumber: string;
  text: string;
  children?: Clause[];
}

export interface Section {
  referenceNumber: string;
  text: string;
  clauses: Clause[];
}

export interface Policy {
  name: string;
  referenceCode: string;
  approvedDate: Date | null;
  sections: Section[];
}
