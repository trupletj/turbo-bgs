"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "react-toastify";
import Link from "next/link";

interface Policy {
  id: string;
  name: string | null;
  approvedDate: string | null;
  referenceCode: string | null;
}

export default function PolicyList() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/policy`);
      if (!response.ok) throw new Error("Журмуудыг авахад алдаа гарлаа");
      const data = await response.json();
      setPolicies(data);
    } catch (error) {
      console.error("Fetch policies error:", error);
      toast.error(`Алдаа: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Журмыг устгахдаа итгэлтэй байна уу?")) return;
    try {
      const response = await fetch(`/api/policy?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Устгахад алдаа гарлаа");
      toast.success("Журам амжилттай устгагдлаа");
      fetchPolicies();
    } catch (error) {
      console.error("Delete policy error:", error);
      toast.error(`Алдаа: ${(error as Error).message}`);
    }
  };

  // Урт текстийг товчлох функц
  const truncateText = (text: string | null, maxLength: number = 50) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Журмууд</h2>
      </div>
      {isLoading ? (
        <div className="text-center py-8">Ачаалж байна...</div>
      ) : policies.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Журам олдсонгүй</div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center font-bold bg-gray-100 dark:bg-gray-700 px-4 py-3 min-w-[100px]">
                  Код
                </TableHead>
                <TableHead className="text-center font-bold bg-gray-100 dark:bg-gray-700 px-4 py-3 min-w-[200px]">
                  Нэр
                </TableHead>
                <TableHead className="text-center font-bold bg-gray-100 dark:bg-gray-700 px-4 py-3 min-w-[120px]">
                  Баталсан огноо
                </TableHead>
                <TableHead className="text-center font-bold bg-gray-100 dark:bg-gray-700 px-4 py-3 min-w-[150px]">
                  Үйлдэл
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {policies.map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell className="px-4 py-2">
                    {policy.referenceCode}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <div
                      className=" break-words whitespace-normal"
                      title={policy.name || ""}
                    >
                      {policy.name}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-2 text-center">
                    {policy.approvedDate
                      ? new Date(policy.approvedDate).toLocaleDateString(
                          "mn-MN"
                        )
                      : "Огноогүй"}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <div className="flex gap-2 justify-center">
                      <Link href={`/dashboard/policy/${policy.id}`}>
                        <Button variant="outline" size="sm" className="h-8">
                          Харах
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-8"
                        onClick={() => handleDelete(policy.id)}
                      >
                        Устгах
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
