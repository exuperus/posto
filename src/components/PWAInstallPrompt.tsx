"use client";

import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";

/**
 * Componente que mostra um prompt para instalar a PWA
 * Especialmente útil para iOS onde não há aviso automático
 */
export default function PWAInstallPrompt() {
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [installPrompt, setInstallPrompt] = useState<any>(null);

    useEffect(() => {
        // Detecta iOS
        const checkIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        setIsIOS(checkIOS);

        // Detecta se já está instalado (modo standalone)
        const standalone = window.matchMedia("(display-mode: standalone)").matches ||
            (window.navigator as any).standalone;
        setIsStandalone(standalone);

        // Detecta prompt de instalação nativo (Android/Desktop)
        let deferredPrompt: any;
        
        window.addEventListener("beforeinstallprompt", (e) => {
            e.preventDefault();
            deferredPrompt = e;
            setInstallPrompt(deferredPrompt);
        });

        // Verifica se já dispensou (dentro de 24h)
        const dismissedTime = localStorage.getItem("pwa_prompt_dismissed");
        const wasDismissed = dismissedTime && (Date.now() - Number(dismissedTime) < 86400000);

        // Mostra prompt APÓS 3 SEGUNDOS se não está instalado nem dispensou
        if (!standalone && !wasDismissed) {
            const timer = setTimeout(() => {
                setShowPrompt(true);
            }, 3000);
            return () => clearTimeout(timer);
        }

        return () => {};
    }, []);

    const handleInstall = async () => {
        if (installPrompt) {
            installPrompt.prompt();
            const { outcome } = await installPrompt.userChoice;
            console.log(`User response to install prompt: ${outcome}`);
            setInstallPrompt(null);
            setShowPrompt(false);
        }
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        // Guarda que o usuário dispensou (24h)
        localStorage.setItem("pwa_prompt_dismissed", Date.now().toString());
    };

    // Mostra se: showPrompt é true (despois de 3 seg)
    if (showPrompt) {
        return (
            <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto animate-fade-in-up">
                <div className="bg-white border-2 border-emerald-500 rounded-2xl shadow-2xl p-5 relative">
                    <button
                        onClick={handleDismiss}
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
                        aria-label="Fechar"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                <Download className="h-6 w-6 text-emerald-600" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">Instalar App</h3>
                            {isIOS ? (
                                <p className="text-sm text-gray-600 mt-1">
                                    Adicione ao ecrã principal para acesso rápido: <strong>⋮ Menu</strong> →
                                    <strong> Adicionar ao Ecrã Principal</strong>
                                </p>
                            ) : (
                                <p className="text-sm text-gray-600 mt-1">
                                    Instale a aplicação para acesso rápido e offline
                                </p>
                            )}
                        </div>
                    </div>

                    {!isIOS && installPrompt && (
                        <button
                            onClick={handleInstall}
                            className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-xl transition shadow-lg"
                        >
                            Instalar Agora
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return null;
}

