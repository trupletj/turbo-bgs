import React from "react";
import { getAllSections } from "@/action/SectionService";
import { section } from "@repo/database/generated/prisma/client";
import ClauseList from "./clause-list";

const SectionList = async ({ id }: { id: string }) => {
  const sections: section[] = await getAllSections(id);

  return (
    <div>
      {sections?.map((section) => (
        <div key={section.id + "section-list"}>
          <div className="font-semibold flex flex-row gap-5 mb-1">
            <div>{section.referenceNumber + "."}</div>
            <div>{section.text}</div>
          </div>
          <ClauseList id={section.id} />
        </div>
      ))}
    </div>
  );
};

export default SectionList;
