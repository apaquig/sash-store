import fs from 'fs';
import path from 'path';

const publicImgDir = path.join(process.cwd(), 'public', 'Imagenes');

// Files to rename
const renames = [
  {
    oldName: 'amazon-basics-blocs-notas-producto-final.png',
    newName: 'amazon-basics-blocs-notas-producto-final-v2.png'
  },
  {
    oldName: 'amazon-basics-blocs-notas-modelo-final.png',
    newName: 'amazon-basics-blocs-notas-modelo-final-v2.png'
  }
];

// Rename files in public/Imagenes
renames.forEach(({ oldName, newName }) => {
  const oldPath = path.join(publicImgDir, oldName);
  const newPath = path.join(publicImgDir, newName);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`Renamed disk file: ${oldName} -> ${newName}`);
  } else {
    console.log(`File not found: ${oldName}`);
  }
});

// Update products.json in src/data/
const srcDataPath = path.join(process.cwd(), 'src', 'data', 'products.json');
if (fs.existsSync(srcDataPath)) {
  let content = fs.readFileSync(srcDataPath, 'utf-8');
  content = content.replace(
    /amazon-basics-blocs-notas-producto-final\.png/g,
    'amazon-basics-blocs-notas-producto-final-v2.png'
  );
  content = content.replace(
    /amazon-basics-blocs-notas-modelo-final\.png/g,
    'amazon-basics-blocs-notas-modelo-final-v2.png'
  );
  fs.writeFileSync(srcDataPath, content, 'utf-8');
  console.log(`Updated paths in ${srcDataPath}`);
}

// Update products.json in Downloads
const downloadsPath = '/Users/user/Downloads/AMAZON 8/products.json';
if (fs.existsSync(downloadsPath)) {
  let content = fs.readFileSync(downloadsPath, 'utf-8');
  content = content.replace(
    /amazon-basics-blocs-notas-producto-final\.png/g,
    'amazon-basics-blocs-notas-producto-final-v2.png'
  );
  content = content.replace(
    /amazon-basics-blocs-notas-modelo-final\.png/g,
    'amazon-basics-blocs-notas-modelo-final-v2.png'
  );
  fs.writeFileSync(downloadsPath, content, 'utf-8');
  console.log(`Updated paths in ${downloadsPath}`);
}
