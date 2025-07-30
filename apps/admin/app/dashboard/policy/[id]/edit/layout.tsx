import { hasAccess } from "@/action/PermissionService";
import { redirect } from "next/navigation";
export default async function AuditLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAccess = await hasAccess("/dashboard/policy/edit", "UPDATE");
  if (!isAccess) {
    redirect("/dashboard/?error=no-access");
  }
  return <div className="m-5">{isAccess && children}</div>;
}
