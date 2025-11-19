import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Função para verificar autenticação admin
async function checkAuth(request: NextRequest): Promise<boolean> {
  const adminKey = request.cookies.get("ak")?.value;
  const expectedKey = process.env.ADMIN_KEY;

  if (!expectedKey) {
    console.warn("[Admin Vouchers] ADMIN_KEY não definida no ambiente");
    return false;
  }

  return adminKey === expectedKey;
}

// GET: Buscar informações do voucher
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ codigo: string }> }
) {
  try {
    const isAuthenticated = await checkAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Acesso não autorizado" },
        { status: 401 }
      );
    }

    const { codigo } = await params;

    if (!codigo) {
      return NextResponse.json(
        { error: "Código é obrigatório" },
        { status: 400 }
      );
    }

    const voucher = await prisma.voucher.findUnique({
      where: { codigo: codigo.toUpperCase() },
    });

    if (!voucher) {
      return NextResponse.json(
        { error: "Voucher não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se expirou
    const agora = new Date();
    const expirado = voucher.expiraEm < agora;

    return NextResponse.json({
      success: true,
      voucher: {
        codigo: voucher.codigo,
        valorAbastecimento: voucher.valorAbastecimento?.toString() || null,
        numeroRecibo: voucher.numeroRecibo,
        usado: voucher.usado,
        usadoEm: voucher.usadoEm?.toISOString() || null,
        expiraEm: voucher.expiraEm.toISOString(),
        criadoEm: voucher.criadoEm.toISOString(),
        expirado,
        valido: !voucher.usado && !expirado,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro inesperado";
    console.error("[ERRO GET /api/admin/vouchers]:", message);
    return NextResponse.json(
      { error: `Erro ao buscar voucher: ${message}` },
      { status: 500 }
    );
  }
}

// POST: Marcar voucher como usado
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ codigo: string }> }
) {
  try {
    const isAuthenticated = await checkAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Acesso não autorizado" },
        { status: 401 }
      );
    }

    const { codigo } = await params;

    if (!codigo) {
      return NextResponse.json(
        { error: "Código é obrigatório" },
        { status: 400 }
      );
    }

    const voucher = await prisma.voucher.findUnique({
      where: { codigo: codigo.toUpperCase() },
    });

    if (!voucher) {
      return NextResponse.json(
        { error: "Voucher não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se já foi usado
    if (voucher.usado) {
      return NextResponse.json(
        {
          error: "Voucher já foi utilizado",
          usadoEm: voucher.usadoEm?.toISOString() || null,
        },
        { status: 400 }
      );
    }

    // Verificar se expirou
    const agora = new Date();
    if (voucher.expiraEm < agora) {
      return NextResponse.json(
        {
          error: "Voucher expirado",
          expiraEm: voucher.expiraEm.toISOString(),
        },
        { status: 400 }
      );
    }

    // Marcar como usado
    const atualizado = await prisma.voucher.update({
      where: { codigo: codigo.toUpperCase() },
      data: {
        usado: true,
        usadoEm: agora,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Voucher validado com sucesso",
      voucher: {
        codigo: atualizado.codigo,
        usadoEm: atualizado.usadoEm?.toISOString() || null,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro inesperado";
    console.error("[ERRO POST /api/admin/vouchers]:", message);
    return NextResponse.json(
      { error: `Erro ao validar voucher: ${message}` },
      { status: 500 }
    );
  }
}

