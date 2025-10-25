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
        <body className="min-h-dvh bg-gray-50 text-gray-900 flex flex-col">
        <Shell>{children}</Shell>

        <CookieNotice />

        <LegalFooter />
        </body>
        </html>
    );
}
