"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@/components/ui/button";
import { Clause, Section } from "@/types/clause";

interface Policy {
  name: string;
  referenceCode: string;
  approvedDate: Date | null;
  sections: Section[];
}

interface ClauseItemProps {
  sectionIndex: number;
  clause: Clause;
  clauseIndex: number;
  path: number[];
  updateClauseText: (
    sectionIndex: number,
    path: number[],
    text: string
  ) => void;
  addSubClause: (sectionIndex: number, path: number[]) => void;
  insertClauseBefore: (sectionIndex: number, path: number[]) => void;
  deleteClause: (sectionIndex: number, path: number[]) => void;
  parentRefNumber: string;
  level?: number;
  isProcessing: boolean;
}

const ClauseItem = ({
  sectionIndex,
  clause,
  path,
  updateClauseText,
  addSubClause,
  insertClauseBefore,
  deleteClause,
  level = 1,
  isProcessing,
}: ClauseItemProps) => {
  return (
    <div className={`mt-2 p-2 border rounded ml-${level * 4}`}>
      <div className="flex items-center gap-4">
        <span className="font-bold">{clause.referenceNumber}.</span>
        <Textarea
          value={clause.text}
          onChange={(e) => updateClauseText(sectionIndex, path, e.target.value)}
          placeholder="Заалтын текст оруулна уу"
          className="flex-1 p-2 border rounded"
          disabled={isProcessing}
        />
        <Button
          type="button"
          variant="link"
          onClick={() => insertClauseBefore(sectionIndex, path)}
          disabled={isProcessing}
          aria-label="Заалт нэмэх (өмнө)"
        >
          + Заалт (өмнө)
        </Button>
        {level < 4 && (
          <Button
            type="button"
            variant="link"
            onClick={() => addSubClause(sectionIndex, path)}
            disabled={isProcessing}
            aria-label="Дэд заалт нэмэх"
          >
            + Дэд заалт
          </Button>
        )}
        <Button
          type="button"
          variant="destructive"
          onClick={() => deleteClause(sectionIndex, path)}
          disabled={isProcessing}
          aria-label="Заалт устгах"
        >
          - Устгах
        </Button>
      </div>
      {clause.children && clause.children.length > 0 && (
        <div className="ml-6 mt-2">
          {clause.children.map((subClause, subClauseIndex) => (
            <ClauseItem
              key={
                subClause.id ||
                `${sectionIndex}-${path.join("-")}-${subClauseIndex}`
              }
              sectionIndex={sectionIndex}
              clause={subClause}
              clauseIndex={subClauseIndex}
              path={[...path, subClauseIndex]}
              updateClauseText={updateClauseText}
              addSubClause={addSubClause}
              insertClauseBefore={insertClauseBefore}
              deleteClause={deleteClause}
              parentRefNumber={subClause.referenceNumber}
              level={level + 1}
              isProcessing={isProcessing}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const NewPolicy = () => {
  const router = useRouter();
  const [policyData, setPolicyData] = useState<Policy>({
    name: "",
    referenceCode: "",
    approvedDate: null,
    sections: [],
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Helper to update clause reference numbers
  const updateClauseNumbers = useCallback(
    (clauses: Clause[], parentRef: string): Clause[] =>
      clauses.map((clause, idx) => ({
        ...clause,
        referenceNumber: `${parentRef}.${idx + 1}`,
        children: updateClauseNumbers(
          clause.children ?? [],
          `${parentRef}.${idx + 1}`
        ),
      })),
    []
  );

  // Add Section
  const addSection = useCallback(() => {
    if (isProcessing) return;
    setIsProcessing(true);
    setPolicyData((prev) => {
      const newSections = [
        ...prev.sections,
        {
          referenceNumber: `${prev.sections.length + 1}`,
          text: "",
          clauses: [],
        },
      ];
      return { ...prev, sections: newSections };
    });
    setIsProcessing(false);
  }, [isProcessing]);

  // Insert Section Before
  const insertSectionBefore = useCallback(
    (sectionIndex: number) => {
      if (isProcessing) return;
      setIsProcessing(true);
      setPolicyData((prev) => {
        const newSections = JSON.parse(JSON.stringify(prev.sections));
        newSections.splice(sectionIndex, 0, {
          referenceNumber: `${sectionIndex + 1}`,
          text: "",
          clauses: [],
        });
        return {
          ...prev,
          sections: newSections.map(
            (section: { clauses: Clause[] }, idx: number) => ({
              ...section,
              referenceNumber: `${idx + 1}`,
              clauses: updateClauseNumbers(section.clauses, `${idx + 1}`),
            })
          ),
        };
      });
      setIsProcessing(false);
    },
    [isProcessing, updateClauseNumbers]
  );

  // Delete Section
  const deleteSection = useCallback(
    (sectionIndex: number) => {
      if (isProcessing) return;
      setIsProcessing(true);
      setPolicyData((prev) => {
        const newSections = JSON.parse(JSON.stringify(prev.sections))
          .filter((_: Section, idx: number) => idx !== sectionIndex)
          .map((section: { clauses: Clause[] }, idx: number) => ({
            ...section,
            referenceNumber: `${idx + 1}`,
            clauses: updateClauseNumbers(section.clauses, `${idx + 1}`),
          }));
        return { ...prev, sections: newSections };
      });
      setIsProcessing(false);
    },
    [isProcessing, updateClauseNumbers]
  );

  // Add Clause
  const addClause = useCallback(
    (sectionIndex: number) => {
      if (isProcessing) return;
      setIsProcessing(true);
      setPolicyData((prev) => {
        const newSections = JSON.parse(JSON.stringify(prev.sections));
        const section = newSections[sectionIndex];
        const newClause: Clause = {
          text: "",
          referenceNumber: `${section.referenceNumber}.${section.clauses.length + 1}`,
          children: [],
        };
        section.clauses = [...section.clauses, newClause];
        return { ...prev, sections: newSections };
      });
      setIsProcessing(false);
    },
    [isProcessing]
  );

  // Insert Clause Before
  const insertClauseBefore = useCallback(
    (sectionIndex: number, path: number[]) => {
      if (isProcessing) return;
      setIsProcessing(true);
      setPolicyData((prev) => {
        const newSections = JSON.parse(JSON.stringify(prev.sections));
        const section = newSections[sectionIndex];
        let current = section.clauses;
        for (let i = 0; i < path.length - 1; i++) {
          current = current[path[i]].children!;
        }
        const insertIndex = path[path.length - 1];
        const parentRef =
          path.length === 1
            ? section.referenceNumber
            : (current[0]?.referenceNumber.split(".").slice(0, -1).join(".") ??
              section.referenceNumber);
        const newClause: Clause = {
          text: "",
          referenceNumber: `${parentRef}.${insertIndex + 1}`,
          children: [],
        };
        current.splice(insertIndex, 0, newClause);
        if (path.length === 1) {
          section.clauses = updateClauseNumbers(current, parentRef);
        } else {
          let parent = section.clauses;
          for (let i = 0; i < path.length - 2; i++) {
            parent = parent[path[i]].children!;
          }
          parent[path[path.length - 2]] = {
            ...parent[path[path.length - 2]],
            children: updateClauseNumbers(current, parentRef),
          };
        }
        newSections[sectionIndex] = section;
        return { ...prev, sections: newSections };
      });
      setIsProcessing(false);
    },
    [isProcessing, updateClauseNumbers]
  );

  // Add Sub-Clause
  const addSubClause = useCallback(
    (sectionIndex: number, path: number[]) => {
      if (isProcessing) return;
      setIsProcessing(true);
      setPolicyData((prev) => {
        const newSections = JSON.parse(JSON.stringify(prev.sections));
        const section = newSections[sectionIndex];
        let current = section.clauses;
        for (let i = 0; i < path.length - 1; i++) {
          current = current[path[i]].children!;
        }
        const parentClause = current[path[path.length - 1]];
        const newSubClause: Clause = {
          text: "",
          referenceNumber: `${parentClause.referenceNumber}.${(parentClause.children?.length ?? 0) + 1}`,
          children: [],
        };
        parentClause.children = [
          ...(parentClause.children ?? []),
          newSubClause,
        ];
        newSections[sectionIndex] = section;
        return { ...prev, sections: newSections };
      });
      setIsProcessing(false);
    },
    [isProcessing]
  );

  // Update Section Text
  const updateSectionText = useCallback(
    (sectionIndex: number, text: string) => {
      if (isProcessing) return;
      setPolicyData((prev) => {
        const newSections = JSON.parse(JSON.stringify(prev.sections));
        newSections[sectionIndex] = { ...newSections[sectionIndex], text };
        return { ...prev, sections: newSections };
      });
    },
    [isProcessing]
  );

  // Update Clause Text
  const updateClauseText = useCallback(
    (sectionIndex: number, path: number[], text: string) => {
      if (isProcessing) return;
      setPolicyData((prev) => {
        const newSections = JSON.parse(JSON.stringify(prev.sections));
        const section = newSections[sectionIndex];
        let current = section.clauses;
        for (let i = 0; i < path.length - 1; i++) {
          current = current[path[i]].children!;
        }
        current[path[path.length - 1]] = {
          ...current[path[path.length - 1]],
          text,
        };
        newSections[sectionIndex] = section;
        return { ...prev, sections: newSections };
      });
    },
    [isProcessing]
  );

  // Delete Clause
  const deleteClause = useCallback(
    (sectionIndex: number, path: number[]) => {
      if (isProcessing) return;
      setIsProcessing(true);
      setPolicyData((prev) => {
        const newSections = JSON.parse(JSON.stringify(prev.sections));
        const section = newSections[sectionIndex];
        let current = section.clauses;
        for (let i = 0; i < path.length - 1; i++) {
          current = current[path[i]].children!;
        }
        current.splice(path[path.length - 1], 1);
        const parentRef =
          path.length === 1
            ? section.referenceNumber
            : current.length > 0
              ? current[0].referenceNumber.split(".").slice(0, -1).join(".")
              : section.referenceNumber;
        if (path.length === 1) {
          section.clauses = updateClauseNumbers(current, parentRef);
        } else {
          let parent = section.clauses;
          for (let i = 0; i < path.length - 2; i++) {
            parent = parent[path[i]].children!;
          }
          parent[path[path.length - 2]] = {
            ...parent[path[path.length - 2]],
            children: updateClauseNumbers(current, parentRef),
          };
        }
        newSections[sectionIndex] = section;
        return { ...prev, sections: newSections };
      });
      setIsProcessing(false);
    },
    [isProcessing, updateClauseNumbers]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    setIsProcessing(true);
    const toastId = toast.loading("Журам хадгалж байна...");

    try {
      if (!policyData.name || !policyData.referenceCode) {
        throw new Error("Журмын нэр болон дугаар заавал оруулна уу");
      }
      if (
        policyData.sections.some(
          (section) =>
            !section.text || section.clauses.some((clause) => !clause.text)
        )
      ) {
        throw new Error("Бүх бүлэг болон заалтууд тексттэй байх ёстой");
      }

      // 1. Журам хадгалах
      const policyResponse = await fetch("/api/policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: policyData.name,
          referenceCode: policyData.referenceCode,
          approvedDate: policyData.approvedDate,
        }),
      });

      if (!policyResponse.ok) {
        const error = await policyResponse.json();
        throw new Error(error.error || "Журам хадгалахад алдаа гарлаа");
      }

      const policy = await policyResponse.json();
      const policyId = policy.id;

      // 2. Бүлэг хадгалах
      for (const section of policyData.sections) {
        const sectionResponse = await fetch("/api/section", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            policyId,
            text: section.text,
            referenceNumber: section.referenceNumber,
          }),
        });

        if (!sectionResponse.ok) {
          const error = await sectionResponse.json();
          throw new Error(error.error || "Бүлэг хадгалахад алдаа гарлаа");
        }

        const createdSection = await sectionResponse.json();
        const sectionId = createdSection.id;

        // 3. Заалтуудыг рекурсив байдлаар хадгалах
        const createClauses = async (clauses: Clause[], parentId?: string) => {
          for (const clause of clauses) {
            const clauseResponse = await fetch("/api/clause", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                text: clause.text,
                referenceNumber: clause.referenceNumber,
                sectionId,
                parentId,
                policyId,
              }),
            });

            if (!clauseResponse.ok) {
              const error = await clauseResponse.json();
              throw new Error(error.error || "Заалт хадгалахад алдаа гарлаа");
            }

            const createdClause = await clauseResponse.json();
            if (clause.children && clause.children.length > 0) {
              await createClauses(clause.children, createdClause.id);
            }
          }
        };

        await createClauses(section.clauses);
      }

      toast.update(toastId, {
        render: "Журмыг амжилттай бүртгэлээ",
        type: "success",
        isLoading: false,
        autoClose: 1000,
      });

      setTimeout(() => {
        router.push("/dashboard/policy");
      }, 1000);
    } catch (error) {
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
          <h1 className="text-2xl font-bold">Шинэ Журам Үүсгэх</h1>
          <Button
            type="submit"
            disabled={isProcessing}
            aria-label="Журам хадгалах"
          >
            Хадгалах
          </Button>
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
              disabled={isProcessing}
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
              maxLength={250}
              disabled={isProcessing}
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
              disabled={isProcessing}
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
              aria-label="Бүлэг нэмэх"
            >
              + Бүлэг нэмэх
            </Button>
          </div>

          {policyData.sections.map((section, sectionIndex) => (
            <div key={section.id || sectionIndex}>
              {sectionIndex > 0 && (
                <Button
                  type="button"
                  variant="link"
                  onClick={() => insertSectionBefore(sectionIndex)}
                  disabled={isProcessing}
                  className="mb-2"
                  aria-label="Бүлэг нэмэх (өмнө)"
                >
                  + Бүлэг нэмэх (өмнө)
                </Button>
              )}
              <div className="mt-4 p-4 border rounded">
                <div className="flex items-center gap-4">
                  <span className="font-bold">{section.referenceNumber}.</span>
                  <Textarea
                    value={section.text}
                    onChange={(e) =>
                      updateSectionText(sectionIndex, e.target.value)
                    }
                    placeholder="Бүлгийн текст оруулна уу"
                    className="flex-1 p-2 border rounded"
                    disabled={isProcessing}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => deleteSection(sectionIndex)}
                    disabled={isProcessing}
                    aria-label="Бүлэг устгах"
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
                      aria-label="Заалт нэмэх"
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
                      addSubClause={addSubClause}
                      insertClauseBefore={insertClauseBefore}
                      deleteClause={deleteClause}
                      parentRefNumber={section.referenceNumber}
                      level={1}
                      isProcessing={isProcessing}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};

export default NewPolicy;
