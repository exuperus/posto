// scripts/import-products.cjs
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/* ---------- utils ---------- */

// Normaliza texto para um slug estável (minúsculas, sem acentos/pontuação)
function slugify(s = "") {
    return s
        .normalize("NFD").replace(/\p{Diacritic}/gu, "")  // tira acentos
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")                     // não alfanum -> "-"
        .replace(/^-+|-+$/g, "");                        // trim "-"
}

function parseCSV(text) {
    // CSV simples: separador vírgula, sem campos com vírgulas internas
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length === 0) return [];
    const header = lines[0].split(",").map(h => h.trim());
    return lines.slice(1).map((line, i) => {
        const cols = line.split(",").map(c => c.trim());
        const obj = {};
        header.forEach((h, idx) => (obj[h] = cols[idx] ?? ""));
        obj.__line = i + 2; // para debug (linha real no CSV)
        return obj;
    });
}

function toBool(v) {
    const s = String(v || "").trim().toLowerCase();
    return s === "true" || s === "1" || s === "yes" || s === "y";
}

function precoToCents(precoStr) {
    if (precoStr == null || precoStr === "") return null;
    const n = Number(String(precoStr).replace(",", "."));
    return Number.isNaN(n) ? null : Math.round(n * 100);
}

/* ---------- main ---------- */

async function main() {
    // 1) Lê CSV (tem de estar em UTF-8!)
    const csvPath = process.argv[2] || path.join(process.cwd(), "data", "produtos.csv");
    if (!fs.existsSync(csvPath)) throw new Error(`CSV não encontrado em: ${csvPath}`);
    // Dica: se o CSV veio do Excel, garante "UTF-8" (sem BOM) no WebStorm (rodapé do editor)

    const raw = fs.readFileSync(csvPath, "utf8");
    const rows = parseCSV(raw);

    const CATS = new Set(["LUBRIFICANTES", "ADITIVOS", "LAVAGEM", "ACESSORIOS", "OUTROS"]);

    // 2) Lê todos os produtos atuais e indexa por slug (derivado do nome)
    const existentes = await prisma.product.findMany();
    const mapExist = new Map(
        existentes.map((p) => [slugify(p.nome || String(p.id)), p])
    );

    let created = 0, updated = 0, skipped = 0;

    // Para remoção dos que não estão no CSV
    const slugsVistos = new Set();

    for (const r of rows) {
        try {
            const nomeCSV = (r.nome || "").trim();
            const catCSV = (r.categoria || "").trim();
            const descCSV = (r.descricao || "").trim();
            const imgCSV  = (r.imagemUrl || "").trim() || null;
            const ativoCSV = r.ativo ? toBool(r.ativo) : true;
            const precoCents = precoToCents(r.preco);

            if (!nomeCSV || !catCSV) {
                console.warn(`⚠️ Linha ${r.__line}: sem nome/categoria → ignorada.`);
                skipped++; continue;
            }
            if (!CATS.has(catCSV)) {
                console.warn(`⚠️ Linha ${r.__line}: categoria inválida "${catCSV}" → ignorada.`);
                skipped++; continue;
            }

            const slug = slugify(nomeCSV);
            slugsVistos.add(slug);

            const atual = mapExist.get(slug);
            if (atual) {
                // UPDATE para refletir exatamente o CSV
                await prisma.product.update({
                    where: { id: atual.id },
                    data: {
                        nome: nomeCSV,
                        categoria: catCSV,
                        precoCents,
                        descricao: descCSV,
                        imagemUrl: imgCSV,
                        ativo: ativoCSV,
                    },
                });
                updated++;
            } else {
                // CREATE
                await prisma.product.create({
                    data: {
                        nome: nomeCSV,
                        categoria: catCSV,
                        precoCents,
                        descricao: descCSV,
                        imagemUrl: imgCSV,
                        ativo: ativoCSV,
                    },
                });
                created++;
            }
        } catch (e) {
            console.error(`❌ Erro na linha ${r.__line}:`, e.message);
            skipped++;
        }
    }

    // 3) Remove da BD o que não veio no CSV (sincronização 1:1)
    const aRemover = existentes.filter(p => !slugsVistos.has(slugify(p.nome || String(p.id))));
    for (const p of aRemover) {
        await prisma.product.delete({ where: { id: p.id } });
    }

    console.log(`\n✅ Sync concluído
  Criados:     ${created}
  Atualizados: ${updated}
  Removidos:   ${aRemover.length}
  Ignorados:   ${skipped}\n`);
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1); });
