import fs from 'fs';
import path from 'path';

const srcDataPath = path.join(process.cwd(), 'src', 'data', 'products.json');
const currentData = JSON.parse(fs.readFileSync(srcDataPath, 'utf-8'));

// Flatten all products from existing categories
const allProducts = [];
currentData.categories.forEach((cat) => {
  cat.products.forEach((prod) => {
    allProducts.push(prod);
  });
});

const categoryMap = new Map();

allProducts.forEach((prod) => {
  let catId = prod.categoryId;

  // Merge "maquina-abdominal" and "fortalecedores-de-agarre" into "fitness"
  if (catId === 'maquina-abdominal' || catId === 'fortalecedores-de-agarre') {
    catId = 'fitness';
  }

  prod.categoryId = catId;

  if (!categoryMap.has(catId)) {
    categoryMap.set(catId, []);
  }

  categoryMap.get(catId).push(prod);
});

const categoryMetadata = {
  "fitness": {
    slug: { es: "fitness", en: "fitness" },
    name: { es: "Fitness", en: "Fitness" },
    description: {
      es: "Selección recomendada de equipo fitness, caminadoras, trampolines y fortalecedores para EE.UU.",
      en: "Recommended selection of fitness equipment, rebounders, and workout gear for US shoppers."
    },
    seo: {
      title: { es: "Fitness | Sasha Store", en: "Fitness | Sasha Store" },
      description: { es: "Explora productos de fitness recomendados con compra directa en Amazon.com.", en: "Explore recommended fitness products with direct links to Amazon.com." }
    }
  },
  "belleza-y-cuidado-personal": {
    slug: { es: "belleza-y-cuidado-personal", en: "beauty-and-personal-care" },
    name: { es: "Belleza & Cuidado Personal", en: "Beauty & Personal Care" },
    description: {
      es: "Selección de mascarillas, parches de colágeno y cuidado de la piel recomendados en EE.UU.",
      en: "Selection of masks, collagen patches, and skincare products for US shoppers."
    },
    seo: {
      title: { es: "Belleza & Cuidado Personal | Sasha Store", en: "Beauty & Personal Care | Sasha Store" },
      description: { es: "Productos de belleza y cuidado personal en Amazon.com.", en: "Beauty and personal care products on Amazon.com." }
    }
  },
  "salud-y-hogar": {
    slug: { es: "salud-y-hogar", en: "health-and-household" },
    name: { es: "Salud & Hogar", en: "Health & Household" },
    description: {
      es: "Dispositivos de salud, hogar inteligente y accesorios de cocina.",
      en: "Health monitors, smart home tech, and home essentials."
    },
    seo: {
      title: { es: "Salud & Hogar | Sasha Store", en: "Health & Household | Sasha Store" },
      description: { es: "Dispositivos de salud y tecnología para el hogar en Amazon.com.", en: "Health and household products on Amazon.com." }
    }
  },
  "office-equipment-supplies": {
    slug: { es: "office-equipment-supplies", en: "office-equipment-supplies" },
    name: { es: "Oficina & Papelería", en: "Office Equipment & Supplies" },
    description: {
      es: "Artículos y suministros esenciales para tu oficina y escritorio.",
      en: "Essential office supplies and desk organization tools."
    },
    seo: {
      title: { es: "Oficina & Papelería | Sasha Store", en: "Office Equipment & Supplies | Sasha Store" },
      description: { es: "Artículos de oficina y papelería recomendados en Amazon.com.", en: "Office equipment and supplies on Amazon.com." }
    }
  }
};

const newCategoriesArray = [];

for (const [catId, prods] of categoryMap.entries()) {
  const meta = categoryMetadata[catId] || {
    slug: { es: catId, en: catId },
    name: { es: catId, en: catId },
    description: { es: `Productos de ${catId}`, en: `${catId} products` },
    seo: { title: { es: `${catId} | Sasha Store`, en: `${catId} | Sasha Store` }, description: { es: catId, en: catId } }
  };

  newCategoriesArray.push({
    id: catId,
    slug: meta.slug,
    name: meta.name,
    description: meta.description,
    seo: meta.seo,
    products: prods
  });
}

const finalData = { categories: newCategoriesArray };
fs.writeFileSync(srcDataPath, JSON.stringify(finalData, null, 2));

console.log(`Successfully merged categories into 4 clean categories in src/data/products.json!`);
