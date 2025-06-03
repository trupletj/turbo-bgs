import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";

interface Clause {
  id: string;
  referenceNumber: string;
  text: string;
  parentId?: string | null;
  children?: Clause[];
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
  deleteClause: (sectionIndex: number, path: number[]) => void;
  parentRefNumber: string;
  level?: number;
  isProcessing: boolean;
}

export default function ClauseItem({
  sectionIndex,
  clause,
  clauseIndex,
  path,
  updateClauseText,
  addSubClause,
  deleteClause,
  parentRefNumber,
  level = 1,
  isProcessing,
}: ClauseItemProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const handleDelete = async () => {
    if (!confirm("Заалтыг устгахдаа итгэлтэй байна уу?")) return;
    try {
      console.log("Deleting clause:", { clauseId: clause.id });
      if (!clause.id.startsWith("temp-")) {
        const response = await fetch(`${API_URL}/api/clause?id=${clause.id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Заалт устгахад алдаа гарлаа");
        }
      }
      deleteClause(sectionIndex, path);
      toast.success("Заалт амжилттай устгагдлаа");
      console.log("Clause deleted:", { clauseId: clause.id });
    } catch (error) {
      console.error("Delete clause error:", error);
      toast.error(`Алдаа: ${(error as Error).message}`);
    }
  };

  return (
    <div className={`mt-2 p-2 border rounded ml-${level * 4}`}>
      <div className="flex items-center gap-4">
        <span className="font-bold">{clause.referenceNumber}.</span>
        <Textarea
          value={clause.text}
          onChange={(e) => updateClauseText(sectionIndex, path, e.target.value)}
          placeholder="Заалтын текст оруулна уу"
          className="flex-1 p-2 border rounded"
        />
        {level < 4 && (
          <button
            type="button"
            onClick={() => addSubClause(sectionIndex, path)}
            disabled={isProcessing}
            className={`px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-500 ${
              isProcessing ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            + Дэд заалт
          </button>
        )}
        <button
          type="button"
          onClick={handleDelete}
          disabled={isProcessing}
          className={`px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500 ${
            isProcessing ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          - Устгах
        </button>
      </div>
      {clause.children && clause.children.length > 0 && (
        <div className="ml-6 mt-2">
          {clause.children.map((subClause, subClauseIndex) => (
            <ClauseItem
              key={subClause.id}
              sectionIndex={sectionIndex}
              clause={subClause}
              clauseIndex={subClauseIndex}
              path={[...path, subClauseIndex]}
              updateClauseText={updateClauseText}
              addSubClause={addSubClause}
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
}
