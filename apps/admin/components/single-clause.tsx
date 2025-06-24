import { clause as TClause } from "@repo/database/generated/prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "lucide-react";
import {
  type_clause_job_position,
  organization,
  heltes,
  alba,
  job_position,
} from "@repo/database/generated/prisma/client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getAllJobPositions } from "@/action/JobPositionService";
import { useEffect, useState } from "react";

interface JobPositionStructure {
  organization: organization;
  structure: Array<{
    heltes: heltes | null;
    alba: Array<{
      alba: alba | null;
      positions: job_position[];
    }>;
  }>;
}

const actionTypes: { value: type_clause_job_position; label: string }[] = [
  { value: "IMPLEMENTATION", label: "Хэрэгжүүлэлт" },
  { value: "MONITORING", label: "Хяналт" },
  { value: "VERIFICATION", label: "Баталгаажуулалт" },
  { value: "DEPLOYMENT", label: "Нэвтрүүлэлт" },
];

const SingleClause = async ({ clause }: { clause: TClause }) => {
  // const [jobPositions, setJobPositions] = useState<JobPositionStructure[]>([]);

  // const fetchJobPositions = async () => {
  //   try {
  //     const positions = await getAllJobPositions();
  //     setJobPositions(positions as JobPositionStructure[]);
  //     console.log("Job positions fetched:", { count: positions.length });
  //   } catch (error) {
  //     console.error("Failed to fetch job positions:", error);
  //   }
  // };

  const positions = await getAllJobPositions;

  return (
    <Sheet>
      <div className="ml-2 flex flex-row gap-5 items-center">
        <div>{clause.referenceNumber}</div>
        <div className="">{clause.text}</div>
        <SheetTrigger asChild>
          <Link className="w-3 h-3 cursor-pointer hover:scale-[1.2]" />
        </SheetTrigger>
      </div>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Ажлын байр холбох</SheetTitle>
        </SheetHeader>

        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          {jobPositions.map((org) => (
            <div key={org.organization.id}>
              <h3>{org.organization.name}</h3>
              {org.structure.map((heltesBlock, i) => (
                <div key={i}>
                  <div>Хэлтэс: {heltesBlock.heltes?.name}</div>
                  {heltesBlock.alba.map((albaBlock, j) => (
                    <div key={j}>
                      <div>Алба: {albaBlock.alba?.name}</div>
                      <ul>
                        {albaBlock.positions.map((pos) => (
                          <li key={pos.id}>{pos.name}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SingleClause;
