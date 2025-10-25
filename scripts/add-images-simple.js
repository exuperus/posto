// Script simples para adicionar imagens aos produtos
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Mapeamento direto de nomes para URLs de imagens placeholder
const productImageMap = {
  // Lubrificantes
  'óleo motor': 'https://via.placeholder.com/400x300/4A90E2/FFFFFF?text=Óleo+Motor',
  'óleo 5w30': 'https://via.placeholder.com/400x300/4A90E2/FFFFFF?text=Óleo+5W30',
  'óleo 10w40': 'https://via.placeholder.com/400x300/4A90E2/FFFFFF?text=Óleo+10W40',
  'óleo 15w40': 'https://via.placeholder.com/400x300/4A90E2/FFFFFF?text=Óleo+15W40',
  'óleo hidráulico': 'https://via.placeholder.com/400x300/4A90E2/FFFFFF?text=Óleo+Hidráulico',
  'óleo transmissão': 'https://via.placeholder.com/400x300/4A90E2/FFFFFF?text=Óleo+Transmissão',
  'óleo diferencial': 'https://via.placeholder.com/400x300/4A90E2/FFFFFF?text=Óleo+Diferencial',
  
  // Aditivos
  'aditivo motor': 'https://via.placeholder.com/400x300/7ED321/FFFFFF?text=Aditivo+Motor',
  'aditivo combustível': 'https://via.placeholder.com/400x300/7ED321/FFFFFF?text=Aditivo+Combustível',
  'aditivo radiador': 'https://via.placeholder.com/400x300/7ED321/FFFFFF?text=Aditivo+Radiador',
  'aditivo freio': 'https://via.placeholder.com/400x300/7ED321/FFFFFF?text=Aditivo+Freio',
  'aditivo direção': 'https://via.placeholder.com/400x300/7ED321/FFFFFF?text=Aditivo+Direção',
  
  // Lavagem
  'shampoo carro': 'https://via.placeholder.com/400x300/50E3C2/FFFFFF?text=Shampoo+Carro',
  'cera carro': 'https://via.placeholder.com/400x300/50E3C2/FFFFFF?text=Cera+Carro',
  'limpa vidros': 'https://via.placeholder.com/400x300/50E3C2/FFFFFF?text=Limpa+Vidros',
  'limpa pneus': 'https://via.placeholder.com/400x300/50E3C2/FFFFFF?text=Limpa+Pneus',
  'limpa estofos': 'https://via.placeholder.com/400x300/50E3C2/FFFFFF?text=Limpa+Estofos',
  
  // Acessórios
  'filtro ar': 'https://via.placeholder.com/400x300/F5A623/FFFFFF?text=Filtro+de+Ar',
  'filtro óleo': 'https://via.placeholder.com/400x300/F5A623/FFFFFF?text=Filtro+de+Óleo',
  'filtro combustível': 'https://via.placeholder.com/400x300/F5A623/FFFFFF?text=Filtro+Combustível',
  'velas': 'https://via.placeholder.com/400x300/F5A623/FFFFFF?text=Velas',
  'cabos': 'https://via.placeholder.com/400x300/F5A623/FFFFFF?text=Cabos',
  'bateria': 'https://via.placeholder.com/400x300/F5A623/FFFFFF?text=Bateria',
  'pneus': 'https://via.placeholder.com/400x300/F5A623/FFFFFF?text=Pneus',
  'jantes': 'https://via.placeholder.com/400x300/F5A623/FFFFFF?text=Jantes'
};

async function addImagesToProducts() {
  try {
    console.log('🔍 Procurando produtos na base de dados...');
    
    const products = await prisma.product.findMany({
      where: { ativo: true },
      select: { id: true, nome: true, categoria: true, imagemUrl: true }
    });
    
    console.log(`📦 Encontrados ${products.length} produtos`);
    console.log('='.repeat(60));
    
    let updated = 0;
    let skipped = 0;
    let notFound = 0;
    
    for (const product of products) {
      const nomeLower = product.nome.toLowerCase().trim();
      let imageUrl = null;
      
      // Procurar correspondência exata
      if (productImageMap[nomeLower]) {
        imageUrl = productImageMap[nomeLower];
      } else {
        // Procurar correspondência parcial
        for (const [key, url] of Object.entries(productImageMap)) {
          if (nomeLower.includes(key) || key.includes(nomeLower)) {
            imageUrl = url;
            break;
          }
        }
      }
      
      if (imageUrl && !product.imagemUrl) {
        await prisma.product.update({
          where: { id: product.id },
          data: { imagemUrl: imageUrl }
        });
        
        console.log(`✅ ${product.nome} → Imagem adicionada`);
        updated++;
      } else if (product.imagemUrl) {
        console.log(`⏭️  ${product.nome} → Já tem imagem`);
        skipped++;
      } else {
        console.log(`❌ ${product.nome} → Sem correspondência`);
        notFound++;
      }
    }
    
    console.log('='.repeat(60));
    console.log(`🎉 Processo concluído!`);
    console.log(`✅ Atualizados: ${updated}`);
    console.log(`⏭️  Já tinham imagem: ${skipped}`);
    console.log(`❌ Sem correspondência: ${notFound}`);
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addImagesToProducts();
