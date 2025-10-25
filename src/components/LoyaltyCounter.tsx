"use client";

import { useState, useEffect } from "react";
import { Heart, Star, Gift } from "lucide-react";

export default function LoyaltyCounter() {
    const [visitCount, setVisitCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Verificar se já visitou hoje
        const today = new Date().toDateString();
        const lastVisit = localStorage.getItem("lastVisit");
        const storedCount = localStorage.getItem("visitCount");

        if (lastVisit !== today) {
            // Nova visita hoje
            const newCount = (parseInt(storedCount || "0") + 1);
            setVisitCount(newCount);
            localStorage.setItem("visitCount", newCount.toString());
            localStorage.setItem("lastVisit", today);
            
            // Mostrar notificação se for uma visita especial
            if (newCount % 5 === 0 || newCount === 1) {
                setIsVisible(true);
                setTimeout(() => setIsVisible(false), 5000);
            }
        } else {
            // Já visitou hoje
            setVisitCount(parseInt(storedCount || "0"));
        }
    }, []);

    const getLoyaltyMessage = () => {
        if (visitCount === 1) {
            return {
                icon: <Heart className="h-5 w-5" />,
                message: "Bem-vindo! Obrigado pela sua primeira visita!",
                color: "from-pink-500 to-pink-600"
            };
        } else if (visitCount % 10 === 0) {
            return {
                icon: <Gift className="h-5 w-5" />,
                message: `Cliente VIP! ${visitCount} visitas - Peça o seu desconto especial!`,
                color: "from-purple-500 to-purple-600"
            };
        } else if (visitCount % 5 === 0) {
            return {
                icon: <Star className="h-5 w-5" />,
                message: `Cliente fiel! ${visitCount} visitas - Continue assim!`,
                color: "from-yellow-500 to-yellow-600"
            };
        }
        return null;
    };

    const loyaltyInfo = getLoyaltyMessage();

    if (!isVisible || !loyaltyInfo) {
        return null;
    }

    return (
        <div className={`
            fixed bottom-20 right-4 z-50 max-w-sm
            bg-gradient-to-r ${loyaltyInfo.color}
            text-white rounded-xl shadow-2xl p-4
            transform transition-all duration-500 ease-out
            ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
        `}>
            <div className="flex items-center gap-3">
                <div className="flex-shrink-0 p-2 rounded-lg bg-white/20">
                    {loyaltyInfo.icon}
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium">
                        {loyaltyInfo.message}
                    </p>
                    <p className="text-xs text-white/80 mt-1">
                        Total de visitas: {visitCount}
                    </p>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="flex-shrink-0 p-1 rounded-lg hover:bg-white/20 transition-colors"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
