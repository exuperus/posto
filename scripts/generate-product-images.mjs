// scripts/generate-product-images.mjs
import fs from "fs";
import path from "path";
import sharp from "sharp";

const ROOT = process.cwd();
const INPUT_DIR = path.join(ROOT, "assets", "produtos");
const OUTPUT_BASE = path.join(ROOT, "public", "images", "produtos");

// Ajusta aqui se precisares de outras dimensões
const SIZES = [
    { key: "web", width: 512, height: 512 },
    { key: "mobile", width: 320, height: 320 },
];

const EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp"]); // input suportado

function slugify(name) {
    return name
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .replace(/-{2,}/g, "-");
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

async function processImage(file) {
    const inputPath = path.join(INPUT_DIR, file);
    const basename = path.parse(file).name;
    const slug = slugify(basename);

    if (!slug) {
        console.warn(`⚠️ Ignorado (slug vazio): ${file}`);
        return;
    }

    for (const size of SIZES) {
        const outDir = path.join(OUTPUT_BASE, size.key);
        ensureDir(outDir);

        const outputPath = path.join(outDir, `${slug}.jpg`);

        await sharp(inputPath)
            .resize(size.width, size.height, {
                fit: "contain",
                position: "centre",
                background: { r: 255, g: 255, b: 255 },
            })
            .flatten({ background: { r: 255, g: 255, b: 255 } })
            .jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: "4:4:4" })
            .toFile(outputPath);

        console.log(`✅ ${file} → ${size.key}/${slug}.jpg`);
    }
}

async function main() {
    if (!fs.existsSync(INPUT_DIR)) {
        console.error(`❌ Diretório de origem não encontrado: ${INPUT_DIR}`);
        process.exit(1);
    }

    const files = fs
        .readdirSync(INPUT_DIR)
        .filter((f) => EXTENSIONS.has(path.extname(f).toLowerCase()));

    if (files.length === 0) {
        console.warn(`⚠️ Nenhuma imagem encontrada em ${INPUT_DIR}`);
        return;
    }

    console.log(`📦 Encontradas ${files.length} imagens. A gerar versões redimensionadas...`);

    for (const file of files) {
        try {
            await processImage(file);
        } catch (err) {
            console.error(`❌ Falha ao processar ${file}:`, err.message);
        }
    }

    console.log("✨ Concluído!");
}

main().catch((err) => {
    console.error("❌ Erro inesperado:", err);
    process.exit(1);
});

