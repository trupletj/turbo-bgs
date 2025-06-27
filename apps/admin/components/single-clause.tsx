import { clause as TClause } from "@repo/database/generated/prisma/client";
import { Link as IconLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import RatingDialogContent from "./ rating-dialog-content";

interface SingleClauseProps {
  clause: TClause;
}

const SingleClause = async ({ clause }: SingleClauseProps) => {
  const clause_id = clause.id;
  return (
    <div className="ml-2 flex flex-row gap-5 items-center">
      <div>{clause.referenceNumber}</div>
      <div>{clause.text}</div>

      <div className="flex flex-row gap-2 items-center ml-auto">
        <Link href={`/dashboard/policy/${clause.policyId}/${clause.id}`}>
          <IconLink className="w-3 h-3 cursor-pointer hover:scale-[1.2]" />
        </Link>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Үнэлэх</Button>
        </DialogTrigger>
        <RatingDialogContent
          id={clause_id}
          clause_reference_code={clause.referenceNumber}
          clause_text={clause.text}
        />
      </Dialog>
    </div>
  );
};

export default SingleClause;
