"use client";
import { useEffect, useRef, useState } from "react";

type Tipo = 'GASOLEO' | 'GASOLEO_HI_ENERGY' | 'GASOLINA_95' | 'GASOLEO_AGRICOLA';

type Row = {
    tipo: Tipo;
    preco_atual: number;
    preco_anterior: number | null;
};

type FuelApiRow = {
    tipo: Tipo;
    preco_atual: string | null;
    preco_anterior: string | null;
    vigencia_inicio: string | null;
    updatedAt: string | null;
};

const LABELS: Record<Tipo, string> = {
    GASOLEO: 'Gasóleo',
    GASOLEO_HI_ENERGY: 'Gasóleo Hi-Energy',
    GASOLINA_95: 'Gasolina 95',
    GASOLEO_AGRICOLA: 'Gasóleo Agrícola',
};

export default function AdminPrecosPage() {
    const [rows, setRows] = useState<Row[]>([
        { tipo: 'GASOLEO', preco_atual: 0, preco_anterior: null },
        { tipo: 'GASOLEO_HI_ENERGY', preco_atual: 0, preco_anterior: null },
        { tipo: 'GASOLINA_95', preco_atual: 0, preco_anterior: null },
        { tipo: 'GASOLEO_AGRICOLA', preco_atual: 0, preco_anterior: null },
    ]);
    const [date, setDate] = useState<string>('');
    const [time, setTime] = useState<string>('06:00');
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);
    const scheduleLoadedRef = useRef(false);

    useEffect(() => {
        (async () => {
            try {
                const r = await fetch('/api/combustiveis', { cache: 'no-store' });
                if (!r.ok) {
                    console.warn('[Admin Preços] Erro ao buscar combustíveis:', r.status, r.statusText);
                    return;
                }
                const data: FuelApiRow[] = await r.json();

                setRows((prev) => {
                    // Garantir que todos os tipos sempre estão presentes
                    const tiposEsperados: Tipo[] = ['GASOLEO', 'GASOLEO_HI_ENERGY', 'GASOLINA_95', 'GASOLEO_AGRICOLA'];
                    const next: Row[] = tiposEsperados.map((tipo) => {
                        const existing = prev.find((r) => r.tipo === tipo);
                        const apiData = data.find((f) => f.tipo === tipo);
                        
                        if (apiData) {
                            const precoAtual =
                                apiData.preco_atual == null ? 0 : Number(String(apiData.preco_atual).replace(',', '.'));
                            const precoAnterior =
                                apiData.preco_anterior == null ? null : Number(String(apiData.preco_anterior).replace(',', '.'));

                            return {
                                tipo,
                                preco_atual: Number.isFinite(precoAtual) ? precoAtual : 0,
                                preco_anterior:
                                    precoAnterior === null || Number.isFinite(precoAnterior) ? precoAnterior : null,
                            };
                        }
                        
                        // Se não existe na API mas existe no estado anterior, manter
                        if (existing) {
                            return existing;
                        }
                        
                        // Se não existe nem na API nem no estado, criar novo com valores padrão
                        return {
                            tipo,
                            preco_atual: 0,
                            preco_anterior: null,
                        };
                    });
                    
                    return next;
                });

                if (!scheduleLoadedRef.current) {
                    const withSchedule = data.find((f) => f.vigencia_inicio);
                    if (withSchedule?.vigencia_inicio) {
                        const dt = new Date(withSchedule.vigencia_inicio);
                        setDate(dt.toISOString().slice(0, 10));
                        setTime(dt.toISOString().slice(11, 16));
                        scheduleLoadedRef.current = true;
                    }
                }
            } catch (error) {
                console.error('[Admin Preços] Erro ao carregar dados:', error);
                // Em caso de erro, garantir que todos os tipos ainda estão presentes
                setRows((prev) => {
                    const tiposEsperados: Tipo[] = ['GASOLEO', 'GASOLEO_HI_ENERGY', 'GASOLINA_95', 'GASOLEO_AGRICOLA'];
                    const next: Row[] = tiposEsperados.map((tipo) => {
                        const existing = prev.find((r) => r.tipo === tipo);
                        return existing || { tipo, preco_atual: 0, preco_anterior: null };
                    });
                    return next;
                });
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function onChange(i: number, field: 'preco_atual' | 'preco_anterior', value: string) {
        setRows((prev) =>
            prev.map((r, idx) => {
                if (idx !== i) return r;
                if (field === 'preco_atual') {
                    const num = value.trim() === '' ? 0 : Number(value.replace(',', '.'));
                    return { ...r, preco_atual: Number.isFinite(num) ? num : 0 };
                } else {
                    const raw = value.trim() === '' ? null : Number(value.replace(',', '.'));
                    const num = raw === null ? null : Number.isFinite(raw) ? (raw as number) : null;
                    return { ...r, preco_anterior: num };
                }
            })
        );
    }

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSaving(true);
        setMsg(null);

        const isoDate = date ? `${date}T${(time || '00:00').padEnd(5, '0')}` : null;
        const payload: { items: Array<Row & { vigencia_inicio: string | null }> } = {
            items: rows.map((r) => ({ ...r, vigencia_inicio: isoDate ? new Date(isoDate).toISOString() : null })),
        };

        const res = await fetch('/api/admin/fuels', {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(payload),
        });

        setSaving(false);
        setMsg(res.ok ? 'Preços guardados com sucesso ✅' : 'Erro ao guardar');
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Administração — preços</h1>

            <form onSubmit={onSubmit} className="space-y-4">
                <div className="rounded-2xl border bg-white overflow-x-auto">
                    <div className="p-4 flex flex-col gap-3 md:flex-row md:items-center">
                        <label className="text-sm flex items-center gap-2">
                            Vigência (data)
                            <input
                                type="date"
                                className="rounded border px-2 py-1"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </label>
                        <label className="text-sm flex items-center gap-2">
                            Hora
                            <input
                                type="time"
                                className="rounded border px-2 py-1"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                step={60}
                            />
                        </label>
                        <span className="text-xs text-gray-500">
                            Se escolher uma data/horário no futuro, o preço fica agendado e só será publicado nessa altura.
                        </span>
                    </div>

                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-left">
                        <tr>
                            <th className="p-3">Combustível</th>
                            <th className="p-3 text-right">Preço atual (€/L)</th>
                            <th className="p-3 text-right">Semana anterior (€/L)</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows.length === 0 && (
                            <tr>
                                <td colSpan={3} className="p-3 text-center text-gray-500">
                                    A carregar...
                                </td>
                            </tr>
                        )}
                        {rows.map((r, i) => (
                            <tr key={r.tipo} className="border-t">
                                <td className="p-3 font-medium">{LABELS[r.tipo]}</td>

                                <td className="p-3 text-right">
                                    <input
                                        className="w-28 text-right rounded border px-2 py-1"
                                        value={r.preco_atual === 0 ? '' : String(r.preco_atual)}
                                        onChange={(e) => onChange(i, 'preco_atual', e.target.value)}
                                        placeholder="0.00"
                                        inputMode="decimal"
                                    />
                                </td>

                                <td className="p-3 text-right">
                                    <input
                                        className="w-28 text-right rounded border px-2 py-1"
                                        value={r.preco_anterior ?? ''}
                                        onChange={(e) => onChange(i, 'preco_anterior', e.target.value)}
                                        placeholder="0.00"
                                        inputMode="decimal"
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <button className="rounded bg-black text-white px-4 py-2 disabled:opacity-60" disabled={saving}>
                    {saving ? 'A guardar…' : 'Guardar preços'}
                </button>

                {msg && <p className="text-sm">{msg}</p>}
            </form>
        </div>
    );
}
