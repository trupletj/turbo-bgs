"use client";
import { useState, useEffect } from "react";
import { getAllRatingSessions } from "@/action/RatingSessionService";
import RatingSessionModal from "@/components/RatingSessionModal";
import { toast } from "react-toastify";

interface RatingSession {
  id: string;
  name: string | null;
  startDate: Date;
  endDate: Date;
}

export default function RatingPage() {
  const [ratingSessions, setRatingSessions] = useState<RatingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRatingSessions();
  }, []);

  const fetchRatingSessions = async () => {
    setIsLoading(true);
    try {
      const sessions = await getAllRatingSessions();

      if ("message" in sessions) {
        toast.info(sessions.message); // Зөвлөмжийг toast-оор харуулах
      } else {
        setRatingSessions(sessions);
        console.log("Rating sessions fetched:", {
          count: sessions.length,
          sessions,
        });
      }
    } catch (error) {
      console.error("Failed to fetch rating sessions:", error);
      toast.error("Үнэлгээний улирлуудыг ачаалахад алдаа гарлаа");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Ачааллаж байна...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Үнэлгээний улирлууд</h1>
        <RatingSessionModal />
      </div>

      {ratingSessions.length === 0 ? (
        <p className="text-gray-500">
          Одоогоор үнэлгээний улирал байхгүй байна.
        </p>
      ) : (
        <div className="grid gap-4">
          {ratingSessions.map((session) => (
            <div
              key={session.id}
              className="p-4 border rounded-md shadow-sm flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold">{session.name}</h2>
                <p className="text-sm text-gray-600">
                  Эхлэх:{" "}
                  {new Date(session.startDate).toLocaleDateString("mn-MN")}
                </p>
                <p className="text-sm text-gray-600">
                  Дуусах:{" "}
                  {new Date(session.endDate).toLocaleDateString("mn-MN")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
