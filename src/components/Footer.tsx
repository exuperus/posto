"use client";

import { useEffect, useState } from "react";

type Props = { isHome?: boolean };

export default function Footer({ isHome }: Props) {
    console.log("[Footer] Módulo carregado no cliente. isHome =", isHome);

    // URL por defeito (fallback)
    const DEFAULT_MAPS =
        "https://maps.app.goo.gl/ND21VPudiqpSRyVq8";
    console.log("[Footer] URL padrão (DEFAULT_MAPS):", DEFAULT_MAPS);

    const [mapsUrl, setMapsUrl] = useState<string>(DEFAULT_MAPS);
    const [mounted, setMounted] = useState(false);

    // Primeira montagem (hidratação)
    useEffect(() => {
        console.log("[Footer] useEffect #1 → Componente montado no cliente.");
        setMounted(true);
    }, []);

    // Fetch do /api/station apenas após montagem
    useEffect(() => {
        if (!mounted) {
            console.log("[Footer] Ainda não montado — fetch ignorado.");
            return;
        }

        console.log("[Footer] A fazer fetch para /api/station...");

        fetch("/api/station", { cache: "no-store" })
            .then((r) => {
                console.log("[Footer] Resposta HTTP:", r.status, r.statusText);
                return r.ok ? r.json() : null;
            })
            .then((s) => {
                if (!s) {
                    console.warn("[Footer] Nenhuma estação devolvida da API.");
                    return;
                }

                console.log("[Footer] Dados recebidos da API:", s);

                try {
                    const links = s?.linksJson ? JSON.parse(s.linksJson) : {};
                    console.log("[Footer] linksJson parseado:", links);

                    if (typeof links?.maps_url === "string" && links.maps_url.length > 0) {
                        console.log("[Footer] maps_url encontrado:", links.maps_url);
                        setMapsUrl(links.maps_url);
                    } else {
                        console.warn("[Footer] Nenhum maps_url válido encontrado no JSON.");
                    }
                } catch (err) {
                    console.error("[Footer] Erro ao fazer parse de linksJson:", err);
                }
            })
            .catch((err) => console.error("[Footer] Erro no fetch:", err));
    }, [mounted]);

    // Renderização
    if (!mounted) {
        console.log("[Footer] Não renderizado (ainda não montado).");
        return null;
    }

    console.log("[Footer] Renderização iniciada. mapsUrl =", mapsUrl);

    if (isHome) {
        console.log("[Footer] Renderização do footer da homepage (flutuante).");
        return (
            <footer className="fixed inset-x-0 bottom-0 z-30">
                <div className="max-w-6xl px-6 py-4 flex justify-start">
                    <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-full border border-white/70
                           text-white/90 backdrop-blur-sm bg-black/20 px-4 py-2 text-sm
                           hover:bg-white/20 transition"
                        onClick={() => console.log("[Footer] Link clicado:", mapsUrl)}
                    >
                        📍 Localização: Sendim
                    </a>
                </div>
            </footer>
        );
    }

    console.log("[Footer] Não é homepage — não renderiza footer fixo.");
    return null;
}
