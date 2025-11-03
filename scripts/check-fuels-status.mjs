#!/usr/bin/env node
/**
 * Script para verificar o status de publicação dos combustíveis
 * Mostra quais combustíveis estão publicados e quais não estão
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkFuelsStatus() {
    console.log('🔍 Verificando status dos combustíveis...\n');

    try {
        const fuelTypes = ['GASOLEO', 'GASOLEO_HI_ENERGY', 'GASOLINA_95', 'GASOLEO_AGRICOLA'];
        
        for (const tipo of fuelTypes) {
            // Obter todos os combustíveis deste tipo
            const allFuels = await prisma.fuel.findMany({
                where: { tipo },
                orderBy: { vigencia_inicio: 'desc' }
            });

            const published = allFuels.filter(f => f.publicado);
            const unpublished = allFuels.filter(f => !f.publicado);

            console.log(`\n📊 ${tipo}:`);
            console.log(`   Total de registros: ${allFuels.length}`);
            
            if (published.length > 0) {
                console.log(`   ✅ Publicados: ${published.length}`);
                published.forEach(f => {
                    console.log(`      - ID ${f.id}: €${f.preco_atual}/L (vigência: ${f.vigencia_inicio.toISOString()})`);
                });
            } else {
                console.log(`   ❌ Nenhum registo publicado!`);
            }

            if (unpublished.length > 0) {
                console.log(`   ⚠️  Não publicados: ${unpublished.length}`);
                if (unpublished.length <= 3) {
                    unpublished.forEach(f => {
                        const vigenciaStr = f.vigencia_inicio.toISOString();
                        const agora = new Date();
                        const status = f.vigencia_inicio > agora ? 'agendado' : 'despublicado';
                        console.log(`      - ID ${f.id}: €${f.preco_atual}/L (${status}, vigência: ${vigenciaStr})`);
                    });
                }
            }
        }

        console.log('\n✅ Verificação concluída!');
    } catch (error) {
        console.error('❌ Erro:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkFuelsStatus();

