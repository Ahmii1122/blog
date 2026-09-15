import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = {
  title: "Admin sign in",
};

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <div className="mx-auto max-w-xl px-5 py-20 text-center">
      <p className="text-[11px] uppercase tracking-[0.24em] text-crimson">Restricted</p>
      <h1 className="mt-2 font-serif text-5xl">Admin access</h1>
      <p className="mt-3 text-muted">Sign in to add and edit case files.</p>
      <LoginForm />
    </div>
  );
}
