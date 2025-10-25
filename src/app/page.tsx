import Hero from "@/components/Hero";
import QuickActions from "@/components/QuickActions";
import { headers } from "next/headers";

export const revalidate = 1800;

// ===== DEBUG MÓDULO =====
console.log("[/] Módulo HomePage carregado.");
console.log("   - NODE_ENV:", process.env.NODE_ENV);
console.log("   - DATABASE_URL:", process.env.DATABASE_URL ? "✅ definida" : "❌ NÃO definida");
console.log("   - revalidate:", revalidate);


async function abs(path: string) {
    console.log("[/abs] Função chamada com path:", path);
    const h = await headers();
    console.log("[/abs] Headers disponíveis:", Object.fromEntries(h.entries()));

    const proto = h.get("x-forwarded-proto") ?? "http";
    const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
    const fullUrl = `${proto}://${host}${path}`;

    console.log("[/abs] URL absoluta construída:", fullUrl);
    return fullUrl;
}

async function getStation(): Promise<{ nome_comercial?: string } | {}> {
    console.log("[/getStation] Início da função.");
    const url = await abs("/api/station");
    console.log("[/getStation] Fetching:", url);

    try {
        const res = await fetch(url, { cache: "no-store", next: { revalidate } });
        console.log("[/getStation] Resposta HTTP:", res.status, res.statusText);

        if (!res.ok) {
            console.warn("[/getStation] Falha no fetch da estação (status != ok).");
            return {};
        }

        const json = await res.json();
        console.log("[/getStation] Dados recebidos:", json);
        return json;
    } catch (err) {
        console.error("[/getStation] Erro durante o fetch:", err);
        return {};
    }
}

export default async function HomePage() {
    console.log("[/HomePage] Render iniciado.");

    const station = await getStation();
    console.log("[/HomePage] station:", station);

    const title = "Sandrina & Mário, LDA";
    console.log("[/HomePage] Título definido:", title);

    console.log("[/HomePage] A renderizar componente <Hero />.");
    const element = (
        <>
            <Hero title={title} />
            <QuickActions />
        </>
    );
    console.log("[/HomePage] Render concluído.\n");

    return element;
}
