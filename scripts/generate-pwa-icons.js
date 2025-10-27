/**
 * Script para gerar ícones PWA
 * 
 * Como usar:
 * 1. Coloque uma imagem "icon-base.png" (512x512) na pasta public/
 * 2. Instale sharp: npm install sharp --save-dev
 * 3. Execute: node scripts/generate-pwa-icons.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../public/icon-base.png');
const outputDir = path.join(__dirname, '../public');

const sizes = [192, 512];

async function generateIcons() {
  console.log('🎨 Gerando ícones PWA...');

  if (!fs.existsSync(inputPath)) {
    console.error('❌ Erro: icon-base.png não encontrado em public/');
    console.log('\n💡 Como criar ícones:');
    console.log('   1. Crie uma imagem 512x512 pixels');
    console.log('   2. Salve como icon-base.png em public/');
    console.log('   3. Execute este script novamente');
    return;
  }

  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}.png`);
    
    try {
      await sharp(inputPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .toFile(outputPath);
      
      console.log(`✅ Gerado: icon-${size}.png`);
    } catch (error) {
      console.error(`❌ Erro ao gerar icon-${size}.png:`, error.message);
    }
  }

  console.log('\n✨ Ícones PWA gerados com sucesso!');
}

generateIcons();

