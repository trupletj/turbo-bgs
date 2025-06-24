import { getAllSortedClauses } from "@/action/ClauseService";
import React from "react";
import { clause } from "@repo/database/generated/prisma/client";
import SingleClause from "./single-clause";

const ClauseList = async ({ id }: { id: string }) => {
  const clauses: clause[] = await getAllSortedClauses(id);

  return (
    <div>
      {clauses?.map((clause) => (
        <SingleClause key={clause.id + "single-clause"} clause={clause} />
      ))}
    </div>
  );
};

export default ClauseList;
