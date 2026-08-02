export type ScissorsFinish = "Regular" | "Super Cut" | "Tungsten Carbide";
export type ScissorsDirection = "Straight" | "Curved";
export type ScissorsPointStyle =
  | "Sharp"
  | "Blunt"
  | "Sharp/Sharp"
  | "Sharp/Blunt"
  | "Blunt/Blunt";

export interface ScissorsCodeOption {
  code: string;
  size: string;
}

export interface ScissorsConfiguration {
  id: string;
  slug: string;
  familyKey: "iris" | "stevens" | "operating" | "mayo" | "metzenbaum";
  name: string;
  finish: ScissorsFinish;
  direction: ScissorsDirection;
  pointStyle: ScissorsPointStyle;
  cataloguePage: "1" | "2" | "3";
  codeOptions: readonly ScissorsCodeOption[];
  mediaAssetId: string;
}

const FINISHES = [
  { finish: "Regular", prefix: "04" },
  { finish: "Super Cut", prefix: "05" },
  { finish: "Tungsten Carbide", prefix: "06" }
] as const;

const DIRECTIONS = ["Straight", "Curved"] as const;

const IRIS = {
  Straight: [
    ["0800", "9.5 cm"],
    ["0802", "11.5 cm"]
  ],
  Curved: [
    ["0810", "9.5 cm"],
    ["0812", "11.5 cm"]
  ]
} as const;

const STEVENS = {
  Straight: [["0901", "10.5 cm"]],
  Curved: [["0911", "10.5 cm"]]
} as const;

const MAYO = {
  Straight: [
    ["0401", "14.5 cm"],
    ["0402", "17 cm"],
    ["0403", "20 cm"],
    ["0404", "23 cm"]
  ],
  Curved: [
    ["0411", "14.5 cm"],
    ["0412", "17 cm"],
    ["0413", "20 cm"],
    ["0414", "23 cm"]
  ]
} as const;

const METZENBAUM = {
  Straight: [
    ["1901", "11 cm"],
    ["1902", "14 cm"],
    ["1909", "16 cm"],
    ["1903", "18 cm"],
    ["1904", "20 cm"],
    ["1905", "23 cm"]
  ],
  Curved: [
    ["1911", "11 cm"],
    ["1912", "14 cm"],
    ["1919", "16 cm"],
    ["1913", "18 cm"],
    ["1914", "20 cm"],
    ["1915", "23 cm"]
  ]
} as const;

const OPERATING = {
  "Sharp/Sharp": {
    Straight: [
      ["0121", "12 cm"],
      ["0101", "14 cm"],
      ["0102", "17 cm"]
    ],
    Curved: [
      ["0131", "12 cm"],
      ["0111", "14 cm"],
      ["0112", "17 cm"]
    ]
  },
  "Sharp/Blunt": {
    Straight: [
      ["0221", "12 cm"],
      ["0201", "14 cm"],
      ["0202", "17 cm"]
    ],
    Curved: [
      ["0231", "12 cm"],
      ["0211", "14 cm"],
      ["0212", "17 cm"]
    ]
  },
  "Blunt/Blunt": {
    Straight: [
      ["0321", "12 cm"],
      ["0301", "14 cm"],
      ["0302", "17 cm"]
    ],
    Curved: [
      ["0331", "12 cm"],
      ["0311", "14 cm"],
      ["0312", "17 cm"]
    ]
  }
} as const;

type OperatingPointStyle = keyof typeof OPERATING;

function kebab(value: string): string {
  return value
    .toLowerCase()
    .replaceAll("/", "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function codeOptions(
  prefix: string,
  rows: readonly (readonly [string, string])[]
): readonly ScissorsCodeOption[] {
  return rows.map(([suffix, size]) => ({ code: `${prefix}-${suffix}`, size }));
}

function createSimpleFamily(
  familyKey: "iris" | "stevens" | "mayo" | "metzenbaum",
  name: string,
  pointStyle: "Sharp" | "Blunt",
  cataloguePage: "1" | "3",
  matrix: Record<ScissorsDirection, readonly (readonly [string, string])[]>
): readonly ScissorsConfiguration[] {
  return FINISHES.flatMap(({ finish, prefix }) =>
    DIRECTIONS.map((direction) => {
      const key = `scissors-${familyKey}-${kebab(finish)}-${kebab(direction)}`;
      const slug =
        familyKey === "mayo" && finish === "Regular" && direction === "Straight"
          ? "mayo-scissors"
          : `${familyKey}-scissors-${kebab(finish)}-${kebab(direction)}`;

      return {
        id: `product-${key}`,
        slug,
        familyKey,
        name,
        finish,
        direction,
        pointStyle,
        cataloguePage,
        codeOptions: codeOptions(prefix, matrix[direction]),
        mediaAssetId: key
      } satisfies ScissorsConfiguration;
    })
  );
}

const OPERATING_CONFIGURATIONS = FINISHES.flatMap(({ finish, prefix }) =>
  (Object.keys(OPERATING) as OperatingPointStyle[]).flatMap((pointStyle) =>
    DIRECTIONS.map((direction) => {
      const key = `scissors-operating-${kebab(finish)}-${kebab(direction)}-${kebab(pointStyle)}`;

      return {
        id: `product-${key}`,
        slug: `operating-scissors-${kebab(finish)}-${kebab(direction)}-${kebab(pointStyle)}`,
        familyKey: "operating",
        name: "Operating Scissors",
        finish,
        direction,
        pointStyle,
        cataloguePage: "2",
        codeOptions: codeOptions(prefix, OPERATING[pointStyle][direction]),
        mediaAssetId: key
      } satisfies ScissorsConfiguration;
    })
  )
);

export const SCISSORS_BATCH_01_CONFIGURATIONS = [
  ...createSimpleFamily("iris", "Iris Scissors", "Sharp", "1", IRIS),
  ...createSimpleFamily("stevens", "Stevens Scissors", "Sharp", "1", STEVENS),
  ...OPERATING_CONFIGURATIONS,
  ...createSimpleFamily("mayo", "Mayo Scissors", "Blunt", "3", MAYO),
  ...createSimpleFamily("metzenbaum", "Metzenbaum Scissors", "Blunt", "3", METZENBAUM)
] as const satisfies readonly ScissorsConfiguration[];
