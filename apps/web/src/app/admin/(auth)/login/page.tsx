"use client";

import { useState } from "react";
import { login } from "./action";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-rosa-border bg-rosa-card p-8 shadow-sm">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="font-heading text-2xl font-bold text-rosa-dark">Rosa</span>
          <span className="font-heading text-2xl font-light text-rosa-accent">Medical</span>
        </div>
        <p className="mt-2 text-sm text-rosa-muted">Admin sign in</p>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-rosa-error/10 border border-rosa-error/20 px-4 py-3 text-sm text-rosa-error">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-rosa-dark">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 block w-full rounded-lg border border-rosa-border bg-rosa-bg px-3 py-2 text-sm text-rosa-dark placeholder:text-rosa-muted/50 focus:border-rosa-accent focus:outline-none focus:ring-1 focus:ring-rosa-accent"
            placeholder="admin@rosamedical.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-rosa-dark">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="mt-1 block w-full rounded-lg border border-rosa-border bg-rosa-bg px-3 py-2 text-sm text-rosa-dark placeholder:text-rosa-muted/50 focus:border-rosa-accent focus:outline-none focus:ring-1 focus:ring-rosa-accent"
            placeholder="Enter your password"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-rosa-accent px-4 py-2.5 text-sm font-semibold text-rosa-dark transition-colors hover:bg-rosa-accent-dark disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-rosa-muted">
        <a href="/admin/recovery" className="hover:text-rosa-accent transition-colors">Forgot your password?</a>
      </p>
    </div>
  );
}
