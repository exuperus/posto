// src/app/api/combustiveis/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { FuelType } from "@prisma/client";

export const dynamic = "force-dynamic";

type FuelDTO = {
    tipo: FuelType;
    preco_atual: string | null;
    preco_anterior: string | null;
    vigencia_inicio: string | null;
    updatedAt: string | null;
};

export async function GET() {
    try {
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

        const json: FuelDTO[] = rows.map((r): FuelDTO => ({
            tipo: r.tipo,
            preco_atual: r.preco_atual?.toString() ?? null,
            preco_anterior: r.preco_anterior?.toString() ?? null,
            vigencia_inicio: r.vigencia_inicio?.toISOString() ?? null,
            updatedAt: r.updatedAt?.toISOString() ?? null,
        }));

        return NextResponse.json<FuelDTO[]>(json, {
            headers: { "Cache-Control": "no-store" },
        });
    } catch (e: unknown) {
        // "e" é unknown por segurança; tenta extrair mensagem útil se existir
        const message =
            e instanceof Error ? e.message : "Erro inesperado ao obter combustíveis";
        console.error("Erro /api/combustiveis:", e);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
