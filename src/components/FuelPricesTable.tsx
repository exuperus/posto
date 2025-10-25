"use client";

import type { FuelType } from "@prisma/client";

type FuelDTO = {
    id: string;
    tipo: FuelType;
    preco_atual: unknown; // pode vir como Decimal | string | number | null
    preco_anterior: unknown; // idem
    vigencia_inicio: string | null;
};

const labels: Record<FuelType, string> = {
    GASOLEO: "Gasóleo",
    GASOLEO_HI_ENERGY: "Gasóleo Hi-Energy",
    GASOLINA_95: "Gasolina 95",
    GASOLEO_AGRICOLA: "Gasóleo Agrícola",
};

function toNumber(v: unknown): number | null {
    if (v == null) return null;
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string") {
        const n = Number(v.replace(",", "."));
        return Number.isFinite(n) ? n : null;
    }
    if (typeof v === "object" && v && "toNumber" in (v as any)) {
        try {
            const n = (v as any).toNumber();
            return Number.isFinite(n) ? n : null;
        } catch (e) {
            console.error("[FuelPricesTable] Erro no toNumber (objeto com toNumber):", e);
        }
    }
    const n = Number(String(v));
    return Number.isFinite(n) ? n : null;
}

const nf = new Intl.NumberFormat("pt-PT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

export default function FuelPricesTable({ fuels }: { fuels: FuelDTO[] }) {
    console.log("[FuelPricesTable] Componente montado.");
    console.log("[FuelPricesTable] fuels recebido:", fuels);

    if (!Array.isArray(fuels) || fuels.length === 0) {
        console.warn("⚠[FuelPricesTable] Nenhum combustível recebido ou lista vazia.");
    }

    const vigencia = fuels[0]?.vigencia_inicio
        ? new Date(fuels[0].vigencia_inicio).toLocaleDateString("pt-PT")
        : "—";

    console.log("🗓[FuelPricesTable] Vigência:", vigencia);

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
                {fuels.map((f, i) => {
                    const atual = toNumber(f.preco_atual);
                    const anterior = toNumber(f.preco_anterior);

                    console.log(`[FuelPricesTable] Linha ${i + 1}`);
                    console.log("   ↳ Tipo:", f.tipo, "| Label:", labels[f.tipo]);
                    console.log("   ↳ Preço atual (raw):", f.preco_atual, "→", atual);
                    console.log("   ↳ Preço anterior (raw):", f.preco_anterior, "→", anterior);
                    console.log("   ↳ Vigência individual:", f.vigencia_inicio);

                    return (
                        <tr key={f.id} className="border-t hover:bg-gray-50">
                            <td className="p-3 font-medium">{labels[f.tipo]}</td>
                            <td className="p-3 text-right">
                                {atual != null ? nf.format(atual) : "—"}
                            </td>
                            <td className="p-3 text-right hidden md:table-cell">
                                {anterior != null ? nf.format(anterior) : "—"}
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
            <p className="p-4 text-xs text-gray-500">Preços sujeitos a alteração.</p>
        </div>
    );
}
