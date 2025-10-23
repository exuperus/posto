'use client';

import { useEffect, useState } from 'react';

type Props = { isHome?: boolean };

export default function Footer({ isHome }: Props) {
    // URL por defeito: Sendim (Miranda do Douro)
    const DEFAULT_MAPS =
        'https://www.google.com/maps?q=Sendim%2C%20Miranda%20do%20Douro';

    const [mapsUrl, setMapsUrl] = useState<string>(DEFAULT_MAPS);

    // Evita hydration mismatch: só renderiza depois de montar no cliente
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    useEffect(() => {
        // Só faz fetch depois de montar
        if (!mounted) return;

        fetch('/api/station', { cache: 'no-store' })
            .then((r) => (r.ok ? r.json() : null))
            .then((s) => {
                if (!s) return;
                try {
                    const links = s?.linksJson ? JSON.parse(s.linksJson) : {};
                    if (typeof links?.maps_url === 'string' && links.maps_url.length > 0) {
                        setMapsUrl(links.maps_url);
                    }
                } catch {
                    /* ignore */
                }
            })
            .catch(() => {});
    }, [mounted]);

    // enquanto não estiver montado, não renderiza nada
    if (!mounted) return null;

    if (isHome) {
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
                    >
                        📍 Localização: Sendim
                    </a>
                </div>
            </footer>
        );
    }
}
