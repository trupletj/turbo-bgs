import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getPolicyOne } from "@/action/PolicyService";
import { policy } from "@repo/database/generated/prisma/client/client";
import SectionList from "@/components/section-list";

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
      <div className="flex justify-between mb-4">
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
      <p className="font-semibold mb-4">
        Баталсан огноо:{" "}
        {policy?.approvedDate
          ? new Date(policy.approvedDate).toLocaleDateString("mn-MN")
          : "Огноогүй"}
      </p>
      <SectionList id={id} />
    </div>
  );
}
