"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/(workspace)/logout-action";

const navLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/site-content", label: "Site Content" },
];

export function AdminShell({ children, userEmail }: { children: React.ReactNode; userEmail: string | null }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-rosa-dark md:flex">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-rosa-border bg-rosa-card md:flex md:flex-col">
        <div className="flex h-16 items-center border-b border-rosa-border px-6">
          <Link href="/admin" className="font-heading text-lg font-bold text-white">
            Rosa<span className="text-rosa-accent">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-md px-3 py-2 text-sm font-medium ${
                  isActive ? "bg-rosa-accent/10 text-rosa-accent" : "text-rosa-cream/80 hover:bg-rosa-dark hover:text-rosa-accent"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-rosa-border p-4">
          <p className="mb-2 truncate text-xs text-rosa-muted">Signed in as: {userEmail}</p>
          <form action={logout}>
            <button type="submit" className="w-full rounded-md border border-rosa-border px-3 py-2 text-sm text-rosa-cream hover:bg-rosa-dark">
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile Header (since sidebar is hidden on mobile) */}
        <header className="flex h-16 items-center justify-between border-b border-rosa-border bg-rosa-card px-4 md:hidden">
          <Link href="/admin" className="font-heading text-lg font-bold text-white">Rosa<span className="text-rosa-accent">Admin</span></Link>
          <form action={logout}>
            <button type="submit" className="rounded-md border border-rosa-border px-3 py-1 text-sm text-rosa-cream">Sign Out</button>
          </form>
        </header>

        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
