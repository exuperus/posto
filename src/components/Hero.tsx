'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function Hero({
                                 title = 'Posto de Abastecimento Sandrina&Mário , LDA',
                             }: {
    title?: string
}) {
    return (
        <section className="relative h-[60vh] sm:h-[90vh] min-h-[300px] max-h-[800px] w-full overflow-hidden">
            {/* Imagem de fundo */}
            <Image
                src="/hero.png"
                alt={title}
                fill
                priority
                className="object-cover"
                sizes="100vw"
            />

            {/* Overlay para legibilidade */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent" />

        </section>
    )
}
