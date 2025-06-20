"use server";

import { prisma } from "@repo/database";
import { ratingSessions } from "@/lib/data";

export async function createRatingSession(data: {
  startDate: Date;
  endDate: Date;
  name: string;
}) {
  try {
    const { startDate, endDate, name } = data;

    const currentDate = new Date();

    let ratingProcess: "ACTIVE" | "END" = "END"; // Default to "END"
    if (currentDate >= startDate && currentDate <= endDate) {
      ratingProcess = "ACTIVE";
    }

    const newSession = await prisma.rating_session.create({
      data: {
        startDate,
        endDate,
        name,
        rating_process: ratingProcess,
      },
    });

    console.log("New rating session created:", newSession);
    return newSession;
  } catch (error) {
    console.error("Error creating new rating session:", error);
    throw new Error("Failed to create rating session");
  }
}

export async function getAllRatingSessions() {
  try {
    const sessions = await prisma.rating_session.findMany({
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        rating_process: true,
      },
    });

    if (sessions.length === 0) {
      return { message: "Үнэлгээний улирлууд байхгүй байна." };
    }

    console.log("All rating sessions fetched:", { count: sessions.length });
    return sessions;
  } catch (error) {
    console.error("Error fetching rating sessions:", error);
    throw new Error("Failed to fetch rating sessions: " + error);
  }
}

export async function getActiveRatingSessionsFromDb() {
  try {
    const sessions = ratingSessions.filter(
      (session) => session.rating_process === "ACTIVE"
    );
    console.log("Active rating sessions fetched:", { count: sessions.length });
    return sessions;
  } catch (error) {
    console.error("getActiveRatingSessions error:", error);
    throw new Error("Failed to fetch active rating sessions");
  }
}
