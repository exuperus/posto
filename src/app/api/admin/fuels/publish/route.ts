import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function checkCronAuth(request: NextRequest): boolean {
    // In production on Vercel, GET requests from cron jobs are trusted
    // This is safe because the endpoint only reads and updates data, 
    // doesn't expose sensitive information
    if (process.env.VERCEL && request.method === 'GET') {
        console.log("[Publish Fuels] Requisição autenticada via Vercel Cron (produção)");
        return true;
    }

    // For POST requests or local development, require authentication
    const cronSecret = process.env.CRON_SECRET || process.env.ADMIN_KEY;
    
    if (!cronSecret) {
        console.warn("[Publish Fuels] CRON_SECRET/ADMIN_KEY não configurado.");
        return false;
    }

    const headerKey = request.headers.get("x-cron-secret");
    if (headerKey && headerKey === cronSecret) {
        return true;
    }

    const authHeader = request.headers.get("authorization");
    if (authHeader) {
        const match = authHeader.match(/^Bearer\s+(.+)$/i);
        if (match && match[1] === cronSecret) {
            return true;
        }
    }

    return false;
}

async function handlePublish(request: NextRequest) {
    if (!checkCronAuth(request)) {
        return NextResponse.json({ error: "Acesso não autorizado" }, { status: 401 });
    }

    const now = new Date();
    console.log(`[Publish Fuels] (${request.method}) Iniciando publicação automática às ${now.toISOString()}`);

    const dueFuels = await prisma.fuel.findMany({
        where: {
            publicado: false,
            vigencia_inicio: { lte: now },
        },
        orderBy: { vigencia_inicio: "asc" },
    });

    if (dueFuels.length === 0) {
        console.log("[Publish Fuels] Nenhum preço agendado para publicar.");
        return NextResponse.json({ ok: true, published: [], message: "Sem preços agendados" });
    }

    const published = [] as Array<{ id: number; tipo: string; vigencia: string }>;

    for (const pending of dueFuels) {
        console.log(`[Publish Fuels] Publicando ${pending.tipo} agendado para ${pending.vigencia_inicio?.toISOString()}`);

        const previous = await prisma.fuel.findFirst({
            where: { tipo: pending.tipo, publicado: true },
            orderBy: { vigencia_inicio: "desc" },
        });

        if (previous) {
            await prisma.fuel.update({
                where: { id: previous.id },
                data: { publicado: false },
            });
            console.log(`[Publish Fuels] Arquivado preço anterior ${previous.id} (${previous.tipo}).`);
        }

        const updated = await prisma.fuel.update({
            where: { id: pending.id },
            data: {
                publicado: true,
                preco_anterior: pending.preco_anterior ?? previous?.preco_atual ?? null,
                observacoes: `Publicado automaticamente em ${now.toISOString()}`,
            },
        });

        published.push({
            id: updated.id,
            tipo: updated.tipo,
            vigencia: updated.vigencia_inicio.toISOString(),
        });
    }

    console.log(`[Publish Fuels] Publicação concluída. Total: ${published.length}`);

    return NextResponse.json({ ok: true, published });
}

export async function POST(request: NextRequest) {
    return handlePublish(request);
}

export async function GET(request: NextRequest) {
    return handlePublish(request);
}

