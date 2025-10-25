// src/app/api/combustiveis/alias/route.ts (ou conforme o teu path)

import { GET as CombustiveisGET } from "../combustiveis/route";

// ===========================
// 🔍 DEBUG DE CONTEXTO
// ===========================
console.log(" /api/combustiveis/route.ts carregado.");
console.log("   - Caminho atual:", import.meta.url);
console.log("   - Ambiente:", process.env.NODE_ENV);
console.log("   - Vercel runtime:", process.env.VERCEL ? "Sim (produção)" : "Não (local)");
console.log("   - DATABASE_URL:", process.env.DATABASE_URL ?? "Não definida");

// ===========================
// 🔁 Reexportação do handler principal
// ===========================
export const GET = async (req: Request) => {
    console.log(" /api/combustiveis/alias] Requisição recebida no alias.");
    console.log(" URL requisitado:", req.url);
    console.log(" A redirecionar execução para ../combustiveis/route.ts ...");

    try {
        const response = await CombustiveisGET();
        console.log(" Resposta obtida com sucesso do módulo principal.");
        return response;
    } catch (error) {
        console.error("[ERRO  /api/combustiveis]:", error);
        console.error("", error instanceof Error ? error.stack : "Sem stack trace");
        return new Response(
            JSON.stringify({ error: "Erro no alias de /api/combustiveis" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    } finally {
        console.log("[GET /api/combustiveis/alias] Execução finalizada.\n");
    }
};

// ===========================
// ⚙️ Configuração dinâmica
// ===========================
export const dynamic = "force-dynamic";
console.log("Configuração dynamic='force-dynamic' aplicada.\n");
