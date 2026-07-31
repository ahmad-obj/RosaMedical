import { RoutePlaceholder } from "@/components/layout/route-placeholder";
import { Homepage } from "@/components/sections/homepage";

const routeTitles: Record<string, string> = {
  "": "Homepage",
  products: "Products overview",
  catalogues: "Technical catalogues",
  about: "About Rosa",
  "procurement-support": "Procurement support",
  contact: "Contact Rosa",
  search: "Search the catalogue",
  inquiry: "Instrument inquiry",
  "request-quotation": "Request a quotation",
  privacy: "Privacy Policy",
  terms: "Terms"
};

export default async function Page({ params }: { params: Promise<{ segments?: string[] }> }) {
  const { segments = [] } = await params;
  const key = segments.join("/");

  if (key === "") {
    return <Homepage />;
  }

  const path = `/${segments.join("/")}`;
  const title = routeTitles[key] ?? (segments.at(-1)?.replaceAll("-", " ") || "Homepage");
  return <RoutePlaceholder eyebrow="Public route" title={title} path={path} />;
}
