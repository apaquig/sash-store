import type { Language } from './getTranslations';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  canonicalUrl?: string;
  lang: Language;
  type?: 'website' | 'article' | 'product';
}

export function buildSEOMetadata({
  title,
  description,
  image = '/images/sasha-ambassador.jpg',
  canonicalUrl,
  lang,
  type = 'website',
}: SEOProps) {
  const siteUrl = 'https://sashastore.com';
  const fullCanonical = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl;

  const alternateLangs = [
    { lang: 'es-US', href: `${siteUrl}/es/` },
    { lang: 'en-US', href: `${siteUrl}/en/` },
    { lang: 'x-default', href: `${siteUrl}/en/` },
  ];

  return {
    title,
    description,
    image: image.startsWith('http') ? image : `${siteUrl}${image}`,
    canonicalUrl: fullCanonical,
    alternateLangs,
    openGraph: {
      type,
      locale: lang === 'es' ? 'es_US' : 'en_US',
      url: fullCanonical,
      title,
      description,
      image: image.startsWith('http') ? image : `${siteUrl}${image}`,
      siteName: 'Sasha Store',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      image: image.startsWith('http') ? image : `${siteUrl}${image}`,
    },
  };
}

export const generateSEOMetadata = buildSEOMetadata;
