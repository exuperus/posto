// src/app/produtos/page.tsx
import Link from "next/link";
import { JSX } from "react";
import { Droplets, Beaker, Sparkles, Package, Phone, MessageCircle } from "lucide-react";

export const revalidate = 300;

const PHONE = process.env.NEXT_PUBLIC_PHONE ?? "911 111 111";
const WHATS = (process.env.NEXT_PUBLIC_WHATS ?? PHONE).replace(/\s+/g, "");

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
    const res = await fetch(`${baseUrl()}/api/produtos`, { next: { revalidate: 300 } });
    const json = await res.json();
    const arr: ProdutoAPI[] = Array.isArray(json) ? json : json.data ?? [];
    return arr.map((p) => ({
        id: p.id,
        nome: p.nome,
        categoria: p.categoria,
        descricao: p.descricao ?? "",
    }));
}

type PageProps = { searchParams: Promise<{ cat?: Categoria; q?: string }> };

export default async function ProdutosPage(props: PageProps) {
    // Next.js 15 → searchParams é uma Promise
    const searchParams = await props.searchParams;

    const cat = (searchParams?.cat as Categoria | undefined) ?? undefined;
    const q = (searchParams?.q ?? "").trim().toLowerCase();

    const dataAll = await getProdutos();
    const data = dataAll.filter((p) => {
        const okCat = !cat || p.categoria === cat;
        const okQ = !q || p.nome.toLowerCase().includes(q) || p.descricao.toLowerCase().includes(q);
        return okCat && okQ;
    });

    const tabs: { key?: Categoria; label: string }[] = [
        { label: "Todos" },
        { key: "LUBRIFICANTES", label: labels.LUBRIFICANTES },
        { key: "ADITIVOS", label: labels.ADITIVOS },
        { key: "LAVAGEM", label: labels.LAVAGEM },
        { key: "ACESSORIOS", label: labels.ACESSORIOS },
        { key: "OUTROS", label: labels.OUTROS },
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
            {/* Título */}
            <header className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
                <p className="text-gray-600">
                    Catálogo por categoria. Fale connosco para aconselhamento e encomendas.
                </p>
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
                                    selected
                                        ? "bg-green-600 text-white ring-green-600"
                                        : "bg-white text-gray-700 ring-gray-200 hover:bg-gray-50",
                                ].join(" ")}
                            >
                                {t.label}
                            </Link>
                        );
                    })}
                </nav>

                <form method="GET" className="flex items-center gap-2">
                    {cat && <input type="hidden" name="cat" value={cat} />}
                    <input
                        name="q"
                        placeholder="Procurar (ex.: escovas 550)"
                        defaultValue={q}
                        className="w-64 rounded-lg border px-3 py-2 text-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-green-600 outline-none"
                        aria-label="Pesquisar produtos"
                    />
                    <button
                        className="rounded-lg bg-green-600 text-white text-sm font-semibold px-3 py-2 hover:bg-green-700"
                        type="submit"
                    >
                        Procurar
                    </button>
                </form>
            </div>

            {/* Lista */}
            {data.length === 0 ? (
                <div className="rounded-xl border bg-white p-6 text-center text-gray-600">
                    Sem resultados {q ? <>para <span className="font-medium">“{q}”</span></> : null}.{" "}
                    <Link href="/produtos" className="text-green-700 font-medium">Limpar filtros</Link>.
                </div>
            ) : (
                <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {data.map((p) => (
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
                                <div className="absolute -right-2 -bottom-2 opacity-20 scale-150">
                                    {icons[p.categoria]}
                                </div>
                            </div>

                            {/* Corpo */}
                            <div className="px-5 pb-5 pt-4">
                                <div className="text-xs uppercase tracking-wide text-gray-600 mb-1">
                                    {labels[p.categoria]}
                                </div>
                                <h3 className="font-semibold text-gray-900">{p.nome}</h3>
                                {p.descricao ? (
                                    <p className="text-sm text-gray-600 mt-1 line-clamp-3">{p.descricao}</p>
                                ) : null}
                            </div>
                        </article>
                    ))}
                </section>
            )}

            {/* Barra fixa de contacto (um único CTA global) — AGORA À DIREITA */}
            <div className="fixed bottom-4 right-4 z-30 pointer-events-none">
                <div className="pointer-events-auto">
                    <div className="rounded-2xl bg-white/90 backdrop-blur ring-1 ring-gray-200 shadow-lg p-3 flex items-center gap-3">
                        <div className="text-sm text-gray-700">
                            Precisa de ajuda a escolher? Fale connosco.
                        </div>
                        <div className="flex gap-2">
                            <a
                                href={`https://wa.me/351${WHATS}`}
                                className="inline-flex items-center gap-2 rounded-lg ring-1 ring-green-600 px-3 py-2 text-sm font-semibold text-green-700 hover:bg-green-50"
                                aria-label="Falar no WhatsApp"
                            >
                                <MessageCircle className="h-4 w-4" />
                                WhatsApp
                            </a>
                            <a
                                href={`tel:${PHONE}`}
                                className="inline-flex items-center gap-2 rounded-lg bg-green-600 text-white px-3 py-2 text-sm font-semibold hover:bg-green-700"
                                aria-label="Ligar"
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
