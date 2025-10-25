// src/app/api/produtos/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Category } from "@prisma/client";

export const dynamic = "force-dynamic";

// ===========================
//  DEBUG: VARIÁVEIS DE AMBIENTE
// ===========================
console.log("🧩 [DEBUG] Ambiente carregado:");
console.log("   - DATABASE_URL:", process.env.DATABASE_URL ?? "❌ Não definida");
console.log("   - NODE_ENV:", process.env.NODE_ENV);
console.log("   - VERCEL:", process.env.VERCEL ? "Sim (produção)" : "Não (local)");

// ===========================
// Tipagem do DTO
// ===========================
type ProdutoDTO = {
    id: number;
    nome: string;
    categoria: Category;
    preco: number | null;
    descricao: string | null;
    imagemUrl: string | null;
    ativo: boolean;
};

// ===========================
// Função principal (GET)
// ===========================
export async function GET() {
    console.log(" [GET /api/produtos] Requisição recebida.");

    try {
        console.log(" A iniciar query Prisma (buscar produtos ativos)...");
        const rows = await prisma.product.findMany({
            where: { ativo: true },
            orderBy: [{ categoria: "asc" }, { nome: "asc" }],
            select: {
                id: true,
                nome: true,
                categoria: true,
                precoCents: true,
                descricao: true,
                imagemUrl: true,
                ativo: true,
            },
        });

        console.log(`[DEBUG] Query concluída. ${rows.length} registos encontrados.`);
        if (rows.length > 0) console.log("Exemplo da 1ª linha]:", rows[0]);
        else console.log("⚠[DEBUG] Nenhum produto ativo encontrado.");

        // ===========================
        //  Transformação para DTO
        // ===========================
        console.log("[DEBUG] A mapear dados para ProdutoDTO...");
        const data: ProdutoDTO[] = rows.map((r, i) => {
            const dto = {
                id: r.id,
                nome: r.nome,
                categoria: r.categoria,
                preco: r.precoCents == null ? null : r.precoCents / 100,
                descricao: r.descricao ?? null,
                imagemUrl: r.imagemUrl ?? null,
                ativo: r.ativo,
            };
            console.log(`   ↪Linha ${i + 1}:`, dto);
            return dto;
        });

        console.log("[DEBUG] Mapeamento concluído. Total DTOs:", data.length);

        // ===========================
        // Resposta final
        // ===========================
        console.log("[DEBUG] A enviar resposta JSON ao cliente...");
        return NextResponse.json(data, {
            headers: { "Cache-Control": "no-store" },
        });

    } catch (e: unknown) {
        // ===========================
        // ERRO
        // ===========================
        console.error("[ERRO /api/produtos]:", e);
        if (e instanceof Error) console.error("[STACK]:", e.stack);
        else console.error("[STACK]: erro não é uma instância de Error.");

        return NextResponse.json(
            { error: "Falha a obter produtos" },
            { status: 500 }
        );
    } finally {
        console.log("[GET /api/produtos] Execução terminada.\n");
    }
}
