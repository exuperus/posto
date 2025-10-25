import { Fuel, TrendingUp, TrendingDown, TicketPercent } from "lucide-react";
import { prisma } from "@/lib/prisma";
import type { FuelType } from "@prisma/client";
import BackButton from "@/components/BackButton";
import RelatedPages from "@/components/RelatedPages";
import FridayBanner from "@/components/FridayBanner";
import FuelCalculator from "@/components/FuelCalculator";
import type { Metadata } from "next";

export const dynamic = "force-dynamic"; // força o runtime dinâmico
export const revalidate = 0;            // desativa cache ISR

export const metadata: Metadata = {
    title: "Preços Combustível - Sandrina & Mário, LDA | Sendim",
    description: "Consulte os preços atuais de combustível: gasóleo, gasolina 95, gasóleo hi-energy e gasóleo agrícola. Promoção de sexta-feira com desconto especial.",
    keywords: "combustível, gasóleo, gasolina, preços, Sendim, Miranda do Douro, posto abastecimento, desconto sexta-feira",
    openGraph: {
        title: "Preços Combustível - Sandrina & Mário, LDA",
        description: "Preços atualizados de combustível com promoção de sexta-feira",
        type: "website",
        locale: "pt_PT",
    },
    twitter: {
        card: "summary_large_image",
        title: "Preços Combustível - Sandrina & Mário, LDA",
        description: "Preços atualizados de combustível com promoção de sexta-feira",
    },
    alternates: {
        canonical: "/combustiveis",
    },
};

/* =======================
   FUNÇÕES DE UTILIDADE
   ======================= */
function norm(s: string) {
    return s?.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase() ?? "";
}

function toNum(v: unknown): number | undefined {
    if (v == null) return undefined;
    if (typeof v === "number") return Number.isFinite(v) ? v : undefined;
    if (typeof v === "string") {
        const n = Number(v.replace(",", "."));
        return Number.isFinite(n) ? n : undefined;
    }
    if (typeof v === "object") {
        const obj = v as { toNumber?: unknown; valueOf?: unknown; toString?: unknown };
        if (typeof obj.toNumber === "function") {
            const n = (obj.toNumber as () => number)();
            if (Number.isFinite(n)) return n;
        }
        if (typeof obj.valueOf === "function") {
            const n = Number(obj.valueOf() as unknown);
            if (Number.isFinite(n)) return n;
        }
        if (typeof obj.toString === "function") {
            const n = Number(String(obj.toString()).replace(",", "."));
            if (Number.isFinite(n)) return n;
        }
    }
    return undefined;
}

/* =======================
   FORMATADORES
   ======================= */
const nf = new Intl.NumberFormat("pt-PT", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
});
const pf = new Intl.NumberFormat("pt-PT", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
});

const fmt = (n?: number | string) => {
    const num = toNum(n);
    return Number.isFinite(num as number) ? `${nf.format(num as number)} €` : "—";
};

/* =======================
   TIPOS E CONFIG
   ======================= */
type FuelRow = {
    tipo: FuelType;
    preco_atual: number | null;
    preco_anterior: number | null;
    vigencia_inicio: Date | null;
    updatedAt: Date;
};

const TARGETS: Array<{ label: string; keys: string[]; tone: "emerald" | "cyan" | "orange" | "lime" }> = [
    { label: "Gasóleo",            keys: ["gasoleo", "diesel"],            tone: "emerald" },
    { label: "Gasóleo Hi-Energy",  keys: ["gasoleo hi", "hi-energy", "hi energy"], tone: "cyan" },
    { label: "Gasolina 95",        keys: ["gasolina 95", "95"],            tone: "orange" },
    { label: "Gasóleo Agrícola",   keys: ["gasoleo agricola", "agricola"], tone: "lime" },
];

/* =======================
   PROMOÇÃO
   ======================= */
const FRIDAY_DISCOUNT_EUR = 0.06;
const FRIDAY_TIME = "07h–22h";
const FRIDAY_EXCEPT = "Gasóleo Agrícola";
const isFriday = () => new Date().getDay() === 5;

/* =======================
   SPARKLINE
   ======================= */
function Sparkline({
                       prev,
                       now,
                       stroke,
                   }: {
    prev?: number;
    now?: number;
    stroke: string;
}) {
    if (!Number.isFinite(prev) || !Number.isFinite(now)) {
        console.log("[Sparkline] valores inválidos -> prev:", prev, "now:", now);
        return <div className="h-8" aria-hidden />;
    }
    const base = Math.max(prev as number, now as number) || 1;
    const yPrev = 24 - ((prev as number) / base) * 24;
    const yNow = 24 - ((now as number) / base) * 24;
    console.log("[Sparkline] base:", base, "yPrev:", yPrev, "yNow:", yNow);
    return (
        <svg viewBox="0 0 100 24" className="h-8 w-full" role="img">
            <polyline
                fill="none"
                stroke={stroke}
                strokeWidth={2}
                strokeLinecap="round"
                points={`0,${yPrev.toFixed(1)} 100,${yNow.toFixed(1)}`}
            />
        </svg>
    );
}

/* =======================
   PÁGINA PRINCIPAL
   ======================= */
export default async function CombustiveisPage() {
    console.log("[/combustiveis] Render iniciado. NODE_ENV:", process.env.NODE_ENV, "VERCEL:", !!process.env.VERCEL);

    // Busca direta no Prisma
    let all: FuelRow[] = [];
    try {
        console.log("[/combustiveis] A consultar Prisma (tabela fuel)...");
        
        const rows = await prisma.fuel.findMany({
            where: { publicado: true },
            orderBy: { tipo: "asc" },
            select: {
                tipo: true,
                preco_atual: true,
                preco_anterior: true,
                vigencia_inicio: true,
                updatedAt: true,
            },
        });

        all = rows.map(row => ({
            tipo: row.tipo,
            preco_atual: row.preco_atual ? Number(row.preco_atual) : null,
            preco_anterior: row.preco_anterior ? Number(row.preco_anterior) : null,
            vigencia_inicio: row.vigencia_inicio,
            updatedAt: row.updatedAt,
        }));
        console.log(`[/combustiveis] Query concluída — ${rows.length} registos encontrados.`);
        if (rows.length > 0) {
            console.log("[/combustiveis] Exemplo 1º registo:", rows[0]);
        } else {
            console.warn("⚠[/combustiveis] Nenhum combustível publicado encontrado.");
        }
    } catch (err) {
        console.error("[/combustiveis] Falha na consulta Prisma:", err);
        all = []; // se a consulta falhar, renderizamos UI vazia (sem crash)
    }

    const pick = (keys: string[]) =>
        all.find((f) => {
            const raw = f.tipo;
            const name = norm(raw.replace(/_/g, " "));
            const hit = keys.some((k) => name.includes(k));
            console.log("🔎 [/combustiveis] pick() raw:", raw, "norm:", name, "keys:", keys, "→ hit:", hit);
            return hit;
        });

    console.log("[/combustiveis] A construir items a partir de TARGETS...");
    const items = TARGETS.map((t, idx) => {
        const row = pick(t.keys.map(norm));
        const price = row?.preco_atual ?? undefined;

        const prev = row?.preco_anterior ?? undefined;
        const hasPrev = Number.isFinite(prev as number);
        const delta =
            hasPrev && Number.isFinite(price as number)
                ? (price as number) - (prev as number)
                : undefined;
        const pct =
            hasPrev && Number.isFinite(delta as number) && (prev as number) !== 0
                ? (delta as number) / (prev as number)
                : undefined;

        const updated = row?.updatedAt ?? row?.vigencia_inicio;

        const debugRow = {
            label: t.label,
            tone: t.tone,
            price,
            prev,
            delta,
            pct,
            updated,
            matchedRow: row ?? null,
        };
        console.log(`   ↪[/combustiveis] item #${idx + 1}:`, debugRow);

        return {
            label: t.label,
            tone: t.tone,
            price,
            prev,
            delta,
            pct,
            updated,
        };
    });

    const updatedAt = items
        .map((i) => i.updated)
        .filter(Boolean)
        .sort()
        .reverse()[0];

    console.log("[/combustiveis] updatedAt calculado:", updatedAt);
    const friday = isFriday();
    console.log("[/combustiveis] é sexta-feira?:", friday, "desconto:", FRIDAY_DISCOUNT_EUR, "exceto:", FRIDAY_EXCEPT);

    console.log("[/combustiveis] A renderizar", items.length, "cards.");
    return (
        <div className="space-y-6">
            <BackButton />
            <FridayBanner />
            {/* ===== CABEÇALHO ===== */}
            <header className="flex items-end justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-ink tracking-tight">
                        Combustíveis
                    </h1>

                    {/* Chip + texto corrido (expansível) */}
                    <details className="max-w-full">
                        <summary
                            className={[
                                "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 cursor-pointer",
                                "bg-emerald-50 text-emerald-700 ring-emerald-200",
                                friday ? "animate-pulse" : "",
                                "list-none [&::-webkit-details-marker]:hidden",
                            ].join(" ")}
                        >
                            <TicketPercent className="h-3.5 w-3.5" />
                            Promoção de Sexta-feira
                        </summary>

                        <div className="mt-2 rounded-xl border border-emerald-200 bg-white p-3 text-xs text-gray-700 shadow-sm">
                            Desconto direto de <strong>{nf.format(FRIDAY_DISCOUNT_EUR)} € / L</strong>{" "}
                            em todas as categorias de combustível,{" "}
                            <strong>exceto {FRIDAY_EXCEPT}</strong>. Válida todas as
                            sextas-feiras, das <strong>{FRIDAY_TIME}</strong>. Sujeito a
                            alterações.
                        </div>
                    </details>

                    <p className="text-sm text-gray-500">
                        Preços por litro com variação face à última semana.
                    </p>
                </div>

                {updatedAt && (
                    <div className="text-xs text-gray-500">
                        Última atualização: {new Date(updatedAt).toLocaleDateString("pt-PT")}
                    </div>
                )}
            </header>

            {/* ===== CALCULADORA ===== */}
            <section className="mb-8">
                <FuelCalculator />
            </section>

            {/* ===== CARTÕES ===== */}
            <section
                aria-label="Lista de combustíveis"
                className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            >
                {items.map((it) => {
                    const up = (it.delta ?? 0) > 0;
                    const down = (it.delta ?? 0) < 0;
                    const tone =
                        it.tone === "emerald"
                            ? "emerald"
                            : it.tone === "cyan"
                                ? "cyan"
                                : it.tone === "orange"
                                    ? "orange"
                                    : "lime";
                    const stroke = down ? "#ef4444" : up ? "#059669" : "#6b7280";

                    console.log("[/combustiveis] card:", {
                        label: it.label,
                        price: it.price,
                        prev: it.prev,
                        delta: it.delta,
                        pct: it.pct,
                        up,
                        down,
                        tone,
                        stroke,
                    });

                    return (
                        <article
                            key={it.label}
                            className="group rounded-2xl border border-gray-200/70 bg-white/90 shadow-card hover:shadow-xl transition-all backdrop-blur-sm"
                        >
                            <div className="p-5">
                                <header className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={[
                                                "inline-flex h-9 w-9 items-center justify-center rounded-xl ring-1 ring-inset",
                                                tone === "emerald" && "bg-emerald-50 ring-emerald-100",
                                                tone === "cyan" && "bg-cyan-50 ring-cyan-100",
                                                tone === "orange" && "bg-orange-50 ring-orange-100",
                                                tone === "lime" && "bg-lime-50 ring-lime-100",
                                            ]
                                                .filter(Boolean)
                                                .join(" ")}
                                        >
                                            <Fuel className="h-5 w-5 text-ink/70" />
                                        </span>
                                        <h3 className="font-semibold text-ink">{it.label}</h3>
                                    </div>

                                    {it.delta === undefined ? (
                                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                                            s/ variação
                                        </span>
                                    ) : (
                                        <span
                                            className={[
                                                "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs",
                                                down && "bg-red-50 text-red-700 ring-1 ring-red-100",
                                                up && "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
                                                !down && !up && "bg-gray-100 text-gray-700",
                                            ]
                                                .filter(Boolean)
                                                .join(" ")}
                                        >
                                            {down ? (
                                                <TrendingDown className="h-3.5 w-3.5" />
                                            ) : up ? (
                                                <TrendingUp className="h-3.5 w-3.5" />
                                            ) : null}
                                            {nf.format(Math.abs(it.delta ?? 0))} €
                                            {it.pct !== undefined && (
                                                <span className="opacity-70">({pf.format(Math.abs(it.pct))})</span>
                                            )}
                                        </span>
                                    )}
                                </header>

                                <div className="mt-4">
                                    <div className="flex items-baseline gap-2">
                                        <div className="text-3xl font-extrabold tracking-tight text-ink">
                                            {fmt(it.price)}
                                        </div>
                                        <div className="text-sm text-gray-500">/L</div>
                                    </div>
                                    <div className="mt-2">
                                        <Sparkline
                                            prev={it.prev as number}
                                            now={it.price as number}
                                            stroke={stroke}
                                        />
                                    </div>
                                </div>

                                <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
                                    <div className="rounded-lg border bg-white px-3 py-2">
                                        <dt className="text-gray-500">Semana anterior</dt>
                                        <dd className="font-medium text-gray-800">
                                            {fmt(it.prev)} <span className="text-gray-500">/L</span>
                                        </dd>
                                    </div>
                                    <div className="rounded-lg border bg-white px-3 py-2">
                                        <dt className="text-gray-500">Tendência</dt>
                                        <dd className="font-medium">
                                            {it.delta === undefined ? (
                                                <span className="text-gray-600">—</span>
                                            ) : down ? (
                                                <span className="text-red-600">↓ em {nf.format(Math.abs(it.delta))} €</span>
                                            ) : up ? (
                                                <span className="text-emerald-600">↑ em {nf.format(Math.abs(it.delta))} €</span>
                                            ) : (
                                                <span className="text-gray-600">Estável</span>
                                            )}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </article>
                    );
                })}
            </section>


            {/* Páginas relacionadas */}
            <RelatedPages />
        </div>
    );
}
