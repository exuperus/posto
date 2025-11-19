"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Link from "next/link";

export default function PromocaoBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        // Verificar se já foi fechada hoje
        if (typeof window === "undefined") return;

        const todayKey = `promocao-banner-${new Date().toDateString()}`;
        const wasDismissed = localStorage.getItem(todayKey);

        if (!wasDismissed) {
            // Mostrar a notificação
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
        const todayKey = `promocao-banner-${new Date().toDateString()}`;
        localStorage.setItem(todayKey, "dismissed");
    };

    if (!isVisible || isDismissed) {
        return null;
    }

    return (
        <div
            className={`
                fixed bottom-4 right-4 z-50
                max-w-sm
                bg-white border-2 border-green-500
                rounded-lg shadow-2xl
                transform transition-all duration-500 ease-in-out
                ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
            `}
        >
            <div className="p-4">
                {/* Botão fechar */}
                <button
                    onClick={handleDismiss}
                    className="
                        absolute top-2 right-2
                        p-1 rounded-lg
                        text-gray-400 hover:text-gray-600
                        transition-colors
                    "
                    aria-label="Fechar"
                >
                    <X className="h-4 w-4" />
                </button>

                {/* Conteúdo */}
                <div className="pr-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                        Promoção Especial
                    </h3>
                    <p className="text-sm text-gray-700 mb-3">
                        Abasteça 50€ ou mais e ganhe uma lavagem grátis!
                    </p>
                    <Link
                        href="/promocoes"
                        onClick={handleDismiss}
                        className="
                            inline-block
                            bg-green-600 text-white
                            px-4 py-2 rounded-lg
                            font-semibold text-sm
                            hover:bg-green-700
                            transition-colors
                        "
                    >
                        Ver Promoção
                    </Link>
                </div>
            </div>
        </div>
    );
}

