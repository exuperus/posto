import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// rótulos bonitos
const LABELS: Record<string, string> = {
    GASOLEO: 'Gasóleo',
    GASOLEO_HI_ENERGY: 'Gasóleo Hi-Energy',
    GASOLINA_95: 'Gasolina 95',
    GASOLEO_AGRICOLA: 'Gasóleo Agrícola',
}

// Converte qualquer coisa que o Prisma possa devolver (Decimal, string, etc.) em number
function toNum(v: unknown): number | null {
    if (v == null) return null
    if (typeof v === 'number' && Number.isFinite(v)) return v
    if (typeof v === 'string') {
        const n = parseFloat(v.replace(',', '.'))
        return Number.isFinite(n) ? n : null
    }
    // Prisma.Decimal tem toNumber()
    if (typeof v === 'object' && v !== null && 'toNumber' in (v as any)) {
        try {
            const n = (v as any).toNumber()
            return Number.isFinite(n) ? n : null
        } catch {}
    }
    // fallback final
    const n = Number(String(v))
    return Number.isFinite(n) ? n : null
}

export async function GET() {
    const rows = await prisma.fuel.findMany({
        where: { publicado: true },
        orderBy: [
            { tipo: 'asc' },
            { updatedAt: 'desc' },
            { vigencia_inicio: 'desc' },
            { createdAt: 'desc' },
        ],
    })

    // escolhe o mais recente por tipo
    const latest: Record<string, typeof rows[number]> = {}
    for (const r of rows) {
        const key = (r.tipo || '').toUpperCase()
        if (!latest[key]) latest[key] = r
    }

    const data = Object.values(latest).map((r) => {
        const key = (r.tipo || '').toUpperCase()
        return {
            nome: LABELS[key] ?? r.tipo ?? 'Combustível',
            tipo: r.tipo,
            preco: toNum(r.preco_atual),
            preco_anterior: toNum(r.preco_anterior),
            updatedAt: r.updatedAt ?? r.vigencia_inicio ?? null,
        }
    })

    return NextResponse.json(data)
}
