// src/app/api/produtos/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Category } from "@prisma/client";

export const dynamic = "force-dynamic";

// Se o UI precisar do preço, expomos "preco" (euros) podendo ser null.
// Se não precisares mesmo, comenta o campo "preco" no tipo e no map.
type ProdutoDTO = {
    id: number;
    nome: string;
    categoria: Category;
    preco: number | null;        // <- null quando não há preço
    descricao: string | null;
    imagemUrl: string | null;
    ativo: boolean;
};

export async function GET() {
    try {
        const rows = await prisma.product.findMany({
            where: { ativo: true },
            orderBy: [{ categoria: "asc" }, { nome: "asc" }],
            select: {
                id: true,
                nome: true,
                categoria: true,
                precoCents: true,     // pode vir null e está tudo bem
                descricao: true,
                imagemUrl: true,
                ativo: true,
            },
        });

        const data: ProdutoDTO[] = rows.map((r) => ({
            id: r.id,
            nome: r.nome,
            categoria: r.categoria,
            preco: r.precoCents == null ? null : r.precoCents / 100, // null => sem preço
            descricao: r.descricao ?? null,
            imagemUrl: r.imagemUrl ?? null,
            ativo: r.ativo,
        }));

        return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
    } catch (e) {
        console.error("GET /api/produtos:", e);
        return NextResponse.json({ error: "Falha a obter produtos" }, { status: 500 });
    }
}
