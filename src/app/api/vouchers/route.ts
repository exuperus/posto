import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

export const dynamic = "force-dynamic";

// Função para gerar código único sequencial: LAV1, LAV2, LAV3...
async function gerarCodigo(): Promise<string> {
  // Buscar todos os vouchers com formato LAV + número para encontrar o maior número
  const vouchers = await prisma.voucher.findMany({
    where: {
      codigo: {
        startsWith: 'LAV',
      },
    },
    select: { codigo: true },
  });

  let maiorNumero = 0;

  // Extrair números de todos os códigos LAV
  for (const voucher of vouchers) {
    // Suporta formatos: LAV1, LAV123, LAV-ABC-123 (ignora este)
    const match = voucher.codigo.match(/^LAV(\d+)$/);
    if (match) {
      const numero = parseInt(match[1], 10);
      if (numero > maiorNumero) {
        maiorNumero = numero;
      }
    }
  }

  // Próximo número sequencial
  const proximoNumero = maiorNumero + 1;
  const codigo = `LAV${proximoNumero}`;

  // Verificar se já existe (segurança extra)
  const existe = await prisma.voucher.findUnique({
    where: { codigo },
  });

  if (existe) {
    // Se por algum motivo já existe, incrementar
    return `LAV${proximoNumero + 1}`;
  }

  return codigo;
}

// POST: Gerar novo voucher
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deviceId, valorAbastecimento, numeroRecibo } = body;

    // Validações
    if (!deviceId || typeof deviceId !== "string") {
      return NextResponse.json(
        { error: "deviceId é obrigatório" },
        { status: 400 }
      );
    }

    const valor = valorAbastecimento ? Number(valorAbastecimento) : null;
    if (valor !== null && (isNaN(valor) || valor < 0)) {
      return NextResponse.json(
        { error: "Valor de abastecimento inválido" },
        { status: 400 }
      );
    }

    // Verificar se valor mínimo foi atingido (50€)
    if (valor === null || valor < 50) {
      return NextResponse.json(
        { error: "Valor mínimo de 50€ necessário para gerar voucher" },
        { status: 400 }
      );
    }

    // Validar número de fatura (obrigatório)
    if (!numeroRecibo || typeof numeroRecibo !== "string") {
      return NextResponse.json(
        { error: "Número de fatura é obrigatório" },
        { status: 400 }
      );
    }

    // Validar formato: CA23/XXXXX (pelo menos 5 dígitos após a barra)
    const faturaRegex = /^CA\d{2}\/\d{5,}$/;
    if (!faturaRegex.test(numeroRecibo.trim().toUpperCase())) {
      return NextResponse.json(
        { error: "Formato de fatura inválido. Use o formato: CA23/12345" },
        { status: 400 }
      );
    }

    // Gerar código único sequencial
    const codigo = await gerarCodigo();

    // Data de expiração: 1 mês (30 dias) a partir de agora
    const expiraEm = new Date();
    expiraEm.setDate(expiraEm.getDate() + 30);

    // Criar voucher
    const voucher = await prisma.voucher.create({
      data: {
        codigo,
        deviceId,
        valorAbastecimento: valor ? new Decimal(valor) : null,
        numeroRecibo: numeroRecibo.trim().toUpperCase(),
        fotoReciboUrl: null, // Não usado mais
        expiraEm,
      },
    });

    return NextResponse.json({
      success: true,
      voucher: {
        id: voucher.id,
        codigo: voucher.codigo,
        expiraEm: voucher.expiraEm.toISOString(),
        valorAbastecimento: voucher.valorAbastecimento?.toString() || null,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro inesperado";
    console.error("[ERRO POST /api/vouchers]:", message);
    return NextResponse.json(
      { error: `Erro ao gerar voucher: ${message}` },
      { status: 500 }
    );
  }
}

// GET: Buscar vouchers de um deviceId (histórico)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get("deviceId");

    if (!deviceId) {
      return NextResponse.json(
        { error: "deviceId é obrigatório" },
        { status: 400 }
      );
    }

    const vouchers = await prisma.voucher.findMany({
      where: { deviceId },
      orderBy: { criadoEm: "desc" },
      select: {
        id: true,
        codigo: true,
        valorAbastecimento: true,
        numeroRecibo: true,
        usado: true,
        usadoEm: true,
        expiraEm: true,
        criadoEm: true,
      },
    });

    return NextResponse.json({
      success: true,
      vouchers: vouchers.map((v) => ({
        id: v.id,
        codigo: v.codigo,
        valorAbastecimento: v.valorAbastecimento?.toString() || null,
        numeroRecibo: v.numeroRecibo,
        usado: v.usado,
        usadoEm: v.usadoEm?.toISOString() || null,
        expiraEm: v.expiraEm.toISOString(),
        criadoEm: v.criadoEm.toISOString(),
      })),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro inesperado";
    console.error("[ERRO GET /api/vouchers]:", message);
    return NextResponse.json(
      { error: `Erro ao buscar vouchers: ${message}` },
      { status: 500 }
    );
  }
}

