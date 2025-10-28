import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🎨 Criando ícones PWA...');

// Verifica se existe hero.png ou cria ícone simples
const heroPath = path.join(__dirname, '../public/hero.png');
const outputDir = path.join(__dirname, '../public');

const sizes = [192, 512];

// Cria um ícone simples verde com texto S&M
async function createIcon(size) {
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <!-- Fundo verde -->
      <rect width="${size}" height="${size}" fill="#059669"/>
      
      <!-- Círculo branco (representa posto/pump) -->
      <circle cx="${size/2}" cy="${size/3}" r="${size/6}" fill="#ffffff" opacity="0.9"/>
      
      <!-- Linhas decorativas -->
      <rect x="${size/3.3}" y="${size/3.5}" width="${size/2.5}" height="${size/50}" fill="#ffffff" opacity="0.7"/>
      <rect x="${size/3.3}" y="${size/2}" width="${size/2.5}" height="${size/50}" fill="#ffffff" opacity="0.7"/>
      
      <!-- Texto S&M em branco -->
      <text x="${size/2}" y="${size/1.3}" font-family="Arial,sans-serif" font-size="${size/7}" font-weight="bold" fill="#ffffff" text-anchor="middle" font-style="italic">S&amp;M</text>
    </svg>
  `;

  const outputPath = path.join(outputDir, `icon-${size}.png`);
  
  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(outputPath);
  
  console.log(`✅ Criado: icon-${size}.png`);
}

// Cria todos os ícones
for (const size of sizes) {
  await createIcon(size);
}

console.log('✨ Ícones PWA criados com sucesso!');


