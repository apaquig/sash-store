import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { seoTranslations } from './translate_seo_data.js';

const srcDataPath = path.join(process.cwd(), 'src', 'data', 'products.json');
const rawData = JSON.parse(fs.readFileSync(srcDataPath, 'utf-8'));

let originalProductsMap = new Map();
try {
  const gitData = JSON.parse(execSync('git show HEAD:src/data/products.json', { encoding: 'utf-8' }));
  gitData.categories.forEach(cat => {
    cat.products.forEach(prod => {
      originalProductsMap.set(prod.id, prod);
    });
  });
} catch (e) {
  console.log("Could not load original products from git, fallback to default English translations.");
}

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
  },
  {
    es: "Sellos Adhesivos Dorados NextDayLabels (250 uds)",
    en: "NextDayLabels Gold Foil Seals (250 ct)"
  }
];

const fallbackEn = {
  "product-15": {
    shortDescription: "NextDayLabels 2-inch round gold metallic foil seals with serrated edge. Comes in a roll of 250 self-adhesive labels, perfect for giving a formal touch to certificates, diplomas, awards, envelopes, cards, and packaging.",
    fullDescription: "These NextDayLabels gold foil seals are a great way to add a professional, elegant touch to certificates, diplomas, and official documents. The metallic gold finish looks sharp and catches the light beautifully, while the serrated edges give a traditional, authentic seal appearance.\n\nWith 250 stickers per roll, they are ideal for school graduations, corporate awards, or sealing business envelopes and product packaging. The adhesive is permanent, so it holds firmly to paper and cardboard. Just make sure to align the seal properly before pressing down, as they are not easily repositionable once stuck.\n\nOverall, a high-quality, cost-effective choice for office stationery and special events.",
    summary: "Roll of 250 round gold metallic foil seals (2-inch diameter) with serrated edges for certificates and packaging.",
    recommendedFor: "Schools, businesses, offices, or anyone looking to add a formal gold seal to diplomas or envelopes.",
    personalReview: "These NextDayLabels gold foil seals are a great way to add a professional, elegant touch to certificates, diplomas, and official documents. The metallic gold finish looks sharp and catches the light beautifully, while the serrated edges give a traditional, authentic seal appearance.\n\nWith 250 stickers per roll, they are ideal for school graduations, corporate awards, or sealing business envelopes and product packaging. The adhesive is permanent, so it holds firmly to paper and cardboard. Just make sure to align the seal properly before pressing down, as they are not easily repositionable once stuck.\n\nOverall, a high-quality, cost-effective choice for office stationery and special events.",
    features: [
      "Color: Metallic Gold",
      "Size: 2-inch round stickers with serrated border",
      "Quantity: 250 self-adhesive seals per roll",
      "Material: Durable gold foil paper with permanent adhesive",
      "Writability: Can be written on with permanent marker or used with custom stamps",
      "Application: Ideal for certificates, diplomas, envelopes, awards, and packages"
    ],
    benefits: [
      "Adds a professional, formal touch to certificates and diplomas.",
      "Serrated edges and metallic gold finish look highly authentic.",
      "Strong permanent adhesive prevents peeling.",
      "Convenient roll format of 250 stickers is easy to store and use.",
      "Versatile for multiple uses including office, school, and shipping."
    ],
    considerations: []
  }
};

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

  // Look up original product from git history
  const originalProd = originalProductsMap.get(prodId);
  const fallback = fallbackEn[prodId];

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
      es: "Más Vendido",
      en: "Best Seller"
    },
    slug: {
      es: slugEs,
      en: slugEn
    },
    name: cleanNameObj,
    rawName: p.nombre,
    shortDescription: {
      es: item.descripcion_corta || p.nombre,
      en: originalProd?.shortDescription?.en || fallback?.shortDescription || item.descripcion_corta || p.nombre
    },
    fullDescription: {
      es: item.resena_personalizada?.texto_resena || item.descripcion_corta || p.nombre,
      en: originalProd?.fullDescription?.en || fallback?.fullDescription || item.resena_personalizada?.texto_resena || item.descripcion_corta || p.nombre
    },
    summary: {
      es: item.descripcion_corta || '',
      en: originalProd?.summary?.en || fallback?.summary || item.descripcion_corta || ''
    },
    recommendedFor: {
      es: `Usuarios interesados en ${rawCat.toLowerCase()} en EE.UU.`,
      en: originalProd?.recommendedFor?.en || fallback?.recommendedFor || `Shoppers interested in ${rawCat.toLowerCase()} in the US.`
    },
    personalReview: {
      es: item.resena_personalizada?.texto_resena || '',
      en: originalProd?.personalReview?.en || fallback?.personalReview || ''
    },
    features: {
      es: item.caracteristicas_principales || [],
      en: originalProd?.features?.en || fallback?.features || item.caracteristicas_principales || []
    },
    benefits: {
      es: item.pros || [],
      en: originalProd?.benefits?.en || fallback?.benefits || item.pros || []
    },
    considerations: {
      es: item.contras || [],
      en: originalProd?.considerations?.en || fallback?.considerations || item.contras || []
    },
    seo_geo: item.seo_geo ? {
      resumen_entidad: {
        es: item.seo_geo.resumen_entidad || "",
        en: seoTranslations[prodId]?.resumen_entidad || item.seo_geo.resumen_entidad || ""
      },
      seo_amazon: {
        titulo_amazon_propuesto: item.seo_geo.seo_amazon?.titulo_amazon_propuesto || "",
        terminos_busqueda_backend: item.seo_geo.seo_amazon?.terminos_busqueda_backend || "",
        enfoque_bullets: item.seo_geo.seo_amazon?.enfoque_bullets || []
      },
      seo_google: {
        titulo_seo: item.seo_geo.seo_google?.titulo_seo || "",
        meta_descripcion: item.seo_geo.seo_google?.meta_descripcion || "",
        h1_sugerido: item.seo_geo.seo_google?.h1_sugerido || "",
        slug_sugerido: item.seo_geo.seo_google?.slug_sugerido || ""
      },
      intencion_de_busqueda: {
        transaccional: item.seo_geo.intencion_de_busqueda?.transaccional || [],
        por_categoria_y_necesidad: item.seo_geo.intencion_de_busqueda?.por_categoria_y_necesidad || [],
        informativa: item.seo_geo.intencion_de_busqueda?.informativa || [],
        conversacional_para_ia: item.seo_geo.intencion_de_busqueda?.conversacional_para_ia || []
      },
      palabras_clave: {
        principales: item.seo_geo.palabras_clave?.principales || [],
        secundarias: item.seo_geo.palabras_clave?.secundarias || [],
        entidades_semanticas: item.seo_geo.palabras_clave?.entidades_semanticas || []
      },
      contenido_geo: {
        respuesta_directa: item.seo_geo.contenido_geo?.respuesta_directa || "",
        guia_de_eleccion: item.seo_geo.contenido_geo?.guia_de_eleccion || "",
        comparacion_40_vs_48: item.seo_geo.contenido_geo?.comparacion_40_vs_48 || "",
        objeciones_y_respuestas: item.seo_geo.contenido_geo?.objeciones_y_respuestas || []
      },
      faqs: (item.seo_geo.faqs || []).map((faq, idx) => {
        const transFaq = seoTranslations[prodId]?.faqs?.[idx];
        return {
          pregunta: {
            es: faq.pregunta || "",
            en: transFaq?.pregunta || faq.pregunta || ""
          },
          respuesta: {
            es: faq.respuesta || "",
            en: transFaq?.respuesta || faq.respuesta || ""
          }
        };
      }),
      alt_text_imagenes: {
        imagen_producto: item.seo_geo.alt_text_imagenes?.imagen_producto || "",
        imagen_modelo: item.seo_geo.alt_text_imagenes?.imagen_modelo || "",
        regla_de_accesibilidad: item.seo_geo.alt_text_imagenes?.regla_de_accesibilidad || ""
      },
      contenido_a_plus: item.seo_geo.contenido_a_plus || [],
      notas_de_seguridad: {
        es: item.seo_geo.notas_de_seguridad || [],
        en: seoTranslations[prodId]?.notas_de_seguridad || item.seo_geo.notas_de_seguridad || []
      }
    } : null,
    imageAlt: {
      primary: {
        es: item.seo_geo?.alt_text_imagenes?.imagen_producto || cleanNameObj.es,
        en: cleanNameObj.en
      },
      secondary: {
        es: item.seo_geo?.alt_text_imagenes?.imagen_modelo || `${cleanNameObj.es} - Modelo`,
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
