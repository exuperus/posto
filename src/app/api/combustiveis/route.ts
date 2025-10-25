// src/app/api/combustiveis/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { FuelType } from "@prisma/client";

export const dynamic = "force-dynamic";

/* ============================================================
   DEBUG DE AMBIENTE
   ============================================================ */
console.log("[Combustíveis] Ambiente carregado:");
console.log("   • DATABASE_URL:", process.env.DATABASE_URL ?? "Não definida");
console.log("   • NODE_ENV:", process.env.NODE_ENV);
console.log("   • Execução:", process.env.VERCEL ? "Vercel (produção)" : "Local");

/* ============================================================
   Tipagem do DTO devolvido
   ============================================================ */
type FuelDTO = {
    tipo: FuelType;
    preco_atual: string | null;
    preco_anterior: string | null;
    vigencia_inicio: string | null;
    updatedAt: string | null;
};

/* ============================================================
   Handler principal (GET)
   ============================================================ */
export async function GET() {
    console.log("\n[GET /api/combustiveis] → Requisição recebida.");

    try {
        console.log("📡 A consultar Prisma (tabela fuel)...");

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

        console.log(`Query concluída — ${rows.length} registos encontrados.`);
        if (rows.length > 0) console.log("   Exemplo 1º registo:", rows[0]);
        else console.warn("⚠Nenhum combustível publicado encontrado.");

        /* ============================================================
           🔄 Normalização e mapeamento dos dados
           ============================================================ */
        const json: FuelDTO[] = rows.map((r, i) => {
            const dto: FuelDTO = {
                tipo: r.tipo,
                preco_atual:
                    r.preco_atual !== null && r.preco_atual !== undefined
                        ? r.preco_atual.toString()
                        : null,
                preco_anterior:
                    r.preco_anterior !== null && r.preco_anterior !== undefined
                        ? r.preco_anterior.toString()
                        : null,
                vigencia_inicio: r.vigencia_inicio
                    ? new Date(r.vigencia_inicio).toISOString()
                    : null,
                updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : null,
            };
            console.log(`   ↪ Linha ${i + 1}:`, dto);
            return dto;
        });

        console.log(`Mapeamento completo. Total DTOs: ${json.length}`);

        /* ============================================================
           📤 Resposta final
           ============================================================ */
        return NextResponse.json(json, {
            headers: { "Cache-Control": "no-store" },
            status: 200,
        });
    } catch (e: unknown) {
        /* ============================================================
           Tratamento de erro
           ============================================================ */
        const message =
            e instanceof Error
                ? e.message
                : "Erro inesperado ao obter dados de combustíveis.";

        console.error("[ERRO /api/combustiveis]:", message);
        if (e instanceof Error) console.error(e.stack);

        return NextResponse.json({ error: message }, { status: 500 });
    } finally {
        console.log("[GET /api/combustiveis] Execução terminada.\n");
    }
}
