"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createRatingSession } from "@/action/RatingSessionService";
import { toast } from "react-toastify";

export default function RatingSessionModal() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !name) {
      toast.error("Бүх талбаруудыг бөглөнө үү");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Үнэлгээний улирал үүсгэж байна...");
    try {
      await createRatingSession({ startDate, endDate, name });
      toast.update(toastId, {
        render: "Үнэлгээний улирал амжилттай үүсгэгдлээ",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Create rating session error:", error);
      toast.update(toastId, {
        render: "Үнэлгээний улирал үүсгэхэд алдаа гарлаа",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button className="mt-4 bg-blue-600 hover:bg-blue-500">
          Үнэлгээний улирал эхлүүлэх
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-[1000] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow-lg w-96 max-w-[90vw] z-[1001] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <Dialog.Title className="text-xl font-bold mb-4">
            Үнэлгээний улирал үүсгэх
          </Dialog.Title>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Улирлын нэр
              </label>
              <input
                type="text"
                id="name"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Улирлын нэрийг оруулна уу"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700"
              >
                Эхлэх огноо
              </label>
              <DatePicker
                id="startDate"
                selected={startDate}
                onChange={(date: Date | null) => setStartDate(date)}
                dateFormat="yyyy/MM/dd"
                placeholderText="Эхлэх огноо сонгоно уу"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700"
              >
                Дуусах огноо
              </label>
              <DatePicker
                id="endDate"
                selected={endDate}
                onChange={(date: Date | null) => setEndDate(date)}
                dateFormat="yyyy/MM/dd"
                placeholderText="Дуусах огноо сонгоно уу"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Dialog.Close asChild>
                <Button variant="outline" disabled={isSubmitting}>
                  Цуцлах
                </Button>
              </Dialog.Close>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500"
                disabled={isSubmitting}
              >
                Үүсгэх
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
