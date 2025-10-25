// src/app/produtos/page.tsx
import Link from "next/link";
import { JSX } from "react";
import { Droplets, Beaker, Sparkles, Package, Phone, MessageCircle } from "lucide-react";

export const revalidate = 300;

// DEBUG
const PHONE = process.env.NEXT_PUBLIC_PHONE ?? "911 111 111";
const WHATS = (process.env.NEXT_PUBLIC_WHATS ?? PHONE).replace(/\s+/g, "");

console.log("[/produtos] Módulo carregado");
console.log("   - NODE_ENV:", process.env.NODE_ENV);
console.log("   - VERCEL:", !!process.env.VERCEL);
console.log("   - NEXT_PUBLIC_PHONE:", PHONE);
console.log("   - NEXT_PUBLIC_WHATS:", WHATS);
console.log("   - revalidate:", revalidate);

type Categoria = "LUBRIFICANTES" | "ADITIVOS" | "LAVAGEM" | "ACESSORIOS" | "OUTROS";

type ProdutoAPI = {
    id: number;
    nome: string;
    categoria: Categoria;
    descricao?: string | null;
};

type Produto = {
    id: number;
    nome: string;
    categoria: Categoria;
    descricao: string;
};

const labels: Record<Categoria, string> = {
    LUBRIFICANTES: "Lubrificantes",
    ADITIVOS: "Aditivos / Fluidos",
    LAVAGEM: "Lavagem & Limpeza",
    ACESSORIOS: "Acessórios",
    OUTROS: "Outros",
};

const colors: Record<Categoria, string> = {
    LUBRIFICANTES: "from-amber-100 to-amber-50 ring-amber-200",
    ADITIVOS: "from-cyan-100 to-cyan-50 ring-cyan-200",
    LAVAGEM: "from-blue-100 to-blue-50 ring-blue-200",
    ACESSORIOS: "from-slate-100 to-slate-50 ring-slate-200",
    OUTROS: "from-emerald-100 to-emerald-50 ring-emerald-200",
};

const icons: Record<Categoria, JSX.Element> = {
    LUBRIFICANTES: <Droplets className="h-7 w-7" />,
    ADITIVOS: <Beaker className="h-7 w-7" />,
    LAVAGEM: <Sparkles className="h-7 w-7" />,
    ACESSORIOS: <Package className="h-7 w-7" />,
    OUTROS: <Package className="h-7 w-7" />,
};

function baseUrl() {
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "");
    return "http://localhost:3000";
}

async function getProdutos(): Promise<Produto[]> {
    const url = `${baseUrl()}/api/produtos`;
    console.log("[/produtos] GET", url);
    try {
        const res = await fetch(url, { next: { revalidate: 300 } });
        console.log("[/produtos] /api/produtos status:", res.status, res.statusText);
        const json = await res.json().catch((e) => {
            console.error("[/produtos] Falha a parsear JSON:", e);
            return null;
        });
        console.log("[/produtos] JSON bruto recebido:", Array.isArray(json) ? `array(${json.length})` : typeof json);

        const arr: ProdutoAPI[] = Array.isArray(json) ? json : json?.data ?? [];
        console.log("[/produtos] Array normalizado:", `array(${arr.length})`);
        if (arr.length > 0) {
            console.log("[/produtos] Exemplo 1º item:", arr[0]);
        }

        const mapped = arr.map((p) => ({
            id: p.id,
            nome: p.nome,
            categoria: p.categoria,
            descricao: p.descricao ?? "",
        }));

        console.log("[/produtos] Mapeado para Produto:", `array(${mapped.length})`);
        return mapped;
    } catch (err) {
        console.error("[/produtos] Falha no fetch /api/produtos:", err);
        return [];
    }
}

// Next 15 → searchParams é Promise
type PageProps = { searchParams: Promise<{ cat?: Categoria; q?: string }> };

export default async function ProdutosPage(props: PageProps) {
    console.log("[/produtos] Render iniciado");
    const searchParams = await props.searchParams;
    console.log("[/produtos] searchParams:", searchParams);

    const cat = (searchParams?.cat as Categoria | undefined) ?? undefined;
    const q = (searchParams?.q ?? "").trim().toLowerCase();

    console.log("[/produtos] filtros -> cat:", cat, "| q:", q);

    const dataAll = await getProdutos();
    console.log("[/produtos] Total produtos (antes do filtro):", dataAll.length);

    const data = dataAll.filter((p) => {
        const okCat = !cat || p.categoria === cat;
        const okQ = !q || p.nome.toLowerCase().includes(q) || p.descricao.toLowerCase().includes(q);
        const keep = okCat && okQ;
        if (q && keep) {
            console.log("[/produtos] match:", { id: p.id, nome: p.nome, categoria: p.categoria });
        }
        return keep;
    });

    console.log("[/produtos] Total após filtro:", data.length);

    const tabs: { key?: Categoria; label: string }[] = [
        { label: "Todos" },
        { key: "LUBRIFICANTES", label: labels.LUBRIFICANTES },
        { key: "ADITIVOS", label: labels.ADITIVOS },
        { key: "LAVAGEM", label: labels.LAVAGEM },
        { key: "ACESSORIOS", label: labels.ACESSORIOS },
        { key: "OUTROS", label: labels.OUTROS },
    ];

    // Links de contacto (CTA fixo)
    const waHref = `https://wa.me/351${WHATS}`;
    const telHref = `tel:${PHONE}`;
    console.log("[/produtos] waHref:", waHref);
    console.log("[/produtos] telHref:", telHref);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
            {/* Título */}
            <header className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
                <p className="text-gray-600">Catálogo por categoria. Fale connosco para aconselhamento e encomendas.</p>
            </header>

            {/* Tabs + Pesquisa */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <nav className="flex flex-wrap gap-2">
                    {tabs.map((t) => {
                        const selected = (t.key ?? undefined) === cat || (!t.key && !cat);
                        const href = t.key
                            ? `/produtos?cat=${t.key}${q ? `&q=${encodeURIComponent(q)}` : ""}`
                            : `/produtos${q ? `?q=${encodeURIComponent(q)}` : ""}`;
                        return (
                            <Link
                                key={t.label}
                                href={href}
                                className={[
                                    "px-3 py-1.5 rounded-full text-sm ring-1 transition",
                                    selected ? "bg-green-600 text-white ring-green-600" : "bg-white text-gray-700 ring-gray-200 hover:bg-gray-50",
                                ].join(" ")}
                                onClick={() => console.log("[/produtos] Tab click:", { tab: t.label, href })}
                            >
                                {t.label}
                            </Link>
                        );
                    })}
                </nav>

                <form method="GET" className="flex items-center gap-2" onSubmit={() => console.log("[/produtos] submit pesquisa:", { cat, q })}>
                    {cat && <input type="hidden" name="cat" value={cat} />}
                    <input
                        name="q"
                        placeholder="Procurar (ex.: escovas 550)"
                        defaultValue={q}
                        className="w-64 rounded-lg border px-3 py-2 text-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-green-600 outline-none"
                        aria-label="Pesquisar produtos"
                    />
                    <button className="rounded-lg bg-green-600 text-white text-sm font-semibold px-3 py-2 hover:bg-green-700" type="submit">
                        Procurar
                    </button>
                </form>
            </div>

            {/* Lista */}
            {data.length === 0 ? (
                <div className="rounded-xl border bg-white p-6 text-center text-gray-600">
                    Sem resultados {q ? <>para <span className="font-medium">“{q}”</span></> : null}.{" "}
                    <Link href="/produtos" className="text-green-700 font-medium" onClick={() => console.log("↩[/produtos] Limpar filtros click")}>
                        Limpar filtros
                    </Link>
                    .
                </div>
            ) : (
                <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {data.map((p) => {
                        console.log("[/produtos] render card:", { id: p.id, nome: p.nome, categoria: p.categoria });
                        return (
                            <article
                                key={p.id}
                                className="group rounded-2xl border ring-1 shadow-sm bg-white overflow-hidden hover:shadow-md transition"
                            >
                                {/* Header decorativo por categoria */}
                                <div className={["relative h-28 bg-gradient-to-br", colors[p.categoria]].join(" ")}>
                                    <svg className="absolute inset-0 h-full w-full opacity-15 mix-blend-overlay" aria-hidden="true">
                                        <defs>
                                            <pattern id={`dots-${p.id}`} width="16" height="16" patternUnits="userSpaceOnUse">
                                                <circle cx="1" cy="1" r="1"></circle>
                                            </pattern>
                                        </defs>
                                        <rect width="100%" height="100%" fill={`url(#dots-${p.id})`} />
                                    </svg>
                                    <div className="absolute -right-2 -bottom-2 opacity-20 scale-150">{icons[p.categoria]}</div>
                                </div>

                                {/* Corpo */}
                                <div className="px-5 pb-5 pt-4">
                                    <div className="text-xs uppercase tracking-wide text-gray-600 mb-1">{labels[p.categoria]}</div>
                                    <h3 className="font-semibold text-gray-900">{p.nome}</h3>
                                    {p.descricao ? <p className="text-sm text-gray-600 mt-1 line-clamp-3">{p.descricao}</p> : null}
                                </div>
                            </article>
                        );
                    })}
                </section>
            )}

            {/* Barra fixa de contacto */}
            <div className="fixed bottom-4 right-4 z-30 pointer-events-none">
                <div className="pointer-events-auto">
                    <div className="rounded-2xl bg-white/90 backdrop-blur ring-1 ring-gray-200 shadow-lg p-3 flex items-center gap-3">
                        <div className="text-sm text-gray-700">Precisa de ajuda a escolher? Fale connosco.</div>
                        <div className="flex gap-2">
                            <a
                                href={waHref}
                                className="inline-flex items-center gap-2 rounded-lg ring-1 ring-green-600 px-3 py-2 text-sm font-semibold text-green-700 hover:bg-green-50"
                                aria-label="Falar no WhatsApp"
                                onClick={() => console.log("[/produtos] WhatsApp click:", waHref)}
                            >
                                <MessageCircle className="h-4 w-4" />
                                WhatsApp
                            </a>
                            <a
                                href={telHref}
                                className="inline-flex items-center gap-2 rounded-lg bg-green-600 text-white px-3 py-2 text-sm font-semibold hover:bg-green-700"
                                aria-label="Ligar"
                                onClick={() => console.log("[/produtos] Ligar click:", telHref)}
                            >
                                <Phone className="h-4 w-4" />
                                Ligar
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
