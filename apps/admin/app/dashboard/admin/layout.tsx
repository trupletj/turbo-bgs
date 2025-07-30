export default async function AuditLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const isAccess = await hasAccess("/dashboard/admin", "READ");
  // if (!isAccess) {
  //   redirect("/dashboard/?error=no-access");
  // }
  return <div className="m-5">{children}</div>;
}
