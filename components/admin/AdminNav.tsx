"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FolderOpen, LayoutDashboard, LogOut, Settings, Tags } from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/cases", label: "Cases", icon: FolderOpen },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="sticky top-0 z-30 flex w-full shrink-0 flex-col border-b border-line bg-card lg:h-full lg:w-60 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between px-5 py-5">
        <Link href="/admin" className="font-serif text-xl">
          Crime Codex
        </Link>
        <Link href="/" className="text-xs uppercase tracking-[0.16em] text-muted hover:text-foreground">
          Site
        </Link>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col">
        {links.map((link) => {
          const active = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${active ? "bg-crimson/15 text-foreground" : "text-muted hover:text-foreground"}`}
            >
              <Icon size={16} />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={logout}
        className="m-3 flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-muted hover:text-crimson-text"
      >
        <LogOut size={16} />
        Sign out
      </button>
    </aside>
  );
}
