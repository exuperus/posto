// Script para baixar imagens placeholder para os produtos
const fs = require('fs');
const path = require('path');

// Lista de produtos comuns e suas imagens placeholder
const productImages = [
  { name: 'oleo-motor', title: 'Óleo Motor', category: 'Lubrificantes' },
  { name: 'oleo-5w30', title: 'Óleo 5W30', category: 'Lubrificantes' },
  { name: 'oleo-10w40', title: 'Óleo 10W40', category: 'Lubrificantes' },
  { name: 'oleo-15w40', title: 'Óleo 15W40', category: 'Lubrificantes' },
  { name: 'oleo-hidraulico', title: 'Óleo Hidráulico', category: 'Lubrificantes' },
  { name: 'oleo-transmissao', title: 'Óleo Transmissão', category: 'Lubrificantes' },
  { name: 'oleo-diferencial', title: 'Óleo Diferencial', category: 'Lubrificantes' },
  
  { name: 'aditivo-motor', title: 'Aditivo Motor', category: 'Aditivos' },
  { name: 'aditivo-combustivel', title: 'Aditivo Combustível', category: 'Aditivos' },
  { name: 'aditivo-radiador', title: 'Aditivo Radiador', category: 'Aditivos' },
  { name: 'aditivo-freio', title: 'Aditivo Freio', category: 'Aditivos' },
  { name: 'aditivo-direcao', title: 'Aditivo Direção', category: 'Aditivos' },
  
  { name: 'shampoo-carro', title: 'Shampoo Carro', category: 'Lavagem' },
  { name: 'cera-carro', title: 'Cera Carro', category: 'Lavagem' },
  { name: 'limpa-vidros', title: 'Limpa Vidros', category: 'Lavagem' },
  { name: 'limpa-pneus', title: 'Limpa Pneus', category: 'Lavagem' },
  { name: 'limpa-estofos', title: 'Limpa Estofos', category: 'Lavagem' },
  
  { name: 'filtro-ar', title: 'Filtro de Ar', category: 'Acessórios' },
  { name: 'filtro-oleo', title: 'Filtro de Óleo', category: 'Acessórios' },
  { name: 'filtro-combustivel', title: 'Filtro Combustível', category: 'Acessórios' },
  { name: 'velas', title: 'Velas', category: 'Acessórios' },
  { name: 'cabos', title: 'Cabos', category: 'Acessórios' },
  { name: 'bateria', title: 'Bateria', category: 'Acessórios' },
  { name: 'pneus', title: 'Pneus', category: 'Acessórios' },
  { name: 'jantes', title: 'Jantes', category: 'Acessórios' }
];

// Cores por categoria
const categoryColors = {
  'Lubrificantes': '4A90E2', // Azul
  'Aditivos': '7ED321',      // Verde
  'Lavagem': '50E3C2',       // Ciano
  'Acessórios': 'F5A623',    // Laranja
  'OUTROS': 'BD10E0'         // Roxo
};

function createPlaceholderImage(product) {
  const color = categoryColors[product.category] || categoryColors['OUTROS'];
  const width = 400;
  const height = 300;
  
  // URL do placeholder.com com texto personalizado
  const url = `https://via.placeholder.com/${width}x${height}/${color}/FFFFFF?text=${encodeURIComponent(product.title)}`;
  
  return url;
}

async function downloadImages() {
  console.log('🖼️  Criando URLs de imagens placeholder...');
  
  const produtosDir = path.join(__dirname, '..', 'public', 'produtos');
  
  // Garantir que a pasta existe
  if (!fs.existsSync(produtosDir)) {
    fs.mkdirSync(produtosDir, { recursive: true });
  }
  
  console.log('📝 URLs das imagens:');
  console.log('='.repeat(50));
  
  productImages.forEach(product => {
    const imageUrl = createPlaceholderImage(product);
    console.log(`${product.name}.jpg → ${imageUrl}`);
  });
  
  console.log('='.repeat(50));
  console.log('💡 Para usar estas imagens:');
  console.log('1. Baixe as imagens dos URLs acima');
  console.log('2. Salve-as na pasta public/produtos/');
  console.log('3. Execute o script add-product-images.js');
}

downloadImages();
