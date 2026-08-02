import type { CatalogueProductRecord } from "../types";

const SPRITE_PATH = "/media/scissors-preview/scissors-batch-01.webp";

const previewProduct = (
  id: string,
  slug: string,
  name: string,
  code: string,
  finish: string,
  page: string,
  mediaIndex: number
): CatalogueProductRecord => ({
  id,
  familySlug: "scissors",
  slug,
  name,
  code,
  description: `Catalogue-listed ${name} shown in the ${finish} finish for visual review.`,
  sizes: [],
  variants: [finish],
  directions: [],
  primaryOption: finish,
  catalogueReference: { family: "Scissors", page },
  mediaLabel: `${name}, ${finish}`,
  mediaPath: SPRITE_PATH,
  mediaIndex
});

export const SCISSOR_PRODUCTS = [
  previewProduct("product_iris_scissors_regular", "iris-scissors-regular", "Iris Scissors", "04-0800", "Regular", "1", 0),
  previewProduct("product_iris_scissors_super_cut", "iris-scissors-super-cut", "Iris Scissors", "05-0802", "Super Cut", "1", 1),
  previewProduct("product_iris_scissors_tc", "iris-scissors-tc", "Iris Scissors", "06-0802", "Tungsten Carbide", "1", 2),
  previewProduct("product_stevens_scissors_regular", "stevens-tenotomy-scissors-regular", "Stevens Tenotomy Scissors", "04-0901", "Regular", "1", 3),
  previewProduct("product_stevens_scissors_super_cut", "stevens-tenotomy-scissors-super-cut", "Stevens Tenotomy Scissors", "05-0901", "Super Cut", "1", 4),
  previewProduct("product_stevens_scissors_tc", "stevens-tenotomy-scissors-tc", "Stevens Tenotomy Scissors", "06-0901", "Tungsten Carbide", "1", 5),
  previewProduct("product_operating_scissors_regular", "operating-scissors-regular", "Operating Scissors", "04-0101", "Regular", "2", 6),
  previewProduct("product_operating_scissors_super_cut", "operating-scissors-super-cut", "Operating Scissors", "05-0101", "Super Cut", "2", 7),
  previewProduct("product_operating_scissors_tc", "operating-scissors-tc", "Operating Scissors", "06-0101", "Tungsten Carbide", "2", 8),
  previewProduct("product_mayo_scissors_regular", "mayo-scissors-regular", "Mayo Scissors", "04-0401", "Regular", "3", 9),
  previewProduct("product_mayo_scissors_super_cut", "mayo-scissors-super-cut", "Mayo Scissors", "05-0401", "Super Cut", "3", 10),
  previewProduct("product_mayo_scissors_tc", "mayo-scissors-tc", "Mayo Scissors", "06-0401", "Tungsten Carbide", "3", 11),
  previewProduct("product_metzenbaum_scissors_regular", "metzenbaum-scissors-regular", "Metzenbaum Scissors", "04-1901", "Regular", "3", 12),
  previewProduct("product_metzenbaum_scissors_super_cut", "metzenbaum-scissors-super-cut", "Metzenbaum Scissors", "05-1901", "Super Cut", "3", 13),
  previewProduct("product_metzenbaum_scissors_tc", "metzenbaum-scissors-tc", "Metzenbaum Scissors", "06-1901", "Tungsten Carbide", "3", 14)
] as const satisfies readonly CatalogueProductRecord[];
