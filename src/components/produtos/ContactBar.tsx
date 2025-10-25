// src/components/produtos/ContactBar.tsx
"use client";

import { useState } from "react";
import { MessageCircle, Phone, HelpCircle, X } from "lucide-react";

export default function ContactBar({ waHref, telHref }: { waHref: string; telHref: string }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
            <div className="pointer-events-auto">
                {/* Versão mobile - ícone colapsável */}
                <div className="sm:hidden">
                    {!isExpanded ? (
                        <button
                            onClick={() => setIsExpanded(true)}
                            className="rounded-full bg-green-600 text-white p-3 shadow-xl hover:bg-green-700 transition-colors z-50"
                            aria-label="Precisa de ajuda? Fale connosco"
                        >
                            <HelpCircle className="h-5 w-5" />
                        </button>
                    ) : (
                        <div className="rounded-2xl bg-white/90 backdrop-blur ring-1 ring-gray-200 shadow-lg p-4 space-y-3 max-w-xs">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700">Precisa de ajuda? Fale connosco.</div>
                                <button
                                    onClick={() => setIsExpanded(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                    aria-label="Fechar"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <a
                                    href={waHref}
                                    className="inline-flex items-center gap-2 rounded-lg ring-1 ring-green-600 px-3 py-2 text-sm font-semibold text-green-700 hover:bg-green-50"
                                    aria-label="Falar no WhatsApp"
                                    onClick={() => console.log("[/produtos] WhatsApp click:", waHref)}
                                >
                                    <MessageCircle className="h-4 w-4" />
                                    WhatsApp
                                </a>
                                <a
                                    href={telHref}
                                    className="inline-flex items-center gap-2 rounded-lg bg-green-600 text-white px-3 py-2 text-sm font-semibold hover:bg-green-700"
                                    aria-label="Ligar"
                                    onClick={() => console.log("[/produtos] Ligar click:", telHref)}
                                >
                                    <Phone className="h-4 w-4" />
                                    Ligar
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {/* Versão desktop - sempre visível */}
                <div className="hidden sm:block">
                    <div className="rounded-2xl bg-white/90 backdrop-blur ring-1 ring-gray-200 shadow-lg p-3 flex items-center gap-3">
                        <div className="text-sm text-gray-700">Precisa de ajuda? Fale connosco.</div>
                        <div className="flex gap-2">
                            <a
                                href={waHref}
                                className="inline-flex items-center gap-2 rounded-lg ring-1 ring-green-600 px-3 py-2 text-sm font-semibold text-green-700 hover:bg-green-50"
                                aria-label="Falar no WhatsApp"
                                onClick={() => console.log("[/produtos] WhatsApp click:", waHref)}
                            >
                                <MessageCircle className="h-4 w-4" />
                                WhatsApp
                            </a>
                            <a
                                href={telHref}
                                className="inline-flex items-center gap-2 rounded-lg bg-green-600 text-white px-3 py-2 text-sm font-semibold hover:bg-green-700"
                                aria-label="Ligar"
                                onClick={() => console.log("[/produtos] Ligar click:", telHref)}
                            >
                                <Phone className="h-4 w-4" />
                                Ligar
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
