// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Shell from "@/components/Shell";
import LegalFooter from "@/components/LegalFooter";
import CookieNotice from "@/components/CookieNotice";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

export const metadata: Metadata = {
    title: "Sandrina & Mário, LDA — Posto de Combustível",
    description: "Preços semanais, serviços e contactos.",
    manifest: "/manifest.json",
    themeColor: "#059669",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Sandrina & Mário",
    },
    viewport: {
        width: "device-width",
        initialScale: 1,
        maximumScale: 5,
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-PT">
        <head>
            <link rel="manifest" href="/manifest.json" />
            <link rel="apple-touch-icon" href="/icon-192.png" />
            <meta name="theme-color" content="#059669" />
            <script src="/register-sw.js" defer></script>
        </head>
        {/* fundo branco forçado + fallback min-h para browsers sem dvh */}
        <body className="min-h-screen supports-[min-height:100dvh]:min-h-dvh bg-white text-gray-900 antialiased flex flex-col">
        <Shell>{children}</Shell>
        <CookieNotice />
        <PWAInstallPrompt />
        <LegalFooter />
        </body>
        </html>
    );
}
