import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { getPolicyOne } from "@/action/PolicyService"
import { getJobPositions } from "@/action/JobPositionService"
import { prisma } from "@repo/database";



const RatingPage = async ({
  searchParams, 
}: {
  searchParams: {
    clause_id?: string;
    job_id?: string;
  };
}) => {

  const { clause_id, job_id } = searchParams

  const clauseWithPolicy = clause_id ? await prisma.clause.findUnique({
  where: { id: clause_id },
  select: {
    policy: {
      select: {
        id: true,
        name: true,
        referenceCode: true,
        approvedDate: true,
        clause: {
          where: { isDeleted: false }, // ← шаардлагатай бол шүү
          orderBy: { referenceNumber: 'asc' },
          select: {
            id: true,
            text: true,
            referenceNumber: true,
          },
        },
      },
    },
  },
}) : null

  const RelatedJobPositions = clause_id ? await getJobPositions({
    where: {
      clause_job_position: {
        some: {
          clauseId: clause_id,
          is_checked : true
        },
      },
    },
  }) : null

// const historyOfRating =( clause_id && job_id) ? await getRatings({
//   where : {
//     AND : {

//     }
//   }
// }) : []


  return (
    <>
      <h1>Журам болон заалтын үнэлгээ хийх</h1>
      <div>Search : Jurmiin nereer haih. or Jurmiin dugaaraar haih bolomjtoi baih</div>
      <input placeholder='Jurmiin ner eswel dugaaraar haina uu '/>
      <div>Журмын нэр хайлт хийж сонгож болдог байх</div>
      <ResizablePanelGroup
        direction="horizontal"
        className="max-w-full md:min-w-[450px] border-t"
      >
        <ResizablePanel defaultSize={35} minSize={10}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">
              {JSON.stringify(clauseWithPolicy,null,2)}
            </span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={35} minSize={10}>
          <div className="flex h-full items-center justify-center p-6">
             {JSON.stringify(RelatedJobPositions,null,2)}
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={35} minSize={10}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">
            {(clause_id && job_id) && <RatingForm /> }
            </span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
};

export default RatingPage;


function RatingForm(){
  return <form>
    <input placeholder='onoo' className='border' />
  </form>
}
