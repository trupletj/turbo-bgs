"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import Link from "next/link";
import PolicyForm from "@/components/PolicyForm";

interface Policy {
  id: string;
  name: string | null;
  referenceCode: string | null;
  approvedDate: string | null;
  section?: Section[];
}

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
  children?: Clause[];
}

interface PolicyDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PolicyDetailPage({ params }: PolicyDetailPageProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const resolvedParams = use(params);
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchPolicy();
  }, [resolvedParams.id]);

  const fetchPolicy = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching policy details:", { policyId: resolvedParams.id });
      const response = await fetch(`/api/policy/?id=${resolvedParams.id}`, {
        cache: "no-store",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Журам олдсонгүй");
      }
      const data: Policy = await response.json();
      console.log("Policy response:", {
        id: data.id,
        referenceCode: data.referenceCode,
        name: data.name,
        section: data.section?.length,
      });
      setPolicy(data);
    } catch (error) {
      console.error("Failed to fetch policy:", error);
      notFound();
    } finally {
      setIsLoading(false);
    }
  };

  const renderClauses = (clauses: Clause[], level = 1) => (
    <div className={`ml-${level * 4}`}>
      {clauses.map((clause) => (
        <div key={clause.id} className="mt-2">
          <span className="font-bold">{clause.referenceNumber}.</span>{" "}
          {clause.text}
          {clause.children &&
            clause.children.length > 0 &&
            renderClauses(clause.children, level + 1)}
        </div>
      ))}
    </div>
  );

  if (isLoading) {
    return <div className="text-center py-8">Ачааллаж байна...</div>;
  }

  if (!policy) {
    return notFound();
  }

  if (editMode) {
    return (
      <PolicyForm
        initialData={{
          id: policy.id,
          name: policy.name || "",
          referenceCode: policy.referenceCode || "",
          approvedDate: policy.approvedDate
            ? new Date(policy.approvedDate)
            : null,
          sections: (policy.section ?? []).map((s) => ({
            id: s.id,
            referenceNumber: s.referenceNumber,
            text: s.text || "",
            clauses: (s.clause ?? []).map((c) => ({
              id: c.id,
              referenceNumber: c.referenceNumber,
              text: c.text,
              parentId: c.parentId,
              children: c.children ?? [],
            })),
          })),
        }}
        onSuccess={() => {
          setEditMode(false);
          fetchPolicy();
          toast.success("Журам амжилттай засварлагдлаа");
          console.log("Policy updated:", { policyId: policy.id });
        }}
        onCancel={() => {
          setEditMode(false);
          console.log("Edit mode cancelled:", { policyId: policy.id });
        }}
      />
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">{policy.name}</h1>
        <div>
          <Link href="/">
            <Button variant="outline" className="mr-2">
              Буцах
            </Button>
          </Link>
          <Button
            onClick={() => {
              setEditMode(true);
              console.log("Edit mode enabled:", { policyId: policy.id });
            }}
          >
            Засварлах
          </Button>
        </div>
      </div>
      <p className="font-semibold">Код: {policy.referenceCode}</p>
      <p className="font-semibold">
        Баталсан огноо:{" "}
        {policy.approvedDate
          ? new Date(policy.approvedDate).toLocaleDateString("mn-MN")
          : "Огноогүй"}
      </p>
      <div className="mt-6">
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
                {/* Заалтууд</h4> */}
                {(section.clause ?? []).length === 0 ? (
                  <p className="text-gray-500 mt-2">Заалт байхгүй</p>
                ) : (
                  renderClauses(section.clause ?? [])
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
