"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "cookie_notice_dismissed_v1";
console.log("[CookieNotice] Módulo carregado no cliente.");
console.log("   - STORAGE_KEY:", STORAGE_KEY);

export default function CookieNotice() {
    const [visible, setVisible] = useState(false);
    console.log("[CookieNotice] Componente montado (inicial). Estado visível:", visible);

    useEffect(() => {
        console.log("⚙[CookieNotice] useEffect executado (verificar localStorage).");

        try {
            if (typeof window !== "undefined") {
                const value = localStorage.getItem(STORAGE_KEY);
                console.log("[CookieNotice] Valor atual em localStorage:", value);

                const dismissed = value === "1";
                console.log("[CookieNotice] dismissed =", dismissed);

                if (!dismissed) {
                    console.log("[CookieNotice] Aviso será exibido (setVisible(true)).");
                    setVisible(true);
                } else {
                    console.log("[CookieNotice] Aviso já foi rejeitado anteriormente.");
                }
            } else {
                console.warn("⚠[CookieNotice] window ainda não definido (SSR).");
            }
        } catch (err) {
            console.error("[CookieNotice] Erro ao aceder ao localStorage:", err);
        }
    }, []);

    const dismiss = () => {
        console.log("[CookieNotice] Botão 'Ok, percebi' clicado.");
        try {
            localStorage.setItem(STORAGE_KEY, "1");
            console.log("[CookieNotice] STORAGE_KEY gravado como '1' no localStorage.");
        } catch (err) {
            console.error("[CookieNotice] Falha ao gravar no localStorage:", err);
        }
        setVisible(false);
        console.log("[CookieNotice] Aviso ocultado (setVisible(false)).");
    };

    if (!visible) {
        console.log("[CookieNotice] Não visível — não será renderizado.");
        return null;
    }

    console.log("[CookieNotice] A renderizar aviso de cookies...");

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
                            onClick={() =>
                                console.log("[CookieNotice] Link para política de privacidade clicado.")
                            }
                        >
                            Política de Privacidade
                        </Link>.
                    </p>

                    <div className="flex gap-2 sm:shrink-0">
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
