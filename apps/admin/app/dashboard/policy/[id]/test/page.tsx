import { useState, useEffect } from "react";
import { use } from "react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import ClauseJobConnect from "@/components/clause-job-connect";
import { type_clause_job_position } from "@repo/database/generated/prisma/client/client";
import { getPolicy, getPolicyTest } from "@/action/PolicyService";
import { getClausePositionsByClauseId } from "@/action/ClausePositionService";
import { policy } from "@repo/database/generated/prisma/client/client";
import SectionList from "@/components/section-list";

// interface Policy {
//   id: string;
//   name: string | null;
//   referenceCode: string | null;
//   approvedDate: string | null;
//   section?: Section[];
// }

interface Section {
  id: string;
  referenceNumber: string;
  text?: string | null;
  policyId: string;
  clause?: Clause[];
}

interface Clause {
  id: string;
  referenceNumber: string;
  text: string;
  sectionId: string;
  parentId: string | null;
  policyId?: string | null;
  children?: Clause[];
  positions?: { positionId: string; type: type_clause_job_position }[];
}

interface PolicyDetailPageProps {
  params: Promise<{ id: string }>;
}

const actionTypes: { value: type_clause_job_position; label: string }[] = [
  { value: "IMPLEMENTATION", label: "Хэрэгжүүлэлт" },
  { value: "MONITORING", label: "Хяналт" },
  { value: "VERIFICATION", label: "Баталгаажуулалт" },
  { value: "DEPLOYMENT", label: "Нэвтрүүлэлт" },
];

export default async function PolicyDetailPageTest({
  params,
}: PolicyDetailPageProps) {
  const { id } = await params;

  const policy: policy | null = await getPolicyTest(id);
  // const resolvedParams = use(params);
  // const [policy, setPolicy] = useState<Policy | null>(null);
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   fetchPolicy();
  // }, [resolvedParams.id]);

  // const fetchPolicy = async () => {
  //   setIsLoading(true);
  //   try {
  //     console.log("Fetching policy details:", { policyId: resolvedParams.id });
  //     const response = await fetch(`/api/policy?id=${resolvedParams.id}`, {
  //       cache: "no-store",
  //     });
  //     if (!response.ok) {
  //       const error = await response.json();
  //       throw new Error(error.error || "Журам олдсонгүй");
  //     }
  //     const data: Policy = await response.json();

  //     // Fetch positions for each clause
  //     const enhancedSections = await Promise.all(
  //       (data.section ?? []).map(async (section) => {
  //         const enhancedClauses = await Promise.all(
  //           (section.clause ?? []).map(async (clause) => {
  //             try {
  //               const positions = await getClausePositionsByClauseId(clause.id);
  //               return {
  //                 ...clause,
  //                 positions: positions.map((pos) => ({
  //                   positionId: pos.job_positionId,
  //                   type: pos.type,
  //                 })),
  //               };
  //             } catch (error) {
  //               console.error(
  //                 `Failed to fetch positions for clause ${clause.id}:`,
  //                 error
  //               );
  //               return { ...clause, positions: [] };
  //             }
  //           })
  //         );
  //         return {
  //           ...section,
  //           clause: enhancedClauses,
  //         };
  //       })
  //     );

  //     const enhancedPolicy = {
  //       ...data,
  //       section: enhancedSections,
  //     };

  //     console.log("Policy response:", {
  //       id: enhancedPolicy.id,
  //       referenceCode: enhancedPolicy.referenceCode,
  //       name: enhancedPolicy.name,
  //       section: enhancedPolicy.section?.length,
  //       clauseCount: enhancedPolicy.section?.reduce(
  //         (acc, s) => acc + (s.clause?.length || 0),
  //         0
  //       ),
  //     });
  //     setPolicy(enhancedPolicy);
  //   } catch (error) {
  //     console.error("Failed to fetch policy:", error);
  //     throw notFound();
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const renderClauses = (clauses: Clause[], level = 0) => (
    <div className={`ml-${level === 0 ? "1" : "0"}`}>
      {clauses.map((clause) => (
        <div key={clause.id} className="mt-2">
          <div className="flex justify-between items-center gap-4">
            <div className="flex-1">
              <span className="font-bold">{clause.referenceNumber}.</span>{" "}
              {clause.text}
              {(clause.positions || []).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {(clause.positions || []).map((pos) => (
                    <Badge key={pos.positionId} variant="outline">
                      {pos.positionId} (
                      {actionTypes.find((t) => t.value === pos.type)?.label})
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            {/* <ClauseJobConnect clause={clause} onSave={fetchPolicy} /> */}
          </div>
          {clause.children &&
            clause.children.length > 0 &&
            renderClauses(clause.children, level + 1)}
        </div>
      ))}
    </div>
  );

  // if (isLoading) {
  //   return <div className="text-center py-8">Ачааллаж байна...</div>;
  // }

  // if (!policy) {
  //   throw notFound();
  // }

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">{policy?.name}</h1>
        <div>
          <Link href="/dashboard/policy">
            <Button variant="outline" className="mr-2">
              Буцах
            </Button>
          </Link>
          <Link href={`/dashboard/policy/${policy?.id}/edit`}>
            <Button>Засварлах</Button>
          </Link>
        </div>
      </div>
      <p className="font-semibold">Код: {policy?.referenceCode}</p>
      <p className="font-semibold">
        Баталсан огноо:{" "}
        {policy?.approvedDate
          ? new Date(policy.approvedDate).toLocaleDateString("mn-MN")
          : "Огноогүй"}
      </p>
      <SectionList id={id} />
      {/* <div className="mt-6">
        {JSON.stringify(policy, null, 2)}
        <h2 className="text-xl font-semibold">Бүлгүүд</h2>
        {(policy.section ?? []).length === 0 ? (
          <p className="text-gray-500 mt-2">Бүлэг байхгүй</p>
        ) : (
          policy.section!.map((section) => (
            <div key={section.id} className="mt-4 p-4 border rounded">
              <h3 className="text-lg font-medium">
                {section.referenceNumber}. {section.text || "Тайлбар байхгүй"}
              </h3>
              <div className="ml-6 mt-2">
                {(section.clause ?? []).length === 0 ? (
                  <p className="text-gray-500 mt-2">Заалт байхгүй</p>
                ) : (
                  renderClauses(section.clause ?? [])
                )}
              </div>
            </div>
          ))
        )}
      </div> */}
    </div>
  );
}
