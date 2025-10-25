// Script para limpar todas as imagens dos produtos
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearProductImages() {
  try {
    console.log('🧹 Limpando imagens dos produtos...');
    
    // Atualizar todos os produtos para remover as imagens
    const result = await prisma.product.updateMany({
      where: {
        imagemUrl: {
          not: null
        }
      },
      data: {
        imagemUrl: null
      }
    });
    
    console.log(`✅ ${result.count} produtos tiveram as imagens removidas`);
    console.log('🎉 Base de dados limpa!');
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearProductImages();
