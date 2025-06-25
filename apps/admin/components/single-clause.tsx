import { clause as TClause } from '@repo/database/generated/prisma/client';
import { Link as IconLink } from 'lucide-react';

import {
  type_clause_job_position,
  organization,
  heltes,
  alba,
  job_position,
} from '@repo/database/generated/prisma/client';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import ClauseJobConnect from './clause-jobe-connect';
import Link from 'next/link';

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
  { value: 'IMPLEMENTATION', label: 'Хэрэгжүүлэлт' },
  { value: 'MONITORING', label: 'Хяналт' },
  { value: 'VERIFICATION', label: 'Баталгаажуулалт' },
  { value: 'DEPLOYMENT', label: 'Нэвтрүүлэлт' },
];

const SingleClause = async ({ clause }: { clause: TClause }) => {
  return (
    // <Sheet>
    //   <div className="ml-2 flex flex-row gap-5 items-center">
    //     <div>{clause.referenceNumber}</div>
    //     <div className="">{clause.text}</div>
    //     <SheetTrigger asChild>
    //       <Link className="w-3 h-3 cursor-pointer hover:scale-[1.2]" />
    //     </SheetTrigger>
    //   </div>

    //   <SheetContent>
    //     <SheetHeader>
    //       <SheetTitle>Ажлын байр холбох</SheetTitle>
    //     </SheetHeader>

    //     <div className="grid flex-1 auto-rows-min gap-6 px-4">
    //       <ClauseJobConnect />
    //     </div>
    //   </SheetContent>
    // </Sheet>

    <div className="ml-2 flex flex-row gap-5 items-center">
        <div>{clause.referenceNumber}</div>
        <div className="">{clause.text}</div>
       
         <Link href={`/dashboard/policy/${clause.policyId}/${clause.id}`}>  <IconLink className="w-3 h-3 cursor-pointer hover:scale-[1.2]" /></Link>
        
      </div>
  );
};

export default SingleClause;
