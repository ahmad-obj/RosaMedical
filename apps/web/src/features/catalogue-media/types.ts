export type CatalogueMediaMatchGrade =
  | "exact"
  | "strong-match"
  | "acceptable-similar";
export type CatalogueMediaRightsMode = "preferred-safe" | "supplier-fallback";
export type CatalogueMediaBackground = "transparent" | "clean-white";
export type CatalogueMediaReviewStatus =
  | "candidate"
  | "approved"
  | "needs-replacement";

export interface CatalogueMediaAsset {
  id: string;
  familySlug: "scissors";
  configurationKey: string;
  avifPath: string;
  webpPath: string;
  sourcePageUrl: string;
  originalImageUrl?: string;
  matchGrade: CatalogueMediaMatchGrade;
  rightsMode: CatalogueMediaRightsMode;
  background: CatalogueMediaBackground;
  processingNotes: string;
  orientationNotes: string;
  reuseScope: string;
  reviewStatus: CatalogueMediaReviewStatus;
}
