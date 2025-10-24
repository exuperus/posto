import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Converte Prisma.Decimal → number
function toNumber(v: unknown): number | null {
    if (v == null) return null;
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string") {
        const n = Number(v.replace(",", "."));
        return Number.isFinite(n) ? n : null;
    }
    if (typeof v === "object" && v && "toNumber" in (v as any)) {
        try {
            const n = (v as any).toNumber();
            return Number.isFinite(n) ? n : null;
        } catch {}
    }
    const n = Number(String(v));
    return Number.isFinite(n) ? n : null;
}

export async function GET() {
    try {
        const rows = await prisma.product.findMany({
            where: { ativo: true },
            orderBy: [{ categoria: "asc" }, { nome: "asc" }],
            select: {
                id: true,
                nome: true,
                categoria: true,
                precoCents: true,        // <-- coluna real (Decimal)
                descricao: true,
                imagemUrl: true,       // <-- confere com o schema (não "imagemUrl")
                ativo: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        const data = rows.map((r) => {
            const preco = toNumber(r.precoCents);
            return {
                ...r,
                preco,                                    // número em euros
                precoCents: preco != null ? Math.round(preco * 100) : null,
            };
        });

        return NextResponse.json(data, {
            headers: { "Cache-Control": "no-store" },
        });
    } catch (e) {
        console.error("GET /api/produtos:", e);
        return NextResponse.json(
            { error: "Falha a obter produtos" },
            { status: 500 }
        );
    }
}
