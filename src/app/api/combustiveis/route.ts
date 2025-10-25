// src/app/api/combustiveis/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { FuelType } from "@prisma/client";

export const dynamic = "force-dynamic";

// ===========================
// VARIÁVEIS DE AMBIENTE
// ===========================
console.log("Ambiente carregado:");
console.log("   - DATABASE_URL:", process.env.DATABASE_URL ?? "Não definida");
console.log("   - NODE_ENV:", process.env.NODE_ENV);
console.log("   - RUNTIME:", process.env.VERCEL ? "Vercel" : "Local");

// ===========================
// Tipagem do DTO
// ===========================
type FuelDTO = {
    tipo: FuelType;
    preco_atual: string | null;
    preco_anterior: string | null;
    vigencia_inicio: string | null;
    updatedAt: string | null;
};

// ===========================
// Função principal (GET)
// ===========================
export async function GET() {
    console.log("[GET /api/combustiveis] Requisição recebida.");

    try {
        console.log("A iniciar query Prisma...");
        const rows = await prisma.fuel.findMany({
            where: { publicado: true },
            orderBy: { tipo: "asc" },
            select: {
                tipo: true,
                preco_atual: true,
                preco_anterior: true,
                vigencia_inicio: true,
                updatedAt: true,
            },
        });
        console.log(`Query concluída. ${rows.length} registos encontrados.`);
        console.log("Primeira linha (exemplo):", rows[0] ?? "Sem dados");

        // ===========================
        // Transformação dos dados
        // ===========================
        console.log("A mapear dados para FuelDTO...");
        const json: FuelDTO[] = rows.map((r, i) => {
            const dto = {
                tipo: r.tipo,
                preco_atual: r.preco_atual?.toString() ?? null,
                preco_anterior: r.preco_anterior?.toString() ?? null,
                vigencia_inicio: r.vigencia_inicio?.toISOString() ?? null,
                updatedAt: r.updatedAt?.toISOString() ?? null,
            };
            console.log(`   ↪Linha ${i + 1}:`, dto);
            return dto;
        });

        console.log("Mapeamento completo. Total DTOs:", json.length);

        // ===========================
        // Resposta final
        // ===========================
        console.log("A devolver resposta JSON ao cliente...");
        return NextResponse.json<FuelDTO[]>(json, {
            headers: { "Cache-Control": "no-store" },
        });

    } catch (e: unknown) {
        // ===========================
        // ERRO
        // ===========================
        const message =
            e instanceof Error ? e.message : "Erro inesperado ao obter combustíveis";

        console.error("[ERRO /api/combustiveis]:", e);
        console.error("", e instanceof Error ? e.stack : "Sem stack trace");

        return NextResponse.json({ error: message }, { status: 500 });
    } finally {
        console.log("[GET /api/combustiveis] Execução terminada.\n");
    }
}
