'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function Hero({
                                 title = 'Posto de Abastecimento Sandrina&Mário , LDA',
                             }: {
    title?: string
}) {
    return (
        <section className="relative h-[60vh] sm:h-[80vh] min-h-[300px] max-h-[700px] w-full overflow-hidden">
            {/* Imagem de fundo */}
            <Image
                src="/hero.png"
                alt={title}
                fill
                priority
                className="object-cover sm:object-contain"
                sizes="100vw"
            />

            {/* Overlay para legibilidade - muito forte na parte inferior para esconder texto */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/90" />
            
            {/* Overlay adicional na parte inferior para esconder texto da imagem */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/95 to-transparent" />

        </section>
    )
}
