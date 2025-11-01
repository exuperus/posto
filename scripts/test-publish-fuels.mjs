#!/usr/bin/env node
/**
 * Script para testar o endpoint de publicação de preços agendados
 * 
 * Uso:
 *   node scripts/test-publish-fuels.mjs [base-url] [secret]
 * 
 * Exemplos:
 *   # Local com admin key
 *   node scripts/test-publish-fuels.mjs http://localhost:3000 minha-admin-key
 * 
 *   # Produção
 *   node scripts/test-publish-fuels.mjs https://meu-dominio.com minha-admin-key
 */

const args = process.argv.slice(2);
const BASE_URL = args[0] || 'http://localhost:3000';
const SECRET = args[1] || process.env.ADMIN_KEY || process.env.CRON_SECRET;

async function testPublish() {
    console.log('🧪 Teste de publicação de preços agendados\n');
    console.log(`📍 URL: ${BASE_URL}/api/admin/fuels/publish`);
    console.log(`🔑 Secret: ${SECRET ? 'Definida' : 'NÃO DEFINIDA'}\n`);

    if (!SECRET) {
        console.error('❌ Erro: ADMIN_KEY ou CRON_SECRET não definida!');
        console.log('\nDica: Defina uma das seguintes variáveis:');
        console.log('  - ADMIN_KEY');
        console.log('  - CRON_SECRET');
        console.log('Ou passe como argumento:');
        console.log('  node scripts/test-publish-fuels.mjs http://localhost:3000 sua-chave');
        process.exit(1);
    }

    try {
        console.log('📡 A enviar requisição POST...\n');
        
        const response = await fetch(`${BASE_URL}/api/admin/fuels/publish`, {
            method: 'POST',
            headers: {
                'x-cron-secret': SECRET,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        console.log(`📊 Status: ${response.status} ${response.statusText}`);
        console.log(`📦 Resposta:`, JSON.stringify(data, null, 2));

        if (response.ok) {
            if (data.published && data.published.length > 0) {
                console.log(`\n✅ Sucesso! ${data.published.length} preço(s) publicado(s):`);
                data.published.forEach(fuel => {
                    console.log(`   - ${fuel.tipo} (ID: ${fuel.id}, Vigência: ${fuel.vigencia})`);
                });
            } else {
                console.log('\n✅ Sucesso! Nenhum preço agendado para publicar.');
            }
        } else {
            console.log(`\n❌ Erro: ${data.error || 'Erro desconhecido'}`);
        }

        process.exit(response.ok ? 0 : 1);
    } catch (error) {
        console.error('\n❌ Erro de rede:', error.message);
        process.exit(1);
    }
}

testPublish();

