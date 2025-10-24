// src/app/servicos/page.tsx
import { prisma } from "@/lib/prisma"; // se o teu singleton ainda está em "@/db", troca este import

export const revalidate = 86400; // revalida 1x/dia (ISR)

export default async function ServicosPage() {
    // lê diretamente da BD (nada de fetch a /api durante a build)
    const st = await prisma.station.findFirst({
        select: { servicosJson: true },
    });

    // parse seguro do JSON
    let servicos: Array<{ nome: string; descricao?: string }> = [];
    if (st?.servicosJson) {
        try {
            const parsed = JSON.parse(st.servicosJson);
            if (Array.isArray(parsed)) servicos = parsed;
        } catch {
            // se o JSON estiver inválido, mantém lista vazia
        }
    }

    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold">Serviços</h1>
            <ul className="grid gap-3 md:grid-cols-2">
                {servicos.map((s, i) => (
                    <li key={i} className="rounded-xl border p-4 bg-white">
                        <h3 className="font-semibold">{s.nome}</h3>
                        {s.descricao && <p className="text-sm text-gray-600 mt-1">{s.descricao}</p>}
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
}
