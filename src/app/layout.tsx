// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Shell from "@/components/Shell";
import LegalFooter from "@/components/LegalFooter";
import CookieNotice from "@/components/CookieNotice";

export const metadata: Metadata = {
    title: "Sandrina & Mário, LDA — Posto de Combustível",
    description: "Preços semanais, serviços e contactos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-PT">
        {/* fundo branco forçado + fallback min-h para browsers sem dvh */}
        <body className="min-h-screen supports-[min-height:100dvh]:min-h-dvh bg-white text-gray-900 antialiased flex flex-col">
        <Shell>{children}</Shell>
        <CookieNotice />
        <LegalFooter />
        </body>
        </html>
    );
}
