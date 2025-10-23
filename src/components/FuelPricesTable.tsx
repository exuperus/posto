'use client'
import { Fuel, FuelType } from '@prisma/client'

const labels: Record<FuelType, string> = {
    GASOLEO: 'Gasóleo',
    GASOLEO_HI_ENERGY: 'Gasóleo Hi-Energy',
    GASOLINA_95: 'Gasolina 95',
}

export default function FuelPricesTable({ fuels }: { fuels: Fuel[] }) {
    const vigencia = fuels[0]?.vigencia_inicio ? new Date(fuels[0].vigencia_inicio).toLocaleDateString() : '—'
    return (
        <div className="w-full overflow-x-auto rounded-2xl border bg-white">
            <div className="p-4 text-sm text-gray-500">Vigência: {vigencia}</div>
            <table className="w-full text-sm">
                <thead>
                <tr className="text-left bg-gray-50">
                    <th className="p-3">Combustível</th>
                    <th className="p-3 text-right">Preço (€/L)</th>
                    <th className="p-3 text-right hidden md:table-cell">Semana anterior</th>
                </tr>
                </thead>
                <tbody>
                {fuels.map(f => (
                    <tr key={f.id} className="border-t hover:bg-gray-50">
                        <td className="p-3 font-medium">{labels[f.tipo]}</td>
                        <td className="p-3 text-right">{Number(f.preco_atual).toFixed(2)}</td>
                        <td className="p-3 text-right hidden md:table-cell">
                            {f.preco_anterior ? Number(f.preco_anterior).toFixed(2) : '—'}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <p className="p-4 text-xs text-gray-500">Preços sujeitos a alteração.</p>
        </div>
    )
}
