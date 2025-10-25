const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('A semear dados iniciais...');

    // Estação exemplo (safe)
    await prisma.station.upsert({
        where: { id: 1 },
        update: {},
        create: {
            nome_comercial: 'Posto Exemplo',
            morada: 'Av. Principal, 123',
            codigo_postal: '4000-000',
            localidade: 'Porto',
            lat: 41.1579,
            lng: -8.6291,
            telefone: '220000000',
            email: 'info@posto.pt',
            horario_semana: '06:00–22:00',
            horario_fim_semana: '07:00–22:00',
            feriados_especiais: 'Aberto em feriados nacionais exceto 25 Dez e 1 Jan',
            servicosJson: JSON.stringify([
                { nome: 'Lavagem Auto', descricao: 'Automática e manual' },
                { nome: 'Ar e Água' },
                { nome: 'Loja de Conveniência' },
            ]),
            linksJson: JSON.stringify({
                maps_url: 'https://maps.google.com',
                whatsapp: 'https://wa.me/351900000000',
            }),
            logoUrl: '',
            heroUrl: '',
        },
    });

    // Combustíveis (apaga e recria para garantir consistência)
    await prisma.fuel.deleteMany({});
    const hoje = new Date();
    await prisma.fuel.createMany({
        data: [
            {
                tipo: 'GASOLEO',
                preco_atual: 1.58,
                vigencia_inicio: hoje,
                preco_anterior: 1.56,
                publicado: true,
                observacoes: 'Preço atualizado semanalmente.',
            },
            {
                tipo: 'GASOLEO_HI_ENERGY',
                preco_atual: 1.65,
                vigencia_inicio: hoje,
                preco_anterior: 1.63,
                publicado: true,
                observacoes: 'Combustível premium de alto desempenho.',
            },
            {
                tipo: 'GASOLINA_95',
                preco_atual: 1.78,
                vigencia_inicio: hoje,
                preco_anterior: 1.76,
                publicado: true,
            },
            {
                tipo: 'GASOLEO_AGRICOLA',
                preco_atual: 1.20,
                vigencia_inicio: hoje,
                preco_anterior: 1.18,
                publicado: true,
            },
        ],
    });

    console.log('Dados iniciais criados com sucesso!');
}

main()
    .catch((e) => { console.error('Erro ao executar seed:', e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
