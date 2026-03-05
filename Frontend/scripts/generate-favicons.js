/**
 * Generates favicon and app icon sizes from public/icon.png.
 * Run: npm run favicon
 * Requires: npm install --save-dev sharp to-ico
 */

import sharp from "sharp";
import toIco from "to-ico";
import { writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");
const inputPath = join(publicDir, "icon.png");

const SIZES = [
  { name: "favicon-16x16.png", size: 16 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "favicon-48x48.png", size: 48 },
  { name: "favicon-64x64.png", size: 64 },
  { name: "favicon.png", size: 32 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "icon-192.png", size: 192 },
];

async function generate() {
  if (!existsSync(inputPath)) {
    console.error("Missing public/icon.png. Add your cart icon there and run again.");
    process.exit(1);
  }

  const image = sharp(inputPath);

  for (const { name, size } of SIZES) {
    const outPath = join(publicDir, name);
    await image.clone().resize(size, size).png().toFile(outPath);
    console.log(`Wrote ${name} (${size}x${size})`);
  }

  const favicon32Buffer = await sharp(inputPath).resize(32, 32).png().toBuffer();
  const icoBuffer = await toIco([favicon32Buffer]);
  writeFileSync(join(publicDir, "favicon.ico"), icoBuffer);
  console.log("Wrote favicon.ico (32x32)");
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
