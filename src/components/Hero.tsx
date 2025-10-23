'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function Hero({
                                 title = 'Posto de Abastecimento Sandrina&Mário , LDA',
                             }: {
    title?: string
}) {
    return (
        <section className="relative h-[100dvh] w-full overflow-hidden">
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
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent" />

            {/* TÍTULO animado — canto superior esquerdo */}
            <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="absolute top-8 left-8 z-10 font-extrabold text-2xl md:text-4xl
                   leading-snug tracking-tight bg-gradient-to-b from-white via-white/95 to-lime-300
                   bg-clip-text text-transparent drop-shadow-[0_6px_15px_rgba(0,0,0,0.5)]"
            >
                {title}
            </motion.h1>
        </section>
    )
}
