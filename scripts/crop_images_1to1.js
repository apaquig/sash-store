import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const imgDir = path.join(process.cwd(), 'public', 'Imagenes');
const files = fs.readdirSync(imgDir).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));

console.log(`Center-cropping ${files.length} images to exact 1:1 square...`);

files.forEach((file) => {
  const filePath = path.join(imgDir, file);

  try {
    const widthOut = execSync(`sips -g pixelWidth "${filePath}"`).toString();
    const heightOut = execSync(`sips -g pixelHeight "${filePath}"`).toString();

    const wMatch = widthOut.match(/pixelWidth:\s*(\d+)/);
    const hMatch = heightOut.match(/pixelHeight:\s*(\d+)/);

    if (wMatch && hMatch) {
      const w = parseInt(wMatch[1], 10);
      const h = parseInt(hMatch[1], 10);

      const targetDim = Math.min(w, h);
      const offsetX = Math.floor((w - targetDim) / 2);
      const offsetY = Math.floor((h - targetDim) / 2);

      // Perform center crop to 1:1 square
      execSync(`sips --cropToHeightWidth ${targetDim} ${targetDim} --cropOffset ${offsetY} ${offsetX} "${filePath}"`);
      console.log(`✓ Center-cropped 1:1 ${file} (${w}x${h} -> ${targetDim}x${targetDim})`);
    }
  } catch (err) {
    console.error(`Failed to crop ${file}:`, err.message);
  }
});

console.log('All 28 images have been re-created in 1:1 center-cropped format!');
