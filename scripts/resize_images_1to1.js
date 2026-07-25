import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const imgDir = path.join(process.cwd(), 'public', 'Imagenes');
const files = fs.readdirSync(imgDir).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));

console.log(`Found ${files.length} images to resize to 1:1 format...`);

files.forEach((file) => {
  const filePath = path.join(imgDir, file);

  try {
    // Get current dimensions using sips
    const widthOut = execSync(`sips -g pixelWidth "${filePath}"`).toString();
    const heightOut = execSync(`sips -g pixelHeight "${filePath}"`).toString();

    const wMatch = widthOut.match(/pixelWidth:\s*(\d+)/);
    const hMatch = heightOut.match(/pixelHeight:\s*(\d+)/);

    if (wMatch && hMatch) {
      const w = parseInt(wMatch[1], 10);
      const h = parseInt(hMatch[1], 10);
      const maxDim = Math.max(w, h);

      // Pad to maxDim x maxDim with white background
      execSync(`sips --padToHeightWidth ${maxDim} ${maxDim} --padColor FFFFFF "${filePath}"`);
      console.log(`✓ Resized ${file} (${w}x${h} -> ${maxDim}x${maxDim})`);
    }
  } catch (err) {
    console.error(`Failed to resize ${file}:`, err.message);
  }
});

console.log('All images have been successfully resized to 1:1 square format!');
