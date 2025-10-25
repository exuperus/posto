// src/components/produtos/SearchFormClient.tsx
"use client";

export default function SearchFormClient({ cat, q }: { cat?: string; q: string }) {
    return (
        <form
            method="GET"
            className="flex items-center gap-2"
            onSubmit={() => console.log("[/produtos] submit pesquisa:", { cat, q })}
        >
            {cat ? <input type="hidden" name="cat" value={cat} /> : null}
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
    );
}
