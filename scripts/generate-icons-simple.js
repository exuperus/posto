/**
 * Script simples para gerar ícones PWA
 * Cria ícones usando Canvas Node.js (sem dependências externas)
 */

const fs = require('fs');
const path = require('path');

// Cores e design simples
const colors = {
  background: '#059669', // Verde
  foreground: '#ffffff',  // Branco
};

// SVG para PNG em diferentes tamanhos
const sizes = [192, 512];

console.log('🎨 Gerando ícones PWA temporários...');

// Usa a biblioteca Sharp se disponível, senão cria SVG simples
try {
  const sharp = require('sharp');
  const inputPath = path.join(__dirname, '../public/icon-base.svg');
  
  if (fs.existsSync(inputPath)) {
    for (const size of sizes) {
      const outputPath = path.join(__dirname, '../public', `icon-${size}.png`);
      await sharp(inputPath)
        .resize(size, size)
        .toFile(outputPath);
      console.log(`✅ Gerado: icon-${size}.png`);
    }
  } else {
    console.log('ℹ️  Arquivo SVG não encontrado, criando ícones simples...');
    createSimpleIcons();
  }
} catch (error) {
  console.log('ℹ️  Sharp não instalado, criando ícones simples...');
  createSimpleIcons();
}

function createSimpleIcons() {
  for (const size of sizes) {
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="${colors.background}"/>
  <circle cx="${size/2}" cy="${size/3}" r="${size/6}" fill="${colors.foreground}" opacity="0.9"/>
  <text x="${size/2}" y="${size/1.3}" font-family="Arial,sans-serif" font-size="${size/6}" font-weight="bold" fill="${colors.foreground}" text-anchor="middle" font-style="italic">S&M</text>
  <rect x="${size/3.3}" y="${size/3.5}" width="${size/2.5}" height="${size/50}" fill="${colors.foreground}" opacity="0.7"/>
  <rect x="${size/3.3}" y="${size/2}" width="${size/2.5}" height="${size/50}" fill="${colors.foreground}" opacity="0.7"/>
</svg>`;
    
    const outputPath = path.join(__dirname, '../public', `icon-${size}.svg`);
    fs.writeFileSync(outputPath, svg);
    
    // Converte SVG para PNG se possível
    convertSvgToPng(outputPath, size);
  }
}

function convertSvgToPng(svgPath, size) {
  // Tenta usar Sharp novamente para converter
  try {
    const sharp = require('sharp');
    const outputPath = path.join(__dirname, '../public', `icon-${size}.png`);
    sharp(svgPath)
      .resize(size, size)
      .png()
      .toFile(outputPath, (err) => {
        if (err) {
          console.error(`❌ Erro ao criar icon-${size}.png:`, err.message);
        } else {
          console.log(`✅ Gerado: icon-${size}.png`);
        }
      });
  } catch (err) {
    // Se falhar, mantém o SVG
    console.log(`ℹ️  SVG criado: icon-${size}.svg (converta para PNG manualmente)`);
  }
}







