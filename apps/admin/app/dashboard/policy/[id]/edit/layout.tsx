import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getProfile } from "@/action/ProfileService";
export default async function AuditLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const profile = await getProfile({
    where: { user_id: session.user.id },
  });

  console.log(session);
  console.log(session.user);

  if (!profile) {
    return (
      <div>
        <h2>Та бүртгүүлэх шаардлагатай байна.</h2>
      </div>
    );
  }

  const canView = session?.user?.permissions?.some(
    (perm) => perm.resource === "policy" && perm.can_update
  );

  if (!canView) {
    return (
      <>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />
            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                Хандах эрх хүрэлцэхгүй байна
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </>
    );
  }

  return <>{children}</>;
}
