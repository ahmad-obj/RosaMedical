import { mkdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

const ROOT = resolve(process.cwd());
const PUBLIC = resolve(ROOT, "public");
const STAGING = resolve(ROOT, "../../.tmp/cinematic-media");

const PRODUCT_MEDIA = {
  knives: resolve(PUBLIC, "media/catalogue-preview/knives/knives-number-3.webp"),
  scissors: resolve(PUBLIC, "media/catalogue-preview/scissors/scissors-mayo-regular-straight.webp"),
  punches: resolve(PUBLIC, "media/catalogue-preview/punches/punches-yeoman-21-10.webp"),
  chisels: resolve(PUBLIC, "media/catalogue-preview/chisels/chisels-osteotomes-13-5cm.webp"),
  cutters: resolve(PUBLIC, "media/catalogue-preview/cutters/cutters-liston-straight.webp")
};

const FAMILIES = [
  { key: "knives", title: "KNIVES", accent: "#f58220" },
  { key: "scissors", title: "SCISSORS", accent: "#ed1c24" },
  { key: "punches", title: "PUNCHES", accent: "#147a68" },
  { key: "chisels", title: "CHISELS", accent: "#293a99" },
  { key: "cutters", title: "CUTTERS", accent: "#185ca7" }
];

function svg(width, height, body) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${body}</svg>`
  );
}

async function ensureParent(path) {
  await mkdir(dirname(path), { recursive: true });
}

async function instrument(path, width, height, rotation = 0) {
  const resized = await sharp(path)
    .resize({
      width,
      height,
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .ensureAlpha()
    .png()
    .toBuffer();

  return rotation === 0
    ? resized
    : sharp(resized)
        .rotate(rotation, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();
}

async function writeWebp(canvas, layers, output, quality = 84) {
  await ensureParent(output);
  await sharp(canvas)
    .composite(layers)
    .webp({ quality, effort: 6 })
    .toFile(output);
}

async function buildHomepageHero() {
  const width = 1600;
  const height = 900;
  const [punch, scissors, chisel, knife, cutter] = await Promise.all([
    instrument(PRODUCT_MEDIA.punches, 780, 360, -4),
    instrument(PRODUCT_MEDIA.scissors, 610, 610, -17),
    instrument(PRODUCT_MEDIA.chisels, 440, 600, 8),
    instrument(PRODUCT_MEDIA.knives, 320, 460, 18),
    instrument(PRODUCT_MEDIA.cutters, 440, 440, 10)
  ]);
  const background = svg(width, height, `
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#070808"/>
        <stop offset=".44" stop-color="#0b1112"/>
        <stop offset="1" stop-color="#173136"/>
      </linearGradient>
      <radialGradient id="light" cx="72%" cy="44%" r="56%">
        <stop offset="0" stop-color="#6f8f91" stop-opacity=".25"/>
        <stop offset="1" stop-color="#122326" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1600" height="900" fill="url(#bg)"/>
    <rect width="1600" height="900" fill="url(#light)"/>
    <circle cx="1320" cy="170" r="220" fill="none" stroke="#b71924" stroke-width="2" opacity=".22"/>
    <circle cx="1320" cy="170" r="156" fill="none" stroke="#d7e0de" stroke-width="1" opacity=".12"/>
    <line x1="1516" y1="88" x2="1516" y2="812" stroke="#b71924" stroke-width="5"/>
    <line x1="850" y1="760" x2="1450" y2="760" stroke="#d7e0de" stroke-width="2" opacity=".18"/>
  `);

  await writeWebp(
    { create: { width, height, channels: 4, background: "#080a0a" } },
    [
      { input: background },
      { input: punch, left: 710, top: 245, blend: "over" },
      { input: knife, left: 1010, top: 80, blend: "over" },
      { input: chisel, left: 1230, top: 60, blend: "over" },
      { input: scissors, left: 880, top: 220, blend: "over" },
      { input: cutter, left: 1190, top: 400, blend: "over" }
    ],
    resolve(PUBLIC, "media/cinematic/homepage-hero.webp"),
    87
  );
}

async function buildCatalogueCover({ key, title, accent }) {
  const width = 800;
  const height = 1000;
  const product = await instrument(PRODUCT_MEDIA[key], 470, 510);
  const frame = svg(width, height, `
    <defs>
      <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#fffefa"/>
        <stop offset="1" stop-color="#ececea"/>
      </linearGradient>
      <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#171714" flood-opacity=".16"/>
      </filter>
    </defs>
    <rect width="800" height="1000" fill="#e6e6e3"/>
    <rect x="42" y="34" width="716" height="924" rx="3" fill="url(#paper)" filter="url(#shadow)"/>
    <rect x="42" y="34" width="12" height="924" fill="${accent}"/>
    <rect x="690" y="34" width="5" height="924" fill="${accent}" opacity=".82"/>
    <g fill="${accent}" opacity=".92">
      ${Array.from({ length: 5 }, (_, row) =>
        Array.from({ length: 5 }, (_, col) => `<circle cx="${530 + col * 27}" cy="${100 + row * 23}" r="5.5"/>`).join("")
      ).join("")}
    </g>
    <text x="112" y="168" fill="#161615" font-family="Georgia, serif" font-size="67" font-weight="700" letter-spacing="2">${title}</text>
    <text x="116" y="216" fill="${accent}" font-family="Arial, sans-serif" font-size="17" font-weight="700" letter-spacing="8">ROSA</text>
    <line x1="112" y1="252" x2="638" y2="252" stroke="${accent}" stroke-width="2" opacity=".62"/>
    <rect x="54" y="650" width="636" height="176" fill="#d8d9d9" opacity=".68"/>
    <line x1="112" y1="884" x2="638" y2="884" stroke="${accent}" stroke-width="2" opacity=".7"/>
  `);

  await writeWebp(
    { create: { width, height, channels: 4, background: "#e6e6e3" } },
    [
      { input: frame },
      { input: product, left: 165, top: 315, blend: "over" }
    ],
    resolve(PUBLIC, `media/catalogue-covers/${key}.webp`),
    87
  );
}

async function buildHomepageProcurement() {
  const width = 1200;
  const height = 1450;
  const [scissors, knife, cutter] = await Promise.all([
    instrument(PRODUCT_MEDIA.scissors, 640, 640),
    instrument(PRODUCT_MEDIA.knives, 430, 430),
    instrument(PRODUCT_MEDIA.cutters, 430, 430)
  ]);
  const background = svg(width, height, `
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#fbfaf6"/>
        <stop offset="1" stop-color="#e8e5de"/>
      </linearGradient>
      <filter id="sheet" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="24" stdDeviation="28" flood-color="#171714" flood-opacity=".14"/>
      </filter>
    </defs>
    <rect width="1200" height="1450" fill="url(#bg)"/>
    <circle cx="1000" cy="180" r="290" fill="#b71924" opacity=".08"/>
    <g transform="rotate(-7 610 660)" filter="url(#sheet)">
      <rect x="235" y="180" width="760" height="980" rx="12" fill="#fffefa"/>
      <rect x="235" y="180" width="12" height="980" fill="#b71924"/>
      <text x="320" y="285" fill="#171714" font-family="Georgia, serif" font-size="60" font-weight="700">Quotation review</text>
      <text x="320" y="340" fill="#6d6b66" font-family="Arial, sans-serif" font-size="24" letter-spacing="5">DOCUMENT-LED PROCUREMENT</text>
      ${Array.from({ length: 8 }, (_, index) => `<line x1="320" y1="${440 + index * 82}" x2="890" y2="${440 + index * 82}" stroke="#c8c6bf" stroke-width="3"/>`).join("")}
      ${Array.from({ length: 4 }, (_, index) => `<circle cx="345" cy="${420 + index * 164}" r="14" fill="none" stroke="#b71924" stroke-width="3"/>`).join("")}
    </g>
    <rect x="0" y="1260" width="1200" height="190" fill="#171714" opacity=".94"/>
    <text x="86" y="1360" fill="#fffefa" font-family="Arial, sans-serif" font-size="25" letter-spacing="7">CODES · OPTIONS · QUANTITIES · NOTES</text>
  `);

  await writeWebp(
    { create: { width, height, channels: 4, background: "#f7f5ef" } },
    [
      { input: background },
      { input: scissors, left: 490, top: 600, blend: "over" },
      { input: knife, left: 40, top: 850, blend: "over" },
      { input: cutter, left: 735, top: 870, blend: "over" }
    ],
    resolve(PUBLIC, "media/cinematic/homepage-procurement.webp"),
    86
  );
}

async function buildAboutHero() {
  const width = 1000;
  const height = 1280;
  const [chisel, cutter] = await Promise.all([
    instrument(PRODUCT_MEDIA.chisels, 700, 820, -7),
    instrument(PRODUCT_MEDIA.cutters, 480, 560, 8)
  ]);
  const background = svg(width, height, `
    <defs>
      <radialGradient id="glow" cx="70%" cy="34%" r="70%">
        <stop offset="0" stop-color="#4f4b46"/>
        <stop offset=".55" stop-color="#1c1b1a"/>
        <stop offset="1" stop-color="#090909"/>
      </radialGradient>
    </defs>
    <rect width="1000" height="1280" fill="url(#glow)"/>
    <rect x="68" y="74" width="8" height="1132" fill="#b71924"/>
    <line x1="120" y1="108" x2="830" y2="108" stroke="#f3eee4" stroke-width="2" opacity=".5"/>
    <text x="124" y="1145" fill="#f8f5ee" font-family="Georgia, serif" font-size="55" font-weight="700">Instrument form</text>
    <text x="126" y="1195" fill="#c8c3ba" font-family="Arial, sans-serif" font-size="20" letter-spacing="6">DETAIL · PROPORTION · SELECTION</text>
  `);

  await writeWebp(
    { create: { width, height, channels: 4, background: "#0d0d0d" } },
    [
      { input: background },
      { input: chisel, left: 245, top: 115, blend: "over" },
      { input: cutter, left: 500, top: 545, blend: "over" }
    ],
    resolve(PUBLIC, "media/cinematic/about-hero.webp"),
    87
  );
}

async function buildAboutProcurement() {
  const width = 1500;
  const height = 1050;
  const [scissors, chisel] = await Promise.all([
    instrument(PRODUCT_MEDIA.scissors, 690, 690, -5),
    instrument(PRODUCT_MEDIA.chisels, 470, 720, 4)
  ]);
  const background = svg(width, height, `
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#fdfcf8"/>
        <stop offset="1" stop-color="#dedbd2"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="20" stdDeviation="25" flood-color="#171714" flood-opacity=".16"/>
      </filter>
    </defs>
    <rect width="1500" height="1050" fill="url(#bg)"/>
    <g filter="url(#shadow)">
      <rect x="120" y="125" width="880" height="770" rx="10" fill="#fffefa"/>
      <rect x="120" y="125" width="10" height="770" fill="#b71924"/>
    </g>
    <text x="210" y="235" fill="#171714" font-family="Georgia, serif" font-size="58" font-weight="700">A clearer request</text>
    <text x="212" y="285" fill="#6d6b66" font-family="Arial, sans-serif" font-size="20" letter-spacing="6">PRODUCT DISCOVERY TO FOLLOW-UP</text>
    ${Array.from({ length: 6 }, (_, index) => `<line x1="215" y1="${390 + index * 75}" x2="850" y2="${390 + index * 75}" stroke="#cbc8c0" stroke-width="3"/>`).join("")}
    <rect x="1050" y="0" width="450" height="1050" fill="#171714" opacity=".96"/>
    <circle cx="1280" cy="230" r="205" fill="#b71924" opacity=".22"/>
    <line x1="1120" y1="900" x2="1430" y2="900" stroke="#f4f0e8" stroke-width="2" opacity=".35"/>
  `);

  await writeWebp(
    { create: { width, height, channels: 4, background: "#f5f2eb" } },
    [
      { input: background },
      { input: scissors, left: 600, top: 360, blend: "over" },
      { input: chisel, left: 1040, top: 245, blend: "over" }
    ],
    resolve(PUBLIC, "media/cinematic/about-procurement.webp"),
    86
  );
}

async function main() {
  await Promise.all([
    buildHomepageHero(),
    buildHomepageProcurement(),
    buildAboutHero(),
    buildAboutProcurement(),
    ...FAMILIES.map(buildCatalogueCover)
  ]);
  await rm(STAGING, { recursive: true, force: true });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
