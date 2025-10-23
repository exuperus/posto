export const revalidate = 86400

export default async function ServicosPage() {
    const rs = await fetch('http://localhost:3000/api/station', { next: { revalidate: 86400 } })
    const st = await rs.json()
    const servicos: Array<{nome:string;descricao?:string}> = st?.servicosJson ? JSON.parse(st.servicosJson) : []
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
            </ul>
        </div>
    )
}
