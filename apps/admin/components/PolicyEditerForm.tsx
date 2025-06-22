"use client";

import { useState, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@/components/ui/button";
import ClauseItem from "./ClauseItem";
import { Clause, Section } from "@/types/clause";
import { type_clause_job_position } from "@repo/database/generated/prisma/client/client";

interface PolicyFormData {
  name: string;
  referenceCode: string;
  approvedDate: Date | null;
}

interface PolicyFormProps {
  initialData?: {
    id: string;
    name: string;
    referenceCode: string;
    approvedDate: Date | null;
    sections: Array<{
      id: string;
      policyId?: string; // Шинэ талбар
      referenceNumber: string;
      text: string;
      clauses: Array<{
        id: string;
        policyId?: string; // Шинэ талбар
        referenceNumber: string;
        text: string;
        sectionId?: string;
        parentId?: string | null;
        children?: Clause[];
        positions?: { positionId: string; type: type_clause_job_position }[];
      }>;
    }>;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PolicyEditerForm({
  initialData,
  onSuccess,
  onCancel,
}: PolicyFormProps) {
  const [policyData, setPolicyData] = useState<PolicyFormData>({
    name: initialData?.name || "",
    referenceCode: initialData?.referenceCode || "",
    approvedDate: initialData?.approvedDate || null,
  });
  const [sections, setSections] = useState<Section[]>(
    initialData?.sections.map((s) => ({
      ...s,
      policyId: s.policyId || initialData.id, // policyId-г оруулах
      clauses: s.clauses.map((c) => ({
        ...c,
        policyId: c.policyId || initialData.id, // policyId-г оруулах
      })),
    })) || []
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const addSection = useCallback(() => {
    if (isProcessing) return;
    setSections((prev) => [
      ...prev,
      {
        referenceNumber: `${prev.length + 1}`,
        text: "",
        clauses: [],
        policyId: initialData?.id, // Шинэ section-д policyId
      },
    ]);
    console.log("New section added:", { totalSections: sections.length + 1 });
  }, [isProcessing, sections.length, initialData?.id]);

  const deleteSection = useCallback((sectionIndex: number) => {
    if (!confirm("Бүлгийг устгахдаа итгэлтэй байна уу?")) return;
    setSections((prev) => {
      const section = prev[sectionIndex];
      console.log("Deleting section (UI only):", {
        sectionId: section.id || `index-${sectionIndex}`,
      });
      return prev
        .filter((_, idx) => idx !== sectionIndex)
        .map((s, idx) => ({
          ...s,
          referenceNumber: `${idx + 1}`,
          clauses: s.clauses.map((c, cIdx) => ({
            ...c,
            referenceNumber: `${idx + 1}.${cIdx + 1}`,
            children: updateClauseNumbers(
              c.children ?? [],
              `${idx + 1}.${cIdx + 1}`
            ),
          })),
        }));
    });
    console.log("Section deleted (UI only)");
  }, []);

  const addClause = useCallback(
    (sectionIndex: number) => {
      if (isProcessing) return;
      setSections((prev) => {
        const newSections = JSON.parse(JSON.stringify(prev));
        const section = newSections[sectionIndex];
        const newClause: Clause = {
          text: "",
          referenceNumber: `${section.referenceNumber}.${section.clauses.length + 1}`,
          sectionId: section.id,
          policyId: section.policyId, // Шинэ clause-д policyId
          children: [],
          positions: [],
        };
        section.clauses = [...section.clauses, newClause];
        console.log("New clause added:", {
          section: section.referenceNumber,
          clause: newClause.referenceNumber,
        });
        return newSections;
      });
    },
    [isProcessing]
  );

  const addSubClause = useCallback(
    (sectionIndex: number, path: number[]) => {
      if (isProcessing) return;
      setSections((prev) => {
        const newSections = JSON.parse(JSON.stringify(prev));
        const section = newSections[sectionIndex];
        let current = section.clauses;
        for (let i = 0; i < path.length - 1; i++) {
          current = current[path[i]].children!;
        }
        const parentClause = current[path[path.length - 1]];
        const newSubClause: Clause = {
          text: "",
          referenceNumber: `${parentClause.referenceNumber}.${(parentClause.children?.length ?? 0) + 1}`,
          sectionId: section.id,
          policyId: section.policyId, // Шинэ sub-clause-д policyId
          children: [],
          positions: [],
        };
        parentClause.children = [
          ...(parentClause.children ?? []),
          newSubClause,
        ];
        console.log("New sub-clause added:", {
          parentClause: parentClause.referenceNumber,
          subClause: newSubClause.referenceNumber,
        });
        return newSections;
      });
    },
    [isProcessing]
  );

  const updateSectionText = useCallback(
    (sectionIndex: number, text: string) => {
      setSections((prev) => {
        const newSections = [...prev];
        newSections[sectionIndex] = { ...newSections[sectionIndex], text };
        console.log("Section text updated:", {
          referenceNumber: newSections[sectionIndex].referenceNumber,
          text: text.substring(0, 20) + (text.length > 20 ? "..." : ""),
        });
        return newSections;
      });
    },
    []
  );

  const updateClauseText = useCallback(
    (sectionIndex: number, path: number[], text: string) => {
      if (isProcessing) return;
      setSections((prev) => {
        const newSections = JSON.parse(JSON.stringify(prev));
        const section = newSections[sectionIndex];
        let current = section.clauses;
        for (let i = 0; i < path.length - 1; i++) {
          current = current[path[i]].children!;
        }
        current[path[path.length - 1]] = {
          ...current[path[path.length - 1]],
          text,
        };
        console.log("Clause text updated:", {
          referenceNumber: current[path[path.length - 1]].referenceNumber,
          text: text.substring(0, 20) + (text.length > 20 ? "..." : ""),
        });
        return newSections;
      });
    },
    [isProcessing]
  );

  const updateClausePositions = useCallback(
    (
      sectionIndex: number,
      path: number[],
      positions: { positionId: string; type: type_clause_job_position }[]
    ) => {
      setSections((prev) => {
        const newSections = JSON.parse(JSON.stringify(prev));
        const section = newSections[sectionIndex];
        let current = section.clauses;
        for (let i = 0; i < path.length - 1; i++) {
          current = current[path[i]].children!;
        }
        current[path[path.length - 1]] = {
          ...current[path[path.length - 1]],
          positions,
        };
        console.log("Clause positions updated:", {
          referenceNumber: current[path[path.length - 1]].referenceNumber,
          positions: positions.length,
        });
        return newSections;
      });
    },
    []
  );

  const deleteClause = useCallback(
    (sectionIndex: number, path: number[]) => {
      if (isProcessing) return;
      setSections((prev) => {
        const newSections = JSON.parse(JSON.stringify(prev));
        const section = newSections[sectionIndex];
        let current = section.clauses;
        for (let i = 0; i < path.length - 1; i++) {
          current = current[path[i]].children!;
        }
        const deletedClause = current[path[path.length - 1]];
        current.splice(path[path.length - 1], 1);
        const parentRef =
          path.length === 1
            ? section.referenceNumber
            : current.length > 0
              ? current[0].referenceNumber.split(".").slice(0, -1).join(".")
              : section.referenceNumber;
        current.forEach((clause: Clause, idx: number) => {
          clause.referenceNumber = `${parentRef}.${idx + 1}`;
          clause.children = updateClauseNumbers(
            clause.children ?? [],
            `${parentRef}.${idx + 1}`
          );
        });
        console.log("Clause deleted:", {
          referenceNumber: deletedClause.referenceNumber,
          remainingClauses: current.length,
        });
        return newSections;
      });
    },
    [isProcessing]
  );

  const updateClauseNumbers = (
    clauses: Clause[],
    parentRef: string
  ): Clause[] => {
    return clauses.map((clause, idx) => ({
      ...clause,
      referenceNumber: `${parentRef}.${idx + 1}`,
      children: updateClauseNumbers(
        clause.children ?? [],
        `${parentRef}.${idx + 1}`
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    const toastId = toast.loading("Журам хадгалж байна...");

    try {
      // Валидаци
      if (!policyData.name || !policyData.referenceCode) {
        throw new Error("Журмын нэр болон дугаар заавал оруулна уу");
      }

      const method = initialData ? "PUT" : "POST";
      const url = initialData
        ? `/api/policy?id=${initialData.id}`
        : `/api/policy`;
      console.log("Submitting policy:", {
        id: initialData?.id,
        name: policyData.name,
        referenceCode: policyData.referenceCode,
        approvedDate: policyData.approvedDate?.toISOString(),
      });

      const policyResponse = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(policyData),
      });
      if (!policyResponse.ok) {
        const error = await policyResponse.json();
        throw new Error(error.error || "Журам хадгалахад алдаа гарлаа");
      }
      const policy = await policyResponse.json();
      const policyId = policy.id;

      const deletedSections =
        initialData?.sections.filter(
          (initSection) => !sections.find((s) => s.id === initSection.id)
        ) || [];
      const deletedClauses: { sectionId: string; clauseId: string }[] = [];
      initialData?.sections.forEach((initSection) => {
        const currentSection = sections.find((s) => s.id === initSection.id);
        if (currentSection && initSection.id) {
          const initClauses = initSection.clauses;
          const currentClauses = currentSection.clauses;
          initClauses.forEach((initClause) => {
            if (
              initClause.id &&
              !currentClauses.find((c) => c.id === initClause.id)
            ) {
              deletedClauses.push({
                sectionId: initSection.id,
                clauseId: initClause.id,
              });
            }
          });
        }
      });

      // Устгагдсан бүлгүүдийг сервер рүү илгээх
      for (const deletedSection of deletedSections) {
        if (deletedSection.id) {
          console.log("Deleting section on server:", {
            sectionId: deletedSection.id,
          });
          const response = await fetch(`/api/section?id=${deletedSection.id}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Бүлэг устгахад алдаа гарлаа");
          }
        }
      }

      // Устгагдсан заалтуудыг сервер рүү илгээх
      for (const { clauseId } of deletedClauses) {
        console.log("Deleting clause on server:", { clauseId });
        const response = await fetch(`/api/clause?id=${clauseId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Заалт устгахад алдаа гарлаа");
        }
      }

      for (const section of sections) {
        const sectionMethod = section.id ? "PUT" : "POST";
        const sectionUrl = section.id
          ? `/api/section?id=${section.id}`
          : `/api/section`;

        console.log("Submitting section:", {
          sectionId: section.id || "new",
          referenceNumber: section.referenceNumber,
          text:
            section.text.substring(0, 20) +
            (section.text.length > 20 ? "..." : ""),
        });

        const sectionResponse = await fetch(sectionUrl, {
          method: sectionMethod,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            policyId,
            referenceNumber: section.referenceNumber,
            text: section.text,
          }),
        });
        if (!sectionResponse.ok) {
          const error = await sectionResponse.json();
          throw new Error(error.error || "Бүлэг хадгалахад алдаа гарлаа");
        }
        const savedSection = await sectionResponse.json();

        const saveClauses = async (
          clauses: Clause[],
          parentId: string | null = null
        ) => {
          for (const clause of clauses) {
            const clauseMethod = clause.id ? "PUT" : "POST";
            const clauseUrl = clause.id
              ? `/api/clause?id=${clause.id}`
              : `/api/clause`;

            console.log("Submitting clause:", {
              clauseId: clause.id || "new",
              referenceNumber: clause.referenceNumber,
              text:
                clause.text.substring(0, 20) +
                (clause.text.length > 20 ? "..." : ""),
              parentId,
              policyId,
              positions: clause.positions?.length || 0,
            });

            const clauseResponse = await fetch(clauseUrl, {
              method: clauseMethod,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                sectionId: savedSection.id,
                text: clause.text,
                referenceNumber: clause.referenceNumber,
                parentId,
                policyId, // Шинэ талбар
                positions: clause.positions,
              }),
            });
            if (!clauseResponse.ok) {
              const error = await clauseResponse.json();
              throw new Error(error.error || "Заалт хадгалахад алдаа гарлаа");
            }
            const savedClause = await clauseResponse.json();

            if (clause.children && clause.children.length > 0) {
              await saveClauses(clause.children, savedClause.id);
            }
          }
        };

        await saveClauses(section.clauses);
      }

      toast.update(toastId, {
        render: `Журам амжилттай ${initialData ? "засварлагдлаа" : "хадгалагдлаа"}`,
        type: "success",
        isLoading: false,
        autoClose: 1000,
      });
      console.log("Form submission successful");
      onSuccess();
    } catch (error) {
      console.error("Submission error:", error);
      toast.update(toastId, {
        render: `Алдаа: ${(error as Error).message}`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full mx-auto p-6">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            {initialData ? "Журам Засварлах" : "Шинэ Журам Үүсгэх"}
          </h1>
          <div className="flex gap-2">
            {initialData && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isProcessing}
              >
                Цуцлах
              </Button>
            )}
            <Button type="submit" disabled={isProcessing}>
              Хадгалах
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap my-4 container w-full shadow-md p-3 justify-between gap-4">
          <div className="flex-1 min-w-[250px]">
            <label className="block text-sm font-medium text-gray-700">
              Журмын дугаар
            </label>
            <Input
              required
              value={policyData.referenceCode}
              onChange={(e) =>
                setPolicyData((prev) => ({
                  ...prev,
                  referenceCode: e.target.value,
                }))
              }
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              placeholder="Журмын дугаарыг оруулна уу"
            />
          </div>

          <div className="flex-1 min-w-[400px]">
            <label className="block text-sm font-medium text-gray-700">
              Журмын нэр
            </label>
            <Textarea
              required
              value={policyData.name}
              onChange={(e) =>
                setPolicyData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              placeholder="Журмын нэрийг оруулна уу"
            />
          </div>

          <div className="flex-1 min-w-[250px]">
            <label className="block text-sm font-medium text-gray-700">
              Журмын баталсан огноо
            </label>
            <DatePicker
              selected={policyData.approvedDate}
              onChange={(date: Date | null) =>
                setPolicyData((prev) => ({
                  ...prev,
                  approvedDate: date,
                }))
              }
              dateFormat="yyyy/MM/dd"
              placeholderText="Журмын баталсан огноо"
              className="mt-1 p-2 w-full border border-gray-300 rounded"
            />
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Бүлгүүд</h2>
            <Button
              type="button"
              variant="outline"
              onClick={addSection}
              disabled={isProcessing}
            >
              + Бүлэг нэмэх
            </Button>
          </div>

          {sections.map((section, sectionIndex) => (
            <div
              key={section.id || sectionIndex}
              className="mt-4 p-4 border rounded"
            >
              <div className="flex items-center gap-4">
                <span className="font-bold">{section.referenceNumber}.</span>
                <Textarea
                  value={section.text}
                  onChange={(e) =>
                    updateSectionText(sectionIndex, e.target.value)
                  }
                  placeholder="Бүлгийн текст оруулна уу"
                  className="flex-1 p-2 border rounded"
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => deleteSection(sectionIndex)}
                  disabled={isProcessing}
                >
                  - Устгах
                </Button>
              </div>

              <div className="ml-6 mt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Заалтууд</h3>
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => addClause(sectionIndex)}
                    disabled={isProcessing}
                  >
                    + Заалт нэмэх
                  </Button>
                </div>

                {section.clauses.map((clause, clauseIndex) => (
                  <ClauseItem
                    key={clause.id || `${sectionIndex}-${clauseIndex}`}
                    sectionIndex={sectionIndex}
                    clause={clause}
                    clauseIndex={clauseIndex}
                    path={[clauseIndex]}
                    updateClauseText={updateClauseText}
                    updateClausePositions={updateClausePositions}
                    addSubClause={addSubClause}
                    deleteClause={deleteClause}
                    parentRefNumber={section.referenceNumber}
                    level={1}
                    isProcessing={isProcessing}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
}
