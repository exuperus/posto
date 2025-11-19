"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    console.log("[AdminLoginPage] Página carregada no cliente.");

    const [key, setKey] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [ok, setOk] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setOk(false);

        console.log("[AdminLoginPage] Enviando chave para /api/admin/login...");
        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key }),
            });

            console.log("[AdminLoginPage] Resposta HTTP:", res.status, res.statusText);
            const json = await res.json();
            console.log("[AdminLoginPage] Corpo da resposta:", json);

            if (!res.ok || !json.ok) {
                setError(json.error ?? "Erro de autenticação");
                console.warn("[AdminLoginPage] Falha no login:", json.error);
                return;
            }

            setOk(true);
            console.log("[AdminLoginPage] Login bem-sucedido.");
            
            // Aguardar um momento para garantir que o cookie está definido
            setTimeout(() => {
                console.log("[AdminLoginPage] A redirecionar para /admin/precos...");
                // Usar window.location para garantir que o cookie é enviado
                window.location.href = "/admin/precos";
            }, 100);
        } catch (err) {
            console.error("[AdminLoginPage] Erro no fetch:", err);
            setError("Falha de rede ou servidor.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="max-w-md mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold text-center">Login do Administrador</h1>

            <form
                onSubmit={handleSubmit}
                className="rounded-xl border p-6 bg-white shadow-sm space-y-4"
            >
                <div>
                    <label
                        htmlFor="key"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Chave de Acesso
                    </label>
                    <input
                        id="key"
                        type="password"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        placeholder="Insere a tua ADMIN_KEY"
                        className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-green-600 outline-none"
                    />
                </div>

                {error && (
                    <p className="text-red-600 text-sm font-medium">{error}</p>
                )}
                {ok && (
                    <p className="text-green-600 text-sm font-medium">
                        Login efetuado com sucesso! Cookie definido.
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-green-600 text-white py-2 font-semibold hover:bg-green-700 disabled:opacity-50"
                >
                    {loading ? "A autenticar..." : "Entrar"}
                </button>
            </form>
        </main>
    );
}
