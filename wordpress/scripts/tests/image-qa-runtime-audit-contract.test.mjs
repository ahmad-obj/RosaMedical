import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const script = path.join(root, 'scripts/image-qa-runtime-audit.mjs');

assert.ok(fs.existsSync(script), 'image QA runtime audit script must exist');
const source = fs.readFileSync(script, 'utf8');

for (const route of [
  "'en-home', '/'",
  "'en-about', '/about/'",
  "'en-contact', '/contact/'",
  "'en-shop', '/shop/'",
  "'en-quote', '/quote-request/'",
  "'en-product', '/product/rosa-foundation-stevens-scissors-regular/'",
  "'ar-home', '/ar/'",
  "'ar-about', '/ar/about/'",
  "'ar-contact', '/ar/contact/'",
  "'ar-shop', '/ar/shop/'",
  "'ar-quote', '/ar/quote-request/'",
  "'ar-product', '/ar/product/rosa-foundation-stevens-scissors-regular/'",
]) {
  assert.ok(source.includes(route), `missing route contract: ${route}`);
}

for (const viewport of [
  '{ width: 1440, height: 900 }',
  '{ width: 1024, height: 768 }',
  '{ width: 768, height: 1024 }',
  '{ width: 431, height: 932 }',
  '{ width: 390, height: 844 }',
]) {
  assert.ok(source.includes(viewport), `missing viewport contract: ${viewport}`);
}

for (const token of [
  'document.images',
  'backgroundImage',
  'currentSrc',
  'naturalWidth',
  'naturalHeight',
  'objectFit',
  'objectPosition',
  'loading',
  'decoding',
  'fetchPriority',
  'srcset',
  'sizes',
  'getBoundingClientRect',
  'visibleBrokenImages',
  'screenshot',
  'manifest.json',
  'expectedCells = 60',
]) {
  assert.ok(source.includes(token), `missing runtime image evidence token: ${token}`);
}

console.log('PASS: complete runtime image-audit source contract is present');
