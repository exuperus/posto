import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { FuelType } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

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
    const adminKey = request.cookies.get("ak")?.value?.trim();
    const expectedKey = process.env.ADMIN_KEY?.trim();
    
    console.log("[Admin Fuels] Verificando autenticação:", {
        cookieExists: !!request.cookies.get("ak"),
        adminKeyLength: adminKey?.length ?? 0,
        expectedKeyLength: expectedKey?.length ?? 0,
        keysMatch: adminKey === expectedKey
    });
    
    if (!expectedKey) {
        console.warn("[Admin Fuels] ADMIN_KEY não definida no ambiente");
        return false;
    }
    
    if (!adminKey || adminKey !== expectedKey) {
        console.warn("[Admin Fuels] Cookie inválido ou não corresponde à ADMIN_KEY");
        return false;
    }
    
    return true;
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
        const now = new Date();
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
            // Se não especificada ou vazia, usar data atual (publicar imediatamente)
            const vigenciaInicio = item.vigencia_inicio && item.vigencia_inicio.trim() !== ''
                ? new Date(item.vigencia_inicio)
                : new Date(); // Se não especificada, usar data atual

            if (Number.isNaN(vigenciaInicio.getTime())) {
                console.warn(`Data de vigência inválida para ${item.tipo}:`, item.vigencia_inicio);
                continue;
            }

            // Publicar agora se a vigência for no passado ou presente (com margem de 1 segundo para evitar problemas de timing)
            const publicarAgora = vigenciaInicio.getTime() <= (now.getTime() + 1000);

            // Buscar registro existente publicado
            const existingFuel = await prisma.fuel.findFirst({
                where: {
                    tipo: item.tipo,
                    publicado: true
                },
                orderBy: { vigencia_inicio: 'desc' }
            });

            // Se vamos publicar agora, arquivar todos os preços anteriores publicados do mesmo tipo
            if (publicarAgora) {
                // Arquivar o preço publicado atual (se existir)
                if (existingFuel) {
                    await prisma.fuel.update({
                        where: { id: existingFuel.id },
                        data: {
                            publicado: false,
                            updatedAt: new Date()
                        }
                    });
                    console.log(`Arquivado preço anterior publicado para ${item.tipo} (ID: ${existingFuel.id})`);
                }
                
                // Também arquivar qualquer outro registro publicado do mesmo tipo (segurança extra)
                // Isso garante que não há múltiplos preços publicados ao mesmo tempo
                const whereClause: any = {
                    tipo: item.tipo,
                    publicado: true
                };
                
                if (existingFuel) {
                    whereClause.id = { not: existingFuel.id };
                }
                
                const outrosPublicados = await prisma.fuel.findMany({
                    where: whereClause
                });
                
                if (outrosPublicados.length > 0) {
                    await prisma.fuel.updateMany({
                        where: whereClause,
                        data: {
                            publicado: false,
                            updatedAt: new Date()
                        }
                    });
                    console.log(`Arquivados ${outrosPublicados.length} outros registros publicados para ${item.tipo}`);
                }
            }

            // Criar novo registro
            const newFuel = await prisma.fuel.create({
                data: {
                    tipo: item.tipo,
                    preco_atual: precoAtual,
                    preco_anterior: existingFuel?.preco_atual || precoAnterior,
                    vigencia_inicio: vigenciaInicio,
                    publicado: publicarAgora,
                    observacoes: publicarAgora
                        ? `Atualizado em ${now.toISOString()}`
                        : `Agendado em ${now.toISOString()} para publicação em ${vigenciaInicio.toISOString()}`
                }
            });

            results.push({
                tipo: item.tipo,
                id: newFuel.id,
                preco_atual: newFuel.preco_atual.toString(),
                vigencia_inicio: newFuel.vigencia_inicio.toISOString(),
                publicado: newFuel.publicado
            });

            console.log(
                `✅ ${publicarAgora ? 'Preço publicado' : 'Preço agendado'} para ${item.tipo}: €${precoAtual}/L (vigência: ${vigenciaInicio.toISOString()})`
            );
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
