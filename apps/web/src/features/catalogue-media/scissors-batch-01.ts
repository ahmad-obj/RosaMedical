import type {
  CatalogueMediaAsset,
  CatalogueMediaMatchGrade
} from "./types";

const SOURCE_LEDGER_URL =
  "https://github.com/manbtd0-cloud/RosaMedical/blob/preview/scissors-image-batch-01/docs/review/catalogue-media/scissors-batch-01-sources.md#client-catalogue-page-1";

function catalogueCandidate(
  id: string,
  direction: "straight" | "curved",
  reuseScope: string
): CatalogueMediaAsset {
  const matchGrade: CatalogueMediaMatchGrade =
    direction === "straight" ? "strong-match" : "acceptable-similar";

  return {
    id,
    familySlug: "scissors",
    configurationKey: id,
    avifPath: `/media/catalogue-preview/scissors/${id}.avif`,
    webpPath: `/media/catalogue-preview/scissors/${id}.webp`,
    sourcePageUrl: SOURCE_LEDGER_URL,
    matchGrade,
    rightsMode: "preferred-safe",
    background: "transparent",
    processingNotes:
      "Client-supplied Scissors catalogue page 1. The finish-specific full instrument was combined with the catalogue's exact direction-specific tip inset. No instrument geometry was generated, stretched, or reshaped.",
    orientationNotes:
      "The full instrument and tip inset were rotated 180 degrees so the working end points right. Scaling remained proportional and the complete instrument stays inside the 1440 px safe region.",
    reuseScope,
    reviewStatus: "candidate"
  };
}

function supplierCandidate(
  id: string,
  sourcePageUrl: string,
  reuseScope: string
): CatalogueMediaAsset {
  return {
    id,
    familySlug: "scissors",
    configurationKey: id,
    avifPath: `/media/catalogue-preview/scissors/${id}.avif`,
    webpPath: `/media/catalogue-preview/scissors/${id}.webp`,
    sourcePageUrl,
    matchGrade: "strong-match",
    rightsMode: "supplier-fallback",
    background: "clean-white",
    processingNotes:
      "Official KLS Martin supplier product image. The clean white source background is preserved to avoid damaging reflective instrument edges. The source is cropped, rotated, and proportionally scaled without stretching, reshaping, or generative editing.",
    orientationNotes:
      "A deterministic principal-axis pass identifies the heavier ring-handle end and rotates the lighter working end toward the upper-right. The complete instrument remains inside the 1440 px safe region.",
    reuseScope,
    reviewStatus: "candidate"
  };
}

export const SCISSORS_BATCH_01_MEDIA = [
  catalogueCandidate(
    "scissors-iris-regular-straight",
    "straight",
    "Iris Regular Straight, catalogue code 04-0901, size 10.5 cm."
  ),
  catalogueCandidate(
    "scissors-iris-regular-curved",
    "curved",
    "Iris Regular Curved, catalogue code 04-0911, size 10.5 cm."
  ),
  catalogueCandidate(
    "scissors-iris-super-cut-straight",
    "straight",
    "Iris Super Cut Straight, catalogue code 05-0901, size 10.5 cm."
  ),
  catalogueCandidate(
    "scissors-iris-super-cut-curved",
    "curved",
    "Iris Super Cut Curved, catalogue code 05-0911, size 10.5 cm."
  ),
  catalogueCandidate(
    "scissors-iris-tungsten-carbide-straight",
    "straight",
    "Iris Tungsten Carbide Straight, catalogue code 06-0901, size 10.5 cm."
  ),
  catalogueCandidate(
    "scissors-iris-tungsten-carbide-curved",
    "curved",
    "Iris Tungsten Carbide Curved, catalogue code 06-0911, size 10.5 cm."
  ),
  catalogueCandidate(
    "scissors-stevens-regular-straight",
    "straight",
    "Stevens Regular Straight, catalogue codes 04-0800 and 04-0802, sizes 9.5 cm and 11.5 cm."
  ),
  catalogueCandidate(
    "scissors-stevens-regular-curved",
    "curved",
    "Stevens Regular Curved, catalogue codes 04-0810 and 04-0812, sizes 9.5 cm and 11.5 cm."
  ),
  catalogueCandidate(
    "scissors-stevens-super-cut-straight",
    "straight",
    "Stevens Super Cut Straight, catalogue codes 05-0800 and 05-0802, sizes 9.5 cm and 11.5 cm."
  ),
  catalogueCandidate(
    "scissors-stevens-super-cut-curved",
    "curved",
    "Stevens Super Cut Curved, catalogue codes 05-0810 and 05-0812, sizes 9.5 cm and 11.5 cm."
  ),
  catalogueCandidate(
    "scissors-stevens-tungsten-carbide-straight",
    "straight",
    "Stevens Tungsten Carbide Straight, catalogue codes 06-0800 and 06-0802, sizes 9.5 cm and 11.5 cm."
  ),
  catalogueCandidate(
    "scissors-stevens-tungsten-carbide-curved",
    "curved",
    "Stevens Tungsten Carbide Curved, catalogue codes 06-0810 and 06-0812, sizes 9.5 cm and 11.5 cm."
  ),
  supplierCandidate(
    "scissors-mayo-regular-straight",
    "https://www.klsmartin.com/shop/en/products/product/11-170-17-07/",
    "Mayo Regular Straight, catalogue codes 04-0401, 04-0402, 04-0403, and 04-0404, sizes 14.5 cm, 17 cm, 20 cm, and 23 cm."
  ),
  supplierCandidate(
    "scissors-mayo-regular-curved",
    "https://www.klsmartin.com/shop/en/products/product/11-171-17-07/",
    "Mayo Regular Curved, catalogue codes 04-0411, 04-0412, 04-0413, and 04-0414, sizes 14.5 cm, 17 cm, 20 cm, and 23 cm."
  ),
  supplierCandidate(
    "scissors-mayo-super-cut-straight",
    "https://www.klsmartin.com/shop/en/products/product/11-652-17-07/",
    "Mayo Super Cut Straight, catalogue codes 05-0401, 05-0402, 05-0403, and 05-0404, sizes 14.5 cm, 17 cm, 20 cm, and 23 cm."
  ),
  supplierCandidate(
    "scissors-mayo-super-cut-curved",
    "https://www.klsmartin.com/shop/en/products/product/11-653-17-07/",
    "Mayo Super Cut Curved, catalogue codes 05-0411, 05-0412, 05-0413, and 05-0414, sizes 14.5 cm, 17 cm, 20 cm, and 23 cm."
  ),
  supplierCandidate(
    "scissors-mayo-tungsten-carbide-straight",
    "https://www.klsmartin.com/shop/en/products/product/11-910-17-07/",
    "Mayo Tungsten Carbide Straight, catalogue codes 06-0401, 06-0402, 06-0403, and 06-0404, sizes 14.5 cm, 17 cm, 20 cm, and 23 cm."
  ),
  supplierCandidate(
    "scissors-mayo-tungsten-carbide-curved",
    "https://www.klsmartin.com/shop/en/products/product/11-911-17-07/",
    "Mayo Tungsten Carbide Curved, catalogue codes 06-0411, 06-0412, 06-0413, and 06-0414, sizes 14.5 cm, 17 cm, 20 cm, and 23 cm."
  ),
  supplierCandidate(
    "scissors-metzenbaum-regular-straight",
    "https://www.klsmartin.com/shop/en/products/product/11-280-18-07/",
    "Metzenbaum Regular Straight, catalogue codes 04-1901, 04-1902, 04-1909, 04-1903, 04-1904, and 04-1905, sizes 11 cm, 14 cm, 16 cm, 18 cm, 20 cm, and 23 cm."
  ),
  supplierCandidate(
    "scissors-metzenbaum-regular-curved",
    "https://www.klsmartin.com/shop/en/products/product/11-285-18-07/",
    "Metzenbaum Regular Curved, catalogue codes 04-1911, 04-1912, 04-1919, 04-1913, 04-1914, and 04-1915, sizes 11 cm, 14 cm, 16 cm, 18 cm, 20 cm, and 23 cm."
  ),
  supplierCandidate(
    "scissors-metzenbaum-super-cut-straight",
    "https://www.klsmartin.com/shop/en/products/product/11-660-18-07/",
    "Metzenbaum Super Cut Straight, catalogue codes 05-1901, 05-1902, 05-1909, 05-1903, 05-1904, and 05-1905, sizes 11 cm, 14 cm, 16 cm, 18 cm, 20 cm, and 23 cm."
  ),
  supplierCandidate(
    "scissors-metzenbaum-super-cut-curved",
    "https://www.klsmartin.com/shop/en/products/product/11-661-18-07/",
    "Metzenbaum Super Cut Curved, catalogue codes 05-1911, 05-1912, 05-1919, 05-1913, 05-1914, and 05-1915, sizes 11 cm, 14 cm, 16 cm, 18 cm, 20 cm, and 23 cm."
  ),
  supplierCandidate(
    "scissors-metzenbaum-tungsten-carbide-straight",
    "https://www.klsmartin.com/shop/en/products/product/11-942-18-07/",
    "Metzenbaum Tungsten Carbide Straight, catalogue codes 06-1901, 06-1902, 06-1909, 06-1903, 06-1904, and 06-1905, sizes 11 cm, 14 cm, 16 cm, 18 cm, 20 cm, and 23 cm."
  ),
  supplierCandidate(
    "scissors-metzenbaum-tungsten-carbide-curved",
    "https://www.klsmartin.com/shop/en/products/product/11-943-18-07/",
    "Metzenbaum Tungsten Carbide Curved, catalogue codes 06-1911, 06-1912, 06-1919, 06-1913, 06-1914, and 06-1915, sizes 11 cm, 14 cm, 16 cm, 18 cm, 20 cm, and 23 cm."
  )
] as const satisfies readonly CatalogueMediaAsset[];
