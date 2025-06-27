import { useState, useEffect } from "react";
import { use } from "react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import ClauseJobConnect from "@/components/clause-job-connect";
import { type_clause_job_position } from "@repo/database/generated/prisma/client/client";
import { getPolicy, getPolicyOne } from "@/action/PolicyService";
import { getClausePositionsByClauseId } from "@/action/ClausePositionService";
import { policy } from "@repo/database/generated/prisma/client/client";
import SectionList from "@/components/section-list";

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

export default async function PolicyDetailPageTest({
  params,
}: PolicyDetailPageProps) {
  const { id } = await params;

  const policy: policy | null = await getPolicyOne({
    where: { id, isDeleted: false },
    select: {
      id: true,
      name: true,
      approvedDate: true,
      referenceCode: true,
      isDeleted: true,
    },
  });

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
    </div>
  );
}
