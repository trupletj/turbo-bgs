"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Clause } from "@/types/clause";
import { type_clause_job_position } from "@repo/database/generated/prisma/client/client";

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
  path,
  updateClauseText,
  updateClausePositions,
  addSubClause,
  deleteClause,
  level,
  isProcessing,
}: ClauseItemProps) {
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
        <Button
          type="button"
          variant="secondary"
          onClick={() => addSubClause(sectionIndex, path)}
          disabled={isProcessing}
        >
          + Дэд заалт
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={() => deleteClause(sectionIndex, path)}
          disabled={isProcessing}
        >
          - Устгах
        </Button>
      </div>

      {clause.children &&
        clause.children.length > 0 &&
        clause.children.map((child, index) => (
          <ClauseItem
            key={child.id || `${sectionIndex}-${path.join("-")}-${index}`}
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
