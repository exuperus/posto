// Script para adicionar imagens aos produtos baseado nos nomes
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Mapeamento de nomes de produtos para imagens
const productImages = {
  // Lubrificantes
  'óleo motor': '/produtos/oleo-motor.jpg',
  'óleo 5w30': '/produtos/oleo-5w30.jpg',
  'óleo 10w40': '/produtos/oleo-10w40.jpg',
  'óleo 15w40': '/produtos/oleo-15w40.jpg',
  'óleo hidráulico': '/produtos/oleo-hidraulico.jpg',
  'óleo transmissão': '/produtos/oleo-transmissao.jpg',
  'óleo diferencial': '/produtos/oleo-diferencial.jpg',
  
  // Aditivos
  'aditivo motor': '/produtos/aditivo-motor.jpg',
  'aditivo combustível': '/produtos/aditivo-combustivel.jpg',
  'aditivo radiador': '/produtos/aditivo-radiador.jpg',
  'aditivo freio': '/produtos/aditivo-freio.jpg',
  'aditivo direção': '/produtos/aditivo-direcao.jpg',
  
  // Lavagem
  'shampoo carro': '/produtos/shampoo-carro.jpg',
  'cera carro': '/produtos/cera-carro.jpg',
  'limpa vidros': '/produtos/limpa-vidros.jpg',
  'limpa pneus': '/produtos/limpa-pneus.jpg',
  'limpa estofos': '/produtos/limpa-estofos.jpg',
  
  // Acessórios
  'filtro ar': '/produtos/filtro-ar.jpg',
  'filtro óleo': '/produtos/filtro-oleo.jpg',
  'filtro combustível': '/produtos/filtro-combustivel.jpg',
  'velas': '/produtos/velas.jpg',
  'cabos': '/produtos/cabos.jpg',
  'bateria': '/produtos/bateria.jpg',
  'pneus': '/produtos/pneus.jpg',
  'jantes': '/produtos/jantes.jpg'
};

async function addProductImages() {
  try {
    console.log('🔍 Procurando produtos...');
    
    const products = await prisma.product.findMany({
      where: { ativo: true },
      select: { id: true, nome: true, categoria: true, imagemUrl: true }
    });
    
    console.log(`📦 Encontrados ${products.length} produtos`);
    
    for (const product of products) {
      const nomeLower = product.nome.toLowerCase();
      let imageUrl = null;
      
      // Procurar correspondência exata
      if (productImages[nomeLower]) {
        imageUrl = productImages[nomeLower];
      } else {
        // Procurar correspondência parcial
        for (const [key, url] of Object.entries(productImages)) {
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
        
        console.log(`✅ ${product.nome} → ${imageUrl}`);
      } else if (product.imagemUrl) {
        console.log(`⏭️  ${product.nome} já tem imagem: ${product.imagemUrl}`);
      } else {
        console.log(`❌ ${product.nome} - sem correspondência`);
      }
    }
    
    console.log('🎉 Processo concluído!');
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addProductImages();
