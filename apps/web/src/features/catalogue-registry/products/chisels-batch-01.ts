export type ChiselsInstrumentKind = "Osteotome" | "Chisel" | "Gouge";
export type ChiselsDirection = "Straight" | "Curved" | "Not specified";
export type ChiselsBatch01FamilyKey =
  | "osteotomes"
  | "chisels"
  | "gouges"
  | "hoke-osteotomes"
  | "round-handle-gouges"
  | "west-chisel"
  | "west-gouge"
  | "andrews-gouge"
  | "alexander-osteotome"
  | "alexander-gouge"
  | "alexander-chisel"
  | "stille-osteotomes"
  | "stille-gouges"
  | "stille-chisels";

export interface ChiselsCodeOption {
  code: string;
  size: string;
}

export interface ChiselsBatch01Configuration {
  id: string;
  slug: string;
  familyKey: ChiselsBatch01FamilyKey;
  name: string;
  instrumentKind: ChiselsInstrumentKind;
  direction: ChiselsDirection;
  cataloguePage: "1" | "2" | "3";
  codeOptions: readonly ChiselsCodeOption[];
  mediaAssetId: string;
}

function options(
  length: string,
  rows: readonly (readonly [string, string])[]
): readonly ChiselsCodeOption[] {
  return rows.map(([code, width]) => ({
    code,
    size: `${length} · ${width}`
  }));
}

const PAGE_ONE_WIDTHS = ["4 mm", "6 mm", "8 mm", "10 mm", "12 mm"] as const;
const HOKE_WIDTHS = ["2 mm", "3 mm", "4 mm", "5 mm", "6 mm", "7 mm", "8 mm"] as const;
const ALEXANDER_WIDTHS = ["4 mm", "6 mm", "8 mm", "10 mm", "12 mm", "14 mm"] as const;

function sequentialRows(
  prefix: string,
  widths: readonly string[],
  start: number = 1
): readonly (readonly [string, string])[] {
  return widths.map((width, index) => [
    `${prefix}${String(start + index).padStart(2, "0")}`,
    width
  ] as const);
}

const STILLE_OSTEOTOMES_STRAIGHT = [
  ...options("20 cm / 8 in", [
    ["36-6901", "10 mm"],
    ["36-6902", "12 mm"],
    ["36-6903", "15 mm"],
    ["36-6904", "20 mm"],
    ["36-6905", "25 mm"]
  ]),
  ...options("23 cm / 9 in", [
    ["36-6940", "4 mm"],
    ["36-6941", "6 mm"],
    ["36-6942", "8 mm"],
    ["36-6943", "10 mm"],
    ["36-6944", "12 mm"],
    ["36-6945", "15 mm"],
    ["36-6946", "20 mm"],
    ["36-6947", "25 mm"],
    ["36-6948", "30 mm"],
    ["36-6949", "40 mm"]
  ])
] as const;

const STILLE_OSTEOTOMES_CURVED = options("20 cm / 8 in", [
  ["36-6911", "10 mm"],
  ["36-6912", "12 mm"],
  ["36-6913", "15 mm"],
  ["36-6914", "20 mm"],
  ["36-6915", "25 mm"]
]);

const STILLE_GOUGES_STRAIGHT = [
  ...options("20 cm / 8 in", [
    ["36-6921", "10 mm"],
    ["36-6922", "12 mm"],
    ["36-6923", "15 mm"],
    ["36-6924", "20 mm"],
    ["36-6925", "25 mm"]
  ]),
  ...options("23 cm / 9 in", [
    ["36-6950", "4 mm"],
    ["36-6951", "6 mm"],
    ["36-6952", "8 mm"],
    ["36-6953", "10 mm"],
    ["36-6954", "12 mm"],
    ["36-6955", "15 mm"],
    ["36-6956", "20 mm"],
    ["36-6957", "25 mm"],
    ["36-6958", "30 mm"],
    ["36-6959", "40 mm"]
  ])
] as const;

const STILLE_CHISELS_STRAIGHT = options("20 cm / 8 in", [
  ["36-6931", "10 mm"],
  ["36-6932", "12 mm"],
  ["36-6933", "15 mm"],
  ["36-6934", "20 mm"],
  ["36-6935", "25 mm"]
]);

export const CHISELS_BATCH_01_CONFIGURATIONS = [
  {
    id: "product-chisels-osteotomes-13-5cm",
    slug: "osteotomes-13-5cm",
    familyKey: "osteotomes",
    name: "Osteotomes",
    instrumentKind: "Osteotome",
    direction: "Not specified",
    cataloguePage: "1",
    codeOptions: options(
      "13.5 cm",
      PAGE_ONE_WIDTHS.map((width, index) => [
        `36-630${index + 1}`,
        width
      ] as const)
    ),
    mediaAssetId: "chisels-osteotomes-13-5cm"
  },
  {
    id: "product-chisels-chisels-13-5cm",
    slug: "chisels-13-5cm",
    familyKey: "chisels",
    name: "Chisels",
    instrumentKind: "Chisel",
    direction: "Not specified",
    cataloguePage: "1",
    codeOptions: options(
      "13.5 cm",
      PAGE_ONE_WIDTHS.map((width, index) => [
        `36-632${index + 1}`,
        width
      ] as const)
    ),
    mediaAssetId: "chisels-chisels-13-5cm"
  },
  {
    id: "product-chisels-gouges-13-5cm",
    slug: "gouges-13-5cm",
    familyKey: "gouges",
    name: "Gouges",
    instrumentKind: "Gouge",
    direction: "Not specified",
    cataloguePage: "1",
    codeOptions: options(
      "13.5 cm",
      PAGE_ONE_WIDTHS.map((width, index) => [
        `36-633${index + 1}`,
        width
      ] as const)
    ),
    mediaAssetId: "chisels-gouges-13-5cm"
  },
  {
    id: "product-chisels-hoke-osteotomes-straight",
    slug: "hoke-osteotomes-straight",
    familyKey: "hoke-osteotomes",
    name: "Hoke Osteotomes",
    instrumentKind: "Osteotome",
    direction: "Straight",
    cataloguePage: "1",
    codeOptions: options("14 cm", sequentialRows("36-64", HOKE_WIDTHS, 1)),
    mediaAssetId: "chisels-hoke-osteotomes-straight"
  },
  {
    id: "product-chisels-hoke-osteotomes-curved",
    slug: "hoke-osteotomes-curved",
    familyKey: "hoke-osteotomes",
    name: "Hoke Osteotomes",
    instrumentKind: "Osteotome",
    direction: "Curved",
    cataloguePage: "1",
    codeOptions: options(
      "14 cm",
      HOKE_WIDTHS.map((width, index) => [
        `36-641${index + 1}`,
        width
      ] as const)
    ),
    mediaAssetId: "chisels-hoke-osteotomes-curved"
  },
  {
    id: "product-chisels-round-handle-gouges",
    slug: "round-handle-gouges",
    familyKey: "round-handle-gouges",
    name: "Round Handle Gouges",
    instrumentKind: "Gouge",
    direction: "Not specified",
    cataloguePage: "1",
    codeOptions: [{ code: "36-6500", size: "14 cm · 6 mm" }],
    mediaAssetId: "chisels-round-handle-gouges"
  },
  {
    id: "product-chisels-west-chisel",
    slug: "west-chisel",
    familyKey: "west-chisel",
    name: "West Chisel",
    instrumentKind: "Chisel",
    direction: "Not specified",
    cataloguePage: "2",
    codeOptions: [{ code: "36-6601", size: "19 cm · 6 mm" }],
    mediaAssetId: "chisels-west-chisel"
  },
  {
    id: "product-chisels-west-gouge",
    slug: "west-gouge",
    familyKey: "west-gouge",
    name: "West Gouge",
    instrumentKind: "Gouge",
    direction: "Not specified",
    cataloguePage: "2",
    codeOptions: [{ code: "36-6621", size: "19 cm · 6 mm" }],
    mediaAssetId: "chisels-west-gouge"
  },
  {
    id: "product-chisels-andrews-gouge",
    slug: "andrews-gouge",
    familyKey: "andrews-gouge",
    name: "Andrews Gouge",
    instrumentKind: "Gouge",
    direction: "Not specified",
    cataloguePage: "2",
    codeOptions: options(
      "16 cm",
      PAGE_ONE_WIDTHS.map((width, index) => [
        `36-670${index + 1}`,
        width
      ] as const)
    ),
    mediaAssetId: "chisels-andrews-gouge"
  },
  {
    id: "product-chisels-alexander-osteotome",
    slug: "alexander-osteotome",
    familyKey: "alexander-osteotome",
    name: "Alexander Osteotome",
    instrumentKind: "Osteotome",
    direction: "Not specified",
    cataloguePage: "2",
    codeOptions: options(
      "17.5 cm",
      ALEXANDER_WIDTHS.map((width, index) => [
        `36-680${index + 1}`,
        width
      ] as const)
    ),
    mediaAssetId: "chisels-alexander-osteotome"
  },
  {
    id: "product-chisels-alexander-gouge",
    slug: "alexander-gouge",
    familyKey: "alexander-gouge",
    name: "Alexander Gouge",
    instrumentKind: "Gouge",
    direction: "Not specified",
    cataloguePage: "2",
    codeOptions: options(
      "17.5 cm",
      ALEXANDER_WIDTHS.map((width, index) => [
        `36-682${index + 1}`,
        width
      ] as const)
    ),
    mediaAssetId: "chisels-alexander-gouge"
  },
  {
    id: "product-chisels-alexander-chisel",
    slug: "alexander-chisel",
    familyKey: "alexander-chisel",
    name: "Alexander Chisel",
    instrumentKind: "Chisel",
    direction: "Not specified",
    cataloguePage: "2",
    codeOptions: options(
      "17.5 cm",
      ALEXANDER_WIDTHS.map((width, index) => [
        `36-683${index + 1}`,
        width
      ] as const)
    ),
    mediaAssetId: "chisels-alexander-chisel"
  },
  {
    id: "product-chisels-stille-osteotomes-straight",
    slug: "stille-osteotomes-straight",
    familyKey: "stille-osteotomes",
    name: "Stille Osteotomes",
    instrumentKind: "Osteotome",
    direction: "Straight",
    cataloguePage: "3",
    codeOptions: STILLE_OSTEOTOMES_STRAIGHT,
    mediaAssetId: "chisels-stille-osteotomes-straight"
  },
  {
    id: "product-chisels-stille-osteotomes-curved",
    slug: "stille-osteotomes-curved",
    familyKey: "stille-osteotomes",
    name: "Stille Osteotomes",
    instrumentKind: "Osteotome",
    direction: "Curved",
    cataloguePage: "3",
    codeOptions: STILLE_OSTEOTOMES_CURVED,
    mediaAssetId: "chisels-stille-osteotomes-curved"
  },
  {
    id: "product-chisels-stille-gouges-straight",
    slug: "stille-gouges-straight",
    familyKey: "stille-gouges",
    name: "Stille Gouges",
    instrumentKind: "Gouge",
    direction: "Straight",
    cataloguePage: "3",
    codeOptions: STILLE_GOUGES_STRAIGHT,
    mediaAssetId: "chisels-stille-gouges-straight"
  },
  {
    id: "product-chisels-stille-chisels-straight",
    slug: "stille-chisels-straight",
    familyKey: "stille-chisels",
    name: "Stille Chisels",
    instrumentKind: "Chisel",
    direction: "Straight",
    cataloguePage: "3",
    codeOptions: STILLE_CHISELS_STRAIGHT,
    mediaAssetId: "chisels-stille-chisels-straight"
  }
] as const satisfies readonly ChiselsBatch01Configuration[];
