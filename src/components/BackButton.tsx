"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
    className?: string;
    fallbackHref?: string;
}

export default function BackButton({ className = "", fallbackHref = "/" }: BackButtonProps) {
    const router = useRouter();

    const handleBack = () => {
        // Verifica se há histórico no navegador
        if (window.history.length > 1) {
            router.back();
        } else {
            // Se não há histórico, vai para a página inicial
            router.push(fallbackHref);
        }
    };

    return (
        <button
            onClick={handleBack}
            className={`
                fixed top-20 left-4 z-40
                inline-flex items-center gap-2
                bg-white/90 backdrop-blur-sm
                border border-gray-200
                rounded-full px-4 py-2
                text-sm font-medium text-gray-700
                shadow-lg hover:shadow-xl
                hover:bg-white hover:text-gray-900
                transition-all duration-200
                md:left-4
                ${className}
            `}
            aria-label="Voltar à página anterior"
        >
            <ArrowLeft className="h-4 w-4" />
            Voltar
        </button>
    );
}
