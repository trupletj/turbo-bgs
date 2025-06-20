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
import { type_clause_position } from "@repo/database/generated/prisma/client/client";
import { getClausePositionsByClauseId } from "@/action/ClausePositionSevice";
import DivisionFilter from "./DivisionFilter";

interface ClausePosition {
  id: string;
  clauseId: string;
  positionId: string;
  type: type_clause_position | null;
  position: {
    id: string;
    name: string | null;
    divisionId: string | null;
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

export default function ClauseItemWithFilterFixed({
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

  useEffect(() => {
    loadExistingClausePositions();
  }, []);

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
    }
  };

  const handleDivisionChange = (divisionId: string) => {
    setSelectedDivision(divisionId);
    setSelectedPositions([]);
    updateClausePositions(sectionIndex, path, []);
  };

  const handlePositionChange = (positionId: string, checked: boolean) => {
    let newPositions;
    if (checked) {
      newPositions = [
        ...selectedPositions,
        { positionId, type: type_clause_position.IMPLEMENTATION },
      ];
    } else {
      newPositions = selectedPositions.filter(
        (p) => p.positionId !== positionId
      );
    }
    setSelectedPositions(newPositions);
    // updateClausePositions-д null-гүй өгөгдөл дамжуулах
    updateClausePositions(
      sectionIndex,
      path,
      newPositions.filter((p) => p.type !== null) as {
        positionId: string;
        type: type_clause_position;
      }[]
    );
  };

  const handleTypeChange = (positionId: string, type: type_clause_position) => {
    const newPositions = selectedPositions.map((p) =>
      p.positionId === positionId ? { ...p, type } : p
    );
    setSelectedPositions(newPositions);
    updateClausePositions(
      sectionIndex,
      path,
      newPositions.filter((p) => p.type !== null) as {
        positionId: string;
        type: type_clause_position;
      }[]
    );
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
          disabled={isProcessing}
        />
        <button
          type="button"
          onClick={() => addSubClause(sectionIndex, path)}
          disabled={isProcessing}
          className={`px-3 py-1 bg-green-600 text-white rounded hover:bg-green-500 ${
            isProcessing ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          + Дэд заалт
        </button>
        <button
          type="button"
          onClick={() => deleteClause(sectionIndex, path)}
          disabled={isProcessing}
          className={`px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500 ${
            isProcessing ? "opacity-50 cursor-not-allowed" : ""
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
          <ClauseItemWithFilterFixed
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
