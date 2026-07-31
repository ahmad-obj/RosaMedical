import { getCategories, getProducts, getSiteSettings } from "@/lib/supabase/queries";

export const hero = {
  headline: "Premium Medical Supplies",
  body: "Trusted by professionals across surgical specialties. Quality instruments you can rely on, delivered with care.",
  primaryCta: "Browse Products",
  secondaryCta: "Request Quotation",
};

export const families = [
  { name: "Knives", className: "knives" },
  { name: "Scissors", className: "scissors" },
  { name: "Punches", className: "punches" },
  { name: "Chisels", className: "chisels" },
  { name: "Cutters", className: "cutters" },
];

export const familiesSection = {
  heading: "Instrument Families",
  body: "Explore our curated ranges of specialist surgical instruments.",
};

export const procurementIntro = {
  heading: "Procurement Support",
  body: "Our dedicated team guides you through every step of the procurement process, from product selection to delivery.",
  cta: "Learn more",
};

export const selectedInstruments = {
  heading: "Selected Instruments",
  body: "A curated selection from our most requested products.",
  products: [
    { code: "36-5101", name: "Liston Bone Cutter", variant: "Request Quote" },
    { code: "36-6901", name: "Stille Osteotome", variant: "Request Quote" },
    { code: "04-0901", name: "Iris Scissors", variant: "Request Quote" },
    { code: "04-0402", name: "Mayo Scissors", variant: "Request Quote" },
  ],
};

export const cataloguesSection = {
  heading: "Catalogues",
  body: "Browse our full product catalogues for detailed specifications.",
  catalogues: ["Knives", "Scissors", "Punches", "Chisels", "Cutters"],
};

export const processSection = {
  heading: "How It Works",
  steps: [
    { number: "01", title: "Browse", body: "Explore our instrument families and find the tools you need." },
    { number: "02", title: "Inquire", body: "Add items to your inquiry list or request a quotation." },
    { number: "03", title: "Connect", body: "Our team responds with pricing, availability, and delivery details." },
    { number: "04", title: "Deliver", body: "Receive your order with full tracking and after-sales support." },
  ],
};

export const finalCta = {
  heading: "Ready to Get Started?",
  body: "Browse our catalog or reach out to our team for personalized recommendations.",
  primaryCta: "Start Inquiry",
  secondaryCta: "Contact Us",
};

// Supabase fetchers for server components
export async function getFamiliesFromDB() {
  const categories = await getCategories();
  if (categories.length > 0) {
    return categories.map((cat) => ({ name: cat.name_en, className: cat.slug }));
  }
  return families;
}

export async function getSelectedInstrumentsFromDB() {
  const products = await getProducts();
  if (products.length > 0) {
    return {
      heading: "Selected Instruments",
      body: "A curated selection from our most requested products.",
      products: products.slice(0, 4).map((p) => ({
        code: p.item_code,
        name: p.name_en,
        variant: p.sell_mode === "quote" ? "Request Quote" : "In Stock",
      })),
    };
  }
  return selectedInstruments;
}

export async function getCataloguesFromDB() {
  const categories = await getCategories();
  if (categories.length > 0) {
    return {
      heading: "Catalogues",
      body: "Browse our full product catalogues for detailed specifications.",
      catalogues: categories.map((cat) => cat.name_en),
    };
  }
  return cataloguesSection;
}

export async function getSettingValue(key: string): Promise<string> {
  const settings = await getSiteSettings();
  return settings[key]?.value_en ?? "";
}
