'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
    const [key, setKey] = useState('')
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState<string | null>(null)
    const router = useRouter()

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setMsg(null)

        const res = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ key }),
        })

        setLoading(false)
        if (res.ok) {
            router.push('/admin')
        } else {
            const j = await res.json().catch(() => ({}))
            setMsg(j?.error ?? 'Chave inválida')
        }
    }

    return (
        <div className="max-w-sm mx-auto mt-16 rounded-2xl border bg-white p-6 shadow-sm">
            <h1 className="text-xl font-semibold mb-4">Área reservada</h1>
            <form onSubmit={onSubmit} className="space-y-3">
                <label className="block text-sm">
                    Chave
                    <input
                        type="password"
                        className="mt-1 w-full rounded border px-3 py-2"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        autoFocus
                    />
                </label>

                <button
                    className="w-full rounded bg-black text-white px-4 py-2 disabled:opacity-60"
                    disabled={loading}
                >
                    {loading ? 'A entrar…' : 'Entrar'}
                </button>

                {msg && <p className="text-sm text-red-600">{msg}</p>}
            </form>
        </div>
    )
}
