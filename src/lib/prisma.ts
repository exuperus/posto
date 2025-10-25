import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

console.log("[Prisma] Módulo carregado.");
console.log("   - NODE_ENV:", process.env.NODE_ENV);
console.log("   - VERCEL:", process.env.VERCEL ? "Sim" : "Não");
console.log("   - DATABASE_URL:", process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:\/\/.*@/, "://***:***@")
    : "NÃO definida"
);

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log:
            process.env.NODE_ENV === "development"
                ? ["query", "error", "warn"]
                : ["error"],
    });

// Se for ambiente de desenvolvimento, guarda o singleton
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
    console.log("[Prisma] Cliente guardado em globalThis (modo desenvolvimento).");
} else {
    console.log("[Prisma] Cliente criado em modo produção (sem cache global).");
}

// Log opcional: testar conexão logo ao carregar
(async () => {
    try {
        await prisma.$connect();
        console.log("[Prisma] Ligação à base de dados estabelecida com sucesso.");
    } catch (err) {
        console.error("[Prisma] Falha ao ligar à base de dados:", err);
    }
})();
