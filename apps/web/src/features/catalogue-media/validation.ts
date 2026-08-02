import type { CatalogueMediaAsset } from "./types";

const LOCAL_PREFIX = "/media/catalogue-preview/scissors/";

function assertNonEmpty(value: string, field: string, id: string): void {
  if (!value.trim()) {
    throw new Error(`Catalogue media ${id} has empty ${field}`);
  }
}

function assertRuntimePath(
  value: string,
  extension: ".avif" | ".webp",
  field: string,
  id: string
): void {
  assertNonEmpty(value, field, id);

  if (/^https?:\/\//i.test(value)) {
    throw new Error(`Catalogue media ${id} uses remote runtime path in ${field}`);
  }
  if (!value.startsWith(LOCAL_PREFIX)) {
    throw new Error(
      `Catalogue media ${id} leaves the scissors media directory in ${field}`
    );
  }
  if (!value.endsWith(extension)) {
    throw new Error(`Catalogue media ${id} has unsupported ${field} extension`);
  }
  if (value.includes("..")) {
    throw new Error(`Catalogue media ${id} contains path traversal in ${field}`);
  }
}

function assertSourceUrl(value: string, field: string, id: string): void {
  assertNonEmpty(value, field, id);

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`Catalogue media ${id} has invalid ${field}`);
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error(`Catalogue media ${id} has unsupported ${field} protocol`);
  }
}

export function assertCatalogueMediaManifest(
  assets: readonly CatalogueMediaAsset[],
  expectedAssetIds: readonly string[]
): void {
  const ids = new Set<string>();

  for (const asset of assets) {
    assertNonEmpty(asset.id, "id", "<unknown>");

    if (ids.has(asset.id)) {
      throw new Error(`Duplicate catalogue media id: ${asset.id}`);
    }
    ids.add(asset.id);

    if (asset.configurationKey !== asset.id) {
      throw new Error(
        `Catalogue media ${asset.id} configurationKey must equal its media id`
      );
    }
    if (asset.familySlug !== "scissors") {
      throw new Error(`Catalogue media ${asset.id} has unsupported familySlug`);
    }

    assertRuntimePath(asset.avifPath, ".avif", "avifPath", asset.id);
    assertRuntimePath(asset.webpPath, ".webp", "webpPath", asset.id);
    assertSourceUrl(asset.sourcePageUrl, "sourcePageUrl", asset.id);
    if (asset.originalImageUrl) {
      assertSourceUrl(asset.originalImageUrl, "originalImageUrl", asset.id);
    }
    assertNonEmpty(asset.processingNotes, "processingNotes", asset.id);
    assertNonEmpty(asset.orientationNotes, "orientationNotes", asset.id);
    assertNonEmpty(asset.reuseScope, "reuseScope", asset.id);
  }

  const expected = new Set(expectedAssetIds);
  if (expected.size !== expectedAssetIds.length) {
    throw new Error("Expected catalogue media ids contain duplicates");
  }

  for (const expectedId of expected) {
    if (!ids.has(expectedId)) {
      throw new Error(`Missing expected catalogue media id: ${expectedId}`);
    }
  }

  for (const id of ids) {
    if (!expected.has(id)) {
      throw new Error(`Unexpected catalogue media id: ${id}`);
    }
  }
}
