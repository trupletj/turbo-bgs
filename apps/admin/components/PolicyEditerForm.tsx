"use client";

import { useState, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ClauseItem from "./ClauseItem";
import { type_clause_job_position } from "@repo/database/generated/prisma/client/client";

interface Clause {
  id: string;
  referenceNumber: string;
  text: string;
  parentId?: string | null;
  children?: Clause[];
  positions?: { positionId: string; type: type_clause_job_position }[];
}

interface Section {
  id: string;
  referenceNumber: string;
  text: string;
  clauses: Clause[];
}

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
    sections: Section[];
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
    initialData?.sections || []
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const addSection = useCallback(() => {
    if (isProcessing) return;
    setIsProcessing(true);
    setSections((prev) => [
      ...prev,
      {
        id: `temp-${crypto.randomUUID()}`,
        referenceNumber: `${prev.length + 1}`,
        text: "",
        clauses: [],
      },
    ]);
    console.log("New section added:", { totalSections: sections.length + 1 });
    setIsProcessing(false);
  }, [isProcessing, sections.length]);

  const deleteSection = useCallback(
    (sectionIndex: number) => {
      if (!confirm("Бүлгийг устгахдаа итгэлтэй байна уу?")) return;
      setIsProcessing(true);
      setSections((prev) => {
        const section = prev[sectionIndex];
        console.log("Deleting section (UI only):", { sectionId: section.id });
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
      setIsProcessing(false);
    },
    [isProcessing]
  );

  const addClause = useCallback(
    (sectionIndex: number) => {
      if (isProcessing) return;
      setIsProcessing(true);
      setSections((prev) => {
        const newSections = JSON.parse(JSON.stringify(prev));
        const section = newSections[sectionIndex];
        const newClause: Clause = {
          id: `temp-${crypto.randomUUID()}`,
          text: "",
          referenceNumber: `${section.referenceNumber}.${section.clauses.length + 1}`,
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
      setIsProcessing(false);
    },
    [isProcessing]
  );

  const addSubClause = useCallback(
    (sectionIndex: number, path: number[]) => {
      if (isProcessing) return;
      setIsProcessing(true);
      setSections((prev) => {
        const newSections = JSON.parse(JSON.stringify(prev));
        const section = newSections[sectionIndex];
        let current = section.clauses;
        for (let i = 0; i < path.length - 1; i++) {
          current = current[path[i]].children!;
        }
        const parentClause = current[path[path.length - 1]];
        const newSubClause: Clause = {
          id: `temp-${crypto.randomUUID()}`,
          text: "",
          referenceNumber: `${parentClause.referenceNumber}.${(parentClause.children?.length ?? 0) + 1}`,
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
      setIsProcessing(false);
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
      setIsProcessing(true);
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
      setIsProcessing(false);
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
      setIsProcessing(true);
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
      setIsProcessing(false);
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

    try {
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
        if (currentSection) {
          const initClauses = initSection.clauses;
          const currentClauses = currentSection.clauses;
          initClauses.forEach((initClause) => {
            if (!currentClauses.find((c) => c.id === initClause.id)) {
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
        if (!deletedSection.id.startsWith("temp-")) {
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
        if (!clauseId.startsWith("temp-")) {
          console.log("Deleting clause on server:", { clauseId });
          const response = await fetch(`/api/clause?id=${clauseId}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Заалт устгахад алдаа гарлаа");
          }
        }
      }

      for (const section of sections) {
        const sectionMethod = section.id.startsWith("temp-") ? "POST" : "PUT";
        const sectionUrl =
          sectionMethod === "POST"
            ? `/api/section`
            : `/api/section?id=${section.id}`;

        console.log("Submitting section:", {
          sectionId: section.id,
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
            const clauseMethod = clause.id.startsWith("temp-") ? "POST" : "PUT";
            const clauseUrl =
              clauseMethod === "POST"
                ? `/api/clause`
                : `/api/clause?id=${clause.id}`;

            console.log("Submitting clause:", {
              clauseId: clause.id,
              referenceNumber: clause.referenceNumber,
              text:
                clause.text.substring(0, 20) +
                (clause.text.length > 20 ? "..." : ""),
              parentId,
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

      toast.success(
        `Журам амжилттай ${initialData ? "засварлагдлаа" : "хадгалагдлаа"}`
      );
      console.log("Form submission successful");
      onSuccess();
    } catch (error) {
      console.error("Submission error:", error);
      throw error;
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
          <div>
            {initialData && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isProcessing}
                className={`px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 mr-2 ${
                  isProcessing ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Цуцлах
              </button>
            )}
            <button
              type="submit"
              disabled={isProcessing}
              className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 ${
                isProcessing ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Хадгалах
            </button>
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
            <button
              type="button"
              onClick={addSection}
              disabled={isProcessing}
              className={`px-3 py-1 bg-green-600 text-white rounded hover:bg-green-500 ${
                isProcessing ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              + Бүлэг нэмэх
            </button>
          </div>

          {sections.map((section, sectionIndex) => (
            <div key={section.id} className="mt-4 p-4 border rounded">
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
                <button
                  type="button"
                  onClick={() => deleteSection(sectionIndex)}
                  disabled={isProcessing}
                  className={`px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500 ${
                    isProcessing ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  - Устгах
                </button>
              </div>

              <div className="ml-6 mt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Заалтууд</h3>
                  <button
                    type="button"
                    onClick={() => addClause(sectionIndex)}
                    disabled={isProcessing}
                    className={`px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 ${
                      isProcessing ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    + Заалт нэмэх
                  </button>
                </div>

                {section.clauses.map((clause, clauseIndex) => (
                  <ClauseItem
                    key={clause.id}
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
