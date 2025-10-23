import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
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
                createdAt: true,
                updatedAt: true,
            },
        });

        // Opcional: devolve ambos os formatos para compatibilidade
        const data = rows.map((r) => ({
            ...r,
            // para quem usa Decimal "preco" no frontend:
            preco: r.precoCents != null ? (r.precoCents / 100).toFixed(2) : null,
        }));

        return NextResponse.json({ data });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Falha a obter produtos" }, { status: 500 });
    }
}
