// src/app/produtos/page.tsx
import Link from "next/link";
import { JSX } from "react";
import { Droplets, Beaker, Sparkles, Package } from "lucide-react";
import TabsNav from "@/components/produtos/TabsNav";
import SearchFormClient from "@/components/produtos/SearchFormClient";
import ContactBar from "@/components/produtos/ContactBar";
import { prisma } from "@/lib/prisma"; // ✅ lê direto do Prisma (sem fetch)

export const revalidate = 300;

// DEBUG
const PHONE = process.env.NEXT_PUBLIC_PHONE ?? "938452320";
const WHATS = (process.env.NEXT_PUBLIC_WHATS ?? PHONE).replace(/\s+/g, "");

type Categoria = "LUBRIFICANTES" | "ADITIVOS" | "LAVAGEM" | "ACESSORIOS" | "OUTROS";

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

// ✅ Lê direto da BD (evita problemas de URL/fetch)
async function getProdutos(): Promise<Produto[]> {
    const rows = await prisma.product.findMany({
        where: { ativo: true },
        orderBy: [{ categoria: "asc" }, { nome: "asc" }],
        select: { id: true, nome: true, categoria: true, descricao: true },
    });

    return rows.map((r) => ({
        id: r.id,
        nome: r.nome,
        categoria: r.categoria as Categoria,
        descricao: r.descricao ?? "",
    }));
}

// Next 15 → searchParams é Promise
type PageProps = { searchParams: Promise<{ cat?: Categoria; q?: string }> };

export default async function ProdutosPage(props: PageProps) {
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

    const waHref = `https://wa.me/351${WHATS}`;
    const telHref = `tel:${PHONE}`;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
            {/* Título */}
            <header className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
                <p className="text-gray-600">Catálogo por categoria. Fale connosco para aconselhamento e encomendas.</p>
            </header>

            {/* Tabs + Pesquisa */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <TabsNav tabs={tabs} cat={cat} q={q} />
                <SearchFormClient cat={cat} q={q} />
            </div>

            {/* Lista */}
            {data.length === 0 ? (
                <div className="rounded-xl border bg-white p-6 text-center text-gray-600">
                    Sem resultados {q ? <>para <span className="font-medium">“{q}”</span></> : null}.{" "}
                    <Link href="/produtos" className="text-green-700 font-medium">
                        Limpar filtros
                    </Link>
                    .
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
                                <div className="absolute -right-2 -bottom-2 opacity-20 scale-150">{icons[p.categoria]}</div>
                            </div>

                            {/* Corpo */}
                            <div className="px-5 pb-5 pt-4">
                                <div className="text-xs uppercase tracking-wide text-gray-600 mb-1">{labels[p.categoria]}</div>
                                <h3 className="font-semibold text-gray-900">{p.nome}</h3>
                                {p.descricao ? <p className="text-sm text-gray-600 mt-1 line-clamp-3">{p.descricao}</p> : null}
                            </div>
                        </article>
                    ))}
                </section>
            )}

            {/* Barra fixa de contacto */}
            <ContactBar waHref={waHref} telHref={telHref} />
        </div>
    );
}
