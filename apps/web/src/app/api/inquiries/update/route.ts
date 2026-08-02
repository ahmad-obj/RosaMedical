import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface InquiryUpdateRequest {
  id: string;
  status: string;
  date?: string;
}

interface InquiryUpdateData {
  status: string;
  appointment_date?: string;
  notification: string;
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { id, status, date } = await req.json() as InquiryUpdateRequest;

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

    const { data, error } = await supabase
      .from("quote_requests")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
