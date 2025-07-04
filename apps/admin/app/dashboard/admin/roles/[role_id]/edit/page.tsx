import {
  profile_role,
  permission,
} from "@repo/database/generated/prisma/client";
import { getProfileRole } from "@/action/ProfileRoleService";
import EditRoleForm from "@/components/edit-role-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ProfileRoleEditPage = async ({
  params,
}: {
  params: { role_id: string };
}) => {
  const role = await getProfileRole({
    where: { id: params.role_id },
    include: { permissions: true },
  });

  if (!role) {
    return (
      <div className="flex justify-between w-full my-3">
        <h1 className="font-bold text-2xl">Засварлах</h1>
        <p>Үүрэг олдсонгүй</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-bold text-2xl m-3">Засварлах</h1>
      <EditRoleForm profile_role={role} />
    </div>
  );
};

export default ProfileRoleEditPage;
