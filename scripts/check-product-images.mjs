import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const CSV_PATH = path.join(ROOT, "data", "produtos.csv");
const PUBLIC_DIR = path.join(ROOT, "public");

const raw = fs.readFileSync(CSV_PATH, "utf8");
const lines = raw.split(/\r?\n/).filter(Boolean);
const header = lines.shift();

let missing = [];

for (const line of lines) {
    const [nome,, , , imagemUrl] = line.split(",");
    if (!imagemUrl) continue;
    const rel = imagemUrl.replace(/^\//, "");
    const abs = path.join(PUBLIC_DIR, rel);
    if (!fs.existsSync(abs)) {
        missing.push({ nome, caminho: rel });
    }
}

if (missing.length === 0) {
    console.log("✅ Todas as imagens referenciadas no CSV existem em public/");
} else {
    console.log("⚠️ Faltam", missing.length, "imagens:");
    for (const item of missing) {
        console.log(` - ${item.nome}: ${item.caminho}`);
    }
}

