"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileMenu from "./MobileMenu";

export default function Header() {
    const pathname = usePathname();
    const isHome = pathname === "/";

    console.log("[Header] Componente montado.");
    console.log("[Header] Pathname atual:", pathname);
    console.log("[Header] isHome =", isHome);

    const links = [
        { href: "/combustiveis", label: "Combustíveis" },
        { href: "/produtos", label: "Produtos" },
        { href: "/transporte-domicilio", label: "Transporte Domicílio" },
        { href: "/promocoes", label: "Promoções" }, // PROMOÇÕES - DEVE APARECER NO MENU
        { href: "/contactos", label: "Contactos" },
    ];
    
    // DEBUG: Verificar se Promoções está na lista
    console.log("[Header] Total de links:", links.length);
    console.log("[Header] Link Promoções existe?", links.some(l => l.href === "/promocoes"));

    console.log("[Header] Links definidos:", links);

    return (
        <>
            {/* Menu Mobile */}
            <MobileMenu isHome={isHome} />
            
            {/* Header Desktop */}
            <header
                className={[
                    "z-40 w-full",
                    isHome
                        ? "absolute top-0 left-0 right-0 bg-gradient-to-b from-black/45 to-transparent"
                        : "sticky top-0 bg-white/90 backdrop-blur border-b border-gray-200",
                ].join(" ")}
            >
                <div className="flex items-center justify-end px-2 md:px-4 lg:px-8 h-16 overflow-visible">
                    <nav
                        className={[
                            "hidden md:flex gap-2 md:gap-3 lg:gap-4 xl:gap-6 text-xs md:text-sm lg:text-base font-medium flex-shrink-0 overflow-visible",
                            isHome ? "text-white drop-shadow" : "text-gray-800",
                        ].join(" ")}
                    >
                    {links.map(({ href, label }) => {
                        const active = pathname === href;
                        console.log(`[Header] Link: ${label} (${href}) → active =`, active);

                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() =>
                                    console.log(`[Header] Clique no link: ${label} → ${href}`)
                                }
                                className={[
                                    "relative transition-colors whitespace-nowrap flex-shrink-0",
                                    isHome
                                        ? active
                                            ? "text-lime-300"
                                            : "hover:text-lime-300"
                                        : active
                                            ? "text-lime-600"
                                            : "hover:text-lime-600",
                                    // underline animado
                                    "after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-current after:origin-left after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100",
                                    active ? "after:scale-x-100" : "",
                                ].join(" ")}
                            >
                                {label}
                            </Link>
                        );
                    })}
                    </nav>
                </div>
            </header>
        </>
    );
}
