"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
        { href: "/contactos", label: "Contactos" },
    ];

    console.log("[Header] Links definidos:", links);

    return (
        <header
            className={[
                "z-40 w-full",
                isHome
                    ? "absolute top-0 left-0 right-0 bg-gradient-to-b from-black/45 to-transparent"
                    : "sticky top-0 bg-white/90 backdrop-blur border-b border-gray-200",
            ].join(" ")}
        >
            <div className="flex items-center justify-end px-8 h-16">
                <nav
                    className={[
                        "flex gap-6 text-sm md:text-base font-medium",
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
                                    "relative transition-colors",
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
    );
}
