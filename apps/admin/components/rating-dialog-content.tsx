"use client";

import { useEffect, useState, useRef } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { getPositions } from "@/action/ClausePositionService";
import { JobPositionWithOrganization } from "@/types/organization";
import { createRating, getRatings } from "@/action/RatingService";
import {
  rating as Rating,
  type_clause_job_position,
} from "@repo/database/generated/prisma/client/client";
import { Star } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "react-toastify";

const RatingDialogContent = ({
  id,
  clause_reference_code,
  clause_text,
}: {
  id: string;
  clause_reference_code: string;
  clause_text: string;
}) => {
  const [clauseJobs, setClauseJobs] = useState<JobPositionWithOrganization[]>(
    []
  );
  const [selectedClauseJobPosition, setSelectedClauseJobPosition] =
    useState<JobPositionWithOrganization | null>(null);

  const prevId = useRef<string | null>(null);
  const actionTypes: { value: type_clause_job_position; label: string }[] = [
    { value: "IMPLEMENTATION", label: "Хэрэгжүүлэлт" },
    { value: "MONITORING", label: "Хяналт" },
    { value: "VERIFICATION", label: "Баталгаажуулалт" },
    { value: "DEPLOYMENT", label: "Нэвтрүүлэлт" },
  ];

  useEffect(() => {
    const fetchPositions = async () => {
      const jobs = (await getPositions({
        where: { clauseId: id, is_checked: true },
        include: {
          job_position: {
            include: {
              organization: true,
            },
          },
        },
      })) as JobPositionWithOrganization[];

      setClauseJobs(jobs ?? []);
    };

    if (id && id !== prevId.current) {
      fetchPositions();
      prevId.current = id;
    }
  }, [id]);

  const handleSelectPosition = async (
    clauseJob: JobPositionWithOrganization
  ) => {
    setSelectedClauseJobPosition(clauseJob);
  };

  return (
    <DialogContent className="sm:max-w-[600px] lg:max-w-[1000px] w-full h-[80vh]">
      <DialogHeader>
        <DialogTitle className="font-bold text-2xl">Үнэлгээ хийх</DialogTitle>
        <DialogDescription className="font-medium">
          {clause_reference_code} {clause_text}
        </DialogDescription>
      </DialogHeader>

      <ResizablePanelGroup
        direction="horizontal"
        className="w-full border-t h-full min-h-[600px] "
      >
        <ResizablePanel defaultSize={35} minSize={25}>
          <ScrollArea className="h-full p-3">
            <h3 className="font-medium mb-4">Ажлын байрны жагсаалт</h3>
            <div className="space-y-2">
              {clauseJobs.map((clauseJob, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectPosition(clauseJob)}
                  className="border p-2 rounded-md cursor-pointer hover:bg-accent transition"
                >
                  <div className="font-medium">
                    {clauseJob.job_position?.name || "Нэр олдсонгүй"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {clauseJob.job_position?.organization?.name ||
                      "Байгууллага олдсонгүй"}
                    ---{" "}
                    {actionTypes.find((type) => type.value === clauseJob.type)
                      ?.label || "Төрөл олдсонгүй"}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </ResizablePanel>

        <ResizableHandle />

        {selectedClauseJobPosition ? (
          <RatingForm
            selectedClauseJobPositionId={selectedClauseJobPosition?.id}
            position_name={selectedClauseJobPosition?.job_position.name}
          />
        ) : (
          <ResizablePanel defaultSize={40} minSize={35}>
            <div className="flex flex-col gap-4 h-full p-6 overflow-auto min-h-[600px]">
              {" "}
              Ажлын байр сонгоно уу{" "}
            </div>
          </ResizablePanel>
        )}
      </ResizablePanelGroup>
    </DialogContent>
  );
};

export default RatingDialogContent;

function RatingForm({
  selectedClauseJobPositionId,
  position_name,
}: {
  selectedClauseJobPositionId: string;
  position_name: string | null;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [rating, setRating] = useState<Partial<Rating>>({
    score: 1,
    description: null,
  });

  const fetchRatings = async () => {
    setIsLoading(true);
    const ratings = (await getRatings({
      orderBy: { scored_date: "desc" },
      where: { clause_job_position_id: selectedClauseJobPositionId },
    })) as Rating[];
    setRatings(ratings);
    setIsLoading(false);
  };

  useEffect(() => {
    if (selectedClauseJobPositionId) fetchRatings();
  }, [selectedClauseJobPositionId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedClauseJobPositionId) return;

    if (rating?.score === 6 && !rating?.description) {
      toast.warning("Тайлбар оруулна уу.", { autoClose: 1500 });
      return;
    }

    try {
      if (rating?.score) {
        const result = await createRating({
          score: rating.score,
          description: rating.description,
          clause_job_position: {
            connect: {
              id: selectedClauseJobPositionId,
            },
          },
        });
        if (result) {
          toast.success("Үнэлгээ амжилттай хадгалагдлаа!", { autoClose: 1500 });
          await fetchRatings();
        } else {
          setIsLoading(false);
        }
      } else {
        toast.warning("Үнэлгээ заавал өгнө үү!", { autoClose: 1500 });
      }
    } catch (err) {
      alert("Үнэлгээ хийхэд алдаа гарлаа.");
      console.error(err);
    }
  };

  return (
    <ResizablePanel defaultSize={40} minSize={35}>
      <div className="flex flex-col gap-4 h-full p-6 overflow-auto">
        <div className="text-center">
          <h2 className="text-xl font-semibold">
            {position_name && position_name}
          </h2>
          <div className="text-muted-foreground text-sm mt-2">
            {/* {selectedClausePosition.job_position?.organization?.name} ---{" "}
                  {
                    actionTypes.find(
                      (type) => type.value === selectedClausePosition.type
                    )?.label
                  } */}
          </div>
        </div>

        <form className="space-y-4" onSubmit={(e) => handleSubmit(e)}>
          <div className="flex items-center space-x-3 justify-between">
            <div className="flex items-center space-x-3 my-2">
              <label className="block font-medium">Оноо (1-6):</label>
              <select
                name="score"
                className="border px-3 rounded-md w-max-[120px]"
                onChange={(e) =>
                  setRating((prev) => ({
                    ...prev,
                    score: Number(e.target.value),
                    description: null,
                  }))
                }
              >
                <option value={rating?.score}>-- Оноо сонгоно уу --</option>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="submit" className="w-max-[40px]">
                  <Star />
                </Button>
              </TooltipTrigger>

              <TooltipContent className="h-max-[20px]">
                Үнэлгээ өгөх
              </TooltipContent>
            </Tooltip>
          </div>

          <div>
            <label className="block mb-1 font-medium">Тайлбар:</label>
            <textarea
              name="description"
              className="w-full border px-3 py-2 rounded-md"
              rows={3}
              value={rating?.description ? rating?.description : ""}
              placeholder="Тайлбараа бичнэ үү..."
              disabled={rating.score !== 6 || isLoading}
              onChange={(e) =>
                setRating((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>

          {isLoading ? (
            <div> Ачааллаж байна</div>
          ) : (
            <div>
              <h4 className="font-semibold mb-2">Үнэлгээний жагсаалт:</h4>
              {ratings.length === 0 ? (
                <p className="text-muted-foreground">Үнэлгээ олдсонгүй.</p>
              ) : (
                <ul className="space-y-2">
                  {ratings.map((rating: Rating) => (
                    <li
                      key={rating.id}
                      className="border p-3 rounded-md bg-muted/30"
                    >
                      <div>
                        Огноо:{" "}
                        {new Date(rating.scored_date).toLocaleDateString()}
                      </div>
                      <div>Оноо: {rating.score}</div>

                      {rating.description && (
                        <div>Тайлбар: {rating.description}</div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </form>
      </div>
    </ResizablePanel>
  );
}
