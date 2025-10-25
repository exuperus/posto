"use client";

import Link from "next/link";
import { Fuel, Package, Truck, Phone, MessageCircle } from "lucide-react";
import AnimatedCard from "./AnimatedCard";

export default function QuickActions() {
    const PHONE = process.env.NEXT_PUBLIC_PHONE ?? "938452320";
    const WHATS = `https://wa.me/351${PHONE.replace(/\s+/g, "")}`;
    const TEL = `tel:${PHONE.replace(/\s+/g, "")}`;

    const actions = [
        {
            title: "Preços Combustível",
            description: "Consulte os preços atuais",
            href: "/combustiveis",
            icon: <Fuel className="h-8 w-8" />,
            color: "from-emerald-500 to-emerald-600",
            hoverColor: "hover:from-emerald-600 hover:to-emerald-700"
        },
        {
            title: "Catálogo Produtos",
            description: "Veja todos os produtos",
            href: "/produtos",
            icon: <Package className="h-8 w-8" />,
            color: "from-blue-500 to-blue-600",
            hoverColor: "hover:from-blue-600 hover:to-blue-700"
        },
        {
            title: "Entrega ao Domicílio",
            description: "Transporte de combustível",
            href: "/transporte-domicilio",
            icon: <Truck className="h-8 w-8" />,
            color: "from-orange-500 to-orange-600",
            hoverColor: "hover:from-orange-600 hover:to-orange-700"
        },
        {
            title: "Contactar",
            description: "Fale connosco",
            href: "/contactos",
            icon: <Phone className="h-8 w-8" />,
            color: "from-green-500 to-green-600",
            hoverColor: "hover:from-green-600 hover:to-green-700"
        }
    ];

    return (
        <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Título */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Como podemos ajudar?
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Aceda rapidamente aos nossos serviços principais
                    </p>
                </div>

                {/* Grid de ações */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {actions.map((action, index) => (
                        <AnimatedCard key={action.href} delay={index * 0.1}>
                            <Link
                                href={action.href}
                                className={`
                                    group relative overflow-hidden rounded-2xl
                                    bg-gradient-to-br ${action.color} ${action.hoverColor}
                                    p-6 text-white shadow-lg hover:shadow-xl
                                    transition-all duration-300 transform hover:-translate-y-1
                                    block
                                `}
                            >
                            {/* Ícone */}
                            <div className="mb-4 opacity-90 group-hover:opacity-100 transition-opacity">
                                {action.icon}
                            </div>

                            {/* Conteúdo */}
                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    {action.title}
                                </h3>
                                <p className="text-white/80 text-sm">
                                    {action.description}
                                </p>
                            </div>

                            {/* Efeito de hover */}
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </Link>
                        </AnimatedCard>
                    ))}
                </div>

                {/* Botões de contacto direto */}
                <div className="mt-12 text-center">
                    <p className="text-gray-600 mb-6">Ou contacte-nos diretamente:</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href={TEL}
                            className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            <Phone className="h-5 w-5" />
                            Ligar Agora
                        </a>
                        <a
                            href={WHATS}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            <MessageCircle className="h-5 w-5" />
                            WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
