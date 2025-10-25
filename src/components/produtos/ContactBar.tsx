// src/components/produtos/ContactBar.tsx
"use client";

import { MessageCircle, Phone } from "lucide-react";

export default function ContactBar({ waHref, telHref }: { waHref: string; telHref: string }) {
    return (
        <div className="fixed bottom-4 right-4 z-30 pointer-events-none">
        <div className="pointer-events-auto">
        <div className="rounded-2xl bg-white/90 backdrop-blur ring-1 ring-gray-200 shadow-lg p-3 flex items-center gap-3">
        <div className="text-sm text-gray-700">Precisa de ajuda a escolher? Fale connosco.</div>
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
);
}
