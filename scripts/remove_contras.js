import fs from 'fs';
import path from 'path';

const productsPath = path.join(process.cwd(), 'src', 'data', 'products.json');
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

productsData.categories.forEach((cat) => {
  cat.products.forEach((prod) => {
    delete prod.considerations;
    if (prod.contras) delete prod.contras;
  });
});

fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));
console.log('Successfully removed considerations/contras from src/data/products.json');
