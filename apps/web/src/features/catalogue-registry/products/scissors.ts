import type { CatalogueProductRecord } from "../types";

type ReviewMedia = {
  imageUrl: string;
  sourceUrl: string;
  note: string;
};

const REVIEW_MEDIA = {
  iris: {
    imageUrl:
      "https://www.storzeye.com/images/jcogs_img_pro/cache/1435__5_____selected__28de80__326656ea33373650624cc8d2316be5fa29299247.jpg",
    sourceUrl: "https://www.storzeye.com/ent-instruments/scissors/straight-iris-scissors2",
    note: "External reference image for visual review only. Exact Iris family; size and finish may differ."
  },
  stevens: {
    imageUrl:
      "https://www.storzeye.com/images/jcogs_img_pro/cache/11604__1_____selected__28de80__f11dc638a77ffdbb2645ae97579569a870893f10.jpg",
    sourceUrl: "https://www.storzeye.com/ent-instruments/stevens-tenotomy-scissors",
    note: "External reference image for visual review only. Exact Stevens Tenotomy family; size and finish may differ."
  },
  operating: {
    imageUrl:
      "https://cdn.swell.store/sklar-staging_test/6971391a7ebd2f00126c5a99/892636614d81b81df3d90f42459f0517",
    sourceUrl:
      "https://www.sklarcorp.com/p/sklar-extracting-forceps-73/97-266",
    note: "External reference image for visual review only. Exact Operating Scissors family; size and finish may differ."
  },
  mayo: {
    imageUrl:
      "https://wpiinc.com/cdn/shop/files/14216_1_d64c9ab4-9951-438d-a876-8fb85d82807e.jpg?v=1766407091&width=1946",
    sourceUrl: "https://wpiinc.com/products/var-14216-mayo-scissors-supercut",
    note: "External reference image for visual review only. Exact Mayo family; size and finish may differ."
  },
  metzenbaum: {
    imageUrl:
      "https://precisiondentalusa.com/wp-content/uploads/2024/02/Metzenbaum-Scissors-5.522-Super-cut.jpg",
    sourceUrl:
      "https://precisiondentalusa.com/product/metzenbaum-scissors-super-cut/",
    note: "External reference image for visual review only. Exact Metzenbaum family; size and finish may differ."
  }
} as const satisfies Record<string, ReviewMedia>;

const previewProduct = (
  id: string,
  slug: string,
  name: string,
  code: string,
  finish: string,
  page: string,
  media: ReviewMedia
): CatalogueProductRecord => ({
  id,
  familySlug: "scissors",
  slug,
  name,
  code,
  description: `Catalogue-listed ${name} in the ${finish} finish. The displayed photograph is an external family reference for visual review, not an approved Rosa product image.`,
  sizes: [],
  variants: [finish],
  directions: [],
  primaryOption: finish,
  catalogueReference: { family: "Scissors", page },
  mediaLabel: `${name}, ${finish}`,
  mediaPath: media.imageUrl,
  mediaSourceUrl: media.sourceUrl,
  mediaReviewNote: media.note
});

export const SCISSOR_PRODUCTS = [
  previewProduct("product_iris_scissors_regular", "iris-scissors-regular", "Iris Scissors", "04-0800", "Regular", "1", REVIEW_MEDIA.iris),
  previewProduct("product_iris_scissors_super_cut", "iris-scissors-super-cut", "Iris Scissors", "05-0802", "Super Cut", "1", REVIEW_MEDIA.iris),
  previewProduct("product_iris_scissors_tc", "iris-scissors-tc", "Iris Scissors", "06-0802", "Tungsten Carbide", "1", REVIEW_MEDIA.iris),
  previewProduct("product_stevens_scissors_regular", "stevens-tenotomy-scissors-regular", "Stevens Tenotomy Scissors", "04-0901", "Regular", "1", REVIEW_MEDIA.stevens),
  previewProduct("product_stevens_scissors_super_cut", "stevens-tenotomy-scissors-super-cut", "Stevens Tenotomy Scissors", "05-0901", "Super Cut", "1", REVIEW_MEDIA.stevens),
  previewProduct("product_stevens_scissors_tc", "stevens-tenotomy-scissors-tc", "Stevens Tenotomy Scissors", "06-0901", "Tungsten Carbide", "1", REVIEW_MEDIA.stevens),
  previewProduct("product_operating_scissors_regular", "operating-scissors-regular", "Operating Scissors", "04-0101", "Regular", "2", REVIEW_MEDIA.operating),
  previewProduct("product_operating_scissors_super_cut", "operating-scissors-super-cut", "Operating Scissors", "05-0101", "Super Cut", "2", REVIEW_MEDIA.operating),
  previewProduct("product_operating_scissors_tc", "operating-scissors-tc", "Operating Scissors", "06-0101", "Tungsten Carbide", "2", REVIEW_MEDIA.operating),
  previewProduct("product_mayo_scissors_regular", "mayo-scissors", "Mayo Scissors", "04-0401", "Regular", "3", REVIEW_MEDIA.mayo),
  previewProduct("product_mayo_scissors_super_cut", "mayo-scissors-super-cut", "Mayo Scissors", "05-0401", "Super Cut", "3", REVIEW_MEDIA.mayo),
  previewProduct("product_mayo_scissors_tc", "mayo-scissors-tc", "Mayo Scissors", "06-0401", "Tungsten Carbide", "3", REVIEW_MEDIA.mayo),
  previewProduct("product_metzenbaum_scissors_regular", "metzenbaum-scissors-regular", "Metzenbaum Scissors", "04-1901", "Regular", "3", REVIEW_MEDIA.metzenbaum),
  previewProduct("product_metzenbaum_scissors_super_cut", "metzenbaum-scissors-super-cut", "Metzenbaum Scissors", "05-1901", "Super Cut", "3", REVIEW_MEDIA.metzenbaum),
  previewProduct("product_metzenbaum_scissors_tc", "metzenbaum-scissors-tc", "Metzenbaum Scissors", "06-1901", "Tungsten Carbide", "3", REVIEW_MEDIA.metzenbaum)
] as const satisfies readonly CatalogueProductRecord[];
