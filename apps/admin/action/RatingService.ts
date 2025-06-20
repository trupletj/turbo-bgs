"use server";

import { prisma } from "@repo/database";

export async function createRating({
  clause_position_id,
  score,
  description,
  ratingSessionId,
}: {
  clause_position_id: string;
  score: number;
  description: string;
  ratingSessionId: string;
}) {
  try {
    const clausePosition = await prisma.clause_position.findUnique({
      where: { id: clause_position_id },
    });
    if (!clausePosition) throw new Error("Clause position not found");

    const ratingSession = await prisma.rating_session.findFirst({
      where: { id: ratingSessionId, rating_process: "ACTIVE" },
    });
    if (!ratingSession) throw new Error("Active rating session not found");

    const rating = await prisma.rating.create({
      data: {
        clause_position_id,
        score,
        description,
        rating_session_id: ratingSessionId,
        scored_date: new Date(),
      },
    });

    console.log("Rating created:", { clause_position_id, score });
    return rating;
  } catch (error) {
    console.error("createRating error:", error);
    throw error;
  }
}

import { ratingSessions } from "@/lib/data";

export async function createRatingFromDb({
  clausePositionId,
  score,
  description,
  ratingSessionId,
}: {
  clausePositionId: string;
  score: number;
  description: string;
  ratingSessionId: string;
}) {
  try {
    const clausePosition = await prisma.clause_position.findUnique({
      where: { id: clausePositionId },
    });
    if (!clausePosition) throw new Error("Clause position not found");

    // Тогтмол өгөгдлөөс rating_session шалгах
    const ratingSession = ratingSessions.find(
      (session) =>
        session.id === ratingSessionId && session.rating_process === "ACTIVE"
    );
    if (!ratingSession) throw new Error("Active rating session not found");

    const rating = await prisma.rating.create({
      data: {
        clause_position_id: clausePositionId,
        score,
        description,
        rating_session_id: ratingSessionId,
        scored_date: new Date(),
      },
    });

    console.log("Rating created:", { clausePositionId, score });
    return rating;
  } catch (error) {
    console.error("createRating error:", error);
    throw error;
  }
}
