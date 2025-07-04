import PermissionList from "@/components/permission-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { getPermissions } from "@/action/PermissionService";

const PermissionListPage = async () => {
  const permissions_list = await getPermissions({});
  return (
    <>
      <div className="flex justify-between w-full  my-3">
        <h1 className="font-bold text-2xl">Permissions List</h1>
        <Button asChild>
          <Link href={"/dashboard/admin/permissions/new"}> Шинэ</Link>
        </Button>
      </div>
      <PermissionList permissions_list={permissions_list} />
    </>
  );
};

export default PermissionListPage;
