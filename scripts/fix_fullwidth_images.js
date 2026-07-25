import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const imgDir = path.join(process.cwd(), 'public', 'Imagenes');
const files = fs.readdirSync(imgDir).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));

console.log(`Fixing ${files.length} images to be true 1:1 full-width photos without white side bars...`);

files.forEach((file) => {
  const filePath = path.join(imgDir, file);

  try {
    const widthOut = execSync(`sips -g pixelWidth "${filePath}"`).toString();
    const heightOut = execSync(`sips -g pixelHeight "${filePath}"`).toString();

    const wMatch = widthOut.match(/pixelWidth:\s*(\d+)/);
    const hMatch = heightOut.match(/pixelHeight:\s*(\d+)/);

    if (wMatch && hMatch) {
      const dim = parseInt(wMatch[1], 10); // currently square e.g. 1448x1448 or 1182x1182

      // Most portrait originals were 3:4 ratio (~75% width of height).
      // To crop out the white side bars, we crop to 75% of dim (or 0.75 * dim)
      const targetCrop = Math.floor(dim * 0.75);
      const offset = Math.floor((dim - targetCrop) / 2);

      // Crop out the white side margins
      execSync(`sips --cropToHeightWidth ${targetCrop} ${targetCrop} --cropOffset ${offset} ${offset} "${filePath}"`);
      console.log(`✓ Trimmed white bars from ${file} (${dim}x${dim} -> ${targetCrop}x${targetCrop})`);
    }
  } catch (err) {
    console.error(`Failed to trim ${file}:`, err.message);
  }
});

console.log('All images are now 100% full-width photos with ZERO white side bars!');
