"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    console.log("[LoginForm] Componente montado no cliente.");

    const [key, setKey] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);
    const router = useRouter();

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        console.log("[LoginForm] Submissão iniciada.");
        console.log("[LoginForm] Chave digitada:", key ? "(fornecida)" : "vazia");

        setLoading(true);
        setMsg(null);

        try {
            console.log("[LoginForm] A enviar requisição POST para /api/admin/login...");
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key }),
            });

            console.log("[LoginForm] Resposta recebida:", res.status, res.statusText);
            const json = await res.json().catch(() => ({}));
            console.log("[LoginForm] Corpo JSON da resposta:", json);

            setLoading(false);

            if (res.ok && json.ok) {
                console.log("[LoginForm] Login bem-sucedido — cookie criado com sucesso.");
                setMsg(null);
                // Redirecionar para /admin
                router.push("/admin");
                console.log("[LoginForm] A redirecionar para /admin...");
            } else {
                console.warn("[LoginForm] Login falhou. Erro recebido:", json.error);
                setMsg(json?.error ?? "Chave inválida");
            }
        } catch (err) {
            console.error("[LoginForm] Erro de rede ou exceção no fetch:", err);
            setMsg("Erro de rede ou servidor.");
            setLoading(false);
        }
    }

    console.log("[LoginForm] Renderização — loading:", loading, "| msg:", msg);

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
                        onChange={(e) => {
                            setKey(e.target.value);
                            console.log("[LoginForm] Campo atualizado:", e.target.value);
                        }}
                        autoFocus
                    />
                </label>

                <button
                    className="w-full rounded bg-black text-white px-4 py-2 disabled:opacity-60"
                    disabled={loading}
                >
                    {loading ? "A entrar…" : "Entrar"}
                </button>

                {msg && (
                    <p className="text-sm text-red-600 mt-1">
                        {msg}
                    </p>
                )}
            </form>
        </div>
    );
}
