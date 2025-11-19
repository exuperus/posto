// Script para deletar vouchers já usados
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteUsedVouchers() {
  try {
    console.log('🗑️  Procurando vouchers usados...');
    
    // Contar vouchers usados
    const count = await prisma.voucher.count({
      where: {
        usado: true
      }
    });
    
    console.log(`📊 Encontrados ${count} vouchers usados`);
    
    if (count === 0) {
      console.log('✅ Nenhum voucher usado para deletar');
      return;
    }
    
    // Deletar vouchers usados
    const result = await prisma.voucher.deleteMany({
      where: {
        usado: true
      }
    });
    
    console.log(`✅ ${result.count} vouchers deletados com sucesso!`);
    console.log('🎉 Base de dados limpa!');
    
  } catch (error) {
    console.error('❌ Erro:', error);
    console.error('Detalhes:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Permitir deletar apenas vouchers expirados também
async function deleteExpiredVouchers() {
  try {
    const agora = new Date();
    console.log('🗑️  Procurando vouchers expirados...');
    
    const count = await prisma.voucher.count({
      where: {
        expiraEm: {
          lt: agora
        }
      }
    });
    
    console.log(`📊 Encontrados ${count} vouchers expirados`);
    
    if (count === 0) {
      console.log('✅ Nenhum voucher expirado para deletar');
      return;
    }
    
    const result = await prisma.voucher.deleteMany({
      where: {
        expiraEm: {
          lt: agora
        }
      }
    });
    
    console.log(`✅ ${result.count} vouchers expirados deletados com sucesso!`);
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Função principal
async function main() {
  const args = process.argv.slice(2);
  const mode = args[0] || 'used';
  
  if (mode === 'used') {
    await deleteUsedVouchers();
  } else if (mode === 'expired') {
    await deleteExpiredVouchers();
  } else if (mode === 'all') {
    await deleteUsedVouchers();
    await deleteExpiredVouchers();
  } else {
    console.log('Uso: node delete-vouchers-used.js [used|expired|all]');
    console.log('  used    - Deleta apenas vouchers usados (padrão)');
    console.log('  expired - Deleta apenas vouchers expirados');
    console.log('  all     - Deleta vouchers usados e expirados');
  }
}

main();


