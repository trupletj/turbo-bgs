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
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching policies...");
      const response = await fetch(`/api/policy`);
      if (!response.ok) throw new Error("Журмуудыг авахад алдаа гарлаа");
      const data = await response.json();
      console.log("Татаж авсан журмууд:", {
        count: data.length,
        policies: data.map((p: Policy) => ({
          id: p.id,
          referenceCode: p.referenceCode,
        })),
      });
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
      console.log("Deleting policy:", { id });
      const response = await fetch(`${API_URL}/api/policy?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Устгахад алдаа гарлаа");
      console.log("Policy deleted:", { id });
      toast.success("Журам амжилттай устгагдлаа");
      fetchPolicies();
    } catch (error) {
      console.error("Delete policy error:", error);
      toast.error(`Алдаа: ${(error as Error).message}`);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Журмууд</h2>
      </div>
      {isLoading ? (
        <div className="text-center py-8">Ачааллаж байна...</div>
      ) : policies.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Журам олдсонгүй</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center font-bold bg-gray-100 dark:bg-gray-700 px-4 py-3">
                Код
              </TableHead>
              <TableHead className="text-center font-bold bg-gray-100 dark:bg-gray-700 px-4 py-3">
                Нэр
              </TableHead>
              <TableHead className="text-center font-bold bg-gray-100 dark:bg-gray-700 px-4 py-3">
                Баталсан огноо
              </TableHead>
              <TableHead className="text-center font-bold bg-gray-100 dark:bg-gray-700 px-4 py-3">
                Үйлдэл
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {policies.map((policy) => (
              <TableRow key={policy.id}>
                <TableCell className="w-24 px-2 py-1 truncate">
                  {" "}
                  {policy.referenceCode}
                </TableCell>
                <TableCell className="px-2 py-1 min-w-[120px]">
                  {" "}
                  {policy.name}
                </TableCell>
                <TableCell className="px-2 py-1 w-32">
                  {" "}
                  {policy.approvedDate
                    ? new Date(policy.approvedDate).toLocaleDateString("mn-MN")
                    : "Огноогүй"}
                </TableCell>
                <TableCell className="px-2 py-1 w-40">
                  {" "}
                  {/* Үйлдлийн товчнууд */}
                  <div className="flex gap-1">
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
      )}
    </div>
  );
}
