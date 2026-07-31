import { getSiteSettings } from "@/lib/supabase/queries";
import { ContactPage } from "@/components/sections/contact";

export const metadata = {
  title: "Contact \u2014 Rosa Medical",
  description: "Get in touch with Rosa Medical for inquiries and quotes.",
};

export default async function ContactRoute({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product } = await searchParams;
  const settings = await getSiteSettings();
  return <ContactPage settings={settings} initialProduct={product || ""} />;
}
