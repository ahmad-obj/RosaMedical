import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CheckoutClient } from "./checkout-client";

export default async function CheckoutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // THE AUTH WALL: If no user, redirect to login
  if (!user) {
    redirect("/login?redirect=/checkout");
  }

  // If logged in, pass the user_id to the client component
  return <CheckoutClient userId={user.id} />;
}
