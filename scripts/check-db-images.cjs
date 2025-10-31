const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    const products = await prisma.product.findMany({
        orderBy: [{ categoria: "asc" }, { nome: "asc" }],
    });

    const missing = products.filter((p) => !p.imagemUrl);
    console.log(`Total produtos: ${products.length}`);
    console.log(`Sem imagemUrl: ${missing.length}`);
    if (missing.length) {
        console.log(missing.map((p) => p.nome));
    }

    const wrongPath = products.filter((p) => p.imagemUrl && !p.imagemUrl.startsWith("/images/produtos"));
    console.log(`Com caminho antigo: ${wrongPath.length}`);
    if (wrongPath.length) {
        console.log(wrongPath.map((p) => ({ nome: p.nome, imagemUrl: p.imagemUrl }))); 
    }
}

main()
    .catch((err) => console.error(err))
    .finally(() => prisma.$disconnect());

