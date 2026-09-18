"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: form.get("username"),
        password: form.get("password"),
      }),
    });
    setPending(false);
    if (!res.ok) {
      setError("Wrong username or password.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 w-full space-y-4 text-left">
      <label className="block text-left text-sm text-muted">
        Username
        <input
          name="username"
          required
          autoComplete="username"
          className="mt-1 h-11 w-full rounded-xl border border-line bg-background/80 px-3 text-left text-foreground"
        />
      </label>
      <label className="block text-left text-sm text-muted">
        Password
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1 h-11 w-full rounded-xl border border-line bg-background/80 px-3 text-left text-foreground"
        />
      </label>
      {error ? <p className="text-left text-sm text-crimson-text">{error}</p> : null}
      <button
        disabled={pending}
        className="h-11 w-full rounded-full bg-crimson text-sm font-medium text-white disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Enter the archive"}
      </button>
    </form>
  );
}
