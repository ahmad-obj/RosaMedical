import { getSettingValue } from "@/lib/supabase/queries";
import { AboutPage } from "@/components/sections/about";

export const metadata = {
  title: "About \u2014 Rosa Medical",
  description: "Learn about Rosa Medical, your trusted partner in premium medical supplies.",
};

export default async function AboutRoute() {
  const about = await getSettingValue("about_us");
  return <AboutPage about={about || "Rosa Medical is your trusted partner in premium medical supplies. We specialize in providing high-quality products for plastic surgery and orthodontics, ensuring that healthcare professionals have the tools they need to deliver exceptional patient care."} />;
}
