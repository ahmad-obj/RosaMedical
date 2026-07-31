"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitContact(formData: FormData) {
  const supabase = await createClient();
  
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const message = formData.get("message") as string;
  const product = formData.get("product") as string;

  // If a product was inquired about, prepend it to the message
  const finalMessage = product 
    ? `Inquiry about product: ${product}\n\n${message}` 
    : message;

  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    phone: phone || null,
    message: finalMessage,
    read: false,
  });

  if (error) {
    console.error("Error saving contact message:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/messages");
  return { success: true };
}
