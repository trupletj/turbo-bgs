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
import { permission as Permission } from "@repo/database/generated/prisma/client/client";
import { toast } from "react-toastify";
import Link from "next/link";
import { deletePermission } from "@/action/PermissionService";

const PermissionList = ({
  permissions_list,
}: {
  permissions_list: Permission[];
}) => {
  const handleDelete = async (id: string) => {
    try {
      await deletePermission(id);
      toast.success("Permission deleted successfully", {
        autoClose: 1000,
      });
    } catch (error) {
      toast.error("Error deleting permission!");
      console.error(error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center font-bold bg-gray-100 dark:bg-gray-700 px-4 py-3">
              Permission name
            </TableHead>
            <TableHead className="text-center font-bold bg-gray-100 dark:bg-gray-700 px-4 py-3">
              Action
            </TableHead>
            <TableHead className="text-center font-bold bg-gray-100 dark:bg-gray-700 px-4 py-3">
              Resource
            </TableHead>
            <TableHead className="text-center font-bold bg-gray-100 dark:bg-gray-700 px-4 py-3">
              Path
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissions_list.map((permission) => (
            <TableRow key={permission.id}>
              <TableCell className="px-2 py-1 min-w-[120px]">
                {permission.name}
              </TableCell>
              <TableCell className="px-2 py-1 min-w-[120px]">
                {permission.action}
              </TableCell>
              <TableCell className="px-2 py-1 min-w-[120px]">
                {permission.resource}
              </TableCell>
              <TableCell className="px-2 py-1 min-w-[120px]">
                <div className="space-y-1">
                  {permission.path.map((path, index) => (
                    <div
                      key={index}
                      className="text-sm text-gray-600 dark:text-gray-300"
                    >
                      <span>•{path}</span>
                    </div>
                  ))}
                </div>
              </TableCell>

              <TableCell className="px-2 py-1 w-40">
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`/dashboard/admin/permissions/${permission.id}/edit`}
                    >
                      Засварлах
                    </Link>
                  </Button>

                  <Button
                    onClick={() => {
                      if (
                        confirm("Та энэ эрхийг устгахдаа итгэлтэй байна уу?")
                      ) {
                        handleDelete(permission.id);
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

export default PermissionList;
