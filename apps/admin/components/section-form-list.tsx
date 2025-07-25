// components/section-form-list.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clause, Section } from "@/types/policy";

interface ClauseItemProps {
  sectionIndex: number;
  clause: Clause;
  path: number[];
  updateClauseText: (
    sectionIndex: number,
    path: number[],
    text: string
  ) => void;
  addSubClause: (
    sectionIndex: number,
    path: number[],
    event: React.MouseEvent
  ) => void;
  insertClauseBefore: (sectionIndex: number, path: number[]) => void;
  deleteClause: (sectionIndex: number, path: number[]) => void;
  level?: number;
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
}: ClauseItemProps) => {
  return (
    <div className={`mt-2 p-2 border rounded ml-${level * 4}`}>
      <div className="flex items-center gap-4">
        <span className="font-bold">{clause.referenceNumber}.</span>
        <Input
          value={clause.text}
          onChange={(e) => updateClauseText(sectionIndex, path, e.target.value)}
          placeholder="Заалтын текст оруулна уу"
          className="flex-1"
        />
        <Button
          type="button"
          variant="link"
          onClick={() => insertClauseBefore(sectionIndex, path)}
        >
          + Заалт (өмнө)
        </Button>
        {level < 4 && (
          <Button
            type="button"
            variant="link"
            onClick={(e) => addSubClause(sectionIndex, path, e)}
          >
            + Дэд заалт
          </Button>
        )}
        <Button
          type="button"
          variant="destructive"
          onClick={() => deleteClause(sectionIndex, path)}
        >
          - Устгах
        </Button>
      </div>
      {(clause.children?.length ?? 0) > 0 && (
        <div className="ml-6 mt-2">
          {clause.children?.map((subClause, index) => (
            <ClauseItem
              key={`${sectionIndex}-${path.join("-")}-${index}`}
              sectionIndex={sectionIndex}
              clause={subClause}
              path={[...path, index]}
              updateClauseText={updateClauseText}
              addSubClause={addSubClause}
              insertClauseBefore={insertClauseBefore}
              deleteClause={deleteClause}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface SectionItemProps {
  section: Section;
  sectionIndex: number;
  updateSectionText: (sectionIndex: number, text: string) => void;
  addClause: (sectionIndex: number) => void;
  deleteSection: (sectionIndex: number) => void;
  updateClauseText: (
    sectionIndex: number,
    path: number[],
    text: string
  ) => void;
  addSubClause: (
    sectionIndex: number,
    path: number[],
    event: React.MouseEvent
  ) => void;
  insertClauseBefore: (sectionIndex: number, path: number[]) => void;
  deleteClause: (sectionIndex: number, path: number[]) => void;
}

const SectionItem = ({
  section,
  sectionIndex,
  updateSectionText,
  addClause,
  deleteSection,
  updateClauseText,
  addSubClause,
  insertClauseBefore,
  deleteClause,
}: SectionItemProps) => {
  return (
    <div className="mt-4 p-4 border rounded">
      <div className="flex items-center gap-4">
        <span className="font-bold">{section.referenceNumber}.</span>
        <Input
          value={section.text}
          onChange={(e) => updateSectionText(sectionIndex, e.target.value)}
          placeholder="Бүлгийн текст оруулна уу"
          className="flex-1"
        />
        <Button
          type="button"
          variant="destructive"
          onClick={() => deleteSection(sectionIndex)}
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
          >
            + Заалт нэмэх
          </Button>
        </div>
        {section.clauses.map((clause, clauseIndex) => (
          <ClauseItem
            key={`${sectionIndex}-${clauseIndex}`}
            sectionIndex={sectionIndex}
            clause={clause}
            path={[clauseIndex]}
            updateClauseText={updateClauseText}
            addSubClause={addSubClause}
            insertClauseBefore={insertClauseBefore}
            deleteClause={deleteClause}
          />
        ))}
      </div>
    </div>
  );
};

interface SectionFormListProps {
  sections: Section[];
  addSection: () => void;
  updateSectionText: (sectionIndex: number, text: string) => void;
  deleteSection: (sectionIndex: number) => void;
  addClause: (sectionIndex: number) => void;
  updateClauseText: (
    sectionIndex: number,
    path: number[],
    text: string
  ) => void;
  addSubClause: (
    sectionIndex: number,
    path: number[],
    event: React.MouseEvent
  ) => void;
  insertClauseBefore: (sectionIndex: number, path: number[]) => void;
  deleteClause: (sectionIndex: number, path: number[]) => void;
}

const SectionFormList = ({
  sections,
  addSection,
  updateSectionText,
  deleteSection,
  addClause,
  updateClauseText,
  addSubClause,
  insertClauseBefore,
  deleteClause,
}: SectionFormListProps) => {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Бүлгүүд</h2>
        <Button type="button" variant="outline" onClick={addSection}>
          + Бүлэг нэмэх
        </Button>
      </div>
      {sections.map((section, sectionIndex) => (
        <SectionItem
          key={section.referenceNumber}
          section={section}
          sectionIndex={sectionIndex}
          updateSectionText={updateSectionText}
          addClause={addClause}
          deleteSection={deleteSection}
          updateClauseText={updateClauseText}
          addSubClause={addSubClause}
          insertClauseBefore={insertClauseBefore}
          deleteClause={deleteClause}
        />
      ))}
    </div>
  );
};

export default SectionFormList;
