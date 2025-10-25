// src/app/api/station/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ===========================
// DEBUG INICIAL: VARIÁVEIS DE AMBIENTE
// ===========================
console.log("[DEBUG] Ambiente carregado:");
console.log("   - DATABASE_URL:", process.env.DATABASE_URL ?? "Não definida");
console.log("   - NODE_ENV:", process.env.NODE_ENV);
console.log("   - Execução no Vercel:", process.env.VERCEL ? "Sim" : "Não");

// ===========================
// Função principal (GET)
// ===========================
export async function GET() {
    console.log("[GET /api/station] Requisição recebida.");

    try {
        console.log("[DEBUG] A iniciar query Prisma: station.findFirst()...");
        const st = await prisma.station.findFirst();

        if (!st) {
            console.warn("⚠[DEBUG] Nenhum registo encontrado na tabela Station.");
        } else {
            console.log("[DEBUG] Registo encontrado:");
            console.log(JSON.stringify(st, null, 2));
        }

        console.log("[DEBUG] A devolver resposta JSON...");
        return NextResponse.json(st ?? { error: "Nenhuma estação encontrada" }, {
            headers: { "Cache-Control": "no-store" },
        });
    } catch (error: unknown) {
        console.error("[ERRO /api/station]:", error);
        if (error instanceof Error) console.error("[STACK]:", error.stack);
        else console.error("[STACK]: erro não é uma instância de Error.");

        return NextResponse.json(
            { error: "Falha ao obter estação" },
            { status: 500 }
        );
    } finally {
        console.log("[GET /api/station] Execução terminada.\n");
    }
}
