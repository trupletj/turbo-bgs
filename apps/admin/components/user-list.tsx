"use client";

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
import { deleteProfile } from "@/action/ProfileService";
import { UserWithJobAndOrg } from "@/types/index";

const UserList = ({ user_list }: { user_list: UserWithJobAndOrg[] }) => {
  const handleDelete = async (id: string) => {
    try {
      await deleteProfile(id);
      toast.success("Амжилттай устгалаа", {
        autoClose: 1500,
      });
    } catch (error) {
      toast.error("Error deleting user!");
      console.error(error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center font-bold bg-gray-100 dark:bg-gray-700 px-4 py-3">
              Нэр
            </TableHead>
            <TableHead className="text-center font-bold bg-gray-100 dark:bg-gray-700 px-4 py-3">
              Овог
            </TableHead>
            <TableHead className="text-center font-bold bg-gray-100 dark:bg-gray-700 px-4 py-3">
              Ажлын байр
            </TableHead>
            <TableHead className="text-center font-bold bg-gray-100 dark:bg-gray-700 px-4 py-3">
              Байгууллага
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {user_list.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="w-24 px-2 py-1 truncate">
                {user.first_name}
              </TableCell>
              <TableCell className="px-2 py-1 min-w-[120px]">
                {user.last_name}
              </TableCell>
              <TableCell className="px-2 py-1 min-w-[120px]">
                {user.job_position?.name}
              </TableCell>
              <TableCell className="px-2 py-1 min-w-[120px]">
                {user.job_position?.organization?.name}
              </TableCell>
              <TableCell className="px-2 py-1 w-40">
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/admin/users/${user.id}/edit`}>
                      Эрх засварлах
                    </Link>
                  </Button>

                  <Button
                    onClick={() => {
                      if (
                        confirm("Та энэ эрхийг устгахдаа итгэлтэй байна уу?")
                      ) {
                        handleDelete(user.id);
                      }
                    }}
                    variant="destructive"
                    size="sm"
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
  );
};

export default UserList;
