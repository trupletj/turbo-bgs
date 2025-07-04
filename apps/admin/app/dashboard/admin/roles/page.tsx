import {
  profile_role,
  permission,
} from "@repo/database/generated/prisma/client";
import { getProfileRoles } from "@/action/ProfileRoleService";
import RoleList from "@/components/role-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const RoleListPage = async () => {
  const profile_role_list = await getProfileRoles({
    include: { permissions: true },
  });

  const roles = profile_role_list ?? [];

  return (
    <div>
      <div className="flex justify-between w-full my-3">
        <h1 className="font-bold text-2xl">List of Permission</h1>
        <Button asChild>
          <Link href={"/dashboard/admin/roles/new"}>Шинэ</Link>
        </Button>
      </div>
      <RoleList profile_role_list={roles} />
    </div>
  );
};

export default RoleListPage;
