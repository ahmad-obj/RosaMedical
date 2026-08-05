export type PunchesBatch01FamilyKey =
  | "yeoman-fixed"
  | "yeoman-turnable"
  | "named-forceps"
  | "laminectomy";

export interface PunchesCodeOption {
  code: string;
  size: string;
}

export interface PunchesBatch01Configuration {
  id: string;
  slug: string;
  familyKey: PunchesBatch01FamilyKey;
  name: string;
  variant: string;
  cataloguePage: "1" | "2" | "3";
  codeOptions: readonly PunchesCodeOption[];
  mediaAssetId: string;
}

export const PUNCHES_BATCH_01_CONFIGURATIONS = [
  {
    id: "product_yeoman",
    slug: "yeoman",
    familyKey: "yeoman-fixed",
    name: "Yeoman Punch",
    variant: "Code group 21-10xx",
    cataloguePage: "1",
    codeOptions: [
      { code: "21-1001", size: "28.0 cm" },
      { code: "21-1002", size: "35.0 cm" },
      { code: "21-1003", size: "42.0 cm" }
    ],
    mediaAssetId: "punches-yeoman-21-10"
  },
  {
    id: "product_yeoman_perforated",
    slug: "yeoman-perforated",
    familyKey: "yeoman-fixed",
    name: "Yeoman Punch",
    variant: "Code group 21-11xx",
    cataloguePage: "1",
    codeOptions: [
      { code: "21-1101", size: "28.0 cm" },
      { code: "21-1102", size: "35.0 cm" },
      { code: "21-1103", size: "42.0 cm" }
    ],
    mediaAssetId: "punches-yeoman-21-11"
  },
  {
    id: "product_yeoman_rectangular",
    slug: "yeoman-rectangular",
    familyKey: "yeoman-fixed",
    name: "Yeoman Punch",
    variant: "Code group 21-12xx",
    cataloguePage: "1",
    codeOptions: [
      { code: "21-1201", size: "28.0 cm" },
      { code: "21-1202", size: "35.0 cm" },
      { code: "21-1203", size: "42.0 cm" }
    ],
    mediaAssetId: "punches-yeoman-21-12"
  },
  {
    id: "product-punches-yeoman-21-13",
    slug: "yeoman-21-13",
    familyKey: "yeoman-fixed",
    name: "Yeoman Punch",
    variant: "Code group 21-13xx",
    cataloguePage: "1",
    codeOptions: [
      { code: "21-1301", size: "28.0 cm" },
      { code: "21-1302", size: "35.0 cm" },
      { code: "21-1303", size: "42.0 cm" }
    ],
    mediaAssetId: "punches-yeoman-21-13"
  },
  {
    id: "product-punches-yeoman-21-14",
    slug: "yeoman-21-14",
    familyKey: "yeoman-turnable",
    name: "Yeoman Punch, 360° Turnable",
    variant: "Code group 21-14xx",
    cataloguePage: "2",
    codeOptions: [
      { code: "21-1401", size: "28.0 cm" },
      { code: "21-1402", size: "35.0 cm" },
      { code: "21-1403", size: "40.0 cm" }
    ],
    mediaAssetId: "punches-yeoman-21-14"
  },
  {
    id: "product-punches-yeoman-21-15",
    slug: "yeoman-21-15",
    familyKey: "yeoman-turnable",
    name: "Yeoman Punch, 360° Turnable",
    variant: "Code group 21-15xx",
    cataloguePage: "2",
    codeOptions: [
      { code: "21-1501", size: "28.0 cm" },
      { code: "21-1502", size: "35.0 cm" },
      { code: "21-1503", size: "40.0 cm" }
    ],
    mediaAssetId: "punches-yeoman-21-15"
  },
  {
    id: "product-punches-turrel-21-16",
    slug: "turrel-21-16",
    familyKey: "yeoman-turnable",
    name: "Turrel Punch, 360° Turnable",
    variant: "Code group 21-16xx",
    cataloguePage: "2",
    codeOptions: [
      { code: "21-1601", size: "28.0 cm" },
      { code: "21-1602", size: "35.0 cm" },
      { code: "21-1603", size: "40.0 cm" }
    ],
    mediaAssetId: "punches-turrel-21-16"
  },
  {
    id: "product-punches-turrel-21-17",
    slug: "turrel-21-17",
    familyKey: "yeoman-turnable",
    name: "Turrel Punch, 360° Turnable",
    variant: "Code group 21-17xx",
    cataloguePage: "2",
    codeOptions: [
      { code: "21-1701", size: "28.0 cm" },
      { code: "21-1702", size: "35.0 cm" },
      { code: "21-1703", size: "40.0 cm" }
    ],
    mediaAssetId: "punches-turrel-21-17"
  },
  {
    id: "product-punches-fahlbusch",
    slug: "fahlbusch-micro-scissors-horizontal-cutting",
    familyKey: "named-forceps",
    name: "Fahlbusch Micro Scissors",
    variant: "Horizontal cutting",
    cataloguePage: "3",
    codeOptions: [{ code: "38-2401", size: "16.5 cm" }],
    mediaAssetId: "punches-fahlbusch"
  },
  {
    id: "product-punches-nicola-spoon-shaped",
    slug: "nicola-forceps-spoon-shaped",
    familyKey: "named-forceps",
    name: "Nicola Forceps",
    variant: "Spoon-shaped",
    cataloguePage: "3",
    codeOptions: [{ code: "38-2410", size: "16.5 cm" }],
    mediaAssetId: "punches-nicola-spoon-shaped"
  },
  {
    id: "product-punches-nicola-biopsy-straight",
    slug: "nicola-forceps-biopsy-straight",
    familyKey: "named-forceps",
    name: "Nicola Forceps Scissors",
    variant: "Biopsy, straight",
    cataloguePage: "3",
    codeOptions: [{ code: "38-2402", size: "16.5 cm" }],
    mediaAssetId: "punches-nicola-biopsy-straight"
  },
  {
    id: "product-punches-yasargil-nicola",
    slug: "yasargil-nicola-forceps",
    familyKey: "named-forceps",
    name: "Yasargil-Nicola Forceps",
    variant: "Forceps",
    cataloguePage: "3",
    codeOptions: [{ code: "038-2420", size: "16.5 cm" }],
    mediaAssetId: "punches-yasargil-nicola"
  },
  {
    id: "product-punches-citelly",
    slug: "citelly-laminectomy-punches",
    familyKey: "laminectomy",
    name: "Citelly Laminectomy Punches",
    variant: "8.0 cm shaft",
    cataloguePage: "3",
    codeOptions: [
      { code: "38-2501", size: "1.0 mm" },
      { code: "38-2502", size: "2.0 mm" },
      { code: "38-2503", size: "3.0 mm" }
    ],
    mediaAssetId: "punches-citelly"
  },
  {
    id: "product-punches-beyer",
    slug: "beyer-laminectomy-punch",
    familyKey: "laminectomy",
    name: "Beyer Laminectomy Punch",
    variant: "9.5 cm shaft, 1.5 mm opening",
    cataloguePage: "3",
    codeOptions: [{ code: "38-2510", size: "1.5 mm" }],
    mediaAssetId: "punches-beyer"
  }
] as const satisfies readonly PunchesBatch01Configuration[];
