"use client";

import { useState, useEffect } from "react";
import { TicketPercent, X, Clock, Euro } from "lucide-react";

interface FridayNotificationProps {
    className?: string;
}

export default function FridayNotification({ className = "" }: FridayNotificationProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isFriday, setIsFriday] = useState(false);

    // Constantes da promoção (mesmas da página de combustíveis)
    const FRIDAY_DISCOUNT_EUR = 0.06;
    const FRIDAY_TIME = "07h–22h";
    const FRIDAY_EXCEPT = "Gasóleo Agrícola";

    useEffect(() => {
        // Verificar se é sexta-feira
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Domingo, 5 = Sexta
        const isFridayToday = dayOfWeek === 5;
        
        setIsFriday(isFridayToday);

        // Verificar se já foi fechada hoje (usando localStorage)
        const todayKey = `friday-notification-${today.toDateString()}`;
        const wasDismissed = localStorage.getItem(todayKey);
        
        // Mostrar apenas se for sexta e não foi fechada hoje
        if (isFridayToday && !wasDismissed) {
            setIsVisible(true);
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        
        // Guardar no localStorage que foi fechada hoje
        const today = new Date();
        const todayKey = `friday-notification-${today.toDateString()}`;
        localStorage.setItem(todayKey, "dismissed");
    };

    // Não mostrar se não for sexta ou se foi fechada
    if (!isFriday || !isVisible) {
        return null;
    }

    return (
        <div className={`
            fixed top-20 right-4 z-50 max-w-sm
            bg-gradient-to-r from-emerald-500 to-emerald-600
            text-white rounded-xl shadow-2xl
            border border-emerald-400
            transform transition-all duration-500 ease-out
            ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
            ${className}
        `}>
            {/* Header da notificação */}
            <div className="flex items-center justify-between p-4 pb-2">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-400/20">
                        <TicketPercent className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">Promoção de Sexta!</h3>
                        <p className="text-xs text-emerald-100">Desconto especial hoje</p>
                    </div>
                </div>
                <button
                    onClick={handleDismiss}
                    className="p-1 rounded-lg hover:bg-emerald-400/20 transition-colors"
                    aria-label="Fechar notificação"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            {/* Conteúdo da notificação */}
            <div className="px-4 pb-4">
                <div className="space-y-2">
                    {/* Desconto */}
                    <div className="flex items-center gap-2 text-sm">
                        <Euro className="h-4 w-4" />
                        <span className="font-semibold">
                            {FRIDAY_DISCOUNT_EUR.toFixed(2)} € / L de desconto
                        </span>
                    </div>

                    {/* Horário */}
                    <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>Válido das {FRIDAY_TIME}</span>
                    </div>

                    {/* Exceção */}
                    <p className="text-xs text-emerald-100">
                        Exceto {FRIDAY_EXCEPT}
                    </p>
                </div>

                {/* Botão de ação */}
                <div className="mt-3 pt-3 border-t border-emerald-400/30">
                    <a
                        href="/combustiveis"
                        className="block w-full text-center bg-white/20 hover:bg-white/30 
                                   text-white font-semibold py-2 px-3 rounded-lg 
                                   transition-colors text-sm"
                        onClick={() => {
                            // Fechar a notificação quando clicar
                            handleDismiss();
                        }}
                    >
                        Ver Preços
                    </a>
                </div>
            </div>

            {/* Efeito de pulso */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        </div>
    );
}
