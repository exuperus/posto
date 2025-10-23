// src/app/admin/login/page.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function AdminLoginPage() {
    const [key, setKey] = useState('');

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        // exemplo simples: guarda a chave num cookie via API/middleware (adapta ao teu fluxo)
        const res = await fetch('/api/admin/session', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ key }),
        });
        if (res.ok) {
            window.location.href = '/admin';
        } else {
            alert('Chave inválida');
        }
    }

    return (
        <main className="min-h-[60vh] grid place-items-center p-6">
            <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 rounded-2xl border bg-white p-6">
                <h1 className="text-xl font-semibold">Login — Área Admin</h1>
                <input
                    type="password"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="ADMIN_KEY"
                    className="w-full rounded border px-3 py-2"
                    autoFocus
                />
                <button className="w-full rounded bg-black px-4 py-2 text-white">Entrar</button>
                <p className="text-xs text-gray-500">
                    Precisas de ajuda? <Link href="/" className="underline">voltar ao site</Link>
                </p>
            </form>
        </main>
    );
}
