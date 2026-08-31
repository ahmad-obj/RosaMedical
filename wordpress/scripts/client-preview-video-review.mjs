import { mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const require = createRequire(new URL('../../apps/web/package.json', import.meta.url));
const { chromium } = require('@playwright/test');

export function buildReviewTimes(duration) {
  const times = [];
  for (let time = 0; time < duration; time += 1) times.push(time);
  if (times.at(-1) < duration - 0.5) times.push(duration - 0.25);
  return times;
}

async function reviewVideo(rawVideoPath, rawFrameDirectory) {
  const videoPath = path.resolve(rawVideoPath);
  const frameDirectory = path.resolve(rawFrameDirectory);
  await mkdir(frameDirectory, { recursive: true });

  const browser = await chromium.launch({ headless: true, args: ['--allow-file-access-from-files'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(pathToFileURL(videoPath).href, { waitUntil: 'load' });
    const video = page.locator('video').first();
    await video.waitFor({ state: 'visible' });
    await page.waitForFunction(() => {
      const element = document.querySelector('video');
      return element instanceof HTMLVideoElement && Number.isFinite(element.duration) && element.duration > 0;
    });

    const metadata = await video.evaluate((element) => ({
      duration: element.duration,
      width: element.videoWidth,
      height: element.videoHeight,
    }));
    if (metadata.duration < 15 || metadata.duration > 180) {
      throw new Error(`Unexpected walkthrough duration: ${metadata.duration.toFixed(2)} seconds`);
    }
    if (metadata.width !== 1440 || metadata.height !== 900) {
      throw new Error(`Unexpected walkthrough dimensions: ${metadata.width}x${metadata.height}`);
    }

    const seekVideo = async (time) => {
      await video.evaluate((element, seekTime) => new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error(`Timed out seeking to ${seekTime}`)), 5000);
        const done = () => { clearTimeout(timeout); resolve(); };
        element.addEventListener('seeked', done, { once: true });
        element.currentTime = Math.min(seekTime, Math.max(0, element.duration - 0.05));
        if (Math.abs(element.currentTime - seekTime) < 0.01 && element.readyState >= 2) done();
      }), time);
    };

    await seekVideo(1);
    const openingNonWhiteRatio = await video.evaluate((element) => {
      const canvas = document.createElement('canvas');
      canvas.width = 144;
      canvas.height = 90;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      context.drawImage(element, 0, 0, canvas.width, canvas.height);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let nonWhite = 0;
      for (let index = 0; index < pixels.length; index += 4) {
        if (pixels[index] < 245 || pixels[index + 1] < 245 || pixels[index + 2] < 245) nonWhite += 1;
      }
      return nonWhite / (pixels.length / 4);
    });
    if (openingNonWhiteRatio < 0.05) {
      throw new Error(`Walkthrough opening frame is blank (${(openingNonWhiteRatio * 100).toFixed(2)}% non-white pixels)`);
    }

    const times = buildReviewTimes(metadata.duration);

    for (let index = 0; index < times.length; index += 1) {
      await seekVideo(times[index]);
      await video.screenshot({ path: path.join(frameDirectory, `frame-${String(index + 1).padStart(3, '0')}.png`) });
    }

    process.stdout.write(`PASS: video ${metadata.width}x${metadata.height}, ${metadata.duration.toFixed(2)}s, ${times.length} review frames in ${frameDirectory}\n`);
  } finally {
    await browser.close();
  }
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) {
  const [rawVideoPath, rawFrameDirectory] = process.argv.slice(2);
  if (!rawVideoPath || !rawFrameDirectory) {
    throw new Error('Usage: client-preview-video-review.mjs VIDEO FRAME_DIRECTORY');
  }
  await reviewVideo(rawVideoPath, rawFrameDirectory);
}
