import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = {
  title: "Admin sign in",
};

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <div className="relative isolate min-h-[calc(100vh-8rem)] overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/login-bg.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl items-center px-5 py-16">
        <div className="w-full max-w-md rounded-3xl border border-line bg-card/80 p-8 text-left shadow-2xl backdrop-blur-md">
          <p className="text-left text-[11px] uppercase tracking-[0.24em] text-crimson">Restricted</p>
          <h1 className="mt-2 text-left font-serif text-5xl">Admin access</h1>
          <p className="mt-3 text-left text-muted">Sign in to add and edit case files.</p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
