import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const imgDir = path.join(process.cwd(), 'public', 'Imagenes');
if (!fs.existsSync(imgDir)) {
  console.log(`Directory ${imgDir} does not exist!`);
  process.exit(1);
}

const files = fs.readdirSync(imgDir).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));
console.log(`Found ${files.length} images to optimize in public/Imagenes...`);

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
      
      // If width or height is greater than 600, resample it
      if (w > 600 || h > 600) {
        execSync(`sips --resampleHeightWidthMax 600 "${filePath}"`);
        console.log(`✓ Optimized ${file} (${w}x${h} -> 600 max dimension)`);
      }
    }
  } catch (err) {
    console.error(`Failed to optimize ${file}:`, err.message);
  }
});

console.log('All images have been successfully optimized to web-friendly sizes!');
