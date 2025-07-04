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
import {
  profile_role,
  permission,
} from "@repo/database/generated/prisma/client/client";
import { toast } from "react-toastify";
import Link from "next/link";
import { deleteProfileRole } from "@/action/ProfileRoleService";

const RoleList = ({
  profile_role_list,
}: {
  profile_role_list: (profile_role & { permissions: permission[] })[];
}) => {
  const handleDelete = async (id: string) => {
    try {
      await deleteProfileRole(id);
      toast.success("Ролыг амжилттай устгалаа");
    } catch (error) {
      toast.error("Рол устгахад алдаа гарлаа!");
      console.error(error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      {profile_role_list.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Рол олдсонгүй</div>
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
                Зөвшөөрлүүд
              </TableHead>
              <TableHead className="text-center font-bold bg-gray-100 dark:bg-gray-700 px-4 py-3">
                Үйлдэл
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profile_role_list.map((profile_role) => (
              <TableRow key={profile_role.id}>
                <TableCell className="w-24 px-2 py-1 truncate">
                  {profile_role.id}
                </TableCell>
                <TableCell className="px-2 py-1 min-w-[120px]">
                  {profile_role.name}
                </TableCell>
                <TableCell className="px-2 py-1 min-w-[120px]">
                  {profile_role.permissions
                    ?.map((perm) => perm.name || perm.id)
                    .join(", ") || "Зөвшөөрөл байхгүй"}
                </TableCell>
                <TableCell className="px-2 py-1 w-40">
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        href={`/dashboard/admin/roles/${profile_role.id}/edit`}
                      >
                        Засварлах
                      </Link>
                    </Button>
                    <Button
                      onClick={() => {
                        if (
                          confirm("Та энэ эрхийг устгахдаа итгэлтэй байна уу?")
                        ) {
                          handleDelete(profile_role.id);
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
      )}
    </div>
  );
};

export default RoleList;
