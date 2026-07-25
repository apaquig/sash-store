import fs from 'fs';
import path from 'path';

const productsPath = path.join(process.cwd(), 'src', 'data', 'products.json');
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

productsData.categories.forEach((cat) => {
  if (cat.name && cat.name.es) {
    cat.name.es = cat.name.es
      .replace(/&/g, 'y')
      .replace(/\s+/g, ' ')
      .trim();
  }
  if (cat.seo && cat.seo.title && cat.seo.title.es) {
    cat.seo.title.es = cat.seo.title.es.replace(/&/g, 'y');
  }
  if (cat.seo && cat.seo.description && cat.seo.description.es) {
    cat.seo.description.es = cat.seo.description.es.replace(/&/g, 'y');
  }
  if (cat.description && cat.description.es) {
    cat.description.es = cat.description.es.replace(/&/g, 'y');
  }
});

fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));
console.log('Successfully updated all Spanish category names to use "y" instead of "&"');
