"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RecoveryPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    // Check if we have a recovery token in the URL hash
    const hash = window.location.hash;
    if (hash && hash.includes("type=recovery")) {
      setIsUpdateMode(true);
    }
    // Also check URL params
    const params = new URLSearchParams(window.location.search);
    if (params.get("update") === "true") {
      setIsUpdateMode(true);
    }
  }, []);

  async function handlePasswordUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      setSuccess("Password updated! Redirecting to login...");
      setTimeout(() => {
        window.location.href = "/admin/login";
      }, 2000);
    }
  }

  async function handleRecover(formData: FormData) {
    setError(null);
    setSuccess(null);
    setLoading(true);
    const email = formData.get("email") as string;

    if (!email) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/auth/callback",
    });

    if (resetError) {
      setError(resetError.message);
    } else {
      setSuccess("Check your email for a reset link");
    }
    setLoading(false);
  }

  // Password update mode (after clicking reset link)
  if (isUpdateMode) {
    return (
      <div className="w-full max-w-sm rounded-2xl border border-rosa-border bg-rosa-card p-8 shadow-sm">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold text-rosa-dark">Set New Password</h1>
          <p className="mt-2 text-sm text-rosa-muted">Enter your new password below</p>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-rosa-error/10 border border-rosa-error/20 px-4 py-3 text-sm text-rosa-error">{error}</div>
        )}

        {success && (
          <div className="mt-4 rounded-lg bg-rosa-success/10 border border-rosa-success/20 px-4 py-3 text-sm text-rosa-success">{success}</div>
        )}

        <form onSubmit={handlePasswordUpdate} className="mt-8 space-y-4">
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-rosa-dark">New Password</label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1 block w-full rounded-lg border border-rosa-border bg-rosa-bg px-3 py-2 text-sm text-rosa-dark placeholder:text-rosa-muted/50 focus:border-rosa-accent focus:outline-none focus:ring-1 focus:ring-rosa-accent"
              placeholder="Min 6 characters"
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-rosa-dark">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1 block w-full rounded-lg border border-rosa-border bg-rosa-bg px-3 py-2 text-sm text-rosa-dark placeholder:text-rosa-muted/50 focus:border-rosa-accent focus:outline-none focus:ring-1 focus:ring-rosa-accent"
              placeholder="Repeat your password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-rosa-accent px-4 py-2.5 text-sm font-semibold text-rosa-dark transition-colors hover:bg-rosa-accent-dark disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    );
  }

  // Default recovery mode (enter email to get reset link)
  return (
    <div className="w-full max-w-sm rounded-2xl border border-rosa-border bg-rosa-card p-8 shadow-sm">
      <div className="text-center">
        <h1 className="font-heading text-2xl font-bold text-rosa-dark">Reset Password</h1>
        <p className="mt-2 text-sm text-rosa-muted">Enter your email to receive a reset link</p>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-rosa-error/10 border border-rosa-error/20 px-4 py-3 text-sm text-rosa-error">{error}</div>
      )}

      {success && (
        <div className="mt-4 rounded-lg bg-rosa-success/10 border border-rosa-success/20 px-4 py-3 text-sm text-rosa-success">{success}</div>
      )}

      <form action={handleRecover} className="mt-8 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-rosa-dark">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 block w-full rounded-lg border border-rosa-border bg-rosa-bg px-3 py-2 text-sm text-rosa-dark placeholder:text-rosa-muted/50 focus:border-rosa-accent focus:outline-none focus:ring-1 focus:ring-rosa-accent"
            placeholder="ahmadaliofficial1155@gmail.com"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-rosa-accent px-4 py-2.5 text-sm font-semibold text-rosa-dark transition-colors hover:bg-rosa-accent-dark disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-rosa-muted">
        <a href="/admin/login" className="hover:text-rosa-accent transition-colors">Back to sign in</a>
      </p>
    </div>
  );
}
