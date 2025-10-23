import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

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

        const json = rows.map((r) => ({
            tipo: r.tipo,
            preco_atual: r.preco_atual?.toString() ?? null,
            preco_anterior: r.preco_anterior?.toString() ?? null,
            vigencia_inicio: r.vigencia_inicio?.toISOString() ?? null,
            updatedAt: r.updatedAt?.toISOString() ?? null,
        }));

        return NextResponse.json(json, { headers: { "Cache-Control": "no-store" } });
    } catch (e) {
        console.error("Erro /api/combustiveis:", e);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
