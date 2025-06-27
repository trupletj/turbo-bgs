"use client";

import { useEffect, useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
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
import { rating as Rating } from "@repo/database/generated/prisma/client/client";

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

  useEffect(() => {
    const fetchPositions = async () => {
      const jobs = (await getPositions({
        where: { clauseId: id },
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

    fetchPositions();
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
      alert("Оноо 1-6 хооронд байх ёстой!");
      return;
    }

    if (score === 6 && !description) {
      alert("Тайлбар оруулна уу.");
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

      alert("Үнэлгээ амжилттай хадгалагдлаа!");

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
                <p className="text-muted-foreground text-sm mt-2">
                  {selectedClausePosition.job_position?.organization?.name}
                </p>
              </div>

              <form
                className="space-y-4"
                onSubmit={(e) =>
                  handleSubmit(e, selectedClausePosition, setRatings)
                }
              >
                <div>
                  <label className="block mb-1 font-medium">Оноо (1-6):</label>
                  <select
                    name="score"
                    className="w-full border px-3 py-2 rounded-md"
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
                <Button type="submit" className="w-full">
                  Үнэлгээ хадгалах
                </Button>
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
