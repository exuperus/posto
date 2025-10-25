// src/app/transporte-domicilio/page.tsx
import Image from "next/image";
import Link from "next/link";
import { Phone, Truck, Smile, Clock as ClockIcon } from "lucide-react";
import BackButton from "@/components/BackButton";
import RelatedPages from "@/components/RelatedPages";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Transporte Combustível ao Domicílio - Sandrina & Mário, LDA | Sendim",
    description: "Serviço de transporte de combustível ao domicílio. Entrega gratuita e rápida. Contacte-nos para marcar a sua entrega.",
    keywords: "transporte combustível, entrega domicílio, combustível casa, Sendim, Miranda do Douro, entrega gratuita",
    openGraph: {
        title: "Transporte Combustível ao Domicílio - Sandrina & Mário, LDA",
        description: "Serviço de entrega de combustível ao domicílio com entrega gratuita",
        type: "website",
        locale: "pt_PT",
    },
    alternates: {
        canonical: "/transporte-domicilio",
    },
};

const PHONE: string = process.env.NEXT_PUBLIC_PHONE ?? "938452320"; // móvel
const LANDLINE = "273739700"; // fixo

console.log("[/transporte-domicilio] Módulo carregado.");
console.log("   - NODE_ENV:", process.env.NODE_ENV);
console.log("   - VERCEL:", !!process.env.VERCEL);
console.log("   - NEXT_PUBLIC_PHONE:", PHONE);
console.log("   - LANDLINE:", LANDLINE);


export const revalidate = 900;
console.log("[/transporte-domicilio] revalidate:", revalidate);

export default function TransportePage() {
    console.log("[/transporte-domicilio] Render iniciado.");
    const phoneHref = `tel:${PHONE.replace(/\s+/g, "")}`;
    const landlineHref = `tel:${LANDLINE}`;
    console.log("[/transporte-domicilio] phoneHref:", phoneHref);
    console.log("[/transporte-domicilio] landlineHref:", landlineHref); {
    }
    return (
        <div className="max-w-6xl mx-auto px-4">
            <BackButton />
            {/* Imagem principal */}
            <div className="relative w-full h-[50vh] sm:h-[60vh] min-h-[400px] max-h-[700px] rounded-2xl overflow-hidden bg-neutral-100 shadow-md">
                <Image
                    src="/transporte-hero.jpg"
                    alt="Transporte ao domicílio"
                    fill
                    priority
                    className="object-contain"
                />
            </div>

            {/* Texto fora da imagem */}
            <div className="text-center space-y-3 px-4 mt-8">
                <p className="text-sm text-gray-500">Serviço ao domicílio</p>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    Transporte de combustível ao domicílio
                </h1>

                {/* Botões de contacto */}
                <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
                    {/* Botão - móvel */}
                    <div className="flex flex-col items-center">
                        <Link
                            href={`tel:${PHONE.replace(/\s+/g, "")}`}
                            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition"
                        >
                            <Phone className="h-4 w-4" />
                            Ligar agora
                        </Link>
                        <p className="mt-1 text-xs text-gray-500">
                            Chamada rede móvel nacional.
                        </p>
                    </div>

                    {/* Botão - fixo */}
                    <div className="flex flex-col items-center">
                        <Link
                            href={`tel:${LANDLINE}`}
                            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition"
                        >
                            <Phone className="h-4 w-4" />
                            Ligar agora
                        </Link>
                        <p className="mt-1 text-xs text-gray-500">
                            Chamada rede fixa nacional.
                        </p>
                    </div>
                </div>
            </div>

            {/* Três cards */}
            <div className="grid gap-5 md:grid-cols-3 px-6 max-w-5xl mx-auto mt-10">
                <div className="rounded-xl border p-6 text-center shadow-sm hover:shadow-md transition">
                    <Truck className="h-8 w-8 text-green-600 mx-auto mb-3" />
                    <h3 className="font-semibold">Entrega gratuita</h3>
                    <p className="text-sm text-gray-500 mt-3">
                        Levamos o combustível até si sem custos adicionais.
                    </p>
                </div>

                <div className="rounded-xl border p-6 text-center shadow-sm hover:shadow-md transition">
                    <ClockIcon className="h-8 w-8 text-green-600 mx-auto mb-3" />
                    <h3 className="font-semibold">Serviço rápido</h3>
                    <p className="text-sm text-gray-500 mt-3">
                        Entregas no próprio dia ou no seguinte, conforme disponibilidade.
                    </p>
                </div>

                <div className="rounded-xl border p-6 text-center shadow-sm hover:shadow-md transition">
                    <Smile className="h-8 w-8 text-green-600 mx-auto mb-3" />
                    <h3 className="font-semibold">Atendimento direto</h3>
                    <p className="text-sm text-gray-500 mt-3">
                        Fale connosco por telefone — sem formulários, sem complicações.
                    </p>
                </div>
            </div>

            {/* Frase final */}
            <p className="text-center text-gray-600 max-w-2xl mx-auto px-6 mt-10">
                Este serviço foi criado a pensar em todos os nossos clientes. Prestamos o mesmo atendimento,
                com o mesmo preço e a qualidade de sempre.
            </p>

            {/* Páginas relacionadas */}
            <RelatedPages />
        </div>
    );
}
