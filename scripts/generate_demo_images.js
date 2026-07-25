import fs from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'src', 'images', 'products');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

for (let i = 1; i <= 15; i++) {
  // Primary Image (imgX.svg)
  const primarySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
    <rect width="600" height="600" rx="32" fill="#ffffff" stroke="#e4e4e7" stroke-width="2"/>
    <rect x="180" y="140" width="240" height="280" rx="20" fill="#f4f4f5" stroke="#18181b" stroke-width="4"/>
    <circle cx="300" cy="240" r="48" fill="#18181b" fill-opacity="0.1"/>
    <rect x="220" y="320" width="160" height="16" rx="8" fill="#18181b"/>
    <rect x="240" y="350" width="120" height="12" rx="6" fill="#71717a"/>
    <text x="300" y="470" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="20" font-weight="700" fill="#18181b">
      Sasha Product ${i}
    </text>
    <text x="300" y="505" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="14" font-weight="500" fill="#71717a">
      Imagen Principal (img${i}.webp)
    </text>
  </svg>`;

  // Secondary Image (imgX.1.svg)
  const secondarySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
    <rect width="600" height="600" rx="32" fill="#fafafa" stroke="#e4e4e7" stroke-width="2"/>
    <polygon points="300,150 420,330 180,330" fill="#ffffff" stroke="#18181b" stroke-width="4"/>
    <rect x="200" y="360" width="200" height="14" rx="7" fill="#18181b"/>
    <text x="300" y="470" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="20" font-weight="700" fill="#18181b">
      Sasha Product ${i} (Detalle)
    </text>
    <text x="300" y="505" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="14" font-weight="500" fill="#71717a">
      Imagen Secundaria (img${i}.1.webp)
    </text>
  </svg>`;

  fs.writeFileSync(path.join(dir, `img${i}.svg`), primarySvg);
  fs.writeFileSync(path.join(dir, `img${i}.1.svg`), secondarySvg);
}

console.log('Sasha Store demo images regenerated successfully!');
