import { ButtonLink } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import {
  AdminPageHeader,
  AdminSection
} from "@/features/admin-primitives";
import { AdminCatalogueOverview } from "./admin-catalogue-overview";
import { getAdminDashboardModel, type AdminOperationalMetric } from "./admin-dashboard-model";
import { AdminLaunchReadiness } from "./admin-launch-readiness";
import { AdminOperationalData } from "./admin-operational-data";
import { AdminWorkspaceStatus } from "./admin-workspace-status";

export async function AdminDashboardPage() {
  const model = getAdminDashboardModel();
  const supabase = await createClient();

  const { count: messageCount } = await supabase
    .from("contact_messages")
    .select("*", { count: "exact", head: true })
    .eq("is_spam", false);

  const { count: inquiryCount } = await supabase
    .from("quote_requests")
    .select("*", { count: "exact", head: true });

  const operationalMetrics: readonly AdminOperationalMetric[] = [
    { key: "inquiries", label: "Quotation inquiries", value: inquiryCount || 0 },
    { key: "messages", label: "General messages", value: messageCount || 0 }
  ];

  return (
    <div className="admin-dashboard" data-admin-dashboard>
      <AdminPageHeader
        eyebrow="Admin overview"
        title="Rosa workspace overview."
        description="This static workspace previews the future single-owner content management system."
      />

      <AdminWorkspaceStatus />
      <AdminCatalogueOverview metrics={model.catalogueMetrics} />
      <AdminOperationalData metrics={operationalMetrics} />
      <AdminLaunchReadiness items={model.readinessItems} />

      <AdminSection
        title="Quick routes"
        description="Navigation only. Management actions are not active."
        className="admin-dashboard__quick"
      >
        <div className="admin-dashboard__quick-routes">
          {model.quickRoutes.map((route) => (
            <ButtonLink key={route.href} href={route.href} variant="secondary">
              {route.label}
            </ButtonLink>
          ))}
        </div>
      </AdminSection>
    </div>
  );
}
