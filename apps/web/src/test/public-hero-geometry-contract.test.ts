import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const readSource = (relativePath: string) =>
  readFileSync(resolve(process.cwd(), relativePath), "utf8");

describe("shared public hero geometry", () => {
  it("keeps the Home-approved dimensions in the shared hero stylesheet", () => {
    const css = readSource("src/styles/public-hero.css");

    expect(css).toContain("min-height: clamp(23.5rem, 44vw, 31rem)");
    expect(css).toContain("height: min(57svh, 31rem)");
    expect(css).toContain("min-height: 22.5rem");
    expect(css).toContain("height: min(55svh, 27rem)");
    expect(css).toContain("min-height: 31rem");
    expect(css).toContain("height: min(71svh, 35rem)");
  });

  it("does not require Home-only hero height overrides", () => {
    const homeCss = readSource("src/styles/home-client-redesign.css");
    const component = readSource("src/features/public-hero/public-hero-carousel.tsx");

    expect(homeCss).not.toMatch(/\.public-page--home\s+\.home-hero\.home-hero-carousel\s*\{[^}]*height:/s);
    expect(homeCss).not.toMatch(/\.public-page--home\s+\.home-hero\.home-hero-carousel\s*\{[^}]*min-height:/s);
    expect(component).toContain('className="public-hero public-hero-carousel');
  });
});
