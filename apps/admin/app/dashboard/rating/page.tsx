import {
  ClauseList,
  JobList,
  ClauseJobLinkList,
  ModeToggle,             // ‹— is_search_clause switch
} from './_components'
import {
  getAllClauses,
  getAllJobs,
  getJobsByClause,
  getClausesByJob,
  getClauseJobLinks,
} from '@/data/rating-queries'      // ← өөрчил

export default async function RatingPage({
  searchParams,
}: {
  searchParams: {
    clause_id?:        string
    job_id?:           string
    is_search_clause?: 'true' | 'false'
  }
}) {
  const { clause_id, job_id } = searchParams
  const isSearch = searchParams.is_search_clause === 'true'

  /* ------------ 1-р, 2-р баганын өгөгдөл -------------- */

  const clauses = isSearch
    ? await getAllClauses()                        // жагсаалт харуулах
    : job_id
    ? await getClausesByJob(job_id)               // ажлын байр → заалт
    : []

  const jobs = isSearch
    ? clause_id
      ? await getJobsByClause(clause_id)          // заалт → ажлын байр
      : []
    : await getAllJobs()                          // жагсаалт харуулах

  /* ------------ 3-р баганын өгөгдөл ------------------- */

  const links =
    clause_id && job_id
      ? await getClauseJobLinks({ clause_id, job_id })
      : []

  return (
    <div className="p-4 space-y-4 max-w-full">
      <h1 className="text-xl font-semibold">Журам · Заалтын үнэлгээ</h1>
      <ModeToggle isSearch={isSearch} />

      {/* 3 багана — Resizable */}
      <ResizablePanelGroup
        direction="horizontal"
        className="border-t md:min-w-[600px]"
      >
        <ResizablePanel defaultSize={33} minSize={15}>
          {isSearch ? (
            <ClauseList list={clauses} selectedId={clause_id} />
          ) : (
            <JobList list={jobs} selectedId={job_id} />
          )}
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={33} minSize={15}>
          {isSearch ? (
            <JobList list={jobs}               selectedId={job_id}     clauseId={clause_id} />
          ) : (
            <ClauseList list={clauses}         selectedId={clause_id}  jobId={job_id} />
          )}
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={34} minSize={20}>
          <ClauseJobLinkList
            links={links}
            clauseId={clause_id}
            jobId={job_id}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
