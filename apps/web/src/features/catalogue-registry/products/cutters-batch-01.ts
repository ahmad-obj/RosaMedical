export type CuttersDirection =
  | "Straight"
  | "Curved"
  | "Angled to side"
  | "Not specified";

export type CuttersBatch01FamilyKey =
  | "liston"
  | "cleveland"
  | "bohler"
  | "mc-indoe"
  | "ruskin-liston"
  | "ruskin-rowland"
  | "stille-liston";

export interface CuttersCodeOption {
  code: string;
  size: string;
}

export interface CuttersBatch01Configuration {
  id: string;
  slug: string;
  familyKey: CuttersBatch01FamilyKey;
  name: string;
  direction: CuttersDirection;
  cataloguePage: "1" | "2" | "3";
  codeOptions: readonly CuttersCodeOption[];
  mediaAssetId: string;
}

export const CUTTERS_BATCH_01_CONFIGURATIONS = [
  {
    id: "product-cutters-liston-straight",
    slug: "liston",
    familyKey: "liston",
    name: "Liston",
    direction: "Straight",
    cataloguePage: "1",
    codeOptions: [
      { code: "36-5101", size: "14.0 cm" },
      { code: "36-5102", size: "17.0 cm" },
      { code: "36-5103", size: "19.0 cm" },
      { code: "36-5104", size: "22.0 cm" }
    ],
    mediaAssetId: "cutters-liston-straight"
  },
  {
    id: "product-cutters-liston-curved",
    slug: "liston-curved",
    familyKey: "liston",
    name: "Liston",
    direction: "Curved",
    cataloguePage: "1",
    codeOptions: [
      { code: "36-5111", size: "14.0 cm" },
      { code: "36-5112", size: "17.0 cm" },
      { code: "36-5113", size: "19.0 cm" },
      { code: "36-5114", size: "22.0 cm" }
    ],
    mediaAssetId: "cutters-liston-curved"
  },
  {
    id: "product-cutters-cleveland",
    slug: "cleveland",
    familyKey: "cleveland",
    name: "Cleveland",
    direction: "Not specified",
    cataloguePage: "1",
    codeOptions: [
      { code: "36-5401", size: "15.0 cm" },
      { code: "36-5402", size: "17.0 cm" }
    ],
    mediaAssetId: "cutters-cleveland"
  },
  {
    id: "product-cutters-bohler-straight",
    slug: "bohler",
    familyKey: "bohler",
    name: "Bohler",
    direction: "Straight",
    cataloguePage: "1",
    codeOptions: [{ code: "36-5501", size: "15.0 cm" }],
    mediaAssetId: "cutters-bohler-straight"
  },
  {
    id: "product-cutters-bohler-curved",
    slug: "bohler-curved",
    familyKey: "bohler",
    name: "Bohler",
    direction: "Curved",
    cataloguePage: "1",
    codeOptions: [{ code: "36-5511", size: "15.0 cm" }],
    mediaAssetId: "cutters-bohler-curved"
  },
  {
    id: "product-cutters-mc-indoe",
    slug: "mc-indoe",
    familyKey: "mc-indoe",
    name: "Mc Indoe",
    direction: "Not specified",
    cataloguePage: "2",
    codeOptions: [{ code: "36-5600", size: "17.5 cm" }],
    mediaAssetId: "cutters-mc-indoe"
  },
  {
    id: "product-cutters-ruskin-liston-straight",
    slug: "ruskin-liston-straight",
    familyKey: "ruskin-liston",
    name: "Ruskin-Liston",
    direction: "Straight",
    cataloguePage: "2",
    codeOptions: [{ code: "36-5701", size: "18.5 cm" }],
    mediaAssetId: "cutters-ruskin-liston-straight"
  },
  {
    id: "product-cutters-ruskin-liston-curved",
    slug: "ruskin-liston-curved",
    familyKey: "ruskin-liston",
    name: "Ruskin-Liston",
    direction: "Curved",
    cataloguePage: "2",
    codeOptions: [{ code: "36-5711", size: "18.5 cm" }],
    mediaAssetId: "cutters-ruskin-liston-curved"
  },
  {
    id: "product-cutters-ruskin-rowland-straight",
    slug: "ruskin-rowland-straight",
    familyKey: "ruskin-rowland",
    name: "Ruskin-Rowland",
    direction: "Straight",
    cataloguePage: "2",
    codeOptions: [{ code: "36-5801", size: "17.0 cm" }],
    mediaAssetId: "cutters-ruskin-rowland-straight"
  },
  {
    id: "product-cutters-ruskin-rowland-angled",
    slug: "ruskin-rowland-angled-to-side",
    familyKey: "ruskin-rowland",
    name: "Ruskin-Rowland",
    direction: "Angled to side",
    cataloguePage: "2",
    codeOptions: [{ code: "36-5811", size: "17.0 cm" }],
    mediaAssetId: "cutters-ruskin-rowland-angled-to-side"
  },
  {
    id: "product-cutters-stille-liston-straight",
    slug: "stille-liston-straight",
    familyKey: "stille-liston",
    name: "Stille-Liston",
    direction: "Straight",
    cataloguePage: "3",
    codeOptions: [
      { code: "36-5901", size: "23.0 cm" },
      { code: "36-5902", size: "27.0 cm" }
    ],
    mediaAssetId: "cutters-stille-liston-straight"
  },
  {
    id: "product-cutters-stille-liston-curved",
    slug: "stille-liston-curved",
    familyKey: "stille-liston",
    name: "Stille-Liston",
    direction: "Curved",
    cataloguePage: "3",
    codeOptions: [
      { code: "36-5911", size: "23.0 cm" },
      { code: "36-5912", size: "27.0 cm" }
    ],
    mediaAssetId: "cutters-stille-liston-curved"
  },
  {
    id: "product-cutters-stille-liston-36-6000",
    slug: "stille-liston-36-6000",
    familyKey: "stille-liston",
    name: "Stille-Liston",
    direction: "Not specified",
    cataloguePage: "3",
    codeOptions: [{ code: "36-6000", size: "27.0 cm" }],
    mediaAssetId: "cutters-stille-liston-36-6000"
  }
] as const satisfies readonly CuttersBatch01Configuration[];
