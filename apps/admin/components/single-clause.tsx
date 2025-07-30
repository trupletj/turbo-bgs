import { clause as TClause } from "@repo/database/generated/prisma/client";
import { Link as IconLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import RatingDialogContent from "./rating-dialog-content";
import { hasAccess } from "@/action/PermissionService";

interface SingleClauseProps {
  clause: TClause;
}

const SingleClause = async ({ clause }: SingleClauseProps) => {
  const isRating = await hasAccess("/dashboard/policy/clause/rate", "UPDATE");
  const clause_id = clause.id;

  return (
    <div className="ml-2 flex gap-5 items-baseline">
      <div className="shrink-0 font-light pt-1">{clause.referenceNumber}</div>

      <div className="flex-1 flex items-center justify-between gap-2">
        <div className="text-m">{clause.text}</div>

        {isRating && (
          <div className="flex items-center gap-2 shrink-0">
            <Link href={`/dashboard/policy/${clause.policyId}/${clause.id}`}>
              <IconLink className="w-4 h-4 cursor-pointer hover:scale-110" />
            </Link>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-xs px-3 py-1 h-auto">
                  Үнэлэх
                </Button>
              </DialogTrigger>
              <RatingDialogContent
                id={clause_id}
                clause_reference_code={clause.referenceNumber}
                clause_text={clause.text}
              />
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleClause;
