#!/usr/bin/env node
/**
 * Script para limpar combustíveis antigos/publicados não utilizados
 * Mantém apenas 1 registro por tipo, o mais recente publicado
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanOldFuels() {
    console.log('🧹 A limpar combustíveis antigos...\n');

    try {
        const fuelTypes = ['GASOLEO', 'GASOLEO_HI_ENERGY', 'GASOLINA_95', 'GASOLEO_AGRICOLA'];
        
        for (const tipo of fuelTypes) {
            // Obter todos os combustíveis deste tipo
            const allFuels = await prisma.fuel.findMany({
                where: { tipo },
                orderBy: { createdAt: 'desc' }
            });

            if (allFuels.length === 0) {
                console.log(`  ⚠️  ${tipo}: Nenhum registo encontrado`);
                continue;
            }

            // Encontrar o mais recente publicado
            const latestPublished = allFuels.find(f => f.publicado);
            
            if (!latestPublished) {
                console.log(`  ⚠️  ${tipo}: Nenhum registo publicado encontrado`);
                continue;
            }

            // Apagar todos os outros
            const toDelete = allFuels.filter(f => f.id !== latestPublished.id);
            
            if (toDelete.length > 0) {
                await prisma.fuel.deleteMany({
                    where: {
                        id: { in: toDelete.map(f => f.id) }
                    }
                });
                console.log(`  ✅ ${tipo}: Mantido ID ${latestPublished.id}, apagados ${toDelete.length} registos antigos`);
            } else {
                console.log(`  ✓  ${tipo}: Já tem apenas 1 registo (ID ${latestPublished.id})`);
            }
        }

        console.log('\n✅ Limpeza concluída!');
    } catch (error) {
        console.error('❌ Erro:', error);
    } finally {
        await prisma.$disconnect();
    }
}

cleanOldFuels();


