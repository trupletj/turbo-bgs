"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { type_clause_job_position } from "@repo/database/generated/prisma/client/client";

interface ClausePosition {
  id: string;
  clauseId: string;
  positionId: string;
  type: type_clause_job_position | null;
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
  positions?: { positionId: string; type: type_clause_job_position }[];
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
    positions: { positionId: string; type: type_clause_job_position }[]
  ) => void;
  addSubClause: (sectionIndex: number, path: number[]) => void;
  deleteClause: (sectionIndex: number, path: number[]) => void;
  parentRefNumber: string;
  level: number;
  isProcessing: boolean;
}

export default function ClauseItem({
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
    { positionId: string; type: type_clause_job_position | null }[]
  >(clause.positions || []);
  const [filteredPositions, setFilteredPositions] = useState<
    { id: string; name: string | null }[]
  >([]);
  const [isSaving, setIsSaving] = useState(false);

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
        {selectedDivision && filteredPositions.length > 0 && (
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700">
              Ажлын байр сонгох
            </label>
            {filteredPositions.map((position) => (
              <div key={position.id} className="flex items-center gap-2">
                <span>{position.name}</span>
                {selectedPositions.some((p) => p.positionId === position.id)}
              </div>
            ))}
          </div>
        )}
      </div>

      {clause.children &&
        clause.children.length > 0 &&
        clause.children.map((child, index) => (
          <ClauseItem
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
