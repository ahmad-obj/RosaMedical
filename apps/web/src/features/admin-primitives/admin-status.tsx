import type { HTMLAttributes } from "react";

export type AdminStatusTone =
  | "neutral"
  | "info"
  | "warning"
  | "danger"
  | "success"
  | "draft"
  | "review"
  | "ready"
  | "published"
  | "hidden"
  | "archived";

export interface AdminStatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: AdminStatusTone;
}

export function AdminStatusBadge({
  tone = "neutral",
  className = "",
  ...props
}: AdminStatusBadgeProps) {
  return (
    <span
      className={`admin-status admin-status--${tone} ${className}`.trim()}
      data-admin-status={tone}
      {...props}
    />
  );
}
