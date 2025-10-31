const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    const products = await prisma.product.findMany({
        where: { imagemUrl: { startsWith: "/produtos/web" } },
        select: { id: true, nome: true, imagemUrl: true },
    });

    console.log(`Encontrados ${products.length} produtos com caminho antigo.`);
    for (const p of products) {
        const novo = p.imagemUrl.replace("/produtos/web", "/images/produtos/web");
        await prisma.product.update({ where: { id: p.id }, data: { imagemUrl: novo } });
        console.log(`Atualizado: ${p.nome}`);
    }
}

main()
    .catch((err) => {
        console.error(err);
    })
    .finally(() => prisma.$disconnect());

