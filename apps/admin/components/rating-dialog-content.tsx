"use client";

import { useEffect, useState, useRef } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@radix-ui/react-scroll-area";
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
  const [selectedClausePosition, setSelectedPosition] =
    useState<JobPositionWithOrganization | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [showDescription, setShowDescription] = useState(false);
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
    setSelectedPosition(clauseJob);
    const result = (await getRatings({
      orderBy: { scored_date: "asc" },
      where: { clause_job_position_id: clauseJob.id },
    })) as Rating[];
    setRatings(result ?? []);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    selectedClausePosition: JobPositionWithOrganization | null,
    setRatings: React.Dispatch<React.SetStateAction<Rating[]>>
  ) => {
    e.preventDefault();

    if (!selectedClausePosition) return;

    const formData = new FormData(e.currentTarget);
    const score = Number(formData.get("score"));
    const description = formData.get("description")?.toString() || undefined;

    if (!score || score < 1 || score > 6) {
      toast.warning("Оноо 1-6 хооронд байх ёстой!", { autoClose: 1500 });
      return;
    }

    if (score === 6 && !description) {
      toast.warning("Тайлбар оруулна уу.", { autoClose: 1500 });
      return;
    }

    try {
      await createRating({
        score: score,
        description: description,
        clause_job_position: {
          connect: {
            id: selectedClausePosition.id,
          },
        },
      });
      toast.success("Үнэлгээ амжилттай хадгалагдлаа!", { autoClose: 1500 });

      const updated = await getRatings({
        where: { clause_job_position_id: selectedClausePosition.id },
        orderBy: { scored_date: "asc" },
      });

      setRatings(updated ?? []);
    } catch (err) {
      alert("Үнэлгээ хийхэд алдаа гарлаа.");
      console.error(err);
    }
  };

  return (
    <DialogContent className="sm:max-w-[600px] lg:max-w-[1000px] w-full overflow-y-auto max-h-[80vh]">
      <DialogHeader>
        <DialogTitle className="font-bold text-2xl">Үнэлгээ хийх</DialogTitle>
        <DialogDescription className="font-medium">
          {clause_reference_code} {clause_text}
        </DialogDescription>
      </DialogHeader>

      <ResizablePanelGroup
        direction="horizontal"
        className="max-w-full border-t"
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

        {selectedClausePosition && (
          <ResizablePanel defaultSize={40} minSize={35}>
            <div className="flex flex-col gap-4 h-full p-6 overflow-auto">
              <div className="text-center">
                <h2 className="text-xl font-semibold">
                  {selectedClausePosition.job_position?.name}
                </h2>
                <div className="text-muted-foreground text-sm mt-2">
                  {selectedClausePosition.job_position?.organization?.name} ---{" "}
                  {
                    actionTypes.find(
                      (type) => type.value === selectedClausePosition.type
                    )?.label
                  }
                </div>
              </div>

              <form
                className="space-y-4"
                onSubmit={(e) =>
                  handleSubmit(e, selectedClausePosition, setRatings)
                }
              >
                <div className="flex items-center space-x-3 justify-between">
                  <div className="flex items-center space-x-3 my-2">
                    <label className="block font-medium">Оноо (1-6):</label>
                    <select
                      name="score"
                      className="border px-3 rounded-md w-max-[120px]"
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setShowDescription(val === 6);
                      }}
                    >
                      <option value="">-- Оноо сонгоно уу --</option>
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

                {showDescription && (
                  <div>
                    <label className="block mb-1 font-medium">Тайлбар:</label>
                    <textarea
                      name="description"
                      className="w-full border px-3 py-2 rounded-md"
                      rows={3}
                      placeholder="Тайлбараа бичнэ үү..."
                    />
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-2">Үнэлгээний жагсаалт:</h4>
                  {ratings.length === 0 ? (
                    <p className="text-muted-foreground">Үнэлгээ олдсонгүй.</p>
                  ) : (
                    <ul className="space-y-2">
                      {ratings.map((rating) => (
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
              </form>
            </div>
          </ResizablePanel>
        )}
      </ResizablePanelGroup>

      <DialogFooter></DialogFooter>
    </DialogContent>
  );
};

export default RatingDialogContent;
