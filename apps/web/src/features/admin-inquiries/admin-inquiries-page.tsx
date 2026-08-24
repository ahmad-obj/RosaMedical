"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { AdminAlert, AdminPageHeader, AdminStatusBadge, AdminToolbar } from "@/features/admin-primitives";
import type { QuoteRequest } from "@/lib/supabase/types";
import { AdminInquiryPricing } from "./admin-inquiry-pricing";
import { ADMIN_INQUIRY_WORKFLOW, getInquiryStatusTone, normalizeInquiryStatus, type AdminInquiryStatus } from "./admin-inquiry-workflow";

export function AdminInquiriesPage() {
  const [records, setRecords] = useState<QuoteRequest[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (status) params.set("status", status);
    void fetch(`/api/inquiries?${params}`)
      .then(async (response) => ({ response, data: await response.json() as unknown }))
      .then(({ response, data }) => {
        if (!active) return;
        setError(response.ok ? "" : "Inquiries could not be loaded.");
        setRecords(Array.isArray(data) ? data as QuoteRequest[] : []);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setError("Inquiries could not be loaded.");
        setLoading(false);
      });
    return () => { active = false; };
  }, [search, status]);

  async function save(record: QuoteRequest, formData: FormData) {
    const nextStatus = String(formData.get("status") || "New") as AdminInquiryStatus;
    const note = String(formData.get("note") || "");
    const response = await fetch("/api/inquiries/update", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: record.id, status: nextStatus, note }) });
    if (!response.ok) return setError("The inquiry update was not saved.");
    setRecords((current) => current.map((item) => item.id === record.id ? { ...item, status: nextStatus, notification: note.trim() || null } : item));
  }

  async function remove(record: QuoteRequest) {
    if (!window.confirm(`Delete the inquiry from ${record.name}? This cannot be undone.`)) return;
    const response = await fetch(`/api/inquiries/update?id=${encodeURIComponent(record.id)}`, { method: "DELETE" });
    if (!response.ok) return setError("The inquiry could not be deleted.");
    setRecords((current) => current.filter((item) => item.id !== record.id));
  }

  return (
    <div className="admin-operations-page admin-inquiries-page">
      <AdminPageHeader eyebrow="Quotation inquiries" title="Manage quotation inquiries." description="Review customer requirements, submitted product/configuration pricing, update status, and keep private owner notes." />
      <AdminToolbar label="Inquiry filters">
        <div className="admin-control-preview"><label htmlFor="inquiry-search">Search</label><input id="inquiry-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name or email" /></div>
        <div className="admin-control-preview"><label htmlFor="inquiry-status">Status</label><select id="inquiry-status" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All statuses</option>{ADMIN_INQUIRY_WORKFLOW.map((item) => <option key={item}>{item}</option>)}</select></div>
      </AdminToolbar>
      {error ? <AdminAlert tone="danger" title="Action failed">{error}</AdminAlert> : null}
      {loading ? <p className="admin-loading-state">Loading inquiries...</p> : null}
      {!loading && !records.length ? <AdminAlert tone="info" title="No inquiries">No inquiries match the current filters.</AdminAlert> : null}
      <div className="admin-queue-list">
        {records.map((record) => {
          const currentStatus = normalizeInquiryStatus(record.status);
          const hasStructuredLines = Boolean(record.quote_request_items?.length);
          return (
            <article className="admin-queue-record" key={record.id}>
              <header><div><h2>{record.name}</h2><p>{record.email}{record.phone ? ` · ${record.phone}` : ""}</p></div><AdminStatusBadge tone={getInquiryStatusTone(currentStatus)}>{currentStatus}</AdminStatusBadge></header>
              <p className="admin-queue-record__date">Received {new Date(record.created_at).toLocaleString()}</p>
              {record.quote_request_items?.length ? (
                <AdminInquiryPricing lines={record.quote_request_items} />
              ) : (
                <div className="admin-queue-record__message">
                  <p>{record.message || "No structured product snapshot is available for this historical inquiry."}</p>
                </div>
              )}
              {hasStructuredLines && record.message ? (
                <details className="admin-inquiry-legacy-message">
                  <summary>Readable submission snapshot</summary>
                  <div className="admin-queue-record__message">{record.message}</div>
                </details>
              ) : null}
              <form action={(formData) => save(record, formData)} className="admin-queue-editor">
                <div className="admin-field-preview"><label htmlFor={`inquiry-note-${record.id}`}>Private note</label><textarea id={`inquiry-note-${record.id}`} name="note" rows={3} defaultValue={record.notification || ""} /></div>
                <div className="admin-field-preview"><label htmlFor={`inquiry-status-${record.id}`}>Status</label><select id={`inquiry-status-${record.id}`} name="status" defaultValue={currentStatus}>{ADMIN_INQUIRY_WORKFLOW.map((item) => <option key={item}>{item}</option>)}</select></div>
                <div className="admin-queue-actions"><Button type="submit" size="small">Save</Button><Button type="button" size="small" variant="quiet" onClick={() => void remove(record)}>Delete</Button></div>
              </form>
            </article>
          );
        })}
      </div>
    </div>
  );
}
