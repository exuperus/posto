// src/components/CookieNotice.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "cookie_notice_dismissed_v1";

export default function CookieNotice() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Só mostra se ainda não tiver sido escondido antes
        const dismissed = typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) === "1";
        if (!dismissed) setVisible(true);
    }, []);

    const dismiss = () => {
        try {
            localStorage.setItem(STORAGE_KEY, "1");
        } catch {}
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div
            role="region"
            aria-label="Aviso de cookies"
            className="fixed inset-x-0 bottom-4 z-[60] px-3 sm:px-4"
        >
            <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white/95 backdrop-blur shadow-xl">
                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-gray-700">
                        Usamos <strong>cookies estritamente necessários</strong> ao
                        funcionamento do website (sem fins de marketing). Saiba mais na nossa{" "}
                        <Link
                            href="/politica-privacidade#cookies"
                            className="text-emerald-700 font-medium hover:underline"
                        >
                            Política de Privacidade
                        </Link>.
                    </p>

                    <div className="flex gap-2 sm:shrink-0">
                        {/* Se no futuro adicionares analíticas/cookies opcionais,
                poderás trocar por dois botões: "Rejeitar" / "Aceitar" */}
                        <button
                            type="button"
                            onClick={dismiss}
                            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            Ok, percebi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
