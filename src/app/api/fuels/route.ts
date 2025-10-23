// src/app/api/fuels/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import type { FuelType } from '@prisma/client'

/** Rótulos legíveis por tipo */
const LABELS: Partial<Record<FuelType, string>> = {
    GASOLEO: 'Gasóleo',
    GASOLEO_HI_ENERGY: 'Gasóleo Hi-Energy',
    GASOLINA_95: 'Gasolina 95',
    GASOLEO_AGRICOLA: 'Gasóleo Agrícola',
}

/** Row que a API devolve ao Admin */
type FuelApiRow = {
    tipo: FuelType
    preco_atual: string | null
    preco_anterior: string | null
    vigencia_inicio: string | null
    updatedAt: string | null
}

/** Type guard para objetos tipo Prisma.Decimal */
function hasToNumber(x: unknown): x is { toNumber: () => number } {
    return (
        typeof x === 'object' &&
        x !== null &&
        typeof (x as Record<string, unknown>).toNumber === 'function'
    )
}

/** Converte valores (Decimal/string/number) em number seguro */
function toNum(v: unknown): number | null {
    if (v == null) return null
    if (typeof v === 'number') return Number.isFinite(v) ? v : null
    if (typeof v === 'string') {
        const n = parseFloat(v.replace(',', '.'))
        return Number.isFinite(n) ? n : null
    }
    if (hasToNumber(v)) {
        try {
            const n = v.toNumber()
            return Number.isFinite(n) ? n : null
        } catch {
            /* ignore */
        }
    }
    const n = Number(String(v))
    return Number.isFinite(n) ? n : null
}

export async function GET() {
    // busca todos os publicados, mais recentes primeiro
    const rows = await prisma.fuel.findMany({
        where: { publicado: true },
        orderBy: [
            { tipo: 'asc' },
            { updatedAt: 'desc' },
            { vigencia_inicio: 'desc' },
            { createdAt: 'desc' },
        ],
        select: {
            tipo: true,
            preco_atual: true,
            preco_anterior: true,
            vigencia_inicio: true,
            updatedAt: true,
        },
    })

    // escolhe o registo mais recente por tipo
    const latest: Partial<Record<FuelType, typeof rows[number]>> = {}
    for (const r of rows) {
        const t = r.tipo as FuelType
        if (!latest[t]) latest[t] = r
    }

    const data: FuelApiRow[] = Object.values(latest).map((r) => {
        const precoAtual = toNum(r!.preco_atual)
        const precoAnterior = toNum(r!.preco_anterior)
        return {
            tipo: r!.tipo as FuelType,
            // devolvemos como string (ou null) para evitar problemas de precisão/Decimal no cliente
            preco_atual: precoAtual !== null ? String(precoAtual) : null,
            preco_anterior: precoAnterior !== null ? String(precoAnterior) : null,
            vigencia_inicio: r!.vigencia_inicio ? r!.vigencia_inicio.toISOString() : null,
            updatedAt: r!.updatedAt ? r!.updatedAt.toISOString() : null,
        }
    })

    return NextResponse.json<FuelApiRow[]>(data, {
        headers: { 'Cache-Control': 'no-store' },
    })
}
