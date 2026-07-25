import fs from 'fs';
import path from 'path';

const productsPath = path.join(process.cwd(), 'src', 'data', 'products.json');
let content = fs.readFileSync(productsPath, 'utf-8');

// Replace any remaining Spanish " & " in products.json
const productsData = JSON.parse(content);

productsData.categories.forEach((cat) => {
  if (cat.name && cat.name.es) {
    cat.name.es = cat.name.es.replace(/\s*&\s*/g, ' y ');
  }
  cat.products.forEach((prod) => {
    if (prod.name && prod.name.es) {
      prod.name.es = prod.name.es.replace(/\s*&\s*/g, ' y ');
    }
    if (prod.imageAlt && prod.imageAlt.primary && prod.imageAlt.primary.es) {
      prod.imageAlt.primary.es = prod.imageAlt.primary.es.replace(/\s*&\s*/g, ' y ');
    }
    if (prod.imageAlt && prod.imageAlt.secondary && prod.imageAlt.secondary.es) {
      prod.imageAlt.secondary.es = prod.imageAlt.secondary.es.replace(/\s*&\s*/g, ' y ');
    }
    if (prod.recommendedFor && prod.recommendedFor.es) {
      prod.recommendedFor.es = prod.recommendedFor.es.replace(/office equipment & supplies/g, 'oficina y papelería');
    }
  });
});

fs.writeFileSync(productsPath, JSON.stringify(productsData, null, 2));
console.log('Successfully updated all Spanish ampersands to "y" in src/data/products.json');

// Fix privacidad.astro
const privPath = path.join(process.cwd(), 'src', 'pages', 'es', 'privacidad.astro');
if (fs.existsSync(privPath)) {
  let privContent = fs.readFileSync(privPath, 'utf-8');
  privContent = privContent.replace(/Privacidad & Seguridad/g, 'Privacidad y Seguridad');
  fs.writeFileSync(privPath, privContent);
  console.log('Successfully updated privacidad.astro');
}
