"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href: string;
    current?: boolean;
}

export default function Breadcrumbs() {
    const pathname = usePathname();
    
    // Não mostrar breadcrumbs na homepage
    if (pathname === "/") return null;

    const generateBreadcrumbs = (): BreadcrumbItem[] => {
        const segments = pathname.split("/").filter(Boolean);
        const breadcrumbs: BreadcrumbItem[] = [
            { label: "Home", href: "/" }
        ];

        let currentPath = "";
        
        segments.forEach((segment, index) => {
            currentPath += `/${segment}`;
            
            // Mapear segmentos para labels mais amigáveis
            const labelMap: Record<string, string> = {
                "combustiveis": "Combustíveis",
                "produtos": "Produtos", 
                "transporte-domicilio": "Transporte ao Domicílio",
                "contactos": "Contactos",
                "servicos": "Serviços",
                "politica-privacidade": "Política de Privacidade",
                "termos-condicoes": "Termos e Condições"
            };

            const label = labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
            const isLast = index === segments.length - 1;
            
            breadcrumbs.push({
                label,
                href: currentPath,
                current: isLast
            });
        });

        return breadcrumbs;
    };

    const breadcrumbs = generateBreadcrumbs();

    return (
        <nav className="flex items-center space-x-1 text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            {breadcrumbs.map((item, index) => (
                <div key={item.href} className="flex items-center">
                    {index === 0 ? (
                        <Link
                            href={item.href}
                            className="flex items-center hover:text-gray-700 transition-colors"
                            aria-label="Ir para a página inicial"
                        >
                            <Home className="h-4 w-4" />
                        </Link>
                    ) : (
                        <Link
                            href={item.href}
                            className={`hover:text-gray-700 transition-colors ${
                                item.current ? "text-gray-900 font-medium" : ""
                            }`}
                        >
                            {item.label}
                        </Link>
                    )}
                    
                    {index < breadcrumbs.length - 1 && (
                        <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />
                    )}
                </div>
            ))}
        </nav>
    );
}
