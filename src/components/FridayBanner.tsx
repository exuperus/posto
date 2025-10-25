"use client";

import { TicketPercent, Clock, Euro } from "lucide-react";

export default function FridayBanner() {
    // Verificar se é sexta-feira
    const today = new Date();
    const isFriday = today.getDay() === 5;

    // Constantes da promoção
    const FRIDAY_DISCOUNT_EUR = 0.06;
    const FRIDAY_TIME = "07h–22h";
    const FRIDAY_EXCEPT = "Gasóleo Agrícola";

    // Não mostrar se não for sexta-feira
    if (!isFriday) {
        return null;
    }

    return (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg border border-emerald-400">
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 p-2 rounded-lg bg-emerald-400/20">
                    <TicketPercent className="h-6 w-6" />
                </div>
                
                <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">
                        🎉 Promoção de Sexta-feira Ativa!
                    </h3>
                    
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                            <Euro className="h-4 w-4" />
                            <span className="font-semibold">
                                Desconto direto de {FRIDAY_DISCOUNT_EUR.toFixed(2)} € / L
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>Válido das {FRIDAY_TIME}</span>
                        </div>
                        
                        <p className="text-emerald-100">
                            Em todas as categorias de combustível <strong>exceto {FRIDAY_EXCEPT}</strong>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
