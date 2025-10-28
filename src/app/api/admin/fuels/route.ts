import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { FuelType } from "@prisma/client";

export const dynamic = "force-dynamic";

// Tipos para a API
type FuelUpdateItem = {
    tipo: FuelType;
    preco_atual: number;
    preco_anterior: number | null;
    vigencia_inicio: string | null;
};

type FuelUpdatePayload = {
    items: FuelUpdateItem[];
};

// Função para verificar autenticação (simplificada)
async function checkAuth(request: NextRequest): Promise<boolean> {
    const adminKey = request.cookies.get("ak")?.value;
    const expectedKey = process.env.ADMIN_KEY;
    
    if (!expectedKey) {
        console.warn("[Admin Fuels] ADMIN_KEY não definida no ambiente");
        return false;
    }
    
    return adminKey === expectedKey;
}

export async function PUT(request: NextRequest) {
    console.log("\n[PUT /api/admin/fuels] → Requisição recebida.");

    try {
        // Verificar autenticação
        const isAuthenticated = await checkAuth(request);
        if (!isAuthenticated) {
            console.warn("[Admin Fuels] Tentativa de acesso não autorizada");
            return NextResponse.json(
                { error: "Acesso não autorizado" },
                { status: 401 }
            );
        }

        // Parse do payload
        const body: FuelUpdatePayload = await request.json();
        console.log("Payload recebido:", JSON.stringify(body, null, 2));

        if (!body.items || !Array.isArray(body.items)) {
            return NextResponse.json(
                { error: "Payload inválido: 'items' deve ser um array" },
                { status: 400 }
            );
        }

        // Processar cada item
        const results = [];
        for (const item of body.items) {
            console.log(`Processando combustível: ${item.tipo}`);

            // Validar dados
            if (!item.tipo || typeof item.preco_atual !== 'number') {
                console.warn(`Item inválido para ${item.tipo}:`, item);
                continue;
            }

            // Converter preços para Decimal (Prisma)
            const precoAtual = new Decimal(item.preco_atual);
            const precoAnterior = item.preco_anterior !== null ? new Decimal(item.preco_anterior) : null;
            
            // Data de vigência
            const vigenciaInicio = item.vigencia_inicio 
                ? new Date(item.vigencia_inicio)
                : new Date(); // Se não especificada, usar data atual

            // Buscar registro existente
            const existingFuel = await prisma.fuel.findFirst({
                where: {
                    tipo: item.tipo,
                    publicado: true
                },
                orderBy: { vigencia_inicio: 'desc' }
            });

            // Se existe um preço anterior, arquivar o atual
            if (existingFuel) {
                await prisma.fuel.update({
                    where: { id: existingFuel.id },
                    data: {
                        publicado: false,
                        updatedAt: new Date()
                    }
                });
                console.log(`Arquivado preço anterior para ${item.tipo}`);
            }

            // Criar novo registro
            const newFuel = await prisma.fuel.create({
                data: {
                    tipo: item.tipo,
                    preco_atual: precoAtual,
                    preco_anterior: existingFuel?.preco_atual || null,
                    vigencia_inicio: vigenciaInicio,
                    publicado: true,
                    observacoes: `Atualizado em ${new Date().toISOString()}`
                }
            });

            results.push({
                tipo: item.tipo,
                id: newFuel.id,
                preco_atual: newFuel.preco_atual.toString(),
                vigencia_inicio: newFuel.vigencia_inicio.toISOString()
            });

            console.log(`✅ Preço atualizado para ${item.tipo}: €${precoAtual}/L`);
        }

        console.log(`Processamento concluído: ${results.length} combustíveis atualizados`);

        return NextResponse.json({
            success: true,
            message: `${results.length} preços atualizados com sucesso`,
            updated: results
        }, { status: 200 });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Erro inesperado";
        console.error("[ERRO PUT /api/admin/fuels]:", message);
        if (error instanceof Error) console.error(error.stack);

        return NextResponse.json(
            { error: `Erro ao atualizar preços: ${message}` },
            { status: 500 }
        );
    } finally {
        console.log("[PUT /api/admin/fuels] Execução terminada.\n");
    }
}

// Import necessário para Decimal
import { Decimal } from "@prisma/client/runtime/library";
