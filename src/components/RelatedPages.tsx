"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Fuel, Package, Truck, Phone } from "lucide-react";

interface RelatedPage {
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
}

export default function RelatedPages() {
    const pathname = usePathname();

    // Mapear páginas relacionadas baseado na página atual
    const getRelatedPages = (): RelatedPage[] => {
        const allPages: Record<string, RelatedPage[]> = {
            "/combustiveis": [
                {
                    title: "Produtos",
                    description: "Veja o nosso catálogo completo",
                    href: "/produtos",
                    icon: <Package className="h-5 w-5" />
                },
                {
                    title: "Transporte ao Domicílio",
                    description: "Entrega de combustível em casa",
                    href: "/transporte-domicilio",
                    icon: <Truck className="h-5 w-5" />
                },
                {
                    title: "Contactos",
                    description: "Fale connosco para mais informações",
                    href: "/contactos",
                    icon: <Phone className="h-5 w-5" />
                }
            ],
            "/produtos": [
                {
                    title: "Combustíveis",
                    description: "Consulte os preços atuais",
                    href: "/combustiveis",
                    icon: <Fuel className="h-5 w-5" />
                },
                {
                    title: "Transporte ao Domicílio",
                    description: "Entrega de produtos em casa",
                    href: "/transporte-domicilio",
                    icon: <Truck className="h-5 w-5" />
                },
                {
                    title: "Contactos",
                    description: "Encomendas e aconselhamento",
                    href: "/contactos",
                    icon: <Phone className="h-5 w-5" />
                }
            ],
            "/transporte-domicilio": [
                {
                    title: "Combustíveis",
                    description: "Veja os preços para entrega",
                    href: "/combustiveis",
                    icon: <Fuel className="h-5 w-5" />
                },
                {
                    title: "Produtos",
                    description: "Outros produtos disponíveis",
                    href: "/produtos",
                    icon: <Package className="h-5 w-5" />
                },
                {
                    title: "Contactos",
                    description: "Marque a sua entrega",
                    href: "/contactos",
                    icon: <Phone className="h-5 w-5" />
                }
            ],
            "/contactos": [
                {
                    title: "Combustíveis",
                    description: "Preços e informações",
                    href: "/combustiveis",
                    icon: <Fuel className="h-5 w-5" />
                },
                {
                    title: "Produtos",
                    description: "Catálogo completo",
                    href: "/produtos",
                    icon: <Package className="h-5 w-5" />
                },
                {
                    title: "Transporte ao Domicílio",
                    description: "Serviço de entrega",
                    href: "/transporte-domicilio",
                    icon: <Truck className="h-5 w-5" />
                }
            ]
        };

        return allPages[pathname] || [];
    };

    const relatedPages = getRelatedPages();

    // Não mostrar se não há páginas relacionadas ou se estiver na homepage
    if (relatedPages.length === 0 || pathname === "/") {
        return null;
    }

    return (
        <section className="mt-16 pt-8 border-t border-gray-200">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Também pode interessar-lhe
                    </h3>
                    <p className="text-gray-600">
                        Explore outros serviços que temos para si
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {relatedPages.map((page, index) => (
                        <Link
                            key={page.href}
                            href={page.href}
                            className="group block p-6 rounded-xl border border-gray-200 bg-white hover:border-green-300 hover:shadow-lg transition-all duration-200"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 p-2 rounded-lg bg-green-50 text-green-600 group-hover:bg-green-100 transition-colors">
                                    {page.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-lg font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                                        {page.title}
                                    </h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {page.description}
                                    </p>
                                </div>
                                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors flex-shrink-0" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
