"use client";

import { useState, useEffect } from "react";
import { Gift, X, ArrowRight } from "lucide-react";
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
            // Mostrar o banner
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
        <>
            {/* Spacer para empurrar o conteúdo para baixo quando o banner está visível */}
            {isVisible && (
                <div className="h-[60px] md:h-[72px]" aria-hidden="true" />
            )}
            <div
                className={`
                    fixed top-0 left-0 right-0 z-50
                    bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600
                    text-gray-900 shadow-lg
                    transform transition-all duration-500 ease-in-out
                    ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
                `}
            >
            <div className="container-pro mx-auto px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                    {/* Conteúdo */}
                    <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 rounded-lg bg-yellow-300/50">
                            <Gift className="h-5 w-5 text-yellow-900" />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-sm md:text-base">
                                🎉 <strong>Promoção Especial!</strong> Abasteça 50€ ou mais e ganhe uma{" "}
                                <strong>lavagem grátis!</strong>
                            </p>
                        </div>
                    </div>

                    {/* Botão de ação */}
                    <Link
                        href="/promocoes"
                        onClick={handleDismiss}
                        className="
                            flex items-center gap-2
                            bg-gray-900 text-white
                            px-4 py-2 rounded-lg
                            font-semibold text-sm
                            hover:bg-gray-800
                            transition-colors
                            whitespace-nowrap
                        "
                    >
                        Ver Promoção
                        <ArrowRight className="h-4 w-4" />
                    </Link>

                    {/* Botão fechar */}
                    <button
                        onClick={handleDismiss}
                        className="
                            p-1 rounded-lg
                            hover:bg-yellow-300/50
                            transition-colors
                            flex-shrink-0
                        "
                        aria-label="Fechar banner"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
        </>
    );
}

