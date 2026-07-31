import { AdminShell } from "@/components/layout/admin-shell";
import { requireAdmin } from "@/lib/supabase/auth-guard";

export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return <AdminShell>{children}</AdminShell>;
}
