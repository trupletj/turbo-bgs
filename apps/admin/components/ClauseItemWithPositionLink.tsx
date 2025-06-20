"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-toastify";
import { type_clause_position } from "@repo/database/generated/prisma/client/client";
import {
  createClausePositionExtended,
  getClausePositionsByClauseId,
} from "@/action/ClausePositionSevice";
import DivisionFilter from "./DivisionFilter";

interface ClausePosition {
  id: string;
  clauseId: string;
  positionId: string;
  type: type_clause_position | null;
  position: {
    id: string;
    name: string | null;
    divisionId: string;
  };
}

interface Clause {
  id: string;
  referenceNumber: string;
  text: string;
  parentId?: string | null;
  children?: Clause[];
  positions?: { positionId: string; type: type_clause_position }[];
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
  updateClausePositions: (
    sectionIndex: number,
    path: number[],
    positions: { positionId: string; type: type_clause_position }[]
  ) => void;
  addSubClause: (sectionIndex: number, path: number[]) => void;
  deleteClause: (sectionIndex: number, path: number[]) => void;
  parentRefNumber: string;
  level: number;
  isProcessing: boolean;
}

export default function ClauseItemWithPositionLink({
  sectionIndex,
  clause,
  clauseIndex,
  path,
  updateClauseText,
  updateClausePositions,
  addSubClause,
  deleteClause,
  parentRefNumber,
  level,
  isProcessing,
}: ClauseItemProps) {
  const [selectedDivision, setSelectedDivision] = useState<string | null>(null);
  const [selectedPositions, setSelectedPositions] = useState<
    { positionId: string; type: type_clause_position | null }[]
  >(clause.positions || []);
  const [filteredPositions, setFilteredPositions] = useState<
    { id: string; name: string | null }[]
  >([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadExistingClausePositions();
  }, [clause.id]);

  const loadExistingClausePositions = async () => {
    try {
      const clausePositions: ClausePosition[] =
        await getClausePositionsByClauseId(clause.id);
      const positions = clausePositions.map((cp) => ({
        positionId: cp.positionId,
        type: cp.type,
      }));
      setSelectedPositions(positions);
      if (clausePositions.length > 0) {
        setSelectedDivision(clausePositions[0].position.divisionId);
        setFilteredPositions(
          clausePositions.map((cp) => ({
            id: cp.positionId,
            name: cp.position.name,
          }))
        );
      }
    } catch (error) {
      console.error("Failed to load clause positions:", error);
      toast.error("Ажлын байрны мэдээлэл ачаалахад алдаа гарлаа");
    }
  };

  const handleDivisionChange = (divisionId: string) => {
    setSelectedDivision(divisionId);
    setSelectedPositions([]);
    updateClausePositions(sectionIndex, path, []);
  };

  const handlePositionChange = async (positionId: string, checked: boolean) => {
    setIsSaving(true);
    const toastId = toast.loading("Хадгалж байна...");
    try {
      let newPositions;
      if (checked) {
        newPositions = [
          ...selectedPositions,
          { positionId, type: type_clause_position.IMPLEMENTATION },
        ];
        await createClausePositionExtended(
          clause.id,
          positionId,
          type_clause_position.IMPLEMENTATION
        );
      } else {
        newPositions = selectedPositions.filter(
          (p) => p.positionId !== positionId
        );
        // Устгах логик нэмж болно
      }
      setSelectedPositions(newPositions);
      updateClausePositions(
        sectionIndex,
        path,
        newPositions.filter((p) => p.type !== null) as {
          positionId: string;
          type: type_clause_position;
        }[]
      );
      toast.update(toastId, {
        render: "Амжилттай хадгалагдлаа",
        type: "success",
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to save position:", error);
      toast.update(toastId, {
        render: "Хадгалахад алдаа гарлаа",
        type: "error",
        isLoading: false,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTypeChange = async (
    positionId: string,
    type: type_clause_position
  ) => {
    setIsSaving(true);
    const toastId = toast.loading("Хадгалж байна...");
    try {
      const newPositions = selectedPositions.map((p) =>
        p.positionId === positionId ? { ...p, type } : p
      );
      setSelectedPositions(newPositions);
      await createClausePositionExtended(clause.id, positionId, type);
      updateClausePositions(
        sectionIndex,
        path,
        newPositions.filter((p) => p.type !== null) as {
          positionId: string;
          type: type_clause_position;
        }[]
      );
      toast.update(toastId, {
        render: "Амжилттай хадгалагдлаа",
        type: "success",
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to update position type:", error);
      toast.update(toastId, {
        render: "Хадгалахад алдаа гарлаа",
        type: "error",
        isLoading: false,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`ml-${level * 4} mt-2`}>
      <div className="flex items-center gap-4">
        <span className="font-bold">{clause.referenceNumber}.</span>
        <Textarea
          value={clause.text}
          onChange={(e) => updateClauseText(sectionIndex, path, e.target.value)}
          placeholder="Заалтын текст оруулна уу"
          className="flex-1 p-2 border rounded"
          disabled={isProcessing || isSaving}
        />
        <button
          type="button"
          onClick={() => addSubClause(sectionIndex, path)}
          disabled={isProcessing || isSaving}
          className={`px-3 py-1 bg-green-600 text-white rounded hover:bg-green-500 ${
            isProcessing || isSaving ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          + Дэд заалт
        </button>
        <button
          type="button"
          onClick={() => deleteClause(sectionIndex, path)}
          disabled={isProcessing || isSaving}
          className={`px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500 ${
            isProcessing || isSaving ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          - Устгах
        </button>
      </div>

      <div className="ml-6 mt-2">
        <DivisionFilter
          selectedDivision={selectedDivision}
          onDivisionChange={handleDivisionChange}
          onPositionFilter={setFilteredPositions}
        />

        {selectedDivision && filteredPositions.length > 0 && (
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700">
              Ажлын байр сонгох
            </label>
            {filteredPositions.map((position) => (
              <div key={position.id} className="flex items-center gap-2">
                <Checkbox
                  checked={selectedPositions.some(
                    (p) => p.positionId === position.id
                  )}
                  onCheckedChange={(checked) =>
                    handlePositionChange(position.id, checked as boolean)
                  }
                  disabled={isSaving}
                />
                <span>{position.name}</span>
                {selectedPositions.some(
                  (p) => p.positionId === position.id
                ) && (
                  <Select
                    onValueChange={(value) =>
                      handleTypeChange(
                        position.id,
                        value as type_clause_position
                      )
                    }
                    value={
                      selectedPositions.find(
                        (p) => p.positionId === position.id
                      )?.type || type_clause_position.IMPLEMENTATION
                    }
                    disabled={isSaving}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(type_clause_position).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {clause.children &&
        clause.children.length > 0 &&
        clause.children.map((child, index) => (
          <ClauseItemWithPositionLink
            key={child.id}
            sectionIndex={sectionIndex}
            clause={child}
            clauseIndex={index}
            path={[...path, index]}
            updateClauseText={updateClauseText}
            updateClausePositions={updateClausePositions}
            addSubClause={addSubClause}
            deleteClause={deleteClause}
            parentRefNumber={clause.referenceNumber}
            level={level + 1}
            isProcessing={isProcessing}
          />
        ))}
    </div>
  );
}
