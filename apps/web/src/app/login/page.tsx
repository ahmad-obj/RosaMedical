"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/checkout';
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push(redirectUrl);
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-rosa-dark px-4">
      <div className="w-full max-w-md rounded-xl border border-rosa-border bg-rosa-card p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-white text-center">Sign In Required</h1>
        <p className="mt-2 text-center text-sm text-rosa-muted">You must be signed in to place an order or track your appointment.</p>
        
        {error && <div className="mt-4 rounded-lg bg-red-500/10 p-3 text-red-400 text-sm text-center">{error}</div>}
        
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm text-rosa-muted">Email</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded-lg border border-rosa-border bg-rosa-dark px-4 py-3 text-white" />
          </div>
          <div>
            <label className="block text-sm text-rosa-muted">Password</label>
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full rounded-lg border border-rosa-border bg-rosa-dark px-4 py-3 text-white" />
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-rosa-accent px-6 py-3.5 font-semibold text-rosa-dark disabled:opacity-50">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
