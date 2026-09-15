import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!(await isAdmin())) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col lg:h-dvh lg:flex-row lg:overflow-hidden">
      <AdminNav />
      <div className="min-w-0 flex-1 px-5 py-8 lg:overflow-y-auto lg:px-10">{children}</div>
    </div>
  );
}
