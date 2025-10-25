"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, MessageCircle } from "lucide-react";

interface MobileMenuProps {
    isHome: boolean;
}

export default function MobileMenu({ isHome }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const links = [
        { href: "/combustiveis", label: "Combustíveis", icon: "⛽" },
        { href: "/produtos", label: "Produtos", icon: "📦" },
        { href: "/transporte-domicilio", label: "Transporte Domicílio", icon: "🚚" },
        { href: "/contactos", label: "Contactos", icon: "📞" },
    ];

    const PHONE = process.env.NEXT_PUBLIC_PHONE ?? "938452320";
    const WHATS = `https://wa.me/351${PHONE.replace(/\s+/g, "")}`;
    const TEL = `tel:${PHONE.replace(/\s+/g, "")}`;

    return (
        <>
            {/* Botão do menu hambúrguer - sempre visível no mobile */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    md:hidden fixed top-4 left-4 z-50
                    p-2 rounded-lg
                    transition-all duration-200
                    ${isHome 
                        ? "bg-black/20 backdrop-blur text-white hover:bg-black/30" 
                        : "bg-white/90 backdrop-blur text-gray-700 hover:bg-white border border-gray-200 shadow-lg"
                    }
                `}
                aria-label="Abrir menu"
            >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Overlay do menu mobile */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Menu mobile deslizante */}
            <div className={`
                fixed top-0 left-0 h-full w-80 max-w-[85vw] z-50
                bg-white shadow-2xl transform transition-transform duration-300 ease-in-out
                md:hidden
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                {/* Header do menu */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Fechar menu"
                    >
                        <X className="h-5 w-5 text-gray-600" />
                    </button>
                </div>

                {/* Links de navegação */}
                <nav className="p-4 space-y-2">
                    {links.map(({ href, label, icon }) => {
                        const active = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setIsOpen(false)}
                                className={`
                                    flex items-center gap-3 p-3 rounded-lg transition-colors
                                    ${active 
                                        ? "bg-green-50 text-green-700 border border-green-200" 
                                        : "text-gray-700 hover:bg-gray-50"
                                    }
                                `}
                            >
                                <span className="text-xl">{icon}</span>
                                <span className="font-medium">{label}</span>
                                {active && <span className="ml-auto text-green-600">●</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Botões de contacto rápido */}
                <div className="p-4 border-t border-gray-200 mt-auto">
                    <p className="text-sm text-gray-600 mb-3">Contacto rápido:</p>
                    <div className="space-y-2">
                        <a
                            href={TEL}
                            className="flex items-center gap-3 p-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                        >
                            <Phone className="h-5 w-5" />
                            <span className="font-medium">Ligar Agora</span>
                        </a>
                        <a
                            href={WHATS}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
                        >
                            <MessageCircle className="h-5 w-5" />
                            <span className="font-medium">WhatsApp</span>
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
