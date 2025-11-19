#!/usr/bin/env node
/**
 * Script para corrigir problemas comuns ao atualizar preços manualmente no Prisma Studio
 * 
 * O que faz:
 * - Garante que apenas 1 registro por tipo está publicado
 * - Publica o registro mais recente de cada tipo se nenhum estiver publicado
 * - Arquivar registros duplicados publicados
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixPublishedFuels() {
    console.log('🔧 Corrigindo status de publicação dos combustíveis...\n');

    try {
        const fuelTypes = ['GASOLEO', 'GASOLEO_HI_ENERGY', 'GASOLINA_95', 'GASOLEO_AGRICOLA'];
        
        for (const tipo of fuelTypes) {
            console.log(`\n📊 Processando ${tipo}...`);
            
            // Obter todos os combustíveis deste tipo
            const allFuels = await prisma.fuel.findMany({
                where: { tipo },
                orderBy: { vigencia_inicio: 'desc' }
            });

            const published = allFuels.filter(f => f.publicado);
            
            if (published.length === 0) {
                // Nenhum publicado - publicar o mais recente
                if (allFuels.length > 0) {
                    const latest = allFuels[0];
                    await prisma.fuel.update({
                        where: { id: latest.id },
                        data: { publicado: true }
                    });
                    console.log(`   ✅ Publicado o registro mais recente (ID ${latest.id})`);
                } else {
                    console.log(`   ⚠️  Nenhum registro encontrado para ${tipo}`);
                }
            } else if (published.length === 1) {
                // Perfeito - apenas 1 publicado
                console.log(`   ✓ Já está correto (ID ${published[0].id} publicado)`);
            } else {
                // Múltiplos publicados - manter apenas o mais recente
                console.log(`   ⚠️  ${published.length} registros publicados - corrigindo...`);
                
                // Manter o mais recente
                const toKeep = published[0];
                console.log(`   ✓ Mantendo ID ${toKeep.id} como publicado`);
                
                // Arquivar os outros
                const toArchive = published.slice(1);
                for (const fuel of toArchive) {
                    await prisma.fuel.update({
                        where: { id: fuel.id },
                        data: { publicado: false }
                    });
                    console.log(`   📦 Arquivado ID ${fuel.id}`);
                }
            }
        }

        console.log('\n✅ Correção concluída!');
        console.log('\n💡 Execute "node scripts/check-fuels-status.mjs" para verificar o resultado.');
    } catch (error) {
        console.error('❌ Erro:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

fixPublishedFuels();


