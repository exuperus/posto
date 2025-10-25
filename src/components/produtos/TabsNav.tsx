// src/components/produtos/TabsNav.tsx
"use client";

import Link from "next/link";

type Categoria = "LUBRIFICANTES" | "ADITIVOS" | "LAVAGEM" | "ACESSORIOS" | "OUTROS";
type Tab = { key?: Categoria; label: string };

export default function TabsNav({ tabs, cat, q }: { tabs: Tab[]; cat?: Categoria; q: string }) {
    return (
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
    );
}
