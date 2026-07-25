import fs from 'fs';
import path from 'path';

const imgDir = path.join(process.cwd(), 'public', 'Imagenes');
const productsPath = path.join(process.cwd(), 'src', 'data', 'products.json');

const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

const usedImageFilenames = new Set();

productsData.categories.forEach((cat) => {
  cat.products.forEach((prod) => {
    if (prod.imagePrimary) {
      const primaryName = path.basename(prod.imagePrimary);
      usedImageFilenames.add(primaryName);
    }
    if (prod.imageSecondary) {
      const secondaryName = path.basename(prod.imageSecondary);
      usedImageFilenames.add(secondaryName);
    }
  });
});

console.log(`Found ${usedImageFilenames.size} actively used image files in products.json:`);
Array.from(usedImageFilenames).sort().forEach(name => console.log(`  - ${name}`));

const allFiles = fs.readdirSync(imgDir);
let deletedCount = 0;

allFiles.forEach((file) => {
  if (file.startsWith('.')) return; // Skip hidden files like .DS_Store

  if (!usedImageFilenames.has(file)) {
    const filePath = path.join(imgDir, file);
    fs.unlinkSync(filePath);
    deletedCount++;
    console.log(`✓ Deleted unused image: ${file}`);
  }
});

console.log(`\nCleanup complete! Deleted ${deletedCount} unused images. ${usedImageFilenames.size} active images remain in public/Imagenes/.`);
