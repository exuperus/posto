import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🎨 Criando ícones limpos a partir do logotipo...');

const logoPath = path.join(__dirname, '../public/logotipo.png');
const publicDir = path.join(__dirname, '../public');
const appDir = path.join(__dirname, '../src/app');

// Verifica se logotipo existe
if (!fs.existsSync(logoPath)) {
    console.error('❌ Erro: logotipo.png não encontrado!');
    console.log('📁 Coloque o logotipo em: public/logotipo.png');
    process.exit(1);
}

// Tamanhos para PWA
const pwaSizes = [192, 512];
// Tamanhos para favicon (ICO suporta múltiplos tamanhos)
const faviconSizes = [16, 32, 48];

async function createPWAIcon(size) {
    try {
        const outputPath = path.join(publicDir, `icon-${size}.png`);
        
        // Cria ícone com fundo branco limpo
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

async function createFavicon() {
    try {
        // Cria múltiplos tamanhos para o ICO
        const icoSizes = [];
        
        for (const size of faviconSizes) {
            const buffer = await sharp(logoPath)
                .resize(size, size, {
                    fit: 'contain',
                    background: { r: 255, g: 255, b: 255, alpha: 1 }
                })
                .png()
                .toBuffer();
            
            icoSizes.push({ size, buffer });
        }
        
        // O Next.js 13+ aceita favicon.ico, icon.png ou apple-icon.png
        // Vamos criar icon.png e apple-icon.png (sharp não suporta ICO diretamente)
        const favicon32Path = path.join(appDir, 'icon.png');
        
        // Cria também icon.png para Next.js (32x32)
        await sharp(logoPath)
            .resize(32, 32, {
                fit: 'contain',
                background: { r: 255, g: 255, b: 255, alpha: 1 }
            })
            .png()
            .toFile(favicon32Path);
        
        // Cria apple-icon.png para iOS (180x180 recomendado)
        const appleIconPath = path.join(appDir, 'apple-icon.png');
        await sharp(logoPath)
            .resize(180, 180, {
                fit: 'contain',
                background: { r: 255, g: 255, b: 255, alpha: 1 }
            })
            .png()
            .toFile(appleIconPath);
        
        console.log('✅ Criado: icon.png e apple-icon.png');
    } catch (error) {
        console.error('❌ Erro ao criar favicon:', error.message);
        // Se ICO falhar, tenta apenas PNG
        try {
            const favicon32Path = path.join(appDir, 'icon.png');
            await sharp(logoPath)
                .resize(32, 32, {
                    fit: 'contain',
                    background: { r: 255, g: 255, b: 255, alpha: 1 }
                })
                .png()
                .toFile(favicon32Path);
            
            // Cria apple-icon.png para iOS
            const appleIconPath = path.join(appDir, 'apple-icon.png');
            await sharp(logoPath)
                .resize(180, 180, {
                    fit: 'contain',
                    background: { r: 255, g: 255, b: 255, alpha: 1 }
                })
                .png()
                .toFile(appleIconPath);
            
            console.log('✅ Criado: icon.png e apple-icon.png (fallback)');
        } catch (fallbackError) {
            console.error('❌ Erro ao criar icon.png:', fallbackError.message);
        }
    }
}

console.log('📸 Usando logotipo.png como base...\n');

// Cria ícones PWA
console.log('📱 Criando ícones PWA...');
for (const size of pwaSizes) {
    await createPWAIcon(size);
}

// Cria favicon
console.log('\n🌐 Criando favicon...');
await createFavicon();

console.log('\n✨ Todos os ícones criados com sucesso!');
console.log('🎯 O site agora terá o logotipo S&M como ícone!');








