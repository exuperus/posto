// scripts/update-product-image-urls.mjs
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const CSV_PATH = path.join(ROOT, "data", "produtos.csv");

const IMAGE_BASE_PATH = "/images/produtos/web"; // caminho base a usar no CSV

const mapping = new Map([
    ["Água Destilada 1L", "agua-destilada.jpg"],
    ["Substituto de Chumbo", "substituto-de-chumbo.jpg"],
    ["Tapa Fugas (Radiador)", "tapa-fugas.jpg"],
    ["Tratamento Diesel", "tratamento-diesel.jpg"],
    ["Tratamento Gasolina", "tratamento-gasolina.jpg"],
    ["Anticongelante 30% 5L", "anticongelante-5l.jpg"],
    ["Anticongelante Puro 5L", "anticongelante-puro.jpg"],
    ["AdBlue 10L", "ad-blue.jpg"],
    ["Limpa Jantes", "limpa-jantes.jpg"],
    ["Limpa Para-Brisas (fluido)", "limpa-para-brisas.jpg"],
    ["Massa Polir", "massa-polir.jpg"],
    ["Limpa Tablier", "limpa-tablier.jpg"],
    ["Óleo 15W40 1L", "oleo-15w40-1l.jpg"],
    ["Óleo 10W40 1L", "oleo-10w40.jpg"],
    ["Óleo 10W40 5L", "10w40-5l.jpg"],
    ["Óleo 5W30 1L", "oleo-5w30-1l.jpg"],
    ["Óleo Direção (Transmissão)", "oleo-transmicao.jpg"],
    ["Óleo Motosserra", "oleo-motoserra.jpg"],
    ["Óleo Hidráulico HM 46 20L", "hidrolep-20l.jpg"],
    ["Óleo Hidráulico HM 46 5L", "hidrolep-5l.jpg"],
    ["Massa consistente 5KG", "massa-consistente.jpg"],
    ["Massa consistente Tubo", "massa-consistente-tubo.jpg"],
    ["Bidão Reserva 10L", "bidao-reserva-10l.jpg"],
    ["Coletes Refletores", "colete.jpg"],
    ["Fita Adesiva", "fita-isoladora.jpg"],
    ["Jogo de Fusiveís", "kit-fusiveis.jpg"],
    ["Kit Reparação (Emergência)", "kit-reparacao-pneus.jpg"],
    ["Luvas Latex (Par)", "luvas-latex.jpg"],
    ["Tapetes Alcatifa", "tapetes-alcatifa.jpg"],
    ["Tapetes Borracha", "tapetes-borracha.jpg"],
    ["Triangulo de Sinalização", "triangulo.jpg"],
    ["Fusivel Lampada 12.5W", "lampada-12v5w-s-casquilho.jpg"],
    ["Lâmpadas 12V 21W", "lampada-12v-21w.jpg"],
    ["Lâmpadas 12V 21W laranja", "lampada-12v-21w-laranja.jpg"],
    ["Lâmpadas 12.5W s/ casquilho", "lampada-12v5w-s-casquilho.jpg"],
    ["Lâmpada Halógenea H1", "lampadas-h1.jpg"],
    ["Lampada H4", "lampadas-h4.jpg"],
    ["Lampadas 12V 10W Tubular", "lampada-tubular-12v-10w.jpg"],
    ["Lampada H7", "lampadas-h7.jpg"],
    ["Escovas Limpa Para-Brisas 330mm", "escovas-aerodinamicas-limpa-para-brisa-v2.jpg"],
    ["Escovas Limpa Para-Brisas 400mm", "escovas-aerodinamicas-limpa-para-brisa-v2.jpg"],
    ["Escovas Limpa Para-Brisas 430mm", "escovas-aerodinamicas-limpa-para-brisa-v2.jpg"],
    ["Escovas Limpa Para-Brisas 480mm", "escovas-aerodinamicas-limpa-para-brisa-v2.jpg"],
    ["Escovas Limpa Para-Brisas 510mm", "escovas-aerodinamicas-limpa-para-brisa-v2.jpg"],
    ["Escovas Limpa Para-Brisas 530mm", "escovas-aerodinamicas-limpa-para-brisa-v2.jpg"],
    ["Escovas Limpa Para-Brisas 550mm", "escovas-aerodinamicas-limpa-para-brisa-v2.jpg"],
    ["Escovas Limpa Para-Brisas 600mm", "escovas-aerodinamicas-limpa-para-brisa-v2.jpg"],
    ["Escovas Aerodinâmicas 450mm", "escovas-limpa-para-brisas-v2.jpg"],
    ["Escovas Aerodinâmicas 480mm", "escovas-limpa-para-brisas-v2.jpg"],
    ["Escovas Aerodinâmicas 510mm", "escovas-limpa-para-brisas-v2.jpg"],
    ["Escovas Aerodinâmicas 550mm", "escovas-limpa-para-brisas-v2.jpg"],
    ["Escovas Aerodinâmicas 575mm", "escovas-limpa-para-brisas-v2.jpg"],
    ["Escovas Aerodinâmicas 600mm", "escovas-limpa-para-brisas-v2.jpg"],
    ["Escovas Aerodinâmicas 650mm", "escovas-limpa-para-brisas-v2.jpg"],
    ["Pilhas CR2016", "pilha-2016.jpg"],
    ["Pilhas CR2025", "pilha-2025.jpg"],
    ["Pilhas CR1620", "pilha-1620.jpg"],
    ["Pilhas CR2032", "pilha-2032.jpg"],
    ["Pilhas 12V 23A (A23)", "12v-23a-pilhas.jpg"],
    ["Pilhas 9V", "pilha-9v.jpg"],
    ["Pilhas AA", "pilhas-aa.jpg"],
    ["Pilhas AAA", "pilhas-aaa.jpg"],
    ["Pilhas C", "pilha-cc.jpg"],
    ["Pilhas D", "pilha-d2.jpg"],
    ["Pilhas MN27 (12V)", "mn27.jpg"],
    ["Pilhas N", "pilha-n.jpg"],
    ["Pilhas MN21 Duo 12V", "mn21.jpg"],
    ["Ambientador Pinho", "ambientador-pinho.jpg"],
    ["Panos Microfibra", "pano-microfibra.jpg"],
]);

function parseCSVLine(line) {
    return line.split(",");
}

function serializeCSVLine(fields) {
    return fields.join(",");
}

function updateCSV() {
    if (!fs.existsSync(CSV_PATH)) {
        throw new Error(`Não foi encontrado o CSV em ${CSV_PATH}`);
    }

    const raw = fs.readFileSync(CSV_PATH, "utf8");
    const lines = raw.split(/\r?\n/);
    if (lines.length <= 1) {
        console.warn("CSV vazio ou sem dados");
        return;
    }

    const header = lines[0];
    const updated = [header];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) {
            continue;
        }

        const cols = parseCSVLine(line);
        const nome = cols[0];

        if (mapping.has(nome)) {
            cols[4] = `${IMAGE_BASE_PATH}/${mapping.get(nome)}`;
        }

        updated.push(serializeCSVLine(cols));
    }

    fs.writeFileSync(CSV_PATH, updated.join("\n"), "utf8");
    console.log("✅ CSV atualizado com os caminhos de imagem.");
}

updateCSV();

