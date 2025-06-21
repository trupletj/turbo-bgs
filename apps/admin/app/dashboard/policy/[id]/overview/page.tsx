"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import { notFound } from "next/navigation";
import { getPolicy } from "@/action/PolicyService";
import { positions } from "@/lib/data";

interface Policy {
  id: string;
  name: string | null;
  referenceCode: string;
  approvedDate: Date | null;
  section?: {
    id: string;
    referenceNumber: string | null;
    text?: string | null;
    clause?: {
      id: string;
      referenceNumber: string;
      text: string;
      clause_position?: { positionId: string; type: string }[];
    }[];
  }[];
}

interface OverviewPageProps {
  params: Promise<{ id: string }>;
}

export default function OverviewPage({ params }: OverviewPageProps) {
  const resolvedParams = use(params);
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPolicy = async () => {
      setIsLoading(true);
      try {
        const data = await getPolicy(resolvedParams.id);
        setPolicy(data);
      } catch (error) {
        console.error("Failed to fetch policy:", error);
        throw notFound();
      } finally {
        setIsLoading(false);
      }
    };
    fetchPolicy();
  }, [resolvedParams.id]);

  if (isLoading) {
    return <div className="text-center py-8">Ачааллаж байна...</div>;
  }

  if (!policy) {
    throw notFound();
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">{policy.name} - Тойм</h1>
      <p className="mb-4">
        <strong>Дугаар:</strong> {policy.referenceCode}
      </p>
      <p className="mb-4">
        <strong>Батлагдсан:</strong>{" "}
        {policy.approvedDate
          ? new Date(policy.approvedDate).toLocaleDateString()
          : "Тодорхойгүй"}
      </p>

      {policy.section?.map((section) => (
        <div key={section.id} className="mt-4 p-4 border rounded">
          <h3 className="text-lg font-medium">
            {section.referenceNumber}. {section.text || "Тайлбар байхгүй"}
          </h3>
          {section.clause?.map((clause) => (
            <div key={clause.id} className="ml-6 mt-2">
              <span className="font-bold">{clause.referenceNumber}.</span>{" "}
              {clause.text}
              {clause.clause_position?.length ? (
                <ul className="ml-4 mt-1 list-disc">
                  {clause.clause_position.map((cp) => {
                    const position = positions.find(
                      (p) => p.id === cp.positionId
                    );
                    return (
                      <li key={cp.positionId}>
                        {position?.name || "Тодорхойгүй"} ({cp.type})
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="ml-4 mt-1 text-gray-500">Ажлын байр холбоогүй</p>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
