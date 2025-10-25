// src/app/servicos/page.tsx
import { prisma } from "@/lib/prisma";
export const revalidate = 86400; // revalida 1x/dia

// ===== DEBUG DE MÓDULO =====
console.log("[/servicos] Módulo carregado.");
console.log("   - NODE_ENV:", process.env.NODE_ENV);
console.log("   - DATABASE_URL:", process.env.DATABASE_URL ? "definida" : "NÃO definida");
console.log("   - revalidate:", revalidate);

export default async function ServicosPage() {
    console.log("[/servicos] Render iniciado.");

    try {
        console.log("[/servicos] A consultar Prisma.station.findFirst()...");
        const st = await prisma.station.findFirst({
            select: { servicosJson: true },
        });

        if (!st) {
            console.warn("[/servicos] Nenhuma estação encontrada na BD.");
        } else {
            console.log("[/servicos] Estação encontrada. servicosJson:", st.servicosJson);
        }

        // parse seguro do JSON
        let servicos: Array<{ nome: string; descricao?: string }> = [];
        if (st?.servicosJson) {
            try {
                const parsed = JSON.parse(st.servicosJson);
                if (Array.isArray(parsed)) {
                    servicos = parsed;
                    console.log("[/servicos] JSON parseado corretamente. Total:", servicos.length);
                    if (servicos.length > 0) {
                        console.log("[/servicos] Exemplo 1º serviço:", servicos[0]);
                    }
                } else {
                    console.warn("[/servicos] JSON não é um array:", parsed);
                }
            } catch (e) {
                console.error("[/servicos] Erro ao fazer JSON.parse(servicosJson):", e);
            }
        } else {
            console.warn("[/servicos] servicosJson está vazio ou indefinido.");
        }

        console.log("[/servicos] A renderizar página com", servicos.length, "serviços.");

        return (
            <div className="space-y-4">
                <h1 className="text-3xl font-bold">Serviços</h1>
                <ul className="grid gap-3 md:grid-cols-2">
                    {servicos.map((s, i) => (
                        <li
                            key={i}
                            className="rounded-xl border p-4 bg-white hover:shadow transition"
                        >
                            <h3 className="font-semibold text-gray-900">{s.nome}</h3>
                            {s.descricao && (
                                <p className="text-sm text-gray-600 mt-1">{s.descricao}</p>
                            )}
                        </li>
                    ))}

                    {servicos.length === 0 && (
                        <li className="rounded-xl border p-4 bg-white text-sm text-gray-600">
                            Sem serviços configurados.
                        </li>
                    )}
                </ul>
            </div>
        );
    } catch (err) {
        console.error("[/servicos] Erro inesperado ao carregar serviços:", err);
        return (
            <div className="p-6 rounded-xl border bg-red-50 text-red-700">
                Erro ao carregar serviços.
            </div>
        );
    } finally {
        console.log("[/servicos] Render concluído.\n");
    }
}
