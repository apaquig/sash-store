/**
 * Utility for resolving product images statically with SSG support.
 * Maps imageNumber to src/images/products/img{N}.webp and img{N}.1.webp
 * Returns image path objects with fallback handling.
 */

export interface ProductImagePaths {
  primary: string;
  secondary: string;
  fallback: string;
}

// Vite glob import for static verification of available images
const globImages = import.meta.glob('/src/images/products/*.{webp,avif,png,jpg,jpeg,svg}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

export function getImagePaths(imageNumber: number): ProductImagePaths {
  const fallback = '/src/images/no-image.svg';

  // Allowed extensions order
  const extensions = ['webp', 'avif', 'png', 'jpg', 'jpeg'];

  let primary = fallback;
  let secondary = fallback;

  // Search for primary image: img{imageNumber}.ext
  for (const ext of extensions) {
    const key = `/src/images/products/img${imageNumber}.${ext}`;
    if (globImages[key]) {
      primary = key;
      break;
    }
  }

  // Search for secondary image: img{imageNumber}.1.ext
  for (const ext of extensions) {
    const key = `/src/images/products/img${imageNumber}.1.${ext}`;
    if (globImages[key]) {
      secondary = key;
      break;
    }
  }

  return {
    primary,
    secondary,
    fallback,
  };
}
