export type KnivesBatch01FamilyKey =
  | "numbered-handle"
  | "micro-surgery"
  | "long-handle"
  | "liston"
  | "special-handle"
  | "dermatology";

export interface KnivesCodeOption {
  code: string;
  size: string;
}

export interface KnivesBatch01Configuration {
  id: string;
  slug: string;
  familyKey: KnivesBatch01FamilyKey;
  name: string;
  variant: string;
  cataloguePage: "1" | "2" | "3";
  codeOptions: readonly KnivesCodeOption[];
  mediaAssetId: string;
}

export const KNIVES_BATCH_01_CONFIGURATIONS = [
  {
    id: "product-knives-number-3",
    slug: "number-3",
    familyKey: "numbered-handle",
    name: "Scalpel Handle No. 3",
    variant: "No. 3",
    cataloguePage: "1",
    codeOptions: [
      { code: "18-0103", size: "12.0 cm" },
      { code: "18-0103S", size: "12.0 cm" }
    ],
    mediaAssetId: "knives-number-3"
  },
  {
    id: "product-knives-number-4",
    slug: "number-4",
    familyKey: "numbered-handle",
    name: "Scalpel Handle No. 4",
    variant: "No. 4",
    cataloguePage: "1",
    codeOptions: [
      { code: "18-0104", size: "13.0 cm" },
      { code: "18-0104S", size: "13.0 cm" }
    ],
    mediaAssetId: "knives-number-4"
  },
  {
    id: "product-knives-number-7",
    slug: "number-7",
    familyKey: "numbered-handle",
    name: "Scalpel Handle No. 7",
    variant: "No. 7",
    cataloguePage: "1",
    codeOptions: [{ code: "18-0107", size: "16.0 cm" }],
    mediaAssetId: "knives-number-7"
  },
  {
    id: "product-knives-micro-surgery-handle",
    slug: "micro-surgery-handle",
    familyKey: "micro-surgery",
    name: "Micro Surgery Handle",
    variant: "Micro surgery",
    cataloguePage: "1",
    codeOptions: [{ code: "18-0202", size: "15.5 cm" }],
    mediaAssetId: "knives-micro-surgery-handle"
  },
  {
    id: "product-knives-number-3-long",
    slug: "number-3-long",
    familyKey: "long-handle",
    name: "Scalpel Handle No. 3 Long",
    variant: "Long",
    cataloguePage: "1",
    codeOptions: [{ code: "18-0103L", size: "21.0 cm" }],
    mediaAssetId: "knives-number-3-long"
  },
  {
    id: "product-knives-number-3-long-curved",
    slug: "number-3-long-curved",
    familyKey: "long-handle",
    name: "Scalpel Handle No. 3 Long Curved",
    variant: "Long curved",
    cataloguePage: "1",
    codeOptions: [{ code: "18-0113L", size: "20.5 cm" }],
    mediaAssetId: "knives-number-3-long-curved"
  },
  {
    id: "product-knives-number-4-long",
    slug: "number-4-long",
    familyKey: "long-handle",
    name: "Scalpel Handle No. 4 Long",
    variant: "Long",
    cataloguePage: "1",
    codeOptions: [{ code: "18-0104L", size: "21.0 cm" }],
    mediaAssetId: "knives-number-4-long"
  },
  {
    id: "product-knives-liston",
    slug: "liston",
    familyKey: "liston",
    name: "Liston Knife",
    variant: "Liston",
    cataloguePage: "1",
    codeOptions: [
      { code: "18-0401", size: "13.0 cm" },
      { code: "18-0402", size: "16.0 cm" },
      { code: "18-0403", size: "19.0 cm" },
      { code: "18-0404", size: "21.5 cm" }
    ],
    mediaAssetId: "knives-liston"
  },
  {
    id: "product-knives-number-9",
    slug: "number-9",
    familyKey: "numbered-handle",
    name: "Scalpel Handle No. 9",
    variant: "No. 9",
    cataloguePage: "2",
    codeOptions: [{ code: "18-0109", size: "12.0 cm" }],
    mediaAssetId: "knives-number-9"
  },
  {
    id: "product-knives-hexagonal",
    slug: "hexagonal",
    familyKey: "special-handle",
    name: "Hexagonal Scalpel Handle",
    variant: "Hexagonal",
    cataloguePage: "2",
    codeOptions: [{ code: "18-0646", size: "16.0 cm" }],
    mediaAssetId: "knives-hexagonal"
  },
  {
    id: "product-knives-round-straight",
    slug: "round-straight",
    familyKey: "special-handle",
    name: "Round Scalpel Handle",
    variant: "Straight",
    cataloguePage: "2",
    codeOptions: [{ code: "18-0644", size: "14.5 cm" }],
    mediaAssetId: "knives-round-straight"
  },
  {
    id: "product-knives-round-curved",
    slug: "round-curved",
    familyKey: "special-handle",
    name: "Round Scalpel Handle",
    variant: "Curved",
    cataloguePage: "2",
    codeOptions: [{ code: "18-0645", size: "14.5 cm" }],
    mediaAssetId: "knives-round-curved"
  },
  {
    id: "product-knives-long-handle",
    slug: "long-handle",
    familyKey: "special-handle",
    name: "Adjustable Scalpel Handle",
    variant: "Long handle",
    cataloguePage: "2",
    codeOptions: [{ code: "18-0647", size: "16.0 cm" }],
    mediaAssetId: "knives-long-handle"
  },
  {
    id: "product-knives-short-handle",
    slug: "short-handle",
    familyKey: "special-handle",
    name: "Adjustable Scalpel Handle",
    variant: "Short handle",
    cataloguePage: "2",
    codeOptions: [{ code: "18-0648", size: "10.0 cm" }],
    mediaAssetId: "knives-short-handle"
  },
  {
    id: "product-knives-saalfeld-comedo-extractor",
    slug: "saalfeld-comedo-extractor",
    familyKey: "dermatology",
    name: "Saalfeld Comedo Extractor",
    variant: "Saalfeld",
    cataloguePage: "3",
    codeOptions: [{ code: "19-0400", size: "14.0 cm" }],
    mediaAssetId: "knives-saalfeld-comedo-extractor"
  },
  {
    id: "product-knives-fox-lupus-curettes",
    slug: "fox-lupus-curettes",
    familyKey: "dermatology",
    name: "Fox Lupus Curettes",
    variant: "Fox",
    cataloguePage: "3",
    codeOptions: [
      { code: "19-0503", size: "3 mm" },
      { code: "19-0504", size: "4 mm" },
      { code: "19-0505", size: "5 mm" },
      { code: "19-0506", size: "6 mm" }
    ],
    mediaAssetId: "knives-fox-lupus-curettes"
  },
  {
    id: "product-knives-keyes-dermal-punches",
    slug: "keyes-dermal-punches",
    familyKey: "dermatology",
    name: "Keyes Dermal Punches",
    variant: "Individual punches",
    cataloguePage: "3",
    codeOptions: [
      { code: "19-0702", size: "2 mm" },
      { code: "19-0703", size: "3 mm" },
      { code: "19-0704", size: "4 mm" },
      { code: "19-0705", size: "5 mm" },
      { code: "19-0706", size: "6 mm" },
      { code: "19-0707", size: "7 mm" },
      { code: "19-0708", size: "8 mm" }
    ],
    mediaAssetId: "knives-keyes-dermal-punches"
  },
  {
    id: "product-knives-keyes-dermal-punch-set",
    slug: "keyes-dermal-punch-set",
    familyKey: "dermatology",
    name: "Keyes Dermal Punch Set",
    variant: "Six interchangeable tips with handle and rack",
    cataloguePage: "3",
    codeOptions: [{ code: "19-0800", size: "19.0 cm" }],
    mediaAssetId: "knives-keyes-dermal-punch-set"
  }
] as const satisfies readonly KnivesBatch01Configuration[];
