export const REQUIRED_CINEMATIC_SLOTS = [
  "homepage-hero",
  "homepage-procurement",
  "homepage-catalogue-knives",
  "homepage-catalogue-scissors",
  "homepage-catalogue-punches",
  "homepage-catalogue-chisels",
  "homepage-catalogue-cutters",
  "about-hero",
  "about-procurement"
] as const;

export type CinematicMediaSlot = (typeof REQUIRED_CINEMATIC_SLOTS)[number];

export interface CinematicMediaAsset {
  slot: CinematicMediaSlot;
  src: string;
  alt: string;
  focalPoint: string;
  sizes: string;
  sourceRecord: string;
  rightsStatus: "client-confirmation-required";
}

const CLIENT_CONFIRMATION_REQUIRED = "client-confirmation-required" as const;

export const CINEMATIC_MEDIA: Record<CinematicMediaSlot, CinematicMediaAsset> = {
  "homepage-hero": {
    slot: "homepage-hero",
    src: "/media/cinematic/homepage-hero.webp",
    alt: "Editorial composition of surgical instruments against a dark blue-black background",
    focalPoint: "78% 50%",
    sizes: "(max-width: 768px) 100vw, 58vw",
    sourceRecord:
      "Knives Catalog(1).pdf; Scissors Catalog(1).pdf; Punches Catalog(1).pdf; Chisels Catalog(1).pdf; Cutters Catalog(1).pdf",
    rightsStatus: CLIENT_CONFIRMATION_REQUIRED
  },
  "homepage-procurement": {
    slot: "homepage-procurement",
    src: "/media/cinematic/homepage-procurement.webp",
    alt: "Quotation review sheet arranged with a scalpel handle, Mayo scissors and bone cutter",
    focalPoint: "52% 50%",
    sizes: "(max-width: 768px) 100vw, 48vw",
    sourceRecord:
      "Knives Catalog(1).pdf; Scissors Catalog(1).pdf; Cutters Catalog(1).pdf",
    rightsStatus: CLIENT_CONFIRMATION_REQUIRED
  },
  "homepage-catalogue-knives": {
    slot: "homepage-catalogue-knives",
    src: "/media/catalogue-covers/knives.webp",
    alt: "Knives catalogue cover featuring a scalpel handle",
    focalPoint: "50% 50%",
    sizes: "(max-width: 768px) 78vw, 18vw",
    sourceRecord: "Knives Catalog(1).pdf",
    rightsStatus: CLIENT_CONFIRMATION_REQUIRED
  },
  "homepage-catalogue-scissors": {
    slot: "homepage-catalogue-scissors",
    src: "/media/catalogue-covers/scissors.webp",
    alt: "Scissors catalogue cover featuring Mayo scissors",
    focalPoint: "50% 50%",
    sizes: "(max-width: 768px) 78vw, 18vw",
    sourceRecord: "Scissors Catalog(1).pdf",
    rightsStatus: CLIENT_CONFIRMATION_REQUIRED
  },
  "homepage-catalogue-punches": {
    slot: "homepage-catalogue-punches",
    src: "/media/catalogue-covers/punches.webp",
    alt: "Punches catalogue cover featuring a Yeoman punch",
    focalPoint: "50% 50%",
    sizes: "(max-width: 768px) 78vw, 18vw",
    sourceRecord: "Punches Catalog(1).pdf",
    rightsStatus: CLIENT_CONFIRMATION_REQUIRED
  },
  "homepage-catalogue-chisels": {
    slot: "homepage-catalogue-chisels",
    src: "/media/catalogue-covers/chisels.webp",
    alt: "Chisels catalogue cover featuring an osteotome",
    focalPoint: "50% 50%",
    sizes: "(max-width: 768px) 78vw, 18vw",
    sourceRecord: "Chisels Catalog(1).pdf",
    rightsStatus: CLIENT_CONFIRMATION_REQUIRED
  },
  "homepage-catalogue-cutters": {
    slot: "homepage-catalogue-cutters",
    src: "/media/catalogue-covers/cutters.webp",
    alt: "Cutters catalogue cover featuring a Liston bone cutter",
    focalPoint: "50% 50%",
    sizes: "(max-width: 768px) 78vw, 18vw",
    sourceRecord: "Cutters Catalog(1).pdf",
    rightsStatus: CLIENT_CONFIRMATION_REQUIRED
  },
  "about-hero": {
    slot: "about-hero",
    src: "/media/cinematic/about-hero.webp",
    alt: "Chisel and bone cutter presented against a dark editorial background",
    focalPoint: "58% 44%",
    sizes: "(max-width: 768px) 100vw, 42vw",
    sourceRecord: "Chisels Catalog(1).pdf; Cutters Catalog(1).pdf",
    rightsStatus: CLIENT_CONFIRMATION_REQUIRED
  },
  "about-procurement": {
    slot: "about-procurement",
    src: "/media/cinematic/about-procurement.webp",
    alt: "Scissors and chisel arranged beside a structured inquiry sheet",
    focalPoint: "56% 50%",
    sizes: "(max-width: 768px) 100vw, 52vw",
    sourceRecord: "Scissors Catalog(1).pdf; Chisels Catalog(1).pdf",
    rightsStatus: CLIENT_CONFIRMATION_REQUIRED
  }
};

export function getCinematicMedia(slot: CinematicMediaSlot): CinematicMediaAsset {
  return CINEMATIC_MEDIA[slot];
}
