import fs from 'fs';
import path from 'path';

const srcDataPath = path.join(process.cwd(), 'src', 'data', 'products.json');
const rawData = JSON.parse(fs.readFileSync(srcDataPath, 'utf-8'));

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

const cleanTitles = [
  {
    es: "Mini Trampolín de Fitness BCAN (40/48 Pulgadas)",
    en: "BCAN BT2 Rebounder Mini Fitness Trampoline"
  },
  {
    es: "Báscula Inteligente Bluetooth Etekcity",
    en: "Etekcity Smart Bluetooth Body Scale"
  },
  {
    es: "Máquina Abdominal Plegable MERACH",
    en: "MERACH Foldable Ab Workout Machine"
  },
  {
    es: "Kit Fortalecedor de Agarre FitBeast (5 Piezas)",
    en: "FitBeast Grip Strengthener Kit (5-Pack)"
  },
  {
    es: "Mascarilla de Colágeno Nocturna BIODANCE Bio-Collagen",
    en: "BIODANCE Bio-Collagen Real Deep Mask"
  },
  {
    es: "Pasta Dental Boka sin Flúor (Sabor Ela Mint)",
    en: "Boka Fluoride-Free Ela Mint Toothpaste"
  },
  {
    es: "Parches de Colágeno para Ojos BIODANCE (60 uds)",
    en: "BIODANCE Collagen Peptide Eye Patches (60 ct)"
  },
  {
    es: "Crema Facial Nocturna Renovadora CeraVe",
    en: "CeraVe Skin Renewing Night Cream"
  },
  {
    es: "Monitor EKG Personal KardiaMobile (Aprobado FDA)",
    en: "KardiaMobile Personal EKG Heart Monitor"
  },
  {
    es: "Altavoz Inteligente Amazon Echo Dot con Alexa",
    en: "Amazon Echo Dot Smart Speaker with Alexa"
  },
  {
    es: "Dispensador & Rociador de Aceite TrendPlain (470 ml)",
    en: "TrendPlain Glass Olive Oil Sprayer & Dispenser (16 oz)"
  },
  {
    es: "Grapadora Metálica de Alta Resistencia SwiHauk",
    en: "SwiHauk Heavy Duty Metal Desk Stapler"
  },
  {
    es: "Set de 6 Blocs de Notas Amazon Basics (5x8 in)",
    en: "Amazon Basics Writing Pads 5x8 in (6-Pack)"
  },
  {
    es: "Sello Personalizado Autoentintable ExcelMark",
    en: "ExcelMark Personalized Self-Inking Custom Stamp"
  }
];

const categoryMap = new Map();

rawData.forEach((item, index) => {
  const p = item.producto;
  let rawCat = p.categoria || 'General';

  // Merge categories into 4 clean groups
  if (rawCat === 'Máquina abdominal' || rawCat === 'Fortalecedores de agarre') {
    rawCat = 'Fitness';
  }

  if (!categoryMap.has(rawCat)) {
    categoryMap.set(rawCat, []);
  }

  const cleanNameObj = cleanTitles[index] || { es: p.nombre, en: p.nombre };
  const prodId = `product-${index + 1}`;
  const slugEs = slugify(cleanNameObj.es);
  const slugEn = slugify(cleanNameObj.en);

  const primaryImg = p.imagen_producto ? `/${p.imagen_producto}` : '/src/images/no-image.svg';
  const secondaryImg = p.imagen_modelo ? `/${p.imagen_modelo}` : primaryImg;

  const productObj = {
    id: prodId,
    brand: p.marca || '',
    categoryId: slugify(rawCat),
    imagePrimary: primaryImg,
    imageSecondary: secondaryImg,
    price: p.precio,
    currency: p.moneda || 'USD',
    personalRating: p.estrellas || 4.5,
    totalReviews: p.total_resenas || 0,
    affiliateUrl: p.url_afiliado || '#',
    isDemo: false,
    badge: {
      es: "Tendencia",
      en: "Trending"
    },
    slug: {
      es: slugEs,
      en: slugEn
    },
    name: cleanNameObj,
    rawName: p.nombre,
    shortDescription: {
      es: item.descripcion_corta || p.nombre,
      en: item.descripcion_corta || p.nombre
    },
    fullDescription: {
      es: item.resena_personalizada?.texto_resena || item.descripcion_corta || p.nombre,
      en: item.resena_personalizada?.texto_resena || item.descripcion_corta || p.nombre
    },
    summary: {
      es: item.descripcion_corta || '',
      en: item.descripcion_corta || ''
    },
    recommendedFor: {
      es: `Usuarios interesados en ${rawCat.toLowerCase()} en EE.UU.`,
      en: `Shoppers interested in ${rawCat.toLowerCase()} in the US.`
    },
    personalReview: {
      es: item.resena_personalizada?.texto_resena || '',
      en: item.resena_personalizada?.texto_resena || ''
    },
    features: {
      es: item.caracteristicas_principales || [],
      en: item.caracteristicas_principales || []
    },
    benefits: {
      es: item.pros || [],
      en: item.pros || []
    },
    considerations: {
      es: item.contras || [],
      en: item.contras || []
    },
    imageAlt: {
      primary: {
        es: cleanNameObj.es,
        en: cleanNameObj.en
      },
      secondary: {
        es: `${cleanNameObj.es} - Modelo`,
        en: `${cleanNameObj.en} - Model`
      }
    }
  };

  categoryMap.get(rawCat).push(productObj);
});

const categoryNamesMap = {
  "Fitness": { es: "Fitness", en: "Fitness" },
  "Belleza y Cuidado Personal": { es: "Belleza & Cuidado Personal", en: "Beauty & Personal Care" },
  "Salud y Hogar": { es: "Salud & Hogar", en: "Health & Household" },
  "Office Equipment & Supplies": { es: "Oficina & Papelería", en: "Office Equipment & Supplies" }
};

const categoriesArray = [];
for (const [rawCat, prods] of categoryMap.entries()) {
  const catSlug = slugify(rawCat);
  const names = categoryNamesMap[rawCat] || { es: rawCat, en: rawCat };

  categoriesArray.push({
    id: catSlug,
    slug: {
      es: catSlug,
      en: catSlug
    },
    name: names,
    description: {
      es: `Selección recomendada de productos en la categoría ${names.es} para EE.UU.`,
      en: `Curated selection of recommended products in ${names.en} for US shoppers.`
    },
    seo: {
      title: {
        es: `${names.es} | Sasha Store`,
        en: `${names.en} | Sasha Store`
      },
      description: {
        es: `Explora nuestra selección recomendada de ${names.es} con compra directa en Amazon.com.`,
        en: `Explore our recommended selection of ${names.en} with direct links to Amazon.com.`
      }
    },
    products: prods
  });
}

const finalData = { categories: categoriesArray };
fs.writeFileSync(srcDataPath, JSON.stringify(finalData, null, 2));

console.log(`Successfully generated src/data/products.json with new 1:1 *-final.png images!`);
