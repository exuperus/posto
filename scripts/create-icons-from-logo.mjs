import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🎨 Criando ícones PWA a partir do logotipo...');

const logoPath = path.join(__dirname, '../public/logotipo.png');
const outputDir = path.join(__dirname, '../public');

// Verifica se logotipo existe
if (!fs.existsSync(logoPath)) {
    console.error('❌ Erro: logotipo.png não encontrado!');
    console.log('📁 Coloque o logotipo em: public/logotipo.png');
    process.exit(1);
}

const sizes = [192, 512];

async function createIconFromLogo(size) {
    try {
        const outputPath = path.join(outputDir, `icon-${size}.png`);
        
        // Lê o logotipo e redimensiona
        await sharp(logoPath)
            .resize(size, size, {
                fit: 'contain',
                background: { r: 255, g: 255, b: 255, alpha: 1 }
            })
            .png()
            .toFile(outputPath);
        
        console.log(`✅ Criado: icon-${size}.png`);
    } catch (error) {
        console.error(`❌ Erro ao criar icon-${size}.png:`, error.message);
    }
}

console.log('📸 Usando logotipo.png como base...');
for (const size of sizes) {
    await createIconFromLogo(size);
}

console.log('✨ Ícones PWA criados com sucesso a partir do logotipo!');








