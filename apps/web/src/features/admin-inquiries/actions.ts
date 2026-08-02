"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

interface InquiryUpdateData {
  status: string;
  appointment_date?: string;
  notification: string;
}

export async function updateInquiryStatus(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  const date = String(formData.get("appointment_date") || "");

  const updateData: InquiryUpdateData = {
    status,
    notification: `Status updated to ${status}`
  };

  if (status === "Contacted" && date) {
    updateData.appointment_date = date;
    updateData.notification = `Meeting scheduled for ${date}`;
  } else if (status === "Closed") {
    updateData.notification = "Inquiry declined and closed";
  } else if (status === "Reviewed") {
    updateData.notification = "Inquiry reviewed";
  }

  const { error } = await supabase
    .from("quote_requests")
    .update(updateData)
    .eq("id", id);

  if (error) {
    console.error("Error updating inquiry:", error);
  }

  revalidatePath("/admin/inquiries");
}
