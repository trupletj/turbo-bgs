import React from "react";
import { getPermission } from "@/action/PermissionService";
import EditPermissionForm from "@/components/edit-permission-form";
const page = async ({ params }: { params: { permission_id: string } }) => {
  const { permission_id } = await params;
  const permission = await getPermission({
    where: { id: permission_id },
  });
  return (
    <div>
      <h1>Засвэрлах</h1>

      <EditPermissionForm permission={permission} />
    </div>
  );
};

export default page;
