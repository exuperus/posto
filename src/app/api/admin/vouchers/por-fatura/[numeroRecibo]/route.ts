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

// GET: Buscar voucher por número de fatura
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ numeroRecibo: string }> }
) {
  try {
    const isAuthenticated = await checkAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Acesso não autorizado" },
        { status: 401 }
      );
    }

    const { numeroRecibo } = await params;
    const numeroReciboDecoded = decodeURIComponent(numeroRecibo).toUpperCase().trim();

    if (!numeroReciboDecoded) {
      return NextResponse.json(
        { error: "Número de fatura é obrigatório" },
        { status: 400 }
      );
    }

    // Buscar voucher pelo número de fatura
    const voucher = await prisma.voucher.findFirst({
      where: { numeroRecibo: numeroReciboDecoded },
      orderBy: { criadoEm: "desc" }, // Pega o mais recente se houver múltiplos
    });

    if (!voucher) {
      return NextResponse.json(
        { error: "Nenhum voucher encontrado para esta fatura" },
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
    console.error("[ERRO GET /api/admin/vouchers/por-fatura]:", message);
    return NextResponse.json(
      { error: `Erro ao buscar voucher: ${message}` },
      { status: 500 }
    );
  }
}


