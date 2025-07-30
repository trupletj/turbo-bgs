import { getPermission } from "@/action/PermissionService";
import EditPermissionForm from "@/components/edit-permission-form";

export default async function Page(props: {
  params: Promise<{ permission_id: string }>;
}) {
  const params = await props.params;
  const permission = await getPermission({
    where: { id: params.permission_id },
  });

  return (
    <div>
      <EditPermissionForm permission={permission} />
    </div>
  );
}
