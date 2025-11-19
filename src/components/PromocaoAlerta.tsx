"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function PromocaoAlerta() {
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        // Verificar se já foi fechada hoje
        if (typeof window === "undefined") return;

        const todayKey = `promocao-alerta-${new Date().toDateString()}`;
        const wasDismissed = localStorage.getItem(todayKey);

        if (!wasDismissed) {
            // Mostrar o alerta
            setIsVisible(true);

            // Auto-fechar após 10 segundos
            const timer = setTimeout(() => {
                setIsVisible(false);
                setIsDismissed(true);
                localStorage.setItem(todayKey, "dismissed");
            }, 10000); // 10 segundos

            return () => clearTimeout(timer);
        } else {
            setIsDismissed(true);
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        setIsDismissed(true);

        // Guardar no localStorage que foi fechada hoje
        const todayKey = `promocao-alerta-${new Date().toDateString()}`;
        localStorage.setItem(todayKey, "dismissed");
    };

    if (!isVisible || isDismissed) {
        return null;
    }

    return (
        <div
            className={`
                w-full bg-green-600 text-white
                py-3 px-4
                transform transition-all duration-500 ease-in-out
                ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
            `}
        >
            <div className="container-pro mx-auto flex items-center justify-between gap-4">
                <div className="flex-1 text-center md:text-left">
                    <p className="text-sm md:text-base font-medium">
                        <strong>Nova Promoção!</strong> Abasteça 50€ ou mais e ganhe uma lavagem grátis.{" "}
                        <Link
                            href="/promocoes"
                            onClick={handleDismiss}
                            className="underline hover:no-underline font-semibold"
                        >
                            Ver detalhes
                        </Link>
                    </p>
                </div>
                <button
                    onClick={handleDismiss}
                    className="
                        text-white/80 hover:text-white
                        font-bold text-lg
                        transition-colors
                        flex-shrink-0
                    "
                    aria-label="Fechar"
                >
                    ×
                </button>
            </div>
        </div>
    );
}

