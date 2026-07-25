import type { Language } from './getTranslations';

export function getWebsiteSchema(lang: Language) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Sasha Store',
    url: `https://sashastore.com/${lang}/`,
    inLanguage: lang === 'es' ? 'es-US' : lang === 'pt' ? 'pt-BR' : 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: `https://sashastore.com/${lang}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Sasha Store',
    url: 'https://sashastore.com',
    logo: 'https://sashastore.com/favicon.svg',
    description: 'Curated US storefront and product recommendation catalog for Amazon.com products.',
    sameAs: [
      'https://www.instagram.com/sassha_steele',
      'https://www.tiktok.com/@sasha_steele.ai',
      'https://www.pinterest.com/sofiahonzalezoff',
      'https://www.facebook.com/sashasteele.official',
    ],
  };
}

export function getBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `https://sashastore.com${item.url}`,
    })),
  };
}

export function getProductSchema(product: any, lang: Language) {
  const domain = 'https://sashastore.com';
  const name = product.rawName || (product.name[lang] || product.name.es);
  const description = product.fullDescription[lang] || product.fullDescription.es;
  const reviewText = product.personalReview[lang] || product.personalReview.es;

  const images = [];
  if (product.imagePrimary) images.push(`${domain}${product.imagePrimary}`);
  if (product.imageSecondary) images.push(`${domain}${product.imageSecondary}`);

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    alternateName: product.name[lang] || product.name.es,
    image: images,
    description,
    category: product.categoryId,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.personalRating,
      reviewCount: product.totalReviews || 100,
      bestRating: '5',
      worstRating: '1',
    },
    offers: {
      '@type': 'Offer',
      url: product.affiliateUrl,
      priceCurrency: product.currency || 'USD',
      price: product.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Amazon.com',
      },
    },
    review: {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: product.personalRating,
        bestRating: '5',
      },
      author: {
        '@type': 'Organization',
        name: 'Sasha Store Editorial',
      },
      reviewBody: reviewText,
    },
  };
}
