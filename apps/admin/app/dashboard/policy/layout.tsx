import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AuditLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const profile = await getProfile(session.user.id)
  //const path = await useRouth
  // const permission = checkPerm(path, )
  // session.user -r profile. If !profile &
  //return <div>Handah erh hureltehgui baina. Terentei holno <button >Garah </button> </div>
  return <>{children}</>;
}
